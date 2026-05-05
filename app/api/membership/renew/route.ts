import { NextRequest, NextResponse } from 'next/server'
import { getResellerSession } from '@/lib/resellerAuth'
import { validateOrigin } from '@/lib/validateOrigin'
import { prisma } from '@/lib/prisma'
import { sendDiscord } from '@/lib/discord'

const MEMBERSHIP_PLANS: Record<string, Record<number, number>> = {
  BASIC: {
    1: 149,
    3: 399,
    6: 749,
    12: 1299,
  },
  PREMIUM: {
    1: 200,
    3: 549,
    6: 999,
    12: 1799,
  }
}

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const session = await getResellerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { months, tier } = await req.json()

  const selectedTier = tier || 'BASIC'
  const costInr = MEMBERSHIP_PLANS[selectedTier]?.[Number(months)]
  
  if (!costInr) return NextResponse.json({ error: 'Invalid plan or tier selected' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { id: session.id } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (user.walletBalance < costInr) {
    return NextResponse.json({
      error: 'Insufficient coins',
      currentCoins: Math.floor(user.walletBalance),
      requiredCoins: costInr,
    }, { status: 402 })
  }

  try {
    const { newExpiry, finalUser, startsAt } = await prisma.$transaction(async (tx) => {
      const txUser = await tx.user.findUnique({
        where: { id: session.id },
        include: { membershipQueue: { orderBy: { expiresAt: 'desc' }, take: 1 } }
      })

      if (!txUser) throw new Error('User not found')
      if (txUser.walletBalance < costInr) throw new Error('Insufficient balance')

      // Determine the start date for this new membership segment
      let baseDate = new Date()
      
      // If there's an existing queue, the last item's expiry is our base
      if (txUser.membershipQueue.length > 0) {
        const lastItemExpiry = new Date(txUser.membershipQueue[0].expiresAt)
        if (lastItemExpiry > baseDate) {
          baseDate = lastItemExpiry
        }
      } else if (txUser.membershipExpiresAt && new Date(txUser.membershipExpiresAt) > baseDate) {
        // Fallback to User.membershipExpiresAt if queue is empty but user has active membership
        baseDate = new Date(txUser.membershipExpiresAt)
      }

      const calculatedStartsAt = new Date(baseDate)
      const calculatedExpiry = new Date(baseDate)
      calculatedExpiry.setMonth(calculatedExpiry.getMonth() + Number(months))

      // Create the queue item
      await tx.membershipItem.create({
        data: {
          userId: session.id,
          tier: selectedTier,
          months: Number(months),
          startsAt: calculatedStartsAt,
          expiresAt: calculatedExpiry,
        }
      })

      // Update User fields
      // If the membership starts NOW (or in the past), we update the tier immediately
      const isImmediate = calculatedStartsAt <= new Date()
      
      const updated = await tx.user.update({
        where: { 
          id: session.id,
          walletBalance: { gte: costInr }
        },
        data: {
          walletBalance: { decrement: costInr },
          membershipExpiresAt: calculatedExpiry,
          // Only update tier if it's an immediate start or the user had no active membership
          ...(isImmediate ? { tier: selectedTier } : {}),
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
          description: `Membership renewal — ${selectedTier} ${months} month${Number(months) > 1 ? 's' : ''}`,
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

      return { newExpiry: calculatedExpiry, finalUser: updated }
    })

    await sendDiscord('signup', {
      title: 'Membership Renewed',
      color: 0x22c55e,
      fields: [
        { name: 'User', value: finalUser.username || finalUser.id, inline: true },
        { name: 'Tier', value: selectedTier, inline: true },
        { name: 'Plan', value: `${months} Months`, inline: true },
        { name: 'Cost', value: `${costInr} coins`, inline: true },
        { name: 'New Expiry', value: newExpiry.toLocaleDateString(), inline: true },
      ],
    }, 'ArtisanStore Membership')

    return NextResponse.json({ success: true, newExpiry })
  } catch (error: any) {
    if (error.code === 'P2025' || error.message === 'Insufficient balance') {
       return NextResponse.json({ error: 'Insufficient balance' }, { status: 402 })
    }
    console.error('[membership/renew]', error)
    await sendDiscord('error', {
      title: 'Membership Renewal Failed',
      color: 0xef4444,
      fields: [
        { name: 'User', value: user.username || user.id, inline: true },
        { name: 'Error', value: error.message ?? 'Unknown error', inline: false },
      ],
    }, 'ArtisanStore System')
    return NextResponse.json({ error: 'Failed to renew membership' }, { status: 500 })
  }
}
