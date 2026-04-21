import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCredentials, createAdminToken, setAdminCookie } from '@/lib/adminAuth'
import { validateOrigin } from '@/lib/validateOrigin'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

    const admin = await verifyAdminCredentials(email, password)
    if (!admin) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = createAdminToken(admin)
    const cookieConfig = setAdminCookie(token)

    const res = NextResponse.json({ success: true, role: admin.role })
    res.cookies.set(cookieConfig)
    return res
  } catch (error) {
    console.error('[admin/auth/login]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
