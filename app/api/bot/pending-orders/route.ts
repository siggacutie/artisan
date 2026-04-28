import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-bot-secret')
  if (secret !== process.env.BOT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: {
      orderStatus: 'PENDING',
      paymentStatus: 'PAID',
      type: 'TOPUP',
    },
    select: {
      id: true,
      playerInputs: true,
      productId: true,
      gameId: true,
      game: {
        select: { supplierConfig: true }
      }
    },
    orderBy: { createdAt: 'asc' },
    take: 5,
  })

  // Extract supplierProductId for each order
  const formattedOrders = await Promise.all(
    orders.map(async (order) => {
      const pkg = await prisma.diamondPackage.findFirst({
        where: { id: order.productId },
        select: { supplierProductId: true },
      })
      return {
        ...order,
        supplierProductId: pkg?.supplierProductId ?? null,
      }
    })
  )

  return NextResponse.json({ orders: formattedOrders })
}
