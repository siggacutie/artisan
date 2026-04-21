import { NextRequest, NextResponse } from 'next/server'
import { validateOrigin } from '@/lib/validateOrigin'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const res = NextResponse.json({ success: true })
  res.cookies.set({ name: 'reseller_session', value: '', maxAge: 0, path: '/' })
  return res
}
