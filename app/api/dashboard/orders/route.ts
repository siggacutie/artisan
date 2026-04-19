import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        type: true,
        totalPrice: true,
        orderStatus: true,
        paymentStatus: true,
        createdAt: true,
        mlbbUsername: true,
        playerInputs: true,
        completedAt: true
      }
    })

    const formattedOrders = orders.map(order => ({
      ...order,
      playerUsername: order.mlbbUsername
    }))

    return NextResponse.json({ orders: formattedOrders })
  } catch (error) {
    console.error('Dashboard orders error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
