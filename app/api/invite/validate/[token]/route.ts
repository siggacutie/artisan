import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const invite = await prisma.inviteLink.findUnique({ where: { token } })

    if (!invite) {
      return NextResponse.json({ valid: false, error: 'Invalid invite link' })
    }

    if (invite.isUsed) {
      return NextResponse.json({ valid: false, error: 'This invite link has already been used' })
    }

    if (new Date(invite.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, error: 'This invite link has expired' })
    }

    return NextResponse.json({ 
      valid: true, 
      membershipMonths: invite.membershipMonths ?? 1 
    })
  } catch (error) {
    return NextResponse.json({ valid: false, error: 'Validation failed' }, { status: 500 })
  }
}
