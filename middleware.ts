import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/* ═══════════════════════════════════════════════════════════
   proxy.ts  (root of project — Next.js 16 uses "proxy" not "middleware")
   Enforces: nonce-based CSP, security headers, rate-limiting on
   /api/* POST routes, scanner path blocking.

   SECURITY AUDIT FIXES (this version):
   1. CSP script-src now uses a per-request nonce + 'strict-dynamic'
      instead of 'unsafe-inline' + 'unsafe-eval'. The old policy let
      ANY inline <script> run, which defeats most of what a CSP is
      for — if an attacker ever got a script tag onto the page
      (stored XSS via a future feature, a compromised npm package,
      etc.) the old CSP would not have stopped it from executing.
   2. style-src keeps 'unsafe-inline' on purpose: this app uses
      React inline `style={{}}` attributes everywhere, and CSP
      nonces don't apply to style attributes (only to <style>
      elements) per the CSP3 spec, so there's no nonce-based way to
      tighten this without rewriting every component to Tailwind
      classes. Documenting this as an accepted, scoped trade-off
      rather than leaving it as an unexamined default.
   3. Added Cross-Origin-Opener-Policy.
   4. Rate-limit map now evicts expired entries instead of growing
      forever — the old version leaked memory for the lifetime of
      a warm serverless instance (every distinct IP ever seen stayed
      in the Map forever).
   5. Documented (not "fixed", because it requires an external
      store) that this in-memory limiter is per-instance: on Vercel,
      concurrent invocations / multiple regions do NOT share this
      Map, so a determined abuser can get effectively more than 10
      req/min by landing on different instances. Good enough to stop
      casual spam/bots; if real abuse shows up, swap this for
      Vercel KV / Upstash Redis so the counter is shared.
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

function buildCsp(nonce: string, isDev: boolean) {
  return [
    "default-src 'self'",
    /* 'strict-dynamic' + nonce: only scripts the page itself loads
       with the right nonce (or that they load) can run. No bare
       'unsafe-inline' / 'unsafe-eval' fallback in production. */
    isDev
      ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'` // eval needed for dev HMR only
      : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    /* style attributes (style={{}}) aren't nonce-able per the CSP
       spec — documented trade-off, see header comment. */
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "img-src 'self' data: blob:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "upgrade-insecure-requests",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ')
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { method }   = request
  const isDev        = process.env.NODE_ENV === 'development'

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

    /* fall through to nonce/header logic below, attach rate-limit
       headers to the final response once it exists */
    rateLimitRemaining = remaining
  }

  /* ── 2. Per-request nonce + CSP, forwarded to Next's own
     internal inline scripts via request headers (this is the
     documented Next.js pattern for nonce-based CSP) ── */
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const csp   = buildCsp(nonce, isDev)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  /* ── 3. Security headers on the actual response ── */
  response.headers.set('Content-Security-Policy',   csp)
  response.headers.set('X-Content-Type-Options',    'nosniff')
  response.headers.set('X-Frame-Options',           'DENY')
  response.headers.set('X-XSS-Protection',          '0')
  response.headers.set('Referrer-Policy',           'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy',        'camera=(), microphone=(), geolocation=()')
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
