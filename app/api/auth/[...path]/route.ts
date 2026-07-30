import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.API_INTERNAL_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  'http://localhost:3002';

function applyAuthCookies(backendRes: Response, response: NextResponse) {
  const setCookies =
    typeof backendRes.headers.getSetCookie === 'function'
      ? backendRes.headers.getSetCookie()
      : [];

  const cookies =
    setCookies.length > 0
      ? setCookies
      : backendRes.headers.get('set-cookie')
        ? [backendRes.headers.get('set-cookie') as string]
        : [];

  for (const raw of cookies) {
    const parts = raw.split(';').map((part) => part.trim());
    const [nameValue, ...attrs] = parts;
    const eqIndex = nameValue.indexOf('=');
    if (eqIndex === -1) continue;

    const name = nameValue.slice(0, eqIndex);
    const value = nameValue.slice(eqIndex + 1);

    if (name !== 'token') continue;

    // Logout / clear cookie
    if (!value || value === 'undefined') {
      response.cookies.set({
        name: 'token',
        value: '',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
      });
      continue;
    }

    let maxAgeSeconds = 7 * 24 * 60 * 60;
    for (const attr of attrs) {
      const [key, attrValue] = attr.split('=');
      if (key.toLowerCase() === 'max-age' && attrValue) {
        const parsed = Number(attrValue);
        if (!Number.isNaN(parsed)) {
          // Express may send ms; Next cookies API expects seconds.
          maxAgeSeconds = parsed > 1_000_000 ? Math.floor(parsed / 1000) : parsed;
        }
      }
    }

    // Re-set cookie for THIS origin (localhost), without Secure/Domain from Render.
    response.cookies.set({
      name: 'token',
      value,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: maxAgeSeconds,
    });
  }
}

async function proxyAuth(request: NextRequest, path: string) {
  const url = `${BACKEND_URL.replace(/\/$/, '')}/api/auth/${path}`;
  const headers = new Headers();

  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers.set('content-type', contentType);
  }

  const cookie = request.headers.get('cookie');
  if (cookie) {
    headers.set('cookie', cookie);
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(url, {
      method: request.method,
      headers,
      body:
        request.method !== 'GET' && request.method !== 'HEAD'
          ? await request.text()
          : undefined,
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json(
      {
        status: 503,
        message:
          'Cannot reach auth server. Check API_INTERNAL_URL / backend is running.',
      },
      { status: 503 },
    );
  }

  const bodyText = await backendRes.text();
  const response = new NextResponse(bodyText, {
    status: backendRes.status,
  });

  const backendContentType = backendRes.headers.get('content-type');
  if (backendContentType) {
    response.headers.set('content-type', backendContentType);
  }

  applyAuthCookies(backendRes, response);
  return response;
}

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyAuth(request, path.join('/'));
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyAuth(request, path.join('/'));
}
