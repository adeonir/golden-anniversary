import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mwhpnkzjzhffwdjsrfed.supabase.co',
      },
    ],
  },
}

export default nextConfig
