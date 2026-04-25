import { NextRequest, NextResponse } from 'next/server'
import { getResellerSession } from '@/lib/resellerAuth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getResellerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const payment = await prisma.paymentLink.findFirst({
    where: { id, userId: session.id },
    select: {
      id: true,
      amount: true,
      status: true,
      upiRef: true,
      expiresAt: true,
      completedAt: true,
      utrSubmittedAt: true,
    },
  })

  if (!payment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(payment)
}
