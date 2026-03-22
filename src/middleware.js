import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host');

  // If the request comes from the subdomain
  if (hostname && hostname.includes('pinowed.withnazligunes.com')) {
    // Rewrite path to /pinowed internally
    url.pathname = `/pinowed${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Continue normally for withnazligunes.com
  return NextResponse.next();
}

// Ensure middleware only runs on routes we might want to intercept
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
