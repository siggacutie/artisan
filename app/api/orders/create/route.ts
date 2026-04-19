import { NextRequest, NextResponse } from 'next/server'
import { getResellerSession } from '@/lib/resellerAuth'
import { prisma } from '@/lib/prisma'
import Razorpay from 'razorpay'
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

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: 'Payment gateway misconfigured' }, { status: 500 })
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })

  try {
    const { packageId, playerId, zoneId, username } = await req.json()

    // Get current user details from DB to check restrictions
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, role: true, isBanned: true },
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

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(finalPrice * 100),
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        userId: user.id,
        playerId,
        zoneId,
        username: safeUsername,
        packageLabel: pkg.label,
        supplierProductId: pkg.supplierProductId,
      },
    })

    const dbOrder = await prisma.order.create({
      data: {
        userId: user.id,
        gameId: game.id,
        type: 'TOPUP',
        productId: pkg.supplierProductId,
        quantity: 1,
        unitPrice: finalPrice,
        totalPrice: finalPrice,
        paymentMethod: 'RAZORPAY',
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
        playerInputs: { playerId, zoneId },
        mlbbUsername: safeUsername,
        notes: pkg.label,
      },
    })

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      dbOrderId: dbOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (err: any) {
    console.error('Order creation error:', err)
    return NextResponse.json({ error: err.message ?? 'Order creation failed' }, { status: 500 })
  }
}
