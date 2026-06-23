/* app/skills/page.tsx
   M10 FIX: same issue as /projects — 'use client' killed metadata.
   Server wrapper exports metadata; client component owns the UI. */

import type { Metadata } from 'next'
import SkillsPageClient from './SkillsPageClient'

export const metadata: Metadata = {
  title: 'Skills — Wali Ahmad Hotak',
  description:
    'Not just logos. Every technology with what it actually means in practice — frameworks, libraries, and the real projects that used it.',
}

export default function SkillsPage() {
  return <SkillsPageClient />
}
