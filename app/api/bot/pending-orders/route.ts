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
        select: { 
          supplierConfig: true,
          supplierBaseUrl: true 
        }
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
      const user_id = String(inputs?.playerId || inputs?.user_id || '')
      const zone_id = String(inputs?.zoneId || inputs?.zone_id || '')
      
      return {
        ...order,
        supplierProductId: pkg?.supplierProductId ?? order.productId,
        supplierBaseUrl: order.game.supplierBaseUrl,
        // Map keys for bot compatibility at root
        user_id,
        zone_id,
        // Also ensure they are inside playerInputs for legacy bot versions
        playerInputs: {
          ...inputs,
          user_id,
          zone_id,
          userId: user_id,
          zoneId: zone_id,
          playerId: user_id,
          zone_ID: zone_id
        }
      }
    })
  )

  return NextResponse.json({ orders: formattedOrders })
}
