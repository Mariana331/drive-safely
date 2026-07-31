import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LOCALE_COOKIE, normalizeLocale } from '@/lib/i18n/config';

const protectedRoutes = ['/profile', '/tests', '/ai-analysis'];
const authRoutes = ['/login', '/signup'];

function resolveLocale(request: NextRequest) {
  const existing = request.cookies.get(LOCALE_COOKIE)?.value;
  if (existing) return normalizeLocale(existing);

  const accept = request.headers.get('accept-language') ?? '';
  return accept.toLowerCase().includes('uk') ? 'uk' : 'en';
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  const locale = resolveLocale(request);

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let response: NextResponse;

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    response = NextResponse.redirect(loginUrl);
  } else if (isAuthRoute && token) {
    response = NextResponse.redirect(new URL('/profile', request.url));
  } else {
    response = NextResponse.next();
  }

  if (!request.cookies.get(LOCALE_COOKIE)?.value) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.svg|images|.*\\..*).*)',
  ],
};
