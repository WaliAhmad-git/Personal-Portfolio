'use client'

/* ═══════════════════════════════════════════════════════════
   components/sections/FeaturedProjects.tsx
   Module 5 — Homepage project preview (3 cards max).
   Now renders project screenshot at top of card when available.
   ═══════════════════════════════════════════════════════════ */

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { PROJECTS } from '@/lib/data'
import type { Project } from '@/lib/data'
import Button from '@/components/ui/Button'

const featured = PROJECTS.filter((p) => p.featured).slice(0, 3)

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const BADGE_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  fullstack: { color: '#4dd9e8', bg: 'rgba(77,217,232,0.08)',   border: 'rgba(77,217,232,0.3)'   },
  security:  { color: '#ff7b72', bg: 'rgba(255,123,114,0.08)', border: 'rgba(255,123,114,0.3)'   },
  ml:        { color: '#bc8cff', bg: 'rgba(188,140,255,0.08)', border: 'rgba(188,140,255,0.3)'   },
  business:  { color: '#ffb13d', bg: 'rgba(255,177,61,0.08)',  border: 'rgba(255,177,61,0.3)'    },
}

const BADGE_LABELS: Record<string, string> = {
  fullstack: 'FULL STACK',
  security:  'SECURITY',
  ml:        'ML / AI',
  business:  'E-COMMERCE',
}

export default function FeaturedProjects() {
  return (
    <section id="projects" className="relative py-24 md:py-32 px-[7vw] dot-grid">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={headerVariants}
        className="section-label"
      >
        <span className="idx">03</span>
        <h2>Selected Work</h2>
        <span className="rule" />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {featured.map((project, index) => (
          <FeaturedCard key={project.id} project={project} index={index} />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-center mt-14"
      >
        <Button href="/projects" variant="primary" size="lg" icon="right">
          VIEW ALL PROJECTS
        </Button>
      </motion.div>
    </section>
  )
}

function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const [imgError, setImgError] = useState(false)
  const badge = BADGE_COLORS[project.category]
  const badgeLabel = BADGE_LABELS[project.category]
  const padNum = String(index + 1).padStart(2, '0')
  const hasImage = !!project.imagePath && !imgError

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -5,
        borderColor: 'rgba(255,177,61,0.5)',
        boxShadow: '0 0 28px rgba(255,177,61,0.08)',
        transition: { duration: 0.2 },
      }}
      className="magnetic relative flex flex-col rounded border overflow-hidden"
      style={{ borderColor: 'var(--line)', background: 'var(--bg-soft)' }}
    >
      {/* Screenshot / image area */}
      {hasImage && (
        <div className="relative w-full h-44 shrink-0 overflow-hidden border-b" style={{ borderColor: 'var(--line)' }}>
          <Image
            src={project.imagePath}
            alt={`${project.title} screenshot`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setImgError(true)}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(18,18,23,0.85) 100%)' }}
          />
          {/* Ghost number over image */}
          <span
            className="absolute top-2 right-3 font-mono font-bold select-none pointer-events-none"
            style={{ fontSize: '2.8rem', color: 'rgba(243,241,234,0.08)', lineHeight: 1 }}
            aria-hidden="true"
          >
            {padNum}
          </span>
        </div>
      )}

      {/* Card body */}
      <div className="flex flex-col gap-5 p-6 flex-1">
        {/* Ghost number — only shown when no image */}
        {!hasImage && (
          <span
            className="absolute top-4 right-4 font-mono font-bold select-none pointer-events-none"
            style={{ fontSize: '3.5rem', color: 'var(--ink)', opacity: 0.05, lineHeight: 1 }}
            aria-hidden="true"
          >
            {padNum}
          </span>
        )}

        {/* Header row */}
        <div className="flex items-center gap-2.5">
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[0.62rem] tracking-widest border"
            style={{ color: badge.color, background: badge.bg, borderColor: badge.border }}
          >
            {badgeLabel}
          </span>
          <span className="font-mono text-[0.62rem] tracking-widest" style={{ color: 'var(--dim-2)' }}>
            {project.year}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-display font-bold leading-snug"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--ink)' }}
        >
          {project.title}
        </h3>

        {/* Short description */}
        <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--dim)' }}>
          {project.description}
        </p>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((tech) => (
            <span key={tech} className="tag-pill">{tech}</span>
          ))}
          {project.stack.length > 4 && (
            <span className="tag-pill" style={{ color: 'var(--dim-2)' }}>
              +{project.stack.length - 4}
            </span>
          )}
        </div>

        {/* Footer CTA */}
        <div className="pt-1 flex items-center justify-between">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs tracking-widest transition-colors duration-200 hover:opacity-80"
            style={{ color: 'var(--cyan)' }}
          >
            GitHub ↗
          </a>
          <Link
            href="/projects"
            className="font-mono text-[0.65rem] tracking-widest transition-colors duration-200"
            style={{ color: 'var(--dim-2)' }}
          >
            CASE STUDY →
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
