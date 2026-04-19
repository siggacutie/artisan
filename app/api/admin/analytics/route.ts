import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/adminAuth'
import { validateOrigin } from '@/lib/validateOrigin'

export async function GET(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)

    const [
      totalRevenueData,
      todayRevenueData,
      totalOrders,
      todayOrders,
      totalUsers,
      todayUsers,
      pendingApprovals,
      activeUsersCount,
      pendingOrdersCount,
      resellerCount,
      ordersByStatusData,
      recentOrders
    ] = await Promise.all([
      // Total Revenue
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { totalPrice: true }
      }),
      // Today's Revenue
      prisma.order.aggregate({
        where: { 
          paymentStatus: 'PAID',
          createdAt: { gte: startOfToday }
        },
        _sum: { totalPrice: true }
      }),
      // Total Orders
      prisma.order.count(),
      // Today's Orders
      prisma.order.count({
        where: { createdAt: { gte: startOfToday } }
      }),
      // Total Users
      prisma.user.count(),
      // Today's Registrations
      prisma.user.count({
        where: { createdAt: { gte: startOfToday } }
      }),
      // Pending Approvals (Manual UPI)
      prisma.walletTransaction.count({
        where: { 
          method: 'MANUAL_UPI',
          status: 'PENDING'
        }
      }),
      // Active Users (Last 15 mins)
      prisma.user.count({
        where: { lastSeenAt: { gte: fifteenMinutesAgo } }
      }),
      // Pending Orders
      prisma.order.count({
        where: { orderStatus: 'PENDING' }
      }),
      // Reseller Count
      prisma.user.count({
        where: { role: 'RESELLER' }
      }),
      // Orders by Status
      prisma.order.groupBy({
        by: ['orderStatus'],
        _count: { _all: true }
      }),
      // Recent Orders for table
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          playerInputs: true,
          type: true,
          totalPrice: true,
          orderStatus: true,
          createdAt: true,
          mlbbUsername: true
        }
      })
    ])

    const ordersByStatus = ordersByStatusData.reduce((acc: any, curr) => {
      acc[curr.orderStatus] = curr._count._all
      return acc
    }, {})

    return NextResponse.json({
      todayRevenue: todayRevenueData._sum.totalPrice ?? 0,
      totalRevenue: totalRevenueData._sum.totalPrice ?? 0,
      totalOrders,
      todayOrders,
      totalUsers,
      todayUsers,
      pendingApprovals,
      activeUsers: activeUsersCount,
      pendingOrders: pendingOrdersCount,
      resellerCount,
      ordersByStatus,
      recentOrders: recentOrders.map(o => ({
        id: o.id,
        player: o.mlbbUsername || (o.playerInputs as any)?.userId || 'Unknown',
        type: o.type,
        amount: `${o.totalPrice} INR`,
        status: o.orderStatus.charAt(0) + o.orderStatus.slice(1).toLowerCase(),
        time: formatRelativeTime(o.createdAt)
      }))
    })
  } catch (err) {
    console.error('Analytics Error:', err)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

function formatRelativeTime(date: Date) {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return new Date(date).toLocaleDateString()
}
