import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/adminAuth'
import { securityLog } from '@/lib/securityLog'
import { validateOrigin } from '@/lib/validateOrigin'
import { sendDiscord } from '@/lib/discord'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: orderId } = await params
  const { orderStatus, paymentStatus, notes } = await req.json()

  try {
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true }
    })

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: orderStatus ?? currentOrder.orderStatus,
          paymentStatus: paymentStatus ?? currentOrder.paymentStatus,
          notes: notes ?? currentOrder.notes,
          completedAt: orderStatus === 'COMPLETED' ? new Date() : currentOrder.completedAt
        }
      })

      if (orderStatus === 'REFUNDED' && currentOrder.orderStatus !== 'REFUNDED') {
        await tx.user.update({
          where: { id: currentOrder.userId },
          data: { walletBalance: { increment: currentOrder.totalPrice } }
        })

        await tx.walletTransaction.create({
          data: {
            userId: currentOrder.userId,
            type: 'CREDIT',
            amount: currentOrder.totalPrice,
            method: 'ADMIN',
            status: 'COMPLETED',
            description: `Refund for order ${orderId}`
          }
        })
      }

      return updated
    })

    if (orderStatus && orderStatus !== currentOrder.orderStatus) {
      await sendDiscord('order', {
        title: `Order ${orderStatus}`,
        color: orderStatus === 'COMPLETED' ? 0x22c55e : (orderStatus === 'REFUNDED' ? 0xf59e0b : 0x00c3ff),
        fields: [
          { name: 'User', value: currentOrder.user.username || currentOrder.userId, inline: true },
          { name: 'Order ID', value: orderId, inline: true },
          { name: 'Status', value: orderStatus, inline: true },
          { name: 'Admin', value: admin.email, inline: true },
        ],
      }, 'ArtisanStore Admin')
    }

    securityLog('ADMIN_ORDER_UPDATE', { adminId: admin.id, orderId, status: orderStatus })
    return NextResponse.json(updatedOrder)
  } catch (err) {
    console.error('Order update error:', err)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
