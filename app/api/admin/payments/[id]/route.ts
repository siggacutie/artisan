import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action } = await req.json()
  const { id } = await params

  const payment = await prisma.paymentLink.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!payment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (action === 'confirm') {
    if (payment.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Already completed' }, { status: 400 })
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: payment.userId },
        data: { walletBalance: { increment: payment.amount } },
      }),
      prisma.walletTransaction.create({
        data: {
          userId: payment.userId,
          type: 'CREDIT',
          amount: payment.amount,
          currency: 'INR',
          method: 'UPI_MANUAL',
          referenceId: payment.utrNumber ?? payment.id,
          status: 'COMPLETED',
          description: `Manual UPI approval — UTR: ${payment.utrNumber ?? 'N/A'}`,
        },
      }),
      prisma.paymentLink.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      }),
    ])

    return NextResponse.json({ success: true })
  }

  if (action === 'reject') {
    await prisma.paymentLink.update({
      where: { id: payment.id },
      data: { status: 'EXPIRED' },
    })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
