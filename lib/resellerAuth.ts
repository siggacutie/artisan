import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { sendDiscord } from './discord'

const SESSION_COOKIE = 'reseller_session'
const SESSION_EXPIRY_DAYS = 30

function normalizeUserAgent(ua: string): string {
  // Extract just the browser engine signature, ignore version numbers
  const match = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/)
  return match ? match[1] : ua.slice(0, 50)
}

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
            role: true,
            walletBalance: true,
            membershipExpiresAt: true,
            isReseller: true,
            isBanned: true,
            isFrozen: true,
            avatarUrl: true,
            name: true,
            emailDisabled: true,
            autoRenew: true,
            autoRenewMonths: true,
            emailVerified: true,
          }
        }
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

    // Session expiry enforcement
    if (session.expiresAt && session.expiresAt < new Date()) {
      await prisma.resellerSession.deleteMany({ where: { token } })
      return null
    }

    // Layer 1: Device fingerprint binding (User-Agent)
    const headersList = await import('next/headers')
    const requestHeaders = await headersList.headers()
    const currentUserAgent = requestHeaders.get('user-agent') ?? ''
    
    const storedUA = normalizeUserAgent(session.userAgent ?? '')
    const currentUA = normalizeUserAgent(currentUserAgent)

    if (storedUA && currentUA && storedUA !== currentUA) {
      // Different browser/device — genuine security concern
      await prisma.resellerSession.deleteMany({ where: { token } })
      return null
    }

    // Layer 2: Update lastSeen and IP (IP change alone does NOT invalidate)
    const currentIp = requestHeaders.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
    
    await prisma.resellerSession.update({
      where: { id: session.id },
      data: { lastSeen: new Date(), ip: currentIp }
    })

    // Membership expiry enforcement
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
  const existingSession = await prisma.resellerSession.findUnique({ 
    where: { userId }, 
    include: { user: true } 
  })

  if (existingSession) {
    const oldIp = existingSession.ip
    const newIp = ip
    
    // Only log and notify if IP actually changed
    if (oldIp && newIp && oldIp !== newIp) {
      await prisma.suspiciousActivity.create({
        data: {
          userId,
          reason: 'concurrent_login_attempt',
          metadata: { oldIp, newIp, userAgent },
        }
      })

      // Send to signup_alerts_webhook
      await sendDiscord('signup', {
        title: 'Account logged in from new IP',
        color: 0xf59e0b,
        fields: [
          { name: 'Username', value: existingSession.user.username ?? 'unknown', inline: true },
          { name: 'Old IP', value: oldIp, inline: true },
          { name: 'New IP', value: newIp, inline: true },
        ],
      }, 'ArtisanStore Security')
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
