import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateOrigin } from '@/lib/validateOrigin'
import crypto from 'crypto'
import { sendOtpEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Rate limit: max 1 send per 60 seconds
    const lastOtp = await prisma.otpCode.findFirst({
      where: { userId, type: 'EMAIL_VERIFY' },
      orderBy: { createdAt: 'desc' }
    })

    if (lastOtp && new Date().getTime() - new Date(lastOtp.createdAt).getTime() < 60 * 1000) {
      return NextResponse.json({ error: 'Please wait 60 seconds before resending' }, { status: 429 })
    }

    // Invalidate old ones
    await prisma.otpCode.updateMany({
      where: { userId, type: 'EMAIL_VERIFY', used: false },
      data: { used: true }
    })

    // Generate new OTP
    const code = crypto.randomInt(100000, 999999).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.otpCode.create({
      data: {
        userId,
        code,
        type: 'EMAIL_VERIFY',
        expiresAt,
      }
    })

    await sendOtpEmail(user.email, code, 'EMAIL_VERIFY')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[resend-otp]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
