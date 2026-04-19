import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { deleteResellerSession, SESSION_COOKIE_NAME } from '@/lib/resellerAuth'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (token) await deleteResellerSession(token)

    const response = NextResponse.json({ success: true })
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: '',
      maxAge: 0,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
