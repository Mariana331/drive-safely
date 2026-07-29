import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.API_INTERNAL_URL ?? 'http://localhost:3002';

function forwardSetCookies(
  backendRes: Response,
  response: NextResponse,
) {
  const setCookies =
    typeof backendRes.headers.getSetCookie === 'function'
      ? backendRes.headers.getSetCookie()
      : [];

  if (setCookies.length > 0) {
    for (const cookie of setCookies) {
      response.headers.append('set-cookie', cookie);
    }
    return;
  }

  const single = backendRes.headers.get('set-cookie');
  if (single) {
    response.headers.set('set-cookie', single);
  }
}

async function proxyAuth(request: NextRequest, path: string) {
  const url = `${BACKEND_URL}/api/auth/${path}`;
  const headers = new Headers();

  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers.set('content-type', contentType);
  }

  const cookie = request.headers.get('cookie');
  if (cookie) {
    headers.set('cookie', cookie);
  }

  const backendRes = await fetch(url, {
    method: request.method,
    headers,
    body: request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.text()
      : undefined,
    cache: 'no-store',
  });

  const response = new NextResponse(await backendRes.text(), {
    status: backendRes.status,
  });

  const backendContentType = backendRes.headers.get('content-type');
  if (backendContentType) {
    response.headers.set('content-type', backendContentType);
  }

  forwardSetCookies(backendRes, response);
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
