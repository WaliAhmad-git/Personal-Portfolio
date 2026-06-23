'use client'

// M4 CHANGES:
// 1. NAV_LINKS converted from scroll-to-section anchors to real page routes
// 2. Desktop + mobile nav now use next/link <Link> instead of scroll handlers
// 3. Active route highlighted via usePathname()
// 4. Mobile menu auto-closes on route change
// 5. CONTACT stays as a scroll target (/#contact) — only meaningful on the homepage,
//    so clicking it from another page navigates home and then scrolls (handled by
//    the browser's native hash-scroll on load; refined further in M10).

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MARQUEE_TEXT, PERSONAL } from '@/lib/data'

const NAV_LINKS = [
  { label: 'HOME',     href: '/'         },
  { label: 'PROJECTS', href: '/projects' },
  { label: 'ABOUT',    href: '/about'    },
  { label: 'SKILLS',   href: '/skills'   },
  { label: 'CONTACT',  href: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // M4: close mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === '/#contact') return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-bg-primary/90 backdrop-blur-md border-b border-border'
          : 'bg-transparent',
      ].join(' ')}
    >
      <MarqueeStrip />

      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Email — visible on sm and up, hidden on mobile */}
        <a
          href={`https://mail.google.com/mail/?view=cm&to=${PERSONAL.email}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs transition-colors duration-200 tracking-wide hidden sm:block"
          style={{ color: 'var(--cyan)', marginLeft: '20px' }}
        >
          {PERSONAL.email}
        </a>

        {/* Empty spacer on mobile so hamburger stays right-aligned */}
        <div className="sm:hidden" />

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.label} label={link.label} href={link.href} active={isActive(link.href)} />
          ))}
        </nav>

        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus-visible:outline-none"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="block w-6 h-px origin-center"
            style={{ background: 'var(--ink)' }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.15 }}
            className="block w-6 h-px"
            style={{ background: 'var(--ink)' }}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="block w-6 h-px origin-center"
            style={{ background: 'var(--ink)' }}
          />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b px-6 pb-6 pt-4"
            style={{ background: 'var(--bg-soft)', borderColor: 'var(--line)' }}
          >
            <nav className="flex flex-col gap-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-left font-display font-semibold text-sm tracking-widest transition-colors duration-200"
                  style={{ color: isActive(link.href) ? 'var(--amber)' : 'var(--dim)' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function MarqueeStrip() {
  return (
    <div aria-hidden="true">
      <div
        className="relative w-full h-10 overflow-hidden flex items-center border-b"
        style={{ background: 'var(--bg-soft)', borderColor: 'var(--line)' }}
      >
        <div className="flex" style={{ animation: 'marquee-scroll 28s linear infinite' }}>
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ display: 'inline-block', paddingRight: '4rem', minWidth: '100vw', whiteSpace: 'nowrap', color: 'var(--dim)' }}
          >
            {MARQUEE_TEXT}
          </span>
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ display: 'inline-block', paddingRight: '4rem', minWidth: '100vw', whiteSpace: 'nowrap', color: 'var(--dim)' }}
          >
            {MARQUEE_TEXT}
          </span>
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to right, var(--bg-soft), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to left, var(--bg-soft), transparent)' }} />
      </div>

      <div className="relative flex justify-center" style={{ height: 20, zIndex: 30 }}>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-xs tracking-widest whitespace-nowrap"
          style={{
            background: 'var(--bg)',
            borderColor: '#22c55e',
            color: '#22c55e',
            transform: 'translateY(-50%)',
            position: 'relative',
            boxShadow: '0 0 12px rgba(34,197,94,0.2)',
          }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}
          />
          OPEN FOR WORK
        </span>
      </div>
    </div>
  )
}

function NavLink({
  label,
  href,
  active,
}: {
  label: string
  href: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className="relative group font-display font-semibold text-xs tracking-widest transition-colors duration-200 pb-0.5"
      style={{ color: active ? 'var(--amber)' : 'var(--dim)' }}
    >
      {label}
      <span
        className="absolute bottom-0 left-0 w-full h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out"
        style={{ background: 'var(--amber)', transform: active ? 'scaleX(1)' : undefined }}
      />
    </Link>
  )
}
