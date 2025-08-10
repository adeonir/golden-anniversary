/** biome-ignore-all lint/suspicious/useAwait: This file does not require await usage checks. */
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: 'https://ik.imagekit.io/:path*',
      },
    ]
  },
}

export default nextConfig
