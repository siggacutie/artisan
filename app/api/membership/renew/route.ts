import { NextRequest, NextResponse } from 'next/server'
import { getResellerSession } from '@/lib/resellerAuth'
import { validateOrigin } from '@/lib/validateOrigin'
import { prisma } from '@/lib/prisma'
import { sendDiscord } from '@/lib/discord'

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

  if (user.walletBalance < costInr) {
    return NextResponse.json({
      error: 'Insufficient coins',
      currentCoins: Math.floor(user.walletBalance),
      requiredCoins: costInr,
    }, { status: 402 })
  }

  try {
    const { newExpiry, finalUser } = await prisma.$transaction(async (tx) => {
      const txUser = await tx.user.findUnique({
        where: { id: session.id },
      })

      if (!txUser) throw new Error('User not found')
      if (txUser.walletBalance < costInr) throw new Error('Insufficient balance')

      const baseDate = !txUser.membershipExpiresAt || new Date(txUser.membershipExpiresAt) < new Date()
        ? new Date()
        : new Date(txUser.membershipExpiresAt)

      const calculatedExpiry = new Date(baseDate)
      calculatedExpiry.setMonth(calculatedExpiry.getMonth() + Number(months))

      const updated = await tx.user.update({
        where: { 
          id: session.id,
          walletBalance: { gte: costInr }
        },
        data: {
          walletBalance: { decrement: costInr },
          membershipExpiresAt: calculatedExpiry,
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

      return { newExpiry: calculatedExpiry, finalUser: updated }
    })

    await sendDiscord('signup', {
      title: 'Membership Renewed',
      color: 0x22c55e,
      fields: [
        { name: 'User', value: finalUser.username || finalUser.id, inline: true },
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
