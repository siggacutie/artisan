import { getResellerSession } from '@/lib/resellerAuth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await getResellerSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { 
        walletBalance: true, 
        name: true, 
        email: true, 
        avatarUrl: true, 
        createdAt: true,
        membershipExpiresAt: true,
        membershipMonths: true,
        isReseller: true,
        isFrozen: true,
        isBanned: true
      }
    })

    const orderCount = await prisma.order.count({
      where: { userId: user.id }
    })

    const totalSpentResult = await prisma.order.aggregate({
      where: { 
        userId: user.id,
        paymentStatus: 'PAID'
      },
      _sum: { totalPrice: true }
    })
    const totalSpent = totalSpentResult._sum.totalPrice ?? 0

    return NextResponse.json({
      walletBalance: userData?.walletBalance ?? 0,
      name: userData?.name,
      email: userData?.email,
      image: userData?.avatarUrl,
      createdAt: userData?.createdAt,
      membershipExpiresAt: userData?.membershipExpiresAt,
      membershipMonths: userData?.membershipMonths,
      isReseller: userData?.isReseller,
      isFrozen: userData?.isFrozen,
      isBanned: userData?.isBanned,
      totalSpent,
      orderCount
    })
  } catch (error) {
    console.error('Dashboard summary error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
