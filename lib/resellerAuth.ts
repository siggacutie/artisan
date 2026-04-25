import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const SESSION_COOKIE = 'reseller_session'
const SESSION_EXPIRY_DAYS = 30

export async function getResellerSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) return null

    const session = await prisma.resellerSession.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            name: true,
            role: true,
            isReseller: true,
            isBanned: true,
            isFrozen: true,
            walletBalance: true,
            membershipExpiresAt: true,
            membershipMonths: true,
            avatarUrl: true,
            createdAt: true,
            autoRenew: true,
            autoRenewMonths: true,
          },
        },
      },
    })

    if (!session) return null
    if (session.user.isBanned) {
      await prisma.resellerSession.deleteMany({ where: { token } })
      return null
    }
    if (!session.user.isReseller) {
      await prisma.resellerSession.deleteMany({ where: { token } })
      return null
    }

    // Layer 5: Session expiry enforcement
    if (session.expiresAt && session.expiresAt < new Date()) {
      await prisma.resellerSession.deleteMany({ where: { token } })
      return null
    }

    // Layer 1: Device fingerprint binding (User-Agent)
    const headersList = await import('next/headers')
    const requestHeaders = await headersList.headers()
    const currentUserAgent = requestHeaders.get('user-agent')
    if (session.userAgent && currentUserAgent && session.userAgent !== currentUserAgent) {
      await prisma.resellerSession.deleteMany({ where: { token } })
      return null
    }

    // Layer 2: Rolling session token with IP change check
    const currentIp = requestHeaders.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
    if (session.lastSeen && (new Date().getTime() - new Date(session.lastSeen).getTime()) > 30 * 60 * 1000) {
      if (session.ip && currentIp && session.ip !== currentIp) {
        await prisma.resellerSession.deleteMany({ where: { token } })
        return null
      }
    }

    // Update lastSeen
    await prisma.resellerSession.update({
      where: { id: session.id },
      data: { lastSeen: new Date(), ip: currentIp }
    })

    // Layer 6: Membership expiry enforcement
    const isExpired = session.user.membershipExpiresAt && new Date(session.user.membershipExpiresAt) < new Date()

    return { ...session.user, membershipExpired: isExpired }
  } catch {
    return null
  }
}

export async function createResellerSession(
  userId: string,
  ip?: string,
  userAgent?: string
): Promise<string> {
  // Layer 3: Concurrent session detection
  const existingSession = await prisma.resellerSession.findUnique({ where: { userId }, include: { user: true } })
  if (existingSession) {
    // Log suspicious activity
    await prisma.suspiciousActivity.create({
      data: {
        userId,
        reason: 'concurrent_login_attempt',
        metadata: {
          oldIp: existingSession.ip,
          newIp: ip,
          userAgent
        }
      }
    })

    // Discord Webhook
    if (process.env.DISCORD_WEBHOOK) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: "ArtisanStore Security",
            content: `⚠️ Account **${existingSession.user.username}** logged in from a new device. Old IP: \`${existingSession.ip}\` → New IP: \`${ip}\`. Old session terminated.`
          })
        })
      } catch (e) {
        console.error('Discord webhook failed', e)
      }
    }
    
    await prisma.resellerSession.deleteMany({ where: { userId } })
  }

  const session = await prisma.resellerSession.create({
    data: {
      userId,
      ip,
      userAgent,
      lastSeen: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  })

  return session.token
}

export async function deleteResellerSession(token: string) {
  await prisma.resellerSession.deleteMany({ where: { token } })
}

export function setSessionCookie(token: string) {
  // This is called from API routes using NextResponse
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    path: '/',
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE
