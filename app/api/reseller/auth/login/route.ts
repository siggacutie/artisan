import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResellerSession, setSessionCookie } from '@/lib/resellerAuth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    // Find user by username (case-insensitive)
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username.trim(),
          mode: 'insensitive',
        },
      },
    })

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    if (user.isBanned) {
      return NextResponse.json({ error: 'Account suspended. Contact support.' }, { status: 403 })
    }

    if (user.isFrozen) {
      return NextResponse.json({ error: 'Account frozen. Contact support.' }, { status: 403 })
    }

    if (!user.isReseller) {
      return NextResponse.json({ error: 'Access restricted. Contact admin.' }, { status: 403 })
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? undefined
    const userAgent = req.headers.get('user-agent') ?? undefined

    // createResellerSession deletes old session (single device enforcement)
    const token = await createResellerSession(user.id, ip, userAgent)

    // Update lastSeenAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastSeenAt: new Date() },
    })

    const cookieOptions = setSessionCookie(token)
    const response = NextResponse.json({ success: true })
    response.cookies.set(cookieOptions)
    return response
  } catch (error) {
    console.error('[reseller/auth/login]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
