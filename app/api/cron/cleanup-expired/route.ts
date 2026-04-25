/**
 * CRON_SECRET is required in environment variables to authorize this route.
 * This route deletes data for users whose membership expired more than 3 days ago.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Find all expired users to check for auto-renewal first
  const expiredUsers = await prisma.user.findMany({
    where: {
      isReseller: true,
      membershipExpiresAt: {
        not: null,
        lt: new Date(),
      },
    },
    // We need more fields for auto-renewal check
  })

  const results = []
  const MEMBERSHIP_PRICES: Record<number, number> = { 1: 250, 3: 699, 6: 1299, 12: 2699 }
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

  for (const user of expiredUsers) {
    // 1. Check Auto-Renewal
    if (user.autoRenew && user.autoRenewMonths) {
      const cost = MEMBERSHIP_PRICES[user.autoRenewMonths]
      
      if (cost && user.walletBalance >= cost) {
        // Sufficient balance — auto renew
        const base = new Date() // expiry was in the past, so base on now
        const newExpiry = new Date(base)
        newExpiry.setMonth(newExpiry.getMonth() + user.autoRenewMonths)
        
        try {
          await prisma.$transaction([
            prisma.user.update({
              where: { 
                id: user.id,
                walletBalance: { gte: cost }
              },
              data: {
                walletBalance: { decrement: cost },
                membershipExpiresAt: newExpiry,
                membershipMonths: user.autoRenewMonths,
                isReseller: true,
                isFrozen: false,
              }
            }),
            prisma.walletTransaction.create({
              data: {
                userId: user.id,
                type: 'DEBIT',
                amount: cost,
                currency: 'INR',
                method: 'AUTO_RENEW',
                referenceId: `autorenew_${user.id}_${Date.now()}`,
                status: 'COMPLETED',
                description: `Auto-renewal — ${user.autoRenewMonths} month${user.autoRenewMonths > 1 ? 's' : ''}`,
              }
            }),
            prisma.membershipPayment.create({
              data: {
                userId: user.id,
                months: user.autoRenewMonths,
                amountInr: cost,
                status: 'PAID',
              },
            }),
          ])
          
          results.push({ userId: user.id, username: user.username, action: 'auto_renewed' })
          continue // skip cleanup for this user
        } catch (err) {
          console.error(`[cron] Auto-renew failed for ${user.username}:`, err)
        }
      }
    }

    // 2. Check 3-day grace period before cleanup
    if (user.membershipExpiresAt && new Date(user.membershipExpiresAt) > threeDaysAgo) {
      // Still in grace period
      results.push({ userId: user.id, username: user.username, action: 'grace_period' })
      continue
    }

    // 3. Cleanup logic (revocation)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          walletBalance: 0,
          isReseller: false,
          isFrozen: true,
        },
      }),
      // Assuming we want to clear sensitive logs but keep order history
      prisma.resellerSession.deleteMany({
        where: { userId: user.id },
      }),
    ])
    results.push({ userId: user.id, username: user.username, action: 'membership_revoked' })
  }

  return NextResponse.json({
    processed: results.length,
    users: results,
    timestamp: new Date().toISOString(),
  })
}
