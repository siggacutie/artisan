import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory cache for geo results
const geoCache = new Map<string, { country: string; allowed: boolean; expiry: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

export async function GET(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1'

  // Check cache
  const cached = geoCache.get(ip)
  if (cached && cached.expiry > Date.now()) {
    return NextResponse.json({ country: cached.country, allowed: cached.allowed })
  }

  if (ip === '127.0.0.1' || ip === '::1') {
    return NextResponse.json({ country: 'IN', allowed: true })
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
      signal: AbortSignal.timeout(5000),
    })
    const data = await res.json()
    const allowed = data.countryCode === 'IN'
    
    // Store in cache
    geoCache.set(ip, { country: data.countryCode, allowed, expiry: Date.now() + CACHE_TTL })
    
    return NextResponse.json({ country: data.countryCode, allowed })
  } catch (err) {
    console.error('Geo fetch error:', err)
    return NextResponse.json({ country: 'UNKNOWN', allowed: true })
  }
}
