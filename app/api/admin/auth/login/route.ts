import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCredentials, createAdminToken, setAdminCookie } from '@/lib/adminAuth'
import { validateOrigin } from '@/lib/validateOrigin'
import { sendDiscord } from '@/lib/discord'
import { getClientIp, rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const ip = getClientIp(req)
  const rl = rateLimit(`admin_login_${ip}`, 5, 15 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'too_many_attempts', retryAfter: 900 }, { status: 429 })
  }

  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

    const admin = await verifyAdminCredentials(email, password)
    if (!admin) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = createAdminToken(admin)
    const cookieConfig = setAdminCookie(token)

    const ip = getClientIp(req)
    await sendDiscord('signup', {
      title: 'Admin Logged In',
      color: 0xffd700,
      fields: [
        { name: 'Email', value: email, inline: true },
        { name: 'IP', value: ip, inline: true },
        { name: 'Role', value: admin.role, inline: true },
      ],
    }, 'ArtisanStore Security')

    const res = NextResponse.json({ success: true, role: admin.role })
    res.cookies.set(cookieConfig)
    return res
  } catch (error: any) {
    console.error('[admin/auth/login]', error)
    await sendDiscord('error', {
      title: 'Admin Login Error',
      color: 0xef4444,
      fields: [
        { name: 'Error', value: error.message ?? 'Unknown error', inline: false },
      ],
    }, 'ArtisanStore System')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
