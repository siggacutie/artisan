import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'
import { validateOrigin } from '@/lib/validateOrigin'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const ip = getClientIp(req)
  const rl = rateLimit(`forgot_password_${ip}`, 3, 60 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'too_many_requests' }, { status: 429 })
  }

  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    // Case 1: No account with this email
    if (!user) {
      return NextResponse.json({ error: 'No account found with this email address.' }, { status: 404 });
    }

    // Case 3: Account exists but emailDisabled = true
    if (user.emailDisabled) {
      return NextResponse.json({ error: 'This account does not have email-based login enabled.' }, { status: 403 });
    }

    // Case 4: Account found, email enabled — send OTP
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Invalidate previous PASSWORD_RESET OTPs for this user
    await prisma.otpCode.updateMany({
      where: { userId: user.id, type: 'PASSWORD_RESET', used: false },
      data: { used: true },
    });

    await prisma.otpCode.create({
      data: { userId: user.id, code, type: 'PASSWORD_RESET', expiresAt },
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@artisanstore.xyz',
      to: email,
      subject: 'Reset your ArtisanStore password',
      text: `Your password reset code is: ${code}\n\nThis code expires in 10 minutes.`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[forgot-password]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
