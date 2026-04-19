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

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

  // Find users whose membership expired more than 3 days ago and are resellers
  const expiredUsers = await prisma.user.findMany({
    where: {
      isReseller: true,
      membershipExpiresAt: {
        not: null,
        lt: threeDaysAgo,
      },
    },
    select: { id: true, email: true },
  })

  const results = []

  for (const user of expiredUsers) {
    await prisma.$transaction([
      // Zero out wallet balance
      prisma.user.update({
        where: { id: user.id },
        data: {
          walletBalance: 0,
          isReseller: false,
          isFrozen: true,
        },
      }),
      // Delete all wallet transactions
      prisma.walletTransaction.deleteMany({
        where: { userId: user.id },
      }),
      // Delete all sessions
      prisma.session.deleteMany({
        where: { userId: user.id },
      }),
    ])
    results.push({ userId: user.id, email: user.email, action: 'data_cleared' })
  }

  return NextResponse.json({
    processed: results.length,
    users: results,
    timestamp: new Date().toISOString(),
  })
}
