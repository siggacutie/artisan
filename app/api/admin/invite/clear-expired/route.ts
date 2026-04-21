import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/adminAuth'
import { validateOrigin } from '@/lib/validateOrigin'

export async function DELETE(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { count } = await prisma.inviteLink.deleteMany({
      where: {
        OR: [
          { isUsed: true },
          { expiresAt: { lt: new Date() } }
        ]
      }
    })

    return NextResponse.json({ success: true, deleted: count })
  } catch (error) {
    console.error('Clear Invites Error:', error)
    return NextResponse.json({ error: 'Failed to clear invites' }, { status: 500 })
  }
}
