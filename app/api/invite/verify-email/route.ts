import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateOrigin } from '@/lib/validateOrigin'
import { checkOtpBruteForce, recordOtpFailure, clearOtpAttempts } from '@/lib/validate'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { userId, code } = await req.json()

    if (!userId || !code) {
      return NextResponse.json({ error: 'Missing userId or code' }, { status: 400 })
    }

    // Task 6B: Brute-force protection
    const check = checkOtpBruteForce(userId, 'EMAIL_VERIFY')
    if (!check.allowed) {
      // Invalidate all pending OTPs for this user+type as per 6B
      await prisma.otpCode.updateMany({
        where: { userId, type: 'EMAIL_VERIFY', used: false },
        data: { used: true }
      })
      return NextResponse.json({ error: 'Too many wrong attempts. Try again in 15 minutes.' }, { status: 429 })
    }

    const otp = await prisma.otpCode.findFirst({
      where: {
        userId,
        code,
        type: 'EMAIL_VERIFY',
        used: false,
        expiresAt: { gt: new Date() }
      }
    })

    if (!otp) {
      recordOtpFailure(userId, 'EMAIL_VERIFY')
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
    }

    // Mark user emailVerified = true and mark OTP used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true }
      }),
      prisma.otpCode.update({
        where: { id: otp.id },
        data: { used: true }
      })
    ])

    clearOtpAttempts(userId, 'EMAIL_VERIFY')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[verify-email]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
