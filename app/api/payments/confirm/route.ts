import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
// Handles: Rs.1.00, Rs 500, INR 1000, ₹500, credited with Rs.500.00
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
// Handles many bank formats:
// "Txn ID: 204766514631"
// "UPI Ref: 123456789012"
// "UTR: 123456789012"
// "Ref No: 123456789012"
// "Ref ID: HDFC1234567890"
// "Transaction ID: 123456789012"
function extractUTR(content: string): string | null {
  const patterns = [
    /(?:UTR|UPI Ref(?:erence)?|Ref(?:erence)?\s*(?:No|ID|Number)?|Txn\s*(?:ID|No|Ref)|Transaction\s*(?:ID|Ref|No))\s*[:#\s]\s*([A-Z0-9]{8,22})/i,
    /\b([0-9]{12})\b/, // bare 12-digit number (most common UTR format)
    /\b([A-Z]{4}[0-9]{8,18})\b/i, // bank code + digits (e.g. HDFC12345678)
  ]
  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) return match[1].toUpperCase()
  }
  return null
}

// Check if notification is a credit notification (not debit)
function isCreditNotification(content: string): boolean {
  const creditKeywords = ['credited', 'received', 'credit', 'added', 'deposited']
  const debitKeywords = ['debited', 'deducted', 'paid', 'sent', 'withdrawn']
  
  const lowerContent = content.toLowerCase()
  const hasCredit = creditKeywords.some(k => lowerContent.includes(k))
  const hasDebit = debitKeywords.some(k => lowerContent.includes(k))
  
  // If both present, credit takes priority only if it appears first
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
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Support both formats:
  // Format A (Android notification): { content: "...", title: "...", ... }
  // Format B (direct): { utrNumber: "...", amountVerified: 500 }

  let utrNumber: string | null = null
  let amountVerified: number | null = null

  if (body.content) {
    // Android notification format — parse content string
    const content = body.content as string

    console.log('[payments/confirm] Received notification:', {
      title: body.title,
      content: content,
      packageName: body.packageName,
      when: body.when,
    })

    // Only process credit notifications
    if (!isCreditNotification(content)) {
      console.log('[payments/confirm] Skipping — not a credit notification')
      return NextResponse.json({ received: true, skipped: 'not_credit' })
    }

    utrNumber = extractUTR(content)
    amountVerified = extractAmount(content)

    if (!utrNumber) {
      console.warn('[payments/confirm] Could not extract UTR from:', content)
      // Still log to Discord for manual review
      if (process.env.DISCORD_WEBHOOK_ERRORS) {
        fetch(process.env.DISCORD_WEBHOOK_ERRORS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'ArtisanStore Payments',
            embeds: [{
              title: 'Could not extract UTR',
              color: 0xf59e0b,
              fields: [
                { name: 'Title', value: body.title ?? 'N/A', inline: true },
                { name: 'Content', value: content.slice(0, 200), inline: false },
                { name: 'Amount Found', value: amountVerified ? `Rs ${amountVerified}` : 'Not found', inline: true },
              ],
              timestamp: new Date().toISOString(),
            }]
          })
        }).catch(() => {})
      }
      return NextResponse.json({ received: true, warning: 'utr_not_extracted' })
    }

    console.log('[payments/confirm] Extracted:', { utrNumber, amountVerified })

  } else if (body.utrNumber) {
    // Direct format
    utrNumber = body.utrNumber.toString().trim().toUpperCase()
    amountVerified = body.amountVerified ? Number(body.amountVerified) : null
  } else {
    return NextResponse.json({ error: 'No content or utrNumber in request' }, { status: 400 })
  }

  if (!utrNumber || !/^[A-Z0-9]{8,22}$/.test(utrNumber)) {
    return NextResponse.json({ error: 'Invalid UTR format' }, { status: 400 })
  }

  // Find payment by UTR
  const payment = await prisma.paymentLink.findFirst({
    where: { utrNumber },
    include: { user: true },
  })

  if (!payment) {
    console.log('[payments/confirm] No payment found for UTR:', utrNumber)
    // Log to Discord — might be a valid payment we need to manually match
    if (process.env.DISCORD_WEBHOOK) {
      fetch(process.env.DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'ArtisanStore Payments',
          embeds: [{
            title: 'Payment received but no matching UTR in system',
            color: 0xef4444,
            fields: [
              { name: 'UTR', value: utrNumber, inline: true },
              { name: 'Amount', value: amountVerified ? `Rs ${amountVerified}` : 'Unknown', inline: true },
            ],
            timestamp: new Date().toISOString(),
          }]
        })
      }).catch(() => {})
    }
    return NextResponse.json({ received: true, matched: false })
  }

  if (payment.status === 'COMPLETED') {
    return NextResponse.json({ received: true, alreadyDone: true })
  }

  // Verify amount matches if we extracted it
  if (amountVerified && Math.round(amountVerified) !== Math.round(payment.amount)) {
    console.warn(`[payments/confirm] Amount mismatch: expected ${payment.amount}, notification says ${amountVerified}`)
    // Still process — our DB amount is authoritative
    // But log for admin review
    if (process.env.DISCORD_WEBHOOK_ERRORS) {
      fetch(process.env.DISCORD_WEBHOOK_ERRORS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'ArtisanStore Payments',
          embeds: [{
            title: 'Amount Mismatch Warning',
            color: 0xf59e0b,
            fields: [
              { name: 'UTR', value: utrNumber, inline: true },
              { name: 'Expected', value: `Rs ${payment.amount}`, inline: true },
              { name: 'Received', value: `Rs ${amountVerified}`, inline: true },
              { name: 'User', value: payment.user.username ?? payment.userId, inline: true },
            ],
            timestamp: new Date().toISOString(),
          }]
        })
      }).catch(() => {})
    }
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
  if (process.env.DISCORD_WEBHOOK) {
    fetch(process.env.DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'ArtisanStore Payments',
        embeds: [{
          title: 'Payment Auto-Confirmed',
          color: 0x22c55e,
          fields: [
            { name: 'User', value: payment.user.username ?? payment.userId, inline: true },
            { name: 'Amount', value: `Rs ${payment.amount}`, inline: true },
            { name: 'UTR', value: utrNumber, inline: false },
          ],
          timestamp: new Date().toISOString(),
        }]
      })
    }).catch(() => {})
  }

  return NextResponse.json({ success: true, amountCredited: payment.amount })
}
