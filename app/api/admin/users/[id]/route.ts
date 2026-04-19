import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession()
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { id: userId } = await params

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Build update object — only include fields that are explicitly provided
    const updateData: Record<string, unknown> = {}

    if (typeof body.isBanned === 'boolean') updateData.isBanned = body.isBanned
    if (typeof body.isFrozen === 'boolean') updateData.isFrozen = body.isFrozen
    if (typeof body.isReseller === 'boolean') updateData.isReseller = body.isReseller
    if (typeof body.adminNote === 'string') updateData.adminNote = body.adminNote
    if (typeof body.walletBalance === 'number') updateData.walletBalance = body.walletBalance

    // Handle manual reseller grant with membership duration
    if (body.isReseller === true && body.membershipMonths) {
      const months = Number(body.membershipMonths)
      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + months)
      updateData.membershipExpiresAt = expiresAt
      updateData.membershipMonths = months
      updateData.isReseller = true
    }

    // Handle manual reseller revocation
    if (body.isReseller === false) {
      updateData.membershipExpiresAt = null
      updateData.membershipMonths = null
      updateData.isReseller = false
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    return NextResponse.json({ success: true, user: updated })
  } catch (error) {
    console.error('[admin/users/[id]] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession()
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id: userId } = await params
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isReseller: true,
        isBanned: true,
        isFrozen: true,
        walletBalance: true,
        membershipExpiresAt: true,
        membershipMonths: true,
        adminNote: true,
        createdAt: true,
        lastSeenAt: true,
      },
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json(user)
  } catch (error) {
    console.error('[admin/users/[id] GET] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
