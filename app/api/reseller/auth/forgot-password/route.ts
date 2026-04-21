import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

  // Case 1: No account with this email
  if (!user) {
    return Response.json({ error: 'No account found with this email address.' }, { status: 404 });
  }

  // Case 2: Account exists but has no email linked (should not happen if found by email, but guard anyway)
  // Case 3: Account exists but emailDisabled = true (they use username+password only, no email auth)
  if (user.emailDisabled) {
    return Response.json({ error: 'This account does not have email-based login enabled. Contact support to reset your password.' }, { status: 403 });
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
    from: 'ArtisanStore <onboarding@resend.dev>',
    to: email,
    subject: 'Reset your ArtisanStore password',
    text: `Your password reset code is: ${code}\n\nThis code expires in 10 minutes. Do not share it with anyone.\n\nIf you did not request this, ignore this email.`,
  });

  return Response.json({ success: true });
}
