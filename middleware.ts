import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

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
  const protectedResellerRoutes = [
    '/games',
    '/reseller',
    '/dashboard',
    '/wallet',
  ]

  const isProtectedReseller = protectedResellerRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )

  // /membership is accessible to authenticated users (including expired)
  const isMembershipRoute = pathname === '/membership'

  if (isProtectedReseller || isMembershipRoute) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Check if banned
    if (token.isBanned) {
      return NextResponse.redirect(new URL('/banned', req.url))
    }

    // Check membership expiry — only block non-membership routes
    if (
      isProtectedReseller &&
      token.membershipExpiresAt &&
      new Date(token.membershipExpiresAt as string) < new Date()
    ) {
      return NextResponse.redirect(new URL('/membership?expired=true', req.url))
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
