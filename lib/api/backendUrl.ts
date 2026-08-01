const RENDER_BACKEND = 'https://drive-safely-node-js.onrender.com';

/** Shared backend base URL for Next.js server-side proxies. */
export function getBackendBaseUrl(): string {
  const fromEnv =
    process.env.API_INTERNAL_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim();

  if (fromEnv) return fromEnv.replace(/\/$/, '');

  // Never default to localhost — Vercel external rewrites/proxy reject it.
  return RENDER_BACKEND;
}
