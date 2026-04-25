import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateOrigin } from '@/lib/validateOrigin'
import { sanitizeInput } from '@/lib/validate'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { createResellerSession, setSessionCookie } from '@/lib/resellerAuth'
import { sendOtpEmail } from '@/lib/email'
import { rateLimit, getClientIp } from '@/lib/rateLimit'
import { sendDiscord } from '@/lib/discord'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const ip = getClientIp(req)

  // Rate limiting check on login endpoint (check only, don't increment yet)
  const ipLimit = rateLimit(`login_fail_ip_${ip}`, 5, 15 * 60 * 1000, false)
  if (!ipLimit.allowed) {
    return NextResponse.json({ error: 'too_many_attempts', retryAfter: 900 }, { status: 429 })
  }

  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    if (!sanitizeInput(username)) {
      return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
    }

    // Rate limiting check per username (check only)
    const userLimit = rateLimit(`login_fail_user_${username}`, 10, 15 * 60 * 1000, false)
    if (!userLimit.allowed) {
      return NextResponse.json({ error: 'too_many_attempts', retryAfter: 900 }, { status: 429 })
    }

    const user = await prisma.user.findUnique({ where: { username: username.trim() } })

    if (!user || !user.passwordHash || !user.isReseller) {
      // Increment failure count
      rateLimit(`login_fail_ip_${ip}`, 5, 15 * 60 * 1000, true)
      if (username) rateLimit(`login_fail_user_${username}`, 10, 15 * 60 * 1000, true)
      
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (user.isBanned) {
      return NextResponse.json({ error: 'Account suspended' }, { status: 403 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      // Increment failure count
      rateLimit(`login_fail_ip_${ip}`, 5, 15 * 60 * 1000, true)
      rateLimit(`login_fail_user_${username}`, 10, 15 * 60 * 1000, true)
      
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Weird login detection (New IP)
    const previousLogin = await prisma.loginHistory.findFirst({
      where: { userId: user.id, ip: { not: ip } }
    })
    
    const isNewIp = previousLogin && !(await prisma.loginHistory.findFirst({ where: { userId: user.id, ip } }))

    if (isNewIp) {
      await sendDiscord('signup', {
        title: '⚠️ Suspicious Login Detected',
        color: 0xff4444,
        fields: [
          { name: 'Username', value: user.username || 'Unknown', inline: true },
          { name: 'Email', value: user.email || 'None', inline: true },
          { name: 'New IP', value: ip, inline: true },
          { name: 'User Agent', value: req.headers.get('user-agent') || 'Unknown', inline: false },
        ],
      }, 'ArtisanStore Security')
    }

    // Success - check if user has email and emailDisabled is false
    if (user.email && !user.emailDisabled) {
      const code = crypto.randomInt(100000, 999999).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

      await prisma.otpCode.updateMany({
        where: { userId: user.id, type: 'LOGIN_2FA', used: false },
        data: { used: true }
      })

      await prisma.otpCode.create({
        data: {
          userId: user.id,
          code,
          type: 'LOGIN_2FA',
          expiresAt,
        }
      })

      await sendOtpEmail(user.email, code, 'LOGIN_2FA')

      return NextResponse.json({ requiresOtp: true, userId: user.id })
    }

    // No 2FA needed - login succeeds
    const userAgent = req.headers.get('user-agent') || 'Unknown'
    const token = await createResellerSession(user.id, ip, userAgent)
    const cookie = setSessionCookie(token)

    const response = NextResponse.json({ success: true })
    response.cookies.set(cookie)
    return response

  } catch (error) {
    console.error('[auth/login]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
