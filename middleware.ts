import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // --- ADMIN ROUTE PROTECTION ---
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminSession = req.cookies.get('admin_session')
    if (!adminSession?.value) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return NextResponse.next()
  }

  // --- RESELLER ROUTE PROTECTION ---
  const protectedRoutes = [
    '/games',
    '/reseller',
    '/dashboard',
    '/wallet',
    '/membership',
  ]

  const isProtected = protectedRoutes.some(
    route => pathname === route || pathname.startsWith(route + '/')
  )

  if (isProtected) {
    const sessionToken = req.cookies.get('reseller_session')
    if (!sessionToken?.value) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/games/:path*',
    '/reseller/:path*',
    '/dashboard/:path*',
    '/wallet/:path*',
    '/membership',
  ],
}
