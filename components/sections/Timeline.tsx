'use client'

/* ═══════════════════════════════════════════════════════════
   components/sections/Timeline.tsx
   Module 5 — Chronological journey timeline. Restyled badges/
   dots to amber/cyan signal palette; structure/data unchanged.
   ═══════════════════════════════════════════════════════════ */

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { TIMELINE } from '@/lib/data'
import type { TimelineEntry, TimelineType } from '@/lib/data'

const BADGE_CONFIG: Record<TimelineType, { label: string; color: string; bg: string; border: string }> = {
  EDUCATION: { label: 'EDUCATION', color: '#4dd9e8', bg: 'rgba(77,217,232,0.08)', border: 'rgba(77,217,232,0.35)' },
  PROJECT:   { label: 'PROJECT',   color: '#ffb13d', bg: 'rgba(255,177,61,0.08)', border: 'rgba(255,177,61,0.35)' },
  SECURITY:  { label: 'SECURITY',  color: '#ff7b72', bg: 'rgba(255,123,114,0.08)', border: 'rgba(255,123,114,0.35)' },
  ML:        { label: 'ML / AI',   color: '#bc8cff', bg: 'rgba(188,140,255,0.08)', border: 'rgba(188,140,255,0.35)' },
  CURRENT:   { label: 'CURRENT',   color: '#ffb13d', bg: 'rgba(255,177,61,0.1)',  border: 'rgba(255,177,61,0.5)'  },
}

const sectionHeaderVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

function entryVariants(side: 'left' | 'right') {
  return {
    hidden: { opacity: 0, x: side === 'left' ? -40 : 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
  }
}

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.35, ease: 'backOut' as const } },
}

export default function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 0.85', 'end 0.15'] })
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 px-[7vw]">
      <motion.div
        variants={sectionHeaderVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="section-label"
      >
        <span className="idx">02</span>
        <h2>Journey</h2>
        <span className="rule" />
      </motion.div>

      <motion.h3
        variants={sectionHeaderVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="font-display font-bold text-[clamp(1.4rem,3vw,2rem)] leading-tight mb-16 md:mb-20"
        style={{ color: 'var(--dim)' }}
      >
        From student to builder.
      </motion.h3>

      <div className="relative">
        <div
          className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
          style={{ width: '2px', background: 'var(--line)' }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-x-0 top-0 origin-top"
            style={{
              scaleY: lineScaleY,
              height: '100%',
              background: 'linear-gradient(to bottom, var(--amber), var(--cyan))',
              opacity: 0.7,
            }}
          />
        </div>

        <div className="flex flex-col gap-12 md:gap-16">
          {TIMELINE.map((entry, index) => (
            <TimelineItem key={entry.id} entry={entry} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ entry }: { entry: TimelineEntry; index: number }) {
  const isLeft = entry.side === 'left'
  const badge = BADGE_CONFIG[entry.type]
  const isCurrent = entry.type === 'CURRENT'

  return (
    <div className="relative md:grid md:grid-cols-2 md:gap-0 pl-8 md:pl-0">
      <div className="md:hidden absolute left-0 top-0 bottom-0 flex flex-col items-center" aria-hidden="true">
        <div className="w-px flex-1" style={{ background: 'var(--line)' }} />
      </div>

      <motion.div
        variants={dotVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="md:hidden absolute left-0 top-5 -translate-x-1/2"
        aria-hidden="true"
      >
        <ConnectorDot isCurrent={isCurrent} />
      </motion.div>

      {isLeft ? (
        <motion.div
          variants={entryVariants('left')}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="hidden md:flex justify-end pr-10 pb-16"
        >
          <EntryCard entry={entry} badge={badge} isCurrent={isCurrent} />
        </motion.div>
      ) : (
        <div className="hidden md:block pb-16" />
      )}

      <div
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center"
        style={{ top: '-1.5rem', zIndex: 10 }}
        aria-hidden="true"
      >
        <motion.div
          variants={dotVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <ConnectorDot isCurrent={isCurrent} />
        </motion.div>
        <span
          className="font-mono text-[0.65rem] tracking-widest whitespace-nowrap absolute left-1/2 -translate-x-1/2"
          style={{ color: 'var(--amber)', top: '-1.5rem', zIndex: 10 }}
        >
          {entry.year}
        </span>
      </div>

      {!isLeft ? (
        <motion.div
          variants={entryVariants('right')}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="hidden md:flex justify-start pl-10 pb-16"
        >
          <EntryCard entry={entry} badge={badge} isCurrent={isCurrent} />
        </motion.div>
      ) : (
        <div className="hidden md:block pb-16" />
      )}

      <motion.div
        variants={entryVariants('right')}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="md:hidden"
      >
        <span className="font-mono text-[0.65rem] tracking-widest mb-2 block" style={{ color: 'var(--amber)' }}>
          {entry.year}
        </span>
        <EntryCard entry={entry} badge={badge} isCurrent={isCurrent} />
      </motion.div>
    </div>
  )
}

interface EntryCardProps {
  entry: TimelineEntry
  badge: (typeof BADGE_CONFIG)[TimelineType]
  isCurrent: boolean
}

function EntryCard({ entry, badge, isCurrent }: EntryCardProps) {
  return (
    <div
      className="relative rounded border p-5 max-w-[440px] w-full"
      style={{
        background: 'var(--bg-soft)',
        borderColor: isCurrent ? 'var(--amber)' : 'var(--line)',
        boxShadow: isCurrent ? '0 0 24px rgba(255,177,61,0.12)' : undefined,
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[0.65rem] tracking-widest border"
          style={{ color: badge.color, background: badge.bg, borderColor: badge.border }}
        >
          {isCurrent && (
            <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: badge.color }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: badge.color }} />
            </span>
          )}
          {badge.label}
        </span>
      </div>

      <h3 className="font-display font-semibold text-sm md:text-base leading-snug mb-2" style={{ color: 'var(--ink)' }}>
        {entry.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--dim)' }}>
        {entry.body}
      </p>
    </div>
  )
}

function ConnectorDot({ isCurrent }: { isCurrent: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
        style={{ borderColor: isCurrent ? 'var(--amber)' : 'var(--line)', background: 'var(--bg)' }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: isCurrent ? 'var(--amber)' : 'var(--dim-2)' }} />
      </div>
      {isCurrent && (
        <div className="absolute w-4 h-4 rounded-full animate-ping" style={{ background: 'rgba(255,177,61,0.2)' }} aria-hidden="true" />
      )}
    </div>
  )
}
