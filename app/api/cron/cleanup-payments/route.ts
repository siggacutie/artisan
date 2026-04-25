import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()

  // Expire PENDING links older than 30 minutes
  const expired = await prisma.paymentLink.updateMany({
    where: {
      status: 'PENDING',
      expiresAt: { lt: now },
    },
    data: { status: 'EXPIRED' },
  })

  // Delete EXPIRED links older than 7 days
  const deleted = await prisma.paymentLink.deleteMany({
    where: {
      status: 'EXPIRED',
      createdAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
  })

  console.log(`[cron/cleanup-payments] Expired: ${expired.count}, Deleted: ${deleted.count}`)
  return NextResponse.json({ expired: expired.count, deleted: deleted.count })
}
