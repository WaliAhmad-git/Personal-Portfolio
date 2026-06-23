'use client'

/* app/projects/ProjectsPageClient.tsx
   M10 REFACTOR: Extracted from page.tsx so the server wrapper
   can export metadata while this file owns all interactivity.
   Content is identical to the original page.tsx body. */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS, SOCIAL } from '@/lib/data'
import ProjectDetailCard from '@/components/sections/ProjectDetailCard'
import Button from '@/components/ui/Button'

type FilterKey = 'all' | 'fullstack' | 'security' | 'ml' | 'business'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',       label: 'All'        },
  { key: 'fullstack', label: 'Full Stack' },
  { key: 'security',  label: 'Security'   },
  { key: 'ml',        label: 'ML / AI'    },
  { key: 'business',  label: 'Business'   },
]

export default function ProjectsPageClient() {
  const [active, setActive] = useState<FilterKey>('all')

  const filtered =
    active === 'all'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === active)

  return (
    <main className="min-h-screen pt-32 pb-24 px-[7vw]">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-16"
        >
          <p
            className="font-mono text-xs tracking-[0.2em] uppercase mb-3"
            style={{ color: 'var(--cyan)' }}
          >
            /projects
          </p>
          <h1
            className="font-display font-extrabold leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--ink)' }}
          >
            Every project shipped<br className="hidden sm:block" /> end-to-end.
          </h1>
          <p
            className="font-mono text-sm"
            style={{ color: 'var(--dim)', maxWidth: '55ch' }}
          >
            No tutorials. No toy apps. Real clients, real deployments, real constraints.
          </p>

          <div className="mt-7">
            <Button href={SOCIAL.github} variant="primary" size="md" icon="external" external>
              VIEW MY WORK
            </Button>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
          className="flex flex-wrap gap-2 mb-14"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {FILTERS.map(({ key, label }) => {
            const isActive = active === key
            const count =
              key === 'all'
                ? PROJECTS.length
                : PROJECTS.filter((p) => p.category === key).length

            return (
              <button
                key={key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(key)}
                className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded border font-mono text-xs tracking-widest transition-all duration-200"
                style={{
                  borderColor:  isActive ? 'var(--amber)' : 'var(--line)',
                  background:   isActive ? 'rgba(255,177,61,0.08)' : 'transparent',
                  color:        isActive ? 'var(--amber)' : 'var(--dim)',
                  cursor:       'pointer',
                }}
              >
                {label}
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[0.55rem]"
                  style={{
                    background: isActive ? 'rgba(255,177,61,0.2)' : 'var(--bg-soft)',
                    color:      isActive ? 'var(--amber)'          : 'var(--dim-2)',
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* Project cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col gap-8"
          >
            {filtered.length === 0 ? (
              <p className="font-mono text-sm" style={{ color: 'var(--dim-2)' }}>
                // no projects in this category yet
              </p>
            ) : (
              filtered.map((project, index) => (
                <ProjectDetailCard key={project.id} project={project} index={index} />
              ))
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </main>
  )
}
