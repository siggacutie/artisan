import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateOrigin } from '@/lib/validateOrigin'
import { sanitizeInput } from '@/lib/validate'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { createResellerSession, setSessionCookie } from '@/lib/resellerAuth'
import { sendOtpEmail } from '@/lib/email'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const ip = getClientIp(req)

  // Task 5 Layer 4: Rate limiting on login endpoint
  // 1. Max 5 failed login attempts per IP per 15 minutes
  const ipLimit = rateLimit(`login_fail_ip_${ip}`, 5, 15 * 60 * 1000)
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

    // 2. Max 10 failed login attempts per username per 15 minutes
    const userLimit = rateLimit(`login_fail_user_${username}`, 10, 15 * 60 * 1000)
    if (!userLimit.allowed) {
      return NextResponse.json({ error: 'too_many_attempts', retryAfter: 900 }, { status: 429 })
    }

    const user = await prisma.user.findUnique({ where: { username: username.trim() } })

    if (!user || !user.passwordHash || !user.isReseller) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (user.isBanned) {
      return NextResponse.json({ error: 'Account suspended' }, { status: 403 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Task 6: Weird login detection (New IP)
    const previousLogin = await prisma.loginHistory.findFirst({
      where: { userId: user.id, ip: { not: ip } }
    })
    
    // If user has login history but this IP is new, it's a "weird login"
    const isNewIp = previousLogin && !(await prisma.loginHistory.findFirst({ where: { userId: user.id, ip } }))

    if (isNewIp && process.env.SIGNUP_ALERTS_WEBHOOK) {
      fetch(process.env.SIGNUP_ALERTS_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'ArtisanStore Security',
          embeds: [{
            title: '⚠️ Suspicious Login Detected',
            description: `A user logged in from a new IP address.`,
            color: 0xff4444,
            fields: [
              { name: 'Username', value: user.username || 'Unknown', inline: true },
              { name: 'Email', value: user.email || 'None', inline: true },
              { name: 'New IP', value: ip, inline: true },
              { name: 'User Agent', value: req.headers.get('user-agent') || 'Unknown', inline: false },
            ],
            timestamp: new Date().toISOString(),
          }]
        })
      }).catch(() => {});
    }

    // Success - check if user has email and emailDisabled is false (Task 2C/2E)
    if (user.email && !user.emailDisabled) {
      // Step 1: Username + password ok, but requires OTP
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

    // No email or emailDisabled: true -> login succeeds immediately
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
