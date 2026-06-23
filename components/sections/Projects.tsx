'use client'

/* ═══════════════════════════════════════════════════════════
   components/sections/Projects.tsx
   Module 7 — Projects Showcase. Signature interaction: hovering
   a project's visual panel floods it with a diagonal color wipe
   instead of a plain image swap/fade.
   ═══════════════════════════════════════════════════════════ */

import { motion } from 'framer-motion'
import { PROJECTS, SOCIAL } from '@/lib/data'
import type { Project } from '@/lib/data'
import Button from '@/components/ui/Button'

const sectionHeaderVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const BADGE_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  fullstack: { color: '#4dd9e8', bg: 'rgba(77,217,232,0.08)', border: 'rgba(77,217,232,0.3)' },
  security:  { color: '#ff7b72', bg: 'rgba(255,123,114,0.08)', border: 'rgba(255,123,114,0.3)' },
  ml:        { color: '#bc8cff', bg: 'rgba(188,140,255,0.08)', border: 'rgba(188,140,255,0.3)' },
  business:  { color: '#ffb13d', bg: 'rgba(255,177,61,0.08)', border: 'rgba(255,177,61,0.3)' },
}
const BADGE_LABELS: Record<string, string> = {
  fullstack: 'FULL STACK',
  security: 'SECURITY',
  ml: 'ML / AI',
  business: 'E-COMMERCE',
}
const GLYPHS: Record<string, string> = {
  fullstack: '{ }',
  security: '⚡',
  ml: '~',
  business: '>_',
}

export default function Projects() {
  return (
    <section id="work" className="relative py-24 md:py-32 px-[7vw] dot-grid">
      <motion.div
        variants={sectionHeaderVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="section-label"
      >
        <span className="idx">03</span>
        <h2>Selected Work</h2>
        <span className="rule" />
      </motion.div>

      <div className="flex flex-col">
        {PROJECTS.map((project, index) => (
          <ProjectRow key={project.id} project={project} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="flex justify-center"
        style={{ marginTop: 'clamp(4rem, 7vw, 7rem)' }}
      >
        <Button href={SOCIAL.github} variant="primary" size="lg" icon="external" external>
          VIEW ALL PROJECTS ON GITHUB
        </Button>
      </motion.div>
    </section>
  )
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const imageLeft = index % 2 === 1
  const padNum = String(index + 1).padStart(2, '0')
  const badge = BADGE_COLORS[project.category]
  const badgeLabel = BADGE_LABELS[project.category]
  const glyph = GLYPHS[project.category]

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="group grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center py-12 md:py-14 border-b"
      style={{ borderColor: 'var(--line)' }}
    >
      {imageLeft ? (
        <>
          <ProjectVisual project={project} glyph={glyph} />
          <ProjectText project={project} padNum={padNum} badge={badge} badgeLabel={badgeLabel} />
        </>
      ) : (
        <>
          <div className="md:order-2"><ProjectVisual project={project} glyph={glyph} /></div>
          <div className="md:order-1"><ProjectText project={project} padNum={padNum} badge={badge} badgeLabel={badgeLabel} /></div>
        </>
      )}
    </motion.div>
  )
}

function ProjectVisual({ project, glyph }: { project: Project; glyph: string }) {
  return (
    <div
      className="relative aspect-[4/3] rounded overflow-hidden border"
      style={{ background: 'var(--bg-soft)', borderColor: 'var(--line)' }}
    >
      <span
        className="absolute top-4 left-4 font-mono text-[0.65rem] tracking-widest z-20"
        style={{ color: 'var(--dim-2)', mixBlendMode: 'difference' }}
      >
        {project.id.toUpperCase()}.PREVIEW
      </span>

      <span
        className="absolute inset-0 flex items-center justify-center font-display font-extrabold z-10 transition-colors duration-400"
        style={{ fontSize: '5rem', color: 'var(--line)' }}
      >
        {glyph}
      </span>

      {/* diagonal wipe — signature hover interaction */}
      <span
        className="absolute inset-0 transition-[clip-path] duration-500 ease-[cubic-bezier(.65,0,.35,1)] group-hover:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]"
        style={{
          background: 'var(--amber)',
          clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        }}
        aria-hidden="true"
      />
    </div>
  )
}

interface TextProps {
  project: Project
  padNum: string
  badge: { color: string; bg: string; border: string }
  badgeLabel: string
}

function ProjectText({ project, padNum, badge, badgeLabel }: TextProps) {
  return (
    <div className="relative flex flex-col gap-5">
      <span
        className="absolute -top-2 -left-1 font-mono font-bold select-none pointer-events-none leading-none"
        style={{ fontSize: 'clamp(3.5rem, 7vw, 6rem)', color: 'var(--ink)', opacity: 0.06, lineHeight: 1 }}
        aria-hidden="true"
      >
        {padNum}
      </span>

      <div className="flex items-center gap-3 relative">
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[0.65rem] tracking-widest border"
          style={{ color: badge.color, background: badge.bg, borderColor: badge.border }}
        >
          {badgeLabel}
        </span>
        {project.id === 'siem-platform' && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] tracking-widest" style={{ color: 'var(--dim-2)' }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--amber)' }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: 'var(--amber)' }} />
            </span>
            IN PROGRESS
          </span>
        )}
      </div>

      <h3 className="font-display font-bold text-[clamp(1.2rem,2.5vw,1.7rem)] leading-tight relative" style={{ color: 'var(--ink)' }}>
        {project.title}
      </h3>

      <p className="text-sm leading-relaxed" style={{ color: 'var(--dim)' }}>
        {project.longDescription}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span key={tech} className="tag-pill">{tech}</span>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-1 flex-wrap">
        <Button href={project.githubUrl} variant="secondary" size="sm" icon="external" external>
          VIEW CODE
        </Button>
        {project.liveUrl && (
          <Button href={project.liveUrl} variant="primary" size="sm" icon="external" external>
            LIVE DEMO
          </Button>
        )}
        {!project.liveUrl && project.id !== 'siem-platform' && (
          <span className="font-mono text-[0.65rem] tracking-widest" style={{ color: 'var(--dim-2)' }}>
            {project.id === 'makkah-pos'
              ? 'Production system — no public demo'
              : project.id === 'seizure-prediction'
              ? 'Research project'
              : 'No public demo'}
          </span>
        )}
        {project.id === 'siem-platform' && (
          <span className="font-mono text-[0.65rem] tracking-widest" style={{ color: 'var(--amber)' }}>
            FYP — Target: graduation 2027
          </span>
        )}
      </div>
    </div>
  )
}
