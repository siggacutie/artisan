import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        walletBalance: true, 
        name: true, 
        email: true, 
        image: true, 
        createdAt: true,
        membershipExpiresAt: true,
        membershipMonths: true,
        isReseller: true,
        isFrozen: true,
        isBanned: true
      }
    })

    const orderCount = await prisma.order.count({
      where: { userId: session.user.id }
    })

    return NextResponse.json({
      walletBalance: user?.walletBalance ?? 0,
      name: user?.name,
      email: user?.email,
      image: user?.image,
      createdAt: user?.createdAt,
      membershipExpiresAt: user?.membershipExpiresAt,
      membershipMonths: user?.membershipMonths,
      isReseller: user?.isReseller,
      isFrozen: user?.isFrozen,
      isBanned: user?.isBanned,
      orderCount
    })
  } catch (error) {
    console.error('Dashboard summary error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
