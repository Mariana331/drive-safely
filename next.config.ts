import type { NextConfig } from 'next';

const backendUrl =
  process.env.API_INTERNAL_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  'http://localhost:3002';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl.replace(/\/$/, '')}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
