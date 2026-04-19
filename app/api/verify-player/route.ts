import { NextRequest, NextResponse } from 'next/server'
import { validateOrigin } from '@/lib/validateOrigin'
import { securityLog } from '@/lib/securityLog'
import { rateLimit, getClientIp } from '@/lib/rateLimit'
import { validators } from '@/lib/validate'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) {
    securityLog('CSRF_BLOCKED', { origin: req.headers.get('origin'), path: req.nextUrl.pathname })
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const ip = getClientIp(req)
  const rl = rateLimit(`verify:${ip}`, 10, 60 * 1000)
  if (!rl.allowed) {
    securityLog('RATE_LIMIT_VERIFY_PLAYER', { ip })
    return NextResponse.json({ error: 'Too many verification attempts. Please wait a moment.' }, { status: 429 })
  }

  try {
    const { userId, zoneId } = await req.json()

    if (!validators.playerId(String(userId)) || !validators.zoneId(String(zoneId))) {
        securityLog('INVALID_INPUT', { route: 'verify-player', userId: String(userId).substring(0, 20), zoneId: String(zoneId).substring(0, 20) })
        return NextResponse.json({ success: false, error: 'Invalid Player ID or Zone ID format.' }, { status: 400 })
    }

    const formData = new FormData()
    formData.append('user_id', String(userId))
    formData.append('zone_id', String(zoneId))
    formData.append('pid', '25')
    formData.append('checkrole', '1')

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    try {
        const response = await fetch('https://www.smile.one/merchant/mobilelegends/checkrole', {
          method: 'POST',
          body: formData,
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.smile.one/merchant/mobilelegends',
            'Origin': 'https://www.smile.one',
          },
        })
        clearTimeout(timeout)
        
        const text = await response.text()
        let data: any
        try {
          data = JSON.parse(text)
        } catch {
          return NextResponse.json({ success: false, error: 'Verification service unavailable' }, { status: 502 })
        }

        if (data.code === 200 && data.username) {
          return NextResponse.json({ success: true, username: data.username })
        } else {
          return NextResponse.json({ success: false, error: 'Invalid Player ID or Zone ID. Please check and try again.' })
        }
    } catch (err: any) {
        clearTimeout(timeout)
        if (err.name === 'AbortError') {
          return NextResponse.json({ success: false, error: 'Verification timed out. Please try again.' }, { status: 504 })
        }
        securityLog('INVALID_INPUT', { route: 'verify-player', error: 'fetch failed' })
        return NextResponse.json({ success: false, error: 'Verification failed. Please try again.' }, { status: 500 })
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Verification failed. Please try again.' }, { status: 500 })
  }
}
