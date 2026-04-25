import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const page = Number(searchParams.get('page') ?? 1)
  const limit = 20

  const where: any = {}
  if (status && status !== 'all') {
    where.status = status
  }

  const [payments, total] = await Promise.all([
    prisma.paymentLink.findMany({
      where,
      include: {
        user: { select: { username: true, id: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.paymentLink.count({ where }),
  ])

  return NextResponse.json({ payments, total, page, limit })
}
