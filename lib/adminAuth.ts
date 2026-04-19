import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { cookies } from 'next/headers'

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-for-dev-only-change-in-production'
const COOKIE_NAME = 'admin_session'

export async function verifyAdminCredentials(email: string, password: string) {
  const admin = await prisma.adminAccount.findUnique({ where: { email } })
  if (!admin || !admin.isActive) return null
  const valid = await bcrypt.compare(password, admin.passwordHash)
  if (!valid) return null
  return admin
}

export function createAdminToken(admin: { id: string; email: string; role: string }) {
  return jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, ADMIN_JWT_SECRET, { expiresIn: '8h' })
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    return jwt.verify(token, ADMIN_JWT_SECRET) as { id: string; email: string; role: string }
  } catch {
    return null
  }
}

export function setAdminCookie(token: string) {
  // Called from API route, uses response headers
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 8,
  }
}
