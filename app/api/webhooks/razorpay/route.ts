import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature')

  if (!signature || !process.env.RAZORPAY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex')

  if (expectedSignature !== signature) {
    console.error('[webhook/razorpay] Invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(rawBody)

  if (event.event !== 'payment.captured') {
    return NextResponse.json({ received: true })
  }

  const payment = event.payload?.payment?.entity
  if (!payment) return NextResponse.json({ received: true })

  const orderId = payment.order_id
  const paymentId = payment.id
  const amountInr = payment.amount / 100
  const userId = payment.notes?.userId
  const type = payment.notes?.type

  if (type !== 'WALLET_TOPUP' || !userId || !orderId) {
    return NextResponse.json({ received: true })
  }

  const ALLOWED_AMOUNTS = [100, 200, 500, 1000, 1500, 2000, 3000, 5000, 10000]
  if (!ALLOWED_AMOUNTS.includes(amountInr)) {
    console.error('[webhook] Invalid amount', amountInr)
    return NextResponse.json({ received: true })
  }

  // Idempotency check
  const alreadyProcessed = await prisma.walletTransaction.findFirst({
    where: { referenceId: orderId },
  })

  if (alreadyProcessed) {
    return NextResponse.json({ received: true })
  }

  // Credit wallet
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { walletBalance: { increment: amountInr } },
    }),
    prisma.walletTransaction.create({
      data: {
        userId,
        type: 'CREDIT',
        amount: amountInr,
        currency: 'INR',
        method: 'RAZORPAY_WEBHOOK',
        referenceId: orderId,
        status: 'COMPLETED',
        description: `Wallet top-up via webhook (${paymentId})`,
      },
    }),
  ])

  console.log(`[webhook] Credited ₹${amountInr} to user ${userId}`)
  return NextResponse.json({ received: true })
}
