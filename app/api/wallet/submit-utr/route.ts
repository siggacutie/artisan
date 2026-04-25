import { NextRequest, NextResponse } from 'next/server'
import { getResellerSession } from '@/lib/resellerAuth'
import { validateOrigin } from '@/lib/validateOrigin'
import { prisma } from '@/lib/prisma'

// UTR validation: UPI reference numbers are 12 digits
// IMPS UTR is 12 digits. NEFT is 22 alphanumeric.
// We accept 12-22 alphanumeric characters, no spaces
const UTR_REGEX = /^[A-Z0-9]{12,22}$/i

// In-memory rate limiter for UTR submissions
// Max 5 attempts per userId per 15 minutes
const utrAttempts = new Map<string, { count: number; resetAt: number }>()

function checkUtrRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = utrAttempts.get(userId)

  if (!entry || now > entry.resetAt) {
    utrAttempts.set(userId, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return true
  }

  if (entry.count >= 5) return false

  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const session = await getResellerSession(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.id

  // Rate limit check
  if (!checkUtrRateLimit(userId)) {
    return NextResponse.json({
      error: 'Too many UTR submission attempts. Please wait 15 minutes.'
    }, { status: 429 })
  }

  const body = await req.json()
  const { paymentLinkId, utrNumber } = body

  // Validate UTR format — must match regex
  if (!utrNumber || !UTR_REGEX.test(utrNumber.trim())) {
    return NextResponse.json({
      error: 'Invalid UTR format. UTR should be 12-22 alphanumeric characters. Make sure you are entering the UTR number and NOT the transaction ID.'
    }, { status: 400 })
  }

  const cleanUtr = utrNumber.trim().toUpperCase()

  // Check UTR not already used (globally across all payments)
  const existingUtr = await prisma.paymentLink.findFirst({
    where: { utrNumber: cleanUtr },
  })

  if (existingUtr) {
    return NextResponse.json({
      error: 'This UTR has already been used. Each UTR can only be submitted once.'
    }, { status: 400 })
  }

  // Find the payment link
  const paymentLink = await prisma.paymentLink.findFirst({
    where: {
      id: paymentLinkId,
      userId,
    },
  })

  if (!paymentLink) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  }

  if (paymentLink.status === 'COMPLETED') {
    return NextResponse.json({ error: 'This payment is already completed' }, { status: 400 })
  }

  if (paymentLink.status === 'EXPIRED') {
    return NextResponse.json({ error: 'This payment link has expired' }, { status: 400 })
  }

  if (new Date(paymentLink.expiresAt) < new Date()) {
    // Mark as expired
    await prisma.paymentLink.update({
      where: { id: paymentLink.id },
      data: { status: 'EXPIRED' },
    })
    return NextResponse.json({ error: 'This payment link has expired. Please create a new one.' }, { status: 400 })
  }

  // Save UTR — extend expiry by 24 hours to give time for manual verification
  const extendedExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await prisma.paymentLink.update({
    where: { id: paymentLink.id },
    data: {
      utrNumber: cleanUtr,
      status: 'UTR_SUBMITTED',
      utrSubmittedAt: new Date(),
      expiresAt: extendedExpiry,
    },
  })

  // Send Discord notification for manual review
  if (process.env.DISCORD_WEBHOOK) {
    fetch(process.env.DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'ArtisanStore Payments',
        embeds: [{
          title: 'UTR Submitted — Pending Verification',
          color: 0xf59e0b,
          fields: [
            { name: 'User', value: userId, inline: true },
            { name: 'Amount', value: `Rs ${paymentLink.amount}`, inline: true },
            { name: 'UTR', value: cleanUtr, inline: false },
            { name: 'UPI Ref', value: paymentLink.upiRef, inline: true },
            { name: 'Payment ID', value: paymentLink.id, inline: true },
          ],
          timestamp: new Date().toISOString(),
        }]
      })
    }).catch(() => {})
  }

  return NextResponse.json({
    success: true,
    message: 'UTR submitted successfully. Your wallet will be credited once the payment is verified.',
  })
}
