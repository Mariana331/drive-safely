import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/lib/api/backendUrl';

type BackendResult = {
  status: number;
  bodyText: string;
  contentType: string | null;
  setCookies: string[];
};

function collectSetCookies(res: Response): string[] {
  if (typeof res.headers.getSetCookie === 'function') {
    const list = res.headers.getSetCookie();
    if (list.length > 0) return list;
  }
  const single = res.headers.get('set-cookie');
  return single ? [single] : [];
}

function applyAuthCookies(setCookies: string[], response: NextResponse) {
  for (const raw of setCookies) {
    const parts = raw.split(';').map((part) => part.trim());
    const [nameValue, ...attrs] = parts;
    const eqIndex = nameValue.indexOf('=');
    if (eqIndex === -1) continue;

    const name = nameValue.slice(0, eqIndex);
    const value = nameValue.slice(eqIndex + 1);

    if (name !== 'token') continue;

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
          maxAgeSeconds =
            parsed > 1_000_000 ? Math.floor(parsed / 1000) : parsed;
        }
      }
    }

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

function looksLikeHtml(body: string, contentType: string | null) {
  const type = contentType?.toLowerCase() ?? '';
  if (type.includes('text/html')) return true;
  const trimmed = body.trimStart().toLowerCase();
  return trimmed.startsWith('<!doctype') || trimmed.startsWith('<html');
}

async function fetchBackend(
  url: string,
  init: RequestInit,
  attempts = 3,
): Promise<BackendResult> {
  let lastError: unknown;

  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, { ...init, cache: 'no-store' });
      const contentType = res.headers.get('content-type');
      const bodyText = await res.text();
      const setCookies = collectSetCookies(res);

      if (looksLikeHtml(bodyText, contentType) && i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 2500 * (i + 1)));
        continue;
      }

      return {
        status: res.status,
        bodyText,
        contentType,
        setCookies,
      };
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
        continue;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Backend request failed');
}

async function proxyAuth(request: NextRequest, path: string) {
  const backend = getBackendBaseUrl();
  const url = `${backend}/api/auth/${path}`;
  const headers = new Headers();

  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers.set('content-type', contentType);
  }

  const cookie = request.headers.get('cookie');
  if (cookie) {
    headers.set('cookie', cookie);
  }

  let backendRes: BackendResult;
  try {
    backendRes = await fetchBackend(url, {
      method: request.method,
      headers,
      body:
        request.method !== 'GET' && request.method !== 'HEAD'
          ? await request.text()
          : undefined,
    });
  } catch {
    return NextResponse.json(
      {
        status: 503,
        message:
          'Cannot reach auth server. Set API_INTERNAL_URL to your backend (e.g. Render URL).',
      },
      { status: 503 },
    );
  }

  if (looksLikeHtml(backendRes.bodyText, backendRes.contentType)) {
    return NextResponse.json(
      {
        status: 503,
        message:
          'Auth server is waking up or returned an invalid response. Please try again in a few seconds.',
      },
      { status: 503 },
    );
  }

  if (backendRes.status === 404) {
    return NextResponse.json(
      {
        status: 404,
        message: `Auth endpoint not found on backend (${backend}/api/auth/${path}).`,
      },
      { status: 404 },
    );
  }

  const response = new NextResponse(backendRes.bodyText, {
    status: backendRes.status,
  });

  if (backendRes.contentType) {
    response.headers.set('content-type', backendRes.contentType);
  }

  applyAuthCookies(backendRes.setCookies, response);
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
