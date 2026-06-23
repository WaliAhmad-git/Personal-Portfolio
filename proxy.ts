import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/* ═══════════════════════════════════════════════════════════
   proxy.ts  (root of project — Next.js 16 uses "proxy" not "middleware")
   Enforces: security headers, rate-limiting on /api/* POST routes,
   scanner path blocking.

   NOTE on CSP: nonce-based CSP was removed because Next.js 16 on
   Vercel does not thread the per-request nonce into <script> tags
   automatically — this caused ALL JavaScript to be blocked by the
   browser (scripts had no valid nonce). CSP is now handled entirely
   by next.config.ts headers() which applies it at the edge correctly.
   All other security headers remain here.

   Rate-limit note: this in-memory limiter is per-instance. On Vercel,
   concurrent invocations / multiple regions do NOT share this Map.
   Good enough to stop casual spam/bots; swap for Vercel KV / Upstash
   Redis if real abuse shows up.
   ═══════════════════════════════════════════════════════════ */

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX       = 10

/* Opportunistic cleanup so the map can't grow unbounded on a
   long-lived warm instance. Cheap: only sweeps every ~50th call. */
let cleanupCounter = 0
function cleanupRateLimitMap(now: number) {
  cleanupCounter++
  if (cleanupCounter % 50 !== 0) return
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip)
  }
}

function rateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  cleanupRateLimitMap(now)

  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 }
  }

  entry.count++
  if (entry.count > RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 }
  }
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { method }   = request

  /* ── 0. Scanner path blocking (cheap, do first) ── */
  const BLOCKED_PATHS = [
    '/wp-admin', '/wp-login.php', '/.env', '/.git', '/config',
    '/admin', '/phpinfo', '/server-status', '/actuator',
  ]
  for (const blocked of BLOCKED_PATHS) {
    if (pathname.startsWith(blocked)) {
      return new NextResponse(null, { status: 404 })
    }
  }

  /* ── 1. Rate-limit /api POST requests ── */
  const isRateLimitedRoute = pathname.startsWith('/api/') && method === 'POST'
  let rateLimitRemaining: number | null = null

  if (isRateLimitedRoute) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'

    const { allowed, remaining } = rateLimit(ip)

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Try again in a minute.' }),
        {
          status: 429,
          headers: {
            'Content-Type':          'application/json',
            'Retry-After':           '60',
            'X-RateLimit-Limit':     String(RATE_LIMIT_MAX),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }

    rateLimitRemaining = remaining
  }

  const response = NextResponse.next()

  /* ── 2. Security headers ── */
  response.headers.set('X-Content-Type-Options',     'nosniff')
  response.headers.set('X-Frame-Options',            'DENY')
  response.headers.set('X-XSS-Protection',           '0')
  response.headers.set('Referrer-Policy',            'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy',         'camera=(), microphone=(), geolocation=()')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )
  response.headers.delete('X-Powered-By')
  response.headers.delete('Server')

  if (isRateLimitedRoute && rateLimitRemaining !== null) {
    response.headers.set('X-RateLimit-Limit',     String(RATE_LIMIT_MAX))
    response.headers.set('X-RateLimit-Remaining', String(rateLimitRemaining))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf|woff2?|ttf)$).*)',
  ],
}
