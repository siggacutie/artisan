import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { validateOrigin } from '@/lib/validateOrigin'
import { sanitizeInput, validatePassword, validateUsername, validateEmail } from '@/lib/validate'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendOtpEmail } from '@/lib/email'
import { sendDiscord } from '@/lib/discord'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await req.json()
    const { token, username, password, email } = body

    const invite = await prisma.inviteLink.findUnique({ where: { token } })
    if (!invite || invite.isUsed || new Date(invite.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired invite link' }, { status: 400 })
    }

    if (!sanitizeInput(username) || (email && !sanitizeInput(email))) {
      return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
    }

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    if (invite.requireEmail && !email) {
      return NextResponse.json({ error: 'Email is required for this invite' }, { status: 400 })
    }

    if (!validateUsername(username)) {
      return NextResponse.json({ error: 'Username must be 3-20 characters (alphanumeric + underscore)' }, { status: 400 })
    }

    if (!validatePassword(password)) {
      return NextResponse.json({ error: 'Password must be at least 8 chars, 1 number, 1 letter' }, { status: 400 })
    }

    if (email && !validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const orConditions: Prisma.UserWhereInput[] = [
      { username: { equals: username.trim(), mode: 'insensitive' as Prisma.QueryMode } },
    ]
    if (email) {
      orConditions.push({ email: { equals: email.trim().toLowerCase(), mode: 'insensitive' as Prisma.QueryMode } })
    }

    const existing = await prisma.user.findFirst({ where: { OR: orConditions } })

    if (existing) {
      if (existing.username?.toLowerCase() === username.trim().toLowerCase()) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const membershipMonths = invite.membershipMonths ?? 1
    const membershipExpiresAt = new Date()
    membershipExpiresAt.setMonth(membershipExpiresAt.getMonth() + membershipMonths)

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username: username.trim(),
          passwordHash: passwordHash,
          name: username.trim(),
          isReseller: true,
          role: 'RESELLER',
          membershipMonths: membershipMonths,
          membershipExpiresAt: membershipExpiresAt,
          emailVerified: false,
          emailDisabled: false,
          twoFactorPending: false,
          email: email ? email.trim().toLowerCase() : undefined,
        }
      })

      await tx.inviteLink.update({
        where: { id: invite.id },
        data: { isUsed: true, usedBy: newUser.username, usedAt: new Date() }
      })

      return newUser
    })

    const requiresEmailVerification = !!email

    if (requiresEmailVerification) {
      const code = crypto.randomInt(100000, 999999).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

      await prisma.otpCode.create({
        data: {
          userId: user.id,
          code: code,
          type: 'EMAIL_VERIFY',
          expiresAt: expiresAt,
        }
      })

      await sendOtpEmail(user.email!, code, 'EMAIL_VERIFY')
    }

    await sendDiscord('signup', {
      title: 'New Reseller Signup',
      color: 0xffd700,
      fields: [
        { name: 'Username', value: user.username || 'Unknown', inline: true },
        { name: 'Email', value: user.email || 'None', inline: true },
        { name: 'Membership', value: membershipMonths + ' Months', inline: true },
      ],
    }, 'ArtisanStore Signups')

    return NextResponse.json({ success: true, userId: user.id, requiresEmailVerification: requiresEmailVerification })
  } catch (error) {
    console.error('[invite/signup]', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
