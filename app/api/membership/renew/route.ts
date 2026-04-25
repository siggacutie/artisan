import { NextRequest, NextResponse } from 'next/server'
import { getResellerSession } from '@/lib/resellerAuth'
import { validateOrigin } from '@/lib/validateOrigin'
import { prisma } from '@/lib/prisma'

const MEMBERSHIP_PRICES: Record<number, number> = {
  1: 250,
  3: 699,
  6: 1299,
  12: 2699,
}

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const session = await getResellerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { months } = await req.json()

  const costInr = MEMBERSHIP_PRICES[Number(months)]
  if (!costInr) return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { id: session.id } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Check sufficient balance — walletBalance is stored as INR, 1 coin = 1 INR
  if (user.walletBalance < costInr) {
    return NextResponse.json({
      error: 'Insufficient coins',
      currentCoins: Math.floor(user.walletBalance),
      requiredCoins: costInr,
    }, { status: 402 })
  }

  // Calculate new expiry
  const base = !user.membershipExpiresAt || new Date(user.membershipExpiresAt) < new Date()
    ? new Date()
    : new Date(user.membershipExpiresAt)

  const newExpiry = new Date(base)
  newExpiry.setMonth(newExpiry.getMonth() + Number(months))

  // Atomic transaction — deduct coins + update membership + log transaction
  try {
    await prisma.$transaction(async (tx) => {
      // Double safety at DB level
      const updatedUser = await tx.user.update({
        where: { 
          id: session.id,
          walletBalance: { gte: costInr }
        },
        data: {
          walletBalance: { decrement: costInr },
          membershipExpiresAt: newExpiry,
          membershipMonths: Number(months),
          isReseller: true,
          isFrozen: false,
        },
      })

      await tx.walletTransaction.create({
        data: {
          userId: session.id,
          type: 'DEBIT',
          amount: costInr,
          currency: 'INR',
          method: 'WALLET',
          referenceId: `membership_${session.id}_${Date.now()}`,
          status: 'COMPLETED',
          description: `Membership renewal — ${months} month${Number(months) > 1 ? 's' : ''}`,
        },
      })

      await tx.membershipPayment.create({
        data: {
          userId: session.id,
          months: Number(months),
          amountInr: costInr,
          status: 'PAID',
        },
      })
    })

    return NextResponse.json({ success: true, newExpiry })
  } catch (error: any) {
    if (error.code === 'P2025') {
       return NextResponse.json({ error: 'Insufficient balance' }, { status: 402 })
    }
    console.error('[membership/renew]', error)
    return NextResponse.json({ error: 'Failed to renew membership' }, { status: 500 })
  }
}
