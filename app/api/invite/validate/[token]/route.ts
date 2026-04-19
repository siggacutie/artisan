import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const invite = await prisma.inviteLink.findUnique({ where: { token } })

  if (!invite) return NextResponse.json({ valid: false, reason: 'Invalid link' })
  if (invite.isUsed) return NextResponse.json({ valid: false, reason: 'This link has already been used' })
  if (new Date() > invite.expiresAt) return NextResponse.json({ valid: false, reason: 'This link has expired' })

  return NextResponse.json({ valid: true, expiresAt: invite.expiresAt })
}
