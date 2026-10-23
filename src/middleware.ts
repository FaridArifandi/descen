import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyAuthToken(token);

    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const res = NextResponse.redirect(loginUrl);
      // clear invalid cookie
      res.cookies.set(AUTH_COOKIE_NAME, '', { maxAge: 0, path: '/' });
      return res;
    }

    // Role-based authorization
    if (pathname.startsWith('/admin/bps')) {
      if (payload.role !== 'bps') {
        // Desa user trying to access BPS admin -> redirect to /admin/desa
        return NextResponse.redirect(new URL('/admin/desa', request.url));
      }
    }

    if (pathname.startsWith('/admin/desa')) {
      if (payload.role !== 'desa' && payload.role !== 'bps') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
