import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/adminAuth'
import { validateOrigin } from '@/lib/validateOrigin'

export async function DELETE(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    const usersToDelete = await prisma.user.findMany({
      where: {
        membershipExpiresAt: {
          not: null,
          lt: threeDaysAgo
        },
        isFrozen: true,
        role: 'RESELLER',
        // Never delete superadmin or admin accounts
        NOT: {
          role: { in: ['ADMIN', 'SUPER_ADMIN'] }
        }
      },
      select: { id: true }
    })

    if (usersToDelete.length === 0) {
      return NextResponse.json({ success: true, deleted: 0 })
    }

    const userIds = usersToDelete.map(u => u.id)

    const deletedCount = await prisma.$transaction(async (tx) => {
      // 1. SupportTickets - set orderId to null first to avoid foreign key issues if any
      await tx.supportTicket.updateMany({
        where: { userId: { in: userIds } },
        data: { orderId: null }
      })

      // 2. SupportTickets - delete
      await tx.supportTicket.deleteMany({
        where: { userId: { in: userIds } }
      })

      // 3. Orders
      await tx.order.deleteMany({
        where: { userId: { in: userIds } }
      })

      // 4. WalletTransactions
      await tx.walletTransaction.deleteMany({
        where: { userId: { in: userIds } }
      })

      // 5. AccountListings - set soldToUserId to null
      await tx.accountListing.updateMany({
        where: { soldToUserId: { in: userIds } },
        data: { soldToUserId: null }
      })

      // LoginHistory and ResellerSession have onDelete: Cascade, so they'll be handled by prisma/DB

      // 6. Finally delete users
      const { count } = await tx.user.deleteMany({
        where: { id: { in: userIds } }
      })

      return count
    })

    return NextResponse.json({ success: true, deleted: deletedCount })
  } catch (error) {
    console.error('Clear Expired Users Error:', error)
    return NextResponse.json({ error: 'Failed to clear expired users' }, { status: 500 })
  }
}
