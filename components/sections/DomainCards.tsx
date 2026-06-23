'use client'

/* ═══════════════════════════════════════════════════════════
   components/sections/DomainCards.tsx
   Module 5 — "What I Do" homepage section.
   Extracted from About.tsx so the homepage gets a lean, focused
   summary of capabilities without the full bio / status block.
   ═══════════════════════════════════════════════════════════ */

import { motion } from 'framer-motion'
import { DOMAIN_CARDS } from '@/lib/data'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export default function DomainCards() {
  return (
    <section
      id="what-i-do"
      className="relative py-24 md:py-32 px-[7vw] border-t"
      style={{ borderColor: 'var(--line)', background: 'var(--bg-soft)' }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={headerVariants}
        className="flex flex-col gap-2 mb-14"
      >
        <span
          className="font-mono text-xs tracking-[0.2em] uppercase"
          style={{ color: 'var(--cyan)' }}
        >
          WHAT GETS BUILT
        </span>
        <h2
          className="font-display font-bold"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--ink)' }}
        >
          Four domains. One engineer.
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {DOMAIN_CARDS.map((card) => (
          <DomainCard key={card.id} card={card} />
        ))}
      </motion.div>
    </section>
  )
}

interface DomainCardProps {
  card: {
    id: string
    icon: string
    title: string
    body: string
    tags: readonly string[]
  }
}

function DomainCard({ card }: DomainCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -4,
        borderColor: 'var(--amber)',
        boxShadow: '0 0 20px rgba(255,177,61,0.1)',
        transition: { duration: 0.2 },
      }}
      className="magnetic relative flex flex-col gap-4 p-5 rounded border cursor-default"
      style={{
        borderColor: 'var(--line)',
        background: 'var(--bg)',
      }}
    >
      <span
        className="font-mono text-sm font-semibold tracking-wider"
        style={{ color: 'var(--amber)' }}
        aria-hidden="true"
      >
        {card.icon}
      </span>
      <h3
        className="font-display font-semibold text-sm tracking-wide leading-snug"
        style={{ color: 'var(--ink)' }}
      >
        {card.title}
      </h3>
      <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--dim)' }}>
        {card.body}
      </p>
      <div className="flex flex-wrap gap-2 pt-1">
        {card.tags.map((tag) => (
          <span key={tag} className="tag-pill">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
