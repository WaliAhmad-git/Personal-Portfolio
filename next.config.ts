import type { NextConfig } from 'next'

/* ═══════════════════════════════════════════════════════════
   next.config.ts  (SECURITY HARDENED)
   - Strict security headers via headers()
   - Disables X-Powered-By fingerprint header
   - Locks down image domains
   - Disables source maps in production
   ═══════════════════════════════════════════════════════════ */

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",        // Matter.js needs unsafe-eval, Next.js hydration needs unsafe-inline
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://formspree.io",
  "frame-ancestors 'none'",
  "form-action 'self' https://formspree.io",
  "upgrade-insecure-requests",
  "object-src 'none'",
  "base-uri 'self'",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy',         value: CSP },
  { key: 'X-Content-Type-Options',          value: 'nosniff' },
  { key: 'X-Frame-Options',                 value: 'DENY' },
  { key: 'X-XSS-Protection',               value: '0' },
  { key: 'Referrer-Policy',                 value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',              value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  /* Remove Next.js fingerprint */
  poweredByHeader: false,

  /* No source maps in production — prevents source code disclosure */
  productionBrowserSourceMaps: false,

  /* Strict mode catches subtle React bugs */
  reactStrictMode: true,

  /* Hide the floating "N" dev tools indicator badge */
  devIndicators: false,

  /* Lock image optimization to self-hosted images only */
  images: {
    domains: [],                  // no external image domains needed
    dangerouslyAllowSVG: false,   // prevent SVG-based XSS via next/image
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  /* Apply security headers to all routes */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  /* Block direct access to sensitive files in public/ */
  async redirects() {
    return [
      /* Redirect .env attempts to 404 */
      {
        source: '/.env/:path*',
        destination: '/404',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
