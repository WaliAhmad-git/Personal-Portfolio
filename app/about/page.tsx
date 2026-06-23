/* app/about/page.tsx
   Module 7 — /about route
   SERVER COMPONENT — no 'use client' here.
   metadata export lives here; all interactive sections are
   imported as separate Client Components.
   ─────────────────────────────────────────────────────────── */

import type { Metadata } from 'next'
import AboutPageClient from './AboutPageClient'

export const metadata: Metadata = {
  title: 'About — Wali Ahmad Hotak',
  description:
    'Full-stack developer and security enthusiast at IMSciences Peshawar. Built production systems for real clients.',
}

export default function AboutPage() {
  return <AboutPageClient />
}
