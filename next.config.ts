import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {

  allowedDevOrigins: ['10.174.207.91'],
  reactStrictMode: true,
  compress: true,
  turbopack: {},

  experimental: {
    browserslistForSwc: true,
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@heroicons/react',
      'react-icons',
    ],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: 'https', hostname: 'www.useclickads.com' },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',             value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',       value: 'nosniff' },
          { key: 'Strict-Transport-Security',    value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy',   value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'Referrer-Policy',              value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',           value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // FIXED: added fonts.googleapis.com and fonts.gstatic.com
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https:",
              // FIXED: added fonts.gstatic.com for font files
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https:",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default bundleAnalyzer(nextConfig)