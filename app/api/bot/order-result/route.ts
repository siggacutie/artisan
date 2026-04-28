import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendDiscord } from '@/lib/discord'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-bot-secret')
  if (secret !== process.env.BOT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { orderId, success, error, playerName, finalUrl } = await req.json()

  if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { username: true } } }
  })

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  if (success) {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: 'COMPLETED',
        completedAt: new Date(),
        notes: `Delivered to ${playerName ?? 'unknown'}. URL: ${finalUrl ?? 'N/A'}`,
      },
    })

    await sendDiscord('order', {
      title: 'Order Delivered',
      color: 0x22c55e,
      fields: [
        { name: 'Order ID', value: orderId, inline: true },
        { name: 'User', value: order.user?.username ?? 'unknown', inline: true },
        { name: 'Player', value: playerName ?? 'N/A', inline: true },
        { name: 'Amount', value: `${order.totalPrice} coins`, inline: true },
      ],
    })

  } else {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: 'FAILED',
        notes: `Bot error: ${error ?? 'unknown'}`,
      },
    })

    await sendDiscord('order', {
      title: 'Order Delivery FAILED',
      color: 0xef4444,
      fields: [
        { name: 'Order ID', value: orderId, inline: true },
        { name: 'User', value: order.user?.username ?? 'unknown', inline: true },
        { name: 'Error', value: error ?? 'unknown', inline: false },
      ],
    })

    // Refund wallet if delivery failed
    if (order.paymentStatus === 'PAID') {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: order.userId },
          data: { walletBalance: { increment: order.totalPrice } },
        }),
        prisma.walletTransaction.create({
          data: {
            userId: order.userId,
            type: 'CREDIT',
            amount: order.totalPrice,
            currency: 'INR',
            method: 'REFUND',
            referenceId: orderId,
            status: 'COMPLETED',
            description: `Refund for failed order ${orderId}`,
          },
        }),
        prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'REFUNDED' },
        }),
      ])

      await sendDiscord('order', {
        title: 'Auto-Refund Issued',
        color: 0xf59e0b,
        fields: [
          { name: 'Order ID', value: orderId, inline: true },
          { name: 'Refunded', value: `${order.totalPrice} coins`, inline: true },
        ],
      })
    }
  }

  return NextResponse.json({ success: true })
}
