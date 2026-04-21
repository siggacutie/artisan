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
      // Task 4A: Redirect to /login with ?redirect=
      return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}`, req.url))
    }

    // Task 5 Layer 6: Membership expiry enforcement
    // Note: We can't read DB in middleware (Edge runtime). 
    // This is handled in getResellerSession() and pages/APIs.
    // However, if we had user info in JWT, we could check here.
    // Since we use session IDs in DB, we rely on page-level checks.
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
