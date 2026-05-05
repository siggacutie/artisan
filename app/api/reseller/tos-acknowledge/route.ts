import { NextRequest, NextResponse } from 'next/server'
import { getResellerSession } from '@/lib/resellerAuth'
import { prisma } from '@/lib/prisma'
import { validateOrigin } from '@/lib/validateOrigin'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const user = await getResellerSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hasSeenOldUserPopup: true,
        tosAcceptedAt: new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('ToS acknowledgment error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
