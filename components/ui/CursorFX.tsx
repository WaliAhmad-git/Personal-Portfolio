'use client'

/* ═══════════════════════════════════════════════════════════
   components/ui/CursorFX.tsx
   Signature element — magnetic custom cursor + film grain overlay.
   Mounted once in layout.tsx, sits above everything, ignores clicks.
   Disabled below 860px (touch devices) via CSS in globals.css.
   ═══════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react'

export default function CursorFX() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(max-width: 860px)').matches) return

    const move = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top = `${e.clientY}px`
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${e.clientX}px`
        ringRef.current.style.top = `${e.clientY}px`
      }
    }

    const grow = () => {
      if (!ringRef.current) return
      ringRef.current.style.width = '64px'
      ringRef.current.style.height = '64px'
      ringRef.current.style.borderColor = 'var(--amber)'
    }
    const shrink = () => {
      if (!ringRef.current) return
      ringRef.current.style.width = '40px'
      ringRef.current.style.height = '40px'
      ringRef.current.style.borderColor = 'var(--dim)'
    }

    window.addEventListener('mousemove', move)

    const hoverables = document.querySelectorAll('a, button, .magnetic')
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    // Re-bind on DOM changes (route content mounts after this effect)
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, .magnetic').forEach((el) => {
        el.removeEventListener('mouseenter', grow)
        el.removeEventListener('mouseleave', shrink)
        el.addEventListener('mouseenter', grow)
        el.addEventListener('mouseleave', shrink)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', move)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-[18px] h-[18px] rounded-full pointer-events-none z-[999]"
        style={{
          background: 'var(--amber)',
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[999] transition-[width,height,border-color] duration-300"
        style={{
          border: '1px solid var(--dim)',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[998] pointer-events-none"
        style={{
          opacity: 0.05,
          mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  )
}
