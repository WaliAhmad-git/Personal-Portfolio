'use client'

/* ═══════════════════════════════════════════════════════════
   components/sections/Hero.tsx
   Two-column layout: LEFT = name + short intro (anchor).
   RIGHT = kinetic headline, role typewriter, stats.
   Signature: boot line → kinetic reveal → real char-by-char
   typewriter cycling through TYPEWRITER_ROLES.
   ═══════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react'
import { PERSONAL, HERO_STATS, TYPEWRITER_ROLES } from '@/lib/data'

export default function Hero() {
  const [booted, setBooted] = useState(false)
  const [linesShown, setLinesShown] = useState(0)
  const [subShown, setSubShown] = useState(false)
  const [metaShown, setMetaShown] = useState(false)
  const [leftShown, setLeftShown] = useState(false)

  useEffect(() => {
    const t0 = setTimeout(() => setBooted(true), 900)
    return () => clearTimeout(t0)
  }, [])

  useEffect(() => {
    if (!booted) return
    const timers = [0, 1].map((i) =>
      setTimeout(() => setLinesShown((n) => Math.max(n, i + 1)), 200 + i * 150)
    )
    const t1 = setTimeout(() => setSubShown(true), 750)
    const t2 = setTimeout(() => setMetaShown(true), 1050)
    const t3 = setTimeout(() => setLeftShown(true), 150)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [booted])

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-16 px-[7vw] dot-grid">
      {/* Boot overlay */}
      <div
        className={[
          'fixed inset-0 z-[997] flex items-center justify-center font-mono text-sm tracking-wide transition-opacity duration-500',
          booted ? 'opacity-0 invisible' : 'opacity-100 visible',
        ].join(' ')}
        style={{ background: 'var(--bg)', color: 'var(--cyan)' }}
        aria-hidden="true"
      >
        <span style={{ borderRight: '2px solid var(--cyan)' }} className="pr-1 cursor-blink">
          wali@portfolio:~$ initializing_render...
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 items-start">

        {/* --- */}
        <div
          className="flex flex-col gap-5 lg:pt-3 transition-all duration-700"
          style={{ opacity: leftShown ? 1 : 0, transform: leftShown ? 'translateY(0)' : 'translateY(16px)' }}
        >
          <p
            className="font-mono text-xs tracking-[0.2em] uppercase flex items-center gap-2"
            style={{ color: 'var(--cyan)' }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)' }}
              aria-hidden="true"
            />
          {PERSONAL.status ? `${String(PERSONAL.status).toLowerCase()} — ` : ''}{String(PERSONAL.location).toLowerCase()}
          </p>

          <h1
            className="font-display font-extrabold leading-[1.05]"
            style={{ fontSize: 'clamp(2rem, 3.4vw, 2.8rem)', color: 'var(--ink)' }}
          >
            {PERSONAL.name}
          </h1>

          <p className="font-mono text-sm tracking-wide" style={{ color: 'var(--amber)' }}>
            {PERSONAL.title}
          </p>

          <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'var(--dim)' }}>
            {PERSONAL.degree} student at {PERSONAL.university} ({PERSONAL.session}) — building
            production systems first, breaking them on purpose second.
          </p>
        </div>

        {/* --- */}
        <div className="flex flex-col">
          <h2 className="kinetic text-[clamp(2.4rem,7.5vw,6.2rem)]">
            <span className="line">
              <span className={linesShown >= 1 ? 'show' : ''}>Code that survives</span>
            </span>
            <span className="line">
              <span
                className={linesShown >= 2 ? 'show' : ''}
                style={{ fontSize: '1.45em', display: 'inline-block' }}
              >
                with reality.
              </span>
            </span>
          </h2>

          <p
            className="mt-8 max-w-xl text-base md:text-lg leading-relaxed transition-all duration-700"
            style={{
              color: 'var(--dim)',
              opacity: subShown ? 1 : 0,
              transform: subShown ? 'translateY(0)' : 'translateY(16px)',
              minHeight: '2.4em',
            }}
          >
            Currently working as a{' '}
            <Typewriter roles={TYPEWRITER_ROLES} active={subShown} />
          </p>

          <div
            className="mt-12 flex flex-wrap gap-x-12 gap-y-6 transition-opacity duration-1000"
            style={{ opacity: metaShown ? 1 : 0 }}
          >
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <span
                  className="block font-display font-bold text-3xl md:text-4xl"
                  style={{ color: 'var(--ink)' }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-mono text-[0.68rem] tracking-widest uppercase"
                  style={{ color: 'var(--dim-2)' }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-10 left-[7vw] flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.18em]"
        style={{ color: 'var(--dim-2)' }}
      >
        <span
          className="block w-px h-8"
          style={{
            background: 'linear-gradient(to bottom, var(--amber), transparent)',
            animation: 'scrollbar-pulse 1.8s ease-in-out infinite',
          }}
          aria-hidden="true"
        />
        SCROLL
      </div>
    </section>
  )
}

/* ─── Char-by-char typewriter, cycling through roles ─────────
   Types forward, pauses, deletes backward, moves to next role.
   `active` gates the whole effect so it only starts once the
   hero choreography reaches this point. */
function Typewriter({ roles, active }: { roles: readonly string[]; active: boolean }) {
  const [display, setDisplay] = useState('')
  const roleIndex = useRef(0)
  const charIndex = useRef(0)
  const deleting = useRef(false)

  useEffect(() => {
    if (!active) return

    const TYPE_MS = 55
    const DELETE_MS = 30
    const HOLD_MS = 1700
    const GAP_MS = 300

    let timeout: ReturnType<typeof setTimeout>

    const tick = () => {
      const current = roles[roleIndex.current]

      if (!deleting.current) {
        charIndex.current += 1
        setDisplay(current.slice(0, charIndex.current))

        if (charIndex.current >= current.length) {
          deleting.current = true
          timeout = setTimeout(tick, HOLD_MS)
          return
        }
        timeout = setTimeout(tick, TYPE_MS)
      } else {
        charIndex.current -= 1
        setDisplay(current.slice(0, charIndex.current))

        if (charIndex.current <= 0) {
          deleting.current = false
          roleIndex.current = (roleIndex.current + 1) % roles.length
          timeout = setTimeout(tick, GAP_MS)
          return
        }
        timeout = setTimeout(tick, DELETE_MS)
      }
    }

    timeout = setTimeout(tick, TYPE_MS)
    return () => clearTimeout(timeout)
  }, [active, roles])

  return (
    <span style={{ color: 'var(--amber)' }}>
      {display}
      <span className="cursor-blink" aria-hidden="true">|</span>
    </span>
  )
}
