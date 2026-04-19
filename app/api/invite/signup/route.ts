import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResellerSession, setSessionCookie } from '@/lib/resellerAuth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, username, password } = body

    if (!token || !username || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json({ error: 'Username must be 3-20 characters' }, { status: 400 })
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ error: 'Username can only contain letters, numbers, and underscores' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Validate invite token
    const invite = await prisma.inviteLink.findUnique({ where: { token } })

    if (!invite) {
      return NextResponse.json({ error: 'Invalid invite link' }, { status: 400 })
    }

    if (invite.isUsed) {
      return NextResponse.json({ error: 'This invite link has already been used' }, { status: 400 })
    }

    if (new Date(invite.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'This invite link has expired' }, { status: 400 })
    }

    // Check username availability (case-insensitive)
    const existingUser = await prisma.user.findFirst({
      where: { username: { equals: username.trim(), mode: 'insensitive' } },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    // Calculate membership expiry
    const membershipMonths = invite.membershipMonths ?? 1
    const membershipExpiresAt = new Date()
    membershipExpiresAt.setMonth(membershipExpiresAt.getMonth() + membershipMonths)

    // Create user
    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        name: username.trim(),
        passwordHash,
        isReseller: true,
        role: 'RESELLER',
        membershipMonths,
        membershipExpiresAt,
        walletBalance: 0,
      },
    })

    // Mark invite as used
    await prisma.inviteLink.update({
      where: { token },
      data: {
        isUsed: true,
        usedBy: user.username,
        usedAt: new Date(),
      },
    })

    // Create session and log in immediately
    const ip = req.headers.get('x-forwarded-for') ?? undefined
    const userAgent = req.headers.get('user-agent') ?? undefined
    const sessionToken = await createResellerSession(user.id, ip, userAgent)

    const cookieOptions = setSessionCookie(sessionToken)
    const response = NextResponse.json({ success: true })
    response.cookies.set(cookieOptions)
    return response
  } catch (error) {
    console.error('[invite/signup]', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
