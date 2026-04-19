import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const rl = rateLimit(`invite:${ip}`, 3, 60 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many attempts. Try again in an hour.' }, { status: 429 })
  }

  const { token } = await req.json()
  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })

  const invite = await prisma.inviteLink.findUnique({ where: { token } })
  if (!invite || invite.isUsed || new Date() > invite.expiresAt) {
    return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 400 })
  }

  // Store a pending claim so signIn callback can find it
  await prisma.inviteLink.update({
    where: { token },
    data: { usedAt: new Date() }, // mark as in-progress but not fully used yet
  })

  const res = NextResponse.json({ success: true })
  res.cookies.set({
    name: 'pending_invite',
    value: token,
    httpOnly: true,
    maxAge: 60 * 15, // 15 minutes
    path: '/',
    sameSite: 'lax',
  })
  return res
}
