/* app/projects/page.tsx
   M10 FIX: 'use client' at the top of this file made the metadata
   export silently dead — Next.js can't read metadata from client
   components. Pattern: server wrapper exports metadata, imports
   the interactive client component. Same pattern as /about. */

import type { Metadata } from 'next'
import ProjectsPageClient from './ProjectsPageClient'

export const metadata: Metadata = {
  title: 'Projects — Wali Ahmad Hotak',
  description:
    'Full-stack, security, and ML projects built for real clients. Every project shipped end-to-end.',
}

export default function ProjectsPage() {
  return <ProjectsPageClient />
}
