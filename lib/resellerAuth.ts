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
          },
        },
      },
    })

    if (!session) return null
    if (session.user.isBanned) return null
    if (!session.user.isReseller) return null

    return session.user
  } catch {
    return null
  }
}

export async function createResellerSession(
  userId: string,
  ip?: string,
  userAgent?: string
): Promise<string> {
  // Single device enforcement — delete any existing session for this user
  await prisma.resellerSession.deleteMany({ where: { userId } })

  const session = await prisma.resellerSession.create({
    data: {
      userId,
      ip,
      userAgent,
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
