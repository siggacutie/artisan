import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  // Verify listener secret
  const authHeader = req.headers.get('x-listener-secret')
  if (!authHeader || !process.env.LISTENER_SECRET || authHeader !== process.env.LISTENER_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { utrNumber, amountVerified } = body

  if (!utrNumber) {
    return NextResponse.json({ error: 'UTR required' }, { status: 400 })
  }

  const cleanUtr = utrNumber.toString().trim().toUpperCase()

  // Find payment by UTR
  const payment = await prisma.paymentLink.findFirst({
    where: { utrNumber: cleanUtr },
    include: { user: true },
  })

  if (!payment) {
    return NextResponse.json({ error: 'No payment found with this UTR' }, { status: 404 })
  }

  if (payment.status === 'COMPLETED') {
    return NextResponse.json({ message: 'Already processed', alreadyDone: true })
  }

  if (payment.status === 'EXPIRED') {
    return NextResponse.json({ error: 'Payment link expired' }, { status: 400 })
  }

  // Strict amount verification
  if (amountVerified) {
    const verifiedAmount = Number(amountVerified)
    if (verifiedAmount !== payment.amount) {
      console.error(`[payments/confirm] AMOUNT MISMATCH: expected ${payment.amount}, got ${verifiedAmount}`)
      return NextResponse.json({ 
        error: 'Amount mismatch detected. User requested ' + payment.amount + ' but paid ' + verifiedAmount 
      }, { status: 400 })
    }
  }

  // Credit wallet atomically
  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: payment.userId,
        walletBalance: { gte: 0 }, // safety check
      },
      data: {
        walletBalance: { increment: payment.amount },
      },
    }),
    prisma.walletTransaction.create({
      data: {
        userId: payment.userId,
        type: 'CREDIT',
        amount: payment.amount,
        currency: 'INR',
        method: 'UPI',
        referenceId: cleanUtr,
        status: 'COMPLETED',
        description: `UPI wallet top-up — UTR: ${cleanUtr}`,
      },
    }),
    prisma.paymentLink.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    }),
  ])

  // Discord success notification
  if (process.env.DISCORD_WEBHOOK) {
    fetch(process.env.DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'ArtisanStore Payments',
        embeds: [{
          title: 'Payment Confirmed',
          color: 0x22c55e,
          fields: [
            { name: 'User', value: payment.user.username ?? payment.userId, inline: true },
            { name: 'Amount', value: `Rs ${payment.amount}`, inline: true },
            { name: 'UTR', value: cleanUtr, inline: false },
          ],
          timestamp: new Date().toISOString(),
        }]
      })
    }).catch(() => {})
  }

  return NextResponse.json({ success: true, amountCredited: payment.amount })
}
