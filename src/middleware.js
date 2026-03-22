import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) return new TextEncoder().encode("pinowed-super-secret-key-2026-fallback"); 
  return new TextEncoder().encode(secret);
};

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host');
  const pathname = url.pathname;

  // 1. Admin Auth Protection (For both subdomain and direct paths)
  const isAdminRoute = pathname.startsWith('/pinowed/admin') || (hostname?.includes('pinowed') && pathname.startsWith('/admin'));
  const isLoginPage = pathname === '/pinowed/admin/login' || pathname === '/admin/login';

  if (isAdminRoute && !isLoginPage) {
    const token = req.cookies.get('admin_token')?.value;
    if (!token) {
      url.pathname = '/pinowed/admin/login';
      return NextResponse.redirect(url);
    }
    
    try {
      await jwtVerify(token, getJwtSecretKey());
    } catch (err) {
      url.pathname = '/pinowed/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // 2. Subdomain Routing
  if (hostname && hostname.includes('pinowed.withnazligunes.com')) {
    // If it's already rewritten to /pinowed, don't prepend it again
    if (!pathname.startsWith('/pinowed')) {
      url.pathname = `/pinowed${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
