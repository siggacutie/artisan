import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendDiscord } from '@/lib/discord'

// Rate limiting: max 30 requests per minute from same IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 1000 })
    return true
  }
  if (entry.count >= 30) return false
  entry.count++
  return true
}

// Extract amount from notification content
function extractAmount(content: string): number | null {
  const patterns = [
    /(?:Rs\.?|INR|₹)\s*([0-9]+(?:\.[0-9]{1,2})?)/i,
    /credited\s+with\s+(?:Rs\.?|INR|₹)\s*([0-9]+(?:\.[0-9]{1,2})?)/i,
    /([0-9]+(?:\.[0-9]{1,2})?)\s*(?:Rs\.?|INR|₹)/i,
  ]
  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) return Math.round(parseFloat(match[1]))
  }
  return null
}

// Extract UTR/transaction reference from notification content
function extractUTR(content: string): string | null {
  const patterns = [
    // "Txn ID: 204766514631" — most common in Indian bank SMS
    /Txn\s*ID\s*[:#\s]\s*([0-9]{9,22})/i,
    // "UTR: 123456789012"
    /UTR\s*[:#\s]\s*([A-Z0-9]{9,22})/i,
    // "UPI Ref: 123456789012"
    /UPI\s*Ref(?:erence)?\s*[:#\s]\s*([A-Z0-9]{9,22})/i,
    // "Ref No: 123456789012"
    /Ref(?:erence)?\s*(?:No|ID|Number)?\s*[:#\s]\s*([A-Z0-9]{9,22})/i,
    // "Transaction ID: 123456789012"
    /Transaction\s*(?:ID|No|Ref)\s*[:#\s]\s*([A-Z0-9]{9,22})/i,
    // Bare 12-digit number
    /\b([0-9]{12})\b/,
    // Bank code + digits (HDFC1234567890)
    /\b([A-Z]{3,5}[0-9]{8,18})\b/i,
  ]
  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) {
      console.log('[extractUTR] Matched pattern:', pattern, '→', match[1])
      return match[1].toUpperCase()
    }
  }
  console.warn('[extractUTR] No pattern matched for:', content)
  return null
}

// Check if notification is a credit notification (not debit)
function isCreditNotification(content: string): boolean {
  const creditKeywords = ['credited', 'received', 'credit', 'added', 'deposited']
  const debitKeywords = ['debited', 'deducted', 'paid', 'sent', 'withdrawn']
  
  const lowerContent = content.toLowerCase()
  const hasCredit = creditKeywords.some(k => lowerContent.includes(k))
  const hasDebit = debitKeywords.some(k => lowerContent.includes(k))
  
  if (hasCredit && hasDebit) {
    const creditIdx = Math.min(...creditKeywords.map(k => lowerContent.indexOf(k)).filter(i => i >= 0))
    const debitIdx = Math.min(...debitKeywords.map(k => lowerContent.indexOf(k)).filter(i => i >= 0))
    return creditIdx < debitIdx
  }
  
  return hasCredit
}

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  // Verify listener secret
  const authHeader = req.headers.get('x-listener-secret')
  if (!authHeader || authHeader !== process.env.LISTENER_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: any
  let rawText: string
  try {
    rawText = await req.text()
    console.log('[payments/confirm] Raw body received:', rawText)
    body = JSON.parse(rawText)
    console.log('[payments/confirm] Parsed body keys:', Object.keys(body))
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  let utrNumber: string | null = null
  let amountVerified: number | null = null

  // Try to find content string from any possible field name
  // Different notification apps use different field names
  const contentString: string =
    body.content ??
    body.message ??
    body.text ??
    body.body ??
    body.notification?.body ??
    body.data?.content ??
    body.data?.message ??
    body.msg ??
    body.sms ??
    body.notificationText ??
    ''

  // Try to find UTR from direct field
  const directUtr: string | null =
    body.utrNumber ??
    body.utr ??
    body.transactionId ??
    body.txnId ??
    body.referenceId ??
    null

  console.log('[payments/confirm] Content string found:', contentString)
  console.log('[payments/confirm] Direct UTR found:', directUtr)

  // If we have a direct UTR, use it
  if (directUtr) {
    utrNumber = directUtr.toString().trim().toUpperCase()
    amountVerified = body.amountVerified ? Number(body.amountVerified) : null
  }
  // If we have a content string, parse it
  else if (contentString) {
    if (!isCreditNotification(contentString)) {
      console.log('[payments/confirm] Skipping — not a credit notification')
      return NextResponse.json({ received: true, skipped: 'not_credit' })
    }
    utrNumber = extractUTR(contentString)
    amountVerified = extractAmount(contentString)
  }
  // Nothing found — log full body for debugging and return success
  // (don't return 400 — we don't want to alarm the listener)
  else {
    console.warn('[payments/confirm] Could not find content in body:', JSON.stringify(body))
    return NextResponse.json({ received: true, skipped: 'no_content_found' })
  }

  if (!utrNumber || !/^[A-Z0-9]{8,22}$/.test(utrNumber)) {
    console.warn('[payments/confirm] Invalid or missing UTR:', utrNumber)
    // Log to Discord for manual review
    await sendDiscord('error', {
      title: 'Could not extract UTR',
      color: 0xf59e0b,
      fields: [
        { name: 'Body', value: JSON.stringify(body).slice(0, 500), inline: false },
        { name: 'Content Found', value: contentString.slice(0, 200) || 'None', inline: false },
        { name: 'Amount Found', value: amountVerified ? `Rs ${amountVerified}` : 'Not found', inline: true },
      ],
    }, 'ArtisanStore Payments')

    return NextResponse.json({ received: true, warning: 'utr_not_extracted' })
  }

  // Find payment by UTR
  const payment = await prisma.paymentLink.findFirst({
    where: { utrNumber },
    include: { user: true },
  })

  if (!payment) {
    console.log('[payments/confirm] No payment found for UTR:', utrNumber)
    // Log to Discord — might be a valid payment we need to manually match
    await sendDiscord('payment', {
      title: 'Payment received but no matching UTR in system',
      color: 0xef4444,
      fields: [
        { name: 'UTR', value: utrNumber, inline: true },
        { name: 'Amount', value: amountVerified ? `Rs ${amountVerified}` : 'Unknown', inline: true },
      ],
    }, 'ArtisanStore Payments')
    
    return NextResponse.json({ received: true, matched: false })
  }

  if (payment.status === 'COMPLETED') {
    return NextResponse.json({ received: true, alreadyDone: true })
  }

  // Verify amount matches if we extracted it
  if (amountVerified && Math.round(amountVerified) !== Math.round(payment.amount)) {
    console.warn(`[payments/confirm] Amount mismatch: expected ${payment.amount}, notification says ${amountVerified}`)
    // Log for admin review
    await sendDiscord('error', {
      title: 'Amount Mismatch Warning',
      color: 0xf59e0b,
      fields: [
        { name: 'UTR', value: utrNumber, inline: true },
        { name: 'Expected', value: `Rs ${payment.amount}`, inline: true },
        { name: 'Received', value: `Rs ${amountVerified}`, inline: true },
        { name: 'User', value: payment.user.username ?? payment.userId, inline: true },
      ],
    }, 'ArtisanStore Payments')
  }

  // Credit wallet atomically
  await prisma.$transaction([
    prisma.user.update({
      where: { id: payment.userId },
      data: { walletBalance: { increment: payment.amount } },
    }),
    prisma.walletTransaction.create({
      data: {
        userId: payment.userId,
        type: 'CREDIT',
        amount: payment.amount,
        currency: 'INR',
        method: 'UPI',
        referenceId: utrNumber,
        status: 'COMPLETED',
        description: `UPI wallet top-up — UTR: ${utrNumber}`,
      },
    }),
    prisma.paymentLink.update({
      where: { id: payment.id },
      data: { status: 'COMPLETED', completedAt: new Date() },
    }),
  ])

  console.log(`[payments/confirm] Credited Rs ${payment.amount} to user ${payment.user.username}`)

  // Discord success notification
  await sendDiscord('payment', {
    title: 'Payment Auto-Confirmed',
    color: 0x22c55e,
    fields: [
      { name: 'User', value: payment.user.username ?? payment.userId, inline: true },
      { name: 'Amount', value: `Rs ${payment.amount}`, inline: true },
      { name: 'UTR', value: utrNumber, inline: false },
    ],
  }, 'ArtisanStore Payments')

  return NextResponse.json({ success: true, amountCredited: payment.amount })
}
