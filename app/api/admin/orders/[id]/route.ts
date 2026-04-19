import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/adminAuth'
import { securityLog } from '@/lib/securityLog'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: orderId } = await params
  const { orderStatus, paymentStatus, notes } = await req.json()

  try {
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId }
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

      // If status changed to REFUNDED, credit user wallet
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

    securityLog('ADMIN_ORDER_UPDATE', { adminId: admin.id, orderId, status: orderStatus })
    return NextResponse.json(updatedOrder)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
