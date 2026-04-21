import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

import { validateOrigin } from '@/lib/validateOrigin'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check if session admin is SUPERADMIN
  if (admin.role !== 'SUPERADMIN') {
    return NextResponse.json({ error: 'Forbidden. Superadmin access required.' }, { status: 403 })
  }

  const { email, password, role } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }

  const existing = await prisma.adminAccount.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Admin already exists' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const newAdmin = await prisma.adminAccount.create({
    data: {
      email,
      passwordHash,
      role: role || 'ADMIN',
    }
  })

  return NextResponse.json({ success: true, admin: { id: newAdmin.id, email: newAdmin.email, role: newAdmin.role } })
}
