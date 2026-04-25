import { NextRequest, NextResponse } from 'next/server'
import { getResellerSession } from '@/lib/resellerAuth'
import { prisma } from '@/lib/prisma'
import { validateOrigin } from '@/lib/validateOrigin'
import { securityLog } from '@/lib/securityLog'
import { rateLimit } from '@/lib/rateLimit'
import { validators, sanitizeHtml } from '@/lib/validate'
import { getPackagesWithPrices } from '@/lib/pricing'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) {
    securityLog('CSRF_BLOCKED', { origin: req.headers.get('origin'), path: req.nextUrl.pathname })
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const user = await getResellerSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = rateLimit(`order:${user.id}`, 5, 60 * 1000)
  if (!rl.allowed) {
    securityLog('RATE_LIMIT_ORDER_CREATE', { userId: user.id })
    return NextResponse.json({ error: 'Too many order attempts. Please wait a moment.' }, { status: 429 })
  }

  try {
    const { packageId, playerId, zoneId, username, paymentMethod } = await req.json()

    // Get current user details from DB to check restrictions and balance
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, role: true, isBanned: true, walletBalance: true },
    })

    if (!dbUser || dbUser.isBanned) {
      return NextResponse.json({ error: 'Account restricted' }, { status: 403 })
    }

    const isReseller = dbUser.role === 'RESELLER'

    // Reseller Rate Limiting
    if (isReseller) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const orderCount = await prisma.order.count({
        where: {
          userId: dbUser.id,
          createdAt: { gte: twentyFourHoursAgo }
        }
      })
      if (orderCount >= 50) {
        return NextResponse.json({ error: "Daily order limit reached. Contact support." }, { status: 429 })
      }
    }

    // Price Validation
    const packagesWithPrices = await getPackagesWithPrices()
    const pkg = packagesWithPrices.find(p => p.id === packageId)

    if (!pkg) {
      securityLog('INVALID_PACKAGE_SELECTED', { userId: user.id, packageId })
      return NextResponse.json({ error: 'Invalid package selected' }, { status: 400 })
    }

    if (!validators.playerId(playerId) || !validators.zoneId(zoneId) || !validators.username(username)) {
      securityLog('INVALID_INPUT', { userId: user.id, packageId, playerId, zoneId })
      return NextResponse.json({ error: 'Invalid input details' }, { status: 400 })
    }

    const finalPrice = isReseller ? pkg.resellerPrice : pkg.userPrice
    const safeUsername = sanitizeHtml(username)

    // Idempotency check
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const duplicateOrder = await prisma.order.findFirst({
      where: {
        userId: user.id,
        productId: pkg.supplierProductId,
        paymentStatus: 'PENDING',
        createdAt: { gte: fiveMinutesAgo },
        playerInputs: {
          path: ['playerId'],
          equals: playerId,
        },
      },
    })

    if (duplicateOrder) {
      return NextResponse.json({
        success: true,
        duplicate: true,
        message: 'You have a pending order for this package. Please complete or wait 5 minutes before retrying.',
        dbOrderId: duplicateOrder.id,
      }, { status: 200 })
    }

    const game = await prisma.game.findUnique({
      where: { slug: 'mobile-legends' }
    })

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    // ONLY Wallet Payment is allowed now
    if (paymentMethod !== 'wallet') {
      return NextResponse.json({ error: 'Direct payment disabled. Please top up your wallet first.' }, { status: 400 })
    }

    if (dbUser.walletBalance < finalPrice) {
      return NextResponse.json({ 
        error: 'Insufficient coins',
        currentCoins: Math.floor(dbUser.walletBalance),
        requiredCoins: Math.ceil(finalPrice)
      }, { status: 402 })
    }

    try {
      const order = await prisma.$transaction(async (tx) => {
        // Double safety at DB level
        await tx.user.update({
          where: { 
            id: user.id,
            walletBalance: { gte: finalPrice }
          },
          data: { walletBalance: { decrement: finalPrice } }
        })

        const newOrder = await tx.order.create({
          data: {
            userId: user.id,
            gameId: game.id,
            type: 'TOPUP',
            productId: pkg.supplierProductId,
            quantity: 1,
            unitPrice: finalPrice,
            totalPrice: finalPrice,
            paymentMethod: 'WALLET',
            paymentStatus: 'PAID',
            orderStatus: 'PENDING',
            playerInputs: { playerId, zoneId },
            mlbbUsername: safeUsername,
            notes: pkg.label,
          },
        })

        await tx.walletTransaction.create({
          data: {
            userId: user.id,
            type: 'DEBIT',
            amount: finalPrice,
            currency: 'INR',
            method: 'WALLET',
            referenceId: `order_${newOrder.id}`,
            status: 'COMPLETED',
            description: `Payment for ${pkg.label} — ${safeUsername}`,
          },
        })

        return newOrder
      })

      return NextResponse.json({
        success: true,
        orderId: order.id,
        message: 'Order placed successfully using wallet balance'
      })
    } catch (error: any) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Insufficient coins' }, { status: 402 })
      }
      throw error
    }
  } catch (err: any) {
    console.error('Order creation error:', err)
    return NextResponse.json({ error: err.message ?? 'Order creation failed' }, { status: 500 })
  }
}
