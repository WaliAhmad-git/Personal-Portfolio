'use client'

import { RESUME_PATH } from '@/lib/data'

export default function ResumeButton() {
  return (
    <a
      href={RESUME_PATH}
      target="_blank"
      rel="noopener noreferrer"
      className="magnetic fixed bottom-8 right-8 z-50 group inline-flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-semibold tracking-widest rounded transition-all duration-200"
      style={{
        color: 'var(--amber)',
        border: '1px solid var(--amber)',
        background: 'rgba(10,10,13,0.8)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 0 18px rgba(255,177,61,0.2)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--amber)'
        e.currentTarget.style.color = 'var(--bg)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(10,10,13,0.8)'
        e.currentTarget.style.color = 'var(--amber)'
      }}
      aria-label="Open resume PDF"
    >
      RESUME
      <span
        className="text-base leading-none transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      >
        ↗
      </span>
    </a>
  )
}
