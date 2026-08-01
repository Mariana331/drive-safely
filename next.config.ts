import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // No external /api rewrites — on Vercel they override Route Handlers and
  // break auth with DNS_HOSTNAME_RESOLVED_PRIVATE when pointed at localhost.
  // Auth: app/api/auth/[...path]/route.ts
  // News/other: server-side fetch via getApiBaseUrl() → Render backend.
};

export default nextConfig;
