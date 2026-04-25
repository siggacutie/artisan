import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateOrigin } from '@/lib/validateOrigin'
import { checkOtpBruteForce, recordOtpFailure, clearOtpAttempts } from '@/lib/validate'
import { createResellerSession, setSessionCookie } from '@/lib/resellerAuth'
import { getClientIp } from '@/lib/rateLimit'
import { sendDiscord } from '@/lib/discord'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { userId, code } = await req.json()

    if (!userId || !code) {
      return NextResponse.json({ error: 'Missing userId or code' }, { status: 400 })
    }

    const check = checkOtpBruteForce(userId, 'LOGIN_2FA')
    if (!check.allowed) {
      await prisma.otpCode.updateMany({
        where: { userId, type: 'LOGIN_2FA', used: false },
        data: { used: true }
      })
      return NextResponse.json({ error: 'Too many wrong attempts.' }, { status: 429 })
    }

    const otp = await prisma.otpCode.findFirst({
      where: {
        userId,
        code,
        type: 'LOGIN_2FA',
        used: false,
        expiresAt: { gt: new Date() }
      }
    })

    if (!otp) {
      recordOtpFailure(userId, 'LOGIN_2FA')
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
    }

    await prisma.otpCode.update({
      where: { id: otp.id },
      data: { used: true }
    })

    clearOtpAttempts(userId, 'LOGIN_2FA')

    const ip = getClientIp(req)
    const userAgent = req.headers.get('user-agent') || 'Unknown'
    const token = await createResellerSession(userId, ip, userAgent)
    const cookie = setSessionCookie(token)

    const response = NextResponse.json({ success: true })
    response.cookies.set(cookie)
    return response

  } catch (error: any) {
    console.error('[verify-2fa]', error)
    await sendDiscord('error', {
      title: '2FA Verification Error',
      color: 0xef4444,
      fields: [
        { name: 'Error', value: error.message ?? 'Unknown error', inline: false },
      ],
    }, 'ArtisanStore Security')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
