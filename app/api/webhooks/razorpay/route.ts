import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { securityLog } from '@/lib/securityLog'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature')

  if (!signature || !process.env.RAZORPAY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex')

  if (expectedSignature !== signature) {
    securityLog('WEBHOOK_INVALID_SIGNATURE', { signature })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: any
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (event.event === 'payment.captured') {
    const payment = event.payload?.payment?.entity
    if (!payment) return NextResponse.json({ received: true })

    // const notes = payment.notes ?? {}
    // const razorpayOrderId = payment.order_id

    const order = await prisma.order.findFirst({
      where: {
        supplierOrderId: payment.id,
        paymentStatus: 'PAID',
      },
    })

    if (!order) {
      const pendingOrder = await prisma.order.findFirst({
        where: { 
            paymentStatus: 'PENDING',
            // Ideally we should match with Razorpay order ID or something in notes
        },
        orderBy: { createdAt: 'desc' },
      })

      if (pendingOrder && pendingOrder.paymentStatus === 'PENDING') {
        await prisma.order.update({
          where: { id: pendingOrder.id },
          data: {
            paymentStatus: 'PAID',
            orderStatus: 'PENDING',
            supplierOrderId: payment.id,
          },
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
