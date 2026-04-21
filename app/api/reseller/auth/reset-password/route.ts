import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateOrigin } from '@/lib/validateOrigin'
import { sanitizeInput, validatePassword, validateEmail, checkOtpBruteForce, recordOtpFailure, clearOtpAttempts } from '@/lib/validate'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { email, code, newPassword, confirmPassword } = await req.json()

    if (!email || !code || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
    }

    if (!validatePassword(newPassword)) {
      return NextResponse.json({ error: 'Password must be at least 8 chars, 1 number, 1 letter' }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })
    if (!user) {
      return NextResponse.json({ error: 'Invalid code or email' }, { status: 400 })
    }

    const check = checkOtpBruteForce(user.id, 'PASSWORD_RESET')
    if (!check.allowed) {
      await prisma.otpCode.updateMany({
        where: { userId: user.id, type: 'PASSWORD_RESET', used: false },
        data: { used: true }
      })
      return NextResponse.json({ error: 'Too many wrong attempts. Try again in 15 minutes.' }, { status: 429 })
    }

    const otp = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code,
        type: 'PASSWORD_RESET',
        used: false,
        expiresAt: { gt: new Date() }
      }
    })

    if (!otp) {
      recordOtpFailure(user.id, 'PASSWORD_RESET')
      return NextResponse.json({ error: 'Invalid code or email' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash }
      }),
      prisma.otpCode.update({
        where: { id: otp.id },
        data: { used: true }
      }),
      // Task 2E: Invalidate all sessions for that user
      prisma.resellerSession.deleteMany({ where: { userId: user.id } })
    ])

    clearOtpAttempts(user.id, 'PASSWORD_RESET')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[reset-password]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
