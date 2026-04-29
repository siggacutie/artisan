import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-bot-secret')?.trim()
  const botSecret = process.env.BOT_SECRET?.trim()

  if (!botSecret || secret !== botSecret) {
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
        where: { supplierProductId: order.productId },
        select: { supplierProductId: true },
      })
      
      const inputs = order.playerInputs as any
      
      return {
        ...order,
        supplierProductId: pkg?.supplierProductId ?? order.productId,
        // Map keys for bot compatibility
        user_id: inputs?.playerId || inputs?.user_id,
        zone_id: inputs?.zoneId || inputs?.zone_id,
      }
    })
  )

  return NextResponse.json({ orders: formattedOrders })
}
