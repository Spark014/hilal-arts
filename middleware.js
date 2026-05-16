import { NextResponse } from 'next/server'

export async function middleware(request) {
  // Rate limit webhook to Stripe IP ranges (documented at stripe.com/docs/ips)
  // In production, validate request.ip against Stripe's published IP list
  if (request.nextUrl.pathname === '/api/webhook/stripe') {
    return NextResponse.next()
  }

  // Auth guard for protected routes
  const protectedPaths = ['/account', '/account/orders']
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtected) {
    // Check for Supabase auth session cookie
    const hasSession = request.cookies.get('sb-access-token')
    if (!hasSession) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Admin guard
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Admin check would require fetching profile — handled at page level
    // Middleware only checks auth presence, admin role checked in page
    const hasSession = request.cookies.get('sb-access-token')
    if (!hasSession) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*', '/api/webhook/stripe'],
}
