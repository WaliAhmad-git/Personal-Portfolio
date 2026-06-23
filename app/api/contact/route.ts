import { NextRequest, NextResponse } from 'next/server'

/* ═══════════════════════════════════════════════════════════
   app/api/contact/route.ts
   Server-side contact form proxy.
   Why proxy instead of hitting Formspree directly from the client?
   1. Formspree endpoint ID never ships in client JS bundle.
   2. We can validate + sanitize server-side before forwarding.
   3. We can add CSRF-like origin check.
   4. Honeypot field checked server-side (not bypassable in JS).
   ═══════════════════════════════════════════════════════════ */

const FORMSPREE_URL = process.env.FORMSPREE_ENDPOINT!  // set in .env.local / Vercel env vars

/* Allowed origins — update to your actual domain */
const ALLOWED_ORIGINS = [
  'https://wali-portfolio.vercel.app',
  process.env.NEXT_PUBLIC_SITE_URL ?? '',
  // add your custom domain here once you get it:
  // 'https://yourdomain.com',
].filter(Boolean)

/* Simple sanitizer — strips HTML tags and null bytes */
function sanitize(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<[^>]*>/g, '')           // strip HTML tags
    .replace(/\0/g, '')                // null bytes
    .replace(/[\r\n]{3,}/g, '\n\n')   // collapse excessive newlines
    .trim()
    .slice(0, 5000)                    // hard length cap
}

/* Email format check (basic RFC 5322 approximation) */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254
}

/* Extract just the origin (scheme + host + port) from a URL string.
   Returns null if the string isn't a parseable absolute URL. */
function safeOrigin(value: string): string | null {
  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  /* --- */
  /* SECURITY FIX: the previous version used origin.startsWith(allowed)
     and referer.startsWith(allowed). startsWith() is the wrong
     comparison for an origin allow-list — a request sent with
     Origin: https://wali-portfolio.vercel.app.attacker.com
     legitimately starts with "https://wali-portfolio.vercel.app" as
     a plain string, so the old check would have let it straight
     through. Comparing the *parsed* origin for exact equality closes
     that gap. (Remember: an attacker scripting curl/fetch directly
     against this endpoint controls these headers completely — this
     check only stops a browser running a script from a different
     site, not a determined bot. The honeypot, timing check, and the
     rate limiter in proxy.ts are what actually slow down bots.) */
  const requestOrigin = safeOrigin(req.headers.get('origin') ?? '')
  const refererOrigin  = safeOrigin(req.headers.get('referer') ?? '')
  const isAllowedOrigin =
    (requestOrigin !== null && ALLOWED_ORIGINS.includes(requestOrigin)) ||
    (refererOrigin !== null && ALLOWED_ORIGINS.includes(refererOrigin))

  const origin = req.headers.get('origin') ?? ''

  /* In dev, allow localhost */
  const isDev = process.env.NODE_ENV === 'development'
  const isLocalhost = origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')

  if (!isAllowedOrigin && !(isDev && isLocalhost)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  /* SECURITY: reject oversized bodies before they're parsed. Without
     this, someone can POST a multi-MB JSON blob and the server will
     fully buffer + JSON.parse() it before any field-length validation
     ever runs — cheap memory/CPU amplification per request. 20KB is
     generous for a name+email+message payload. */
  const contentLength = Number(req.headers.get('content-length') ?? '0')
  if (contentLength > 20_000) {
    return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
  }

  /* --- */
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  /* --- */
  if (body._gotcha && String(body._gotcha).length > 0) {
    /* Return 200 to fool bots — they think it worked */
    return NextResponse.json({ ok: true })
  }

  /* --- */
  const loadedAt = Number(body._loadedAt)
  if (!isNaN(loadedAt) && Date.now() - loadedAt < 5000) {
    return NextResponse.json({ ok: true }) // silent reject
  }

  /* --- */
  const name    = sanitize(body.name)
  const email   = sanitize(body.email)
  const message = sanitize(body.message)

  const errors: string[] = []
  if (!name || name.length < 2)           errors.push('Name must be at least 2 characters.')
  if (!isValidEmail(email))               errors.push('Please enter a valid email address.')
  if (!message || message.length < 10)    errors.push('Message must be at least 10 characters.')
  if (name.length > 100)                  errors.push('Name too long.')
  if (message.length > 3000)             errors.push('Message too long (max 3000 chars).')

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(' ') }, { status: 422 })
  }

  /* --- */
  if (!FORMSPREE_URL) {
    console.error('FORMSPREE_ENDPOINT env var not set')
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 })
  }

  try {
    const fRes = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'WaliPortfolio/1.0',
      },
      body: JSON.stringify({ name, email, message }),
    })

    if (!fRes.ok) {
      const fBody = await fRes.json().catch(() => ({}))
      console.error('Formspree error:', fRes.status, fBody)
      return NextResponse.json(
        { error: 'Failed to send message. Please email me directly.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact route fetch error:', err)
    return NextResponse.json({ error: 'Network error. Please try again.' }, { status: 503 })
  }
}

/* Block non-POST methods */
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
