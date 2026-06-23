'use client'

/* ═══════════════════════════════════════════════════════════
   components/sections/About.tsx
   Module 4 — About Me + What I Do (domain cards)
   Restyled to terminal-kinetic direction; content unchanged.
   ═══════════════════════════════════════════════════════════ */

import { motion } from 'framer-motion'
import { PERSONAL, DOMAIN_CARDS, SOCIAL } from '@/lib/data'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}
const cardContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

const STATUS_ITEMS = [
  { num: '01', label: 'Currently Building', value: PERSONAL.currentProject },
  { num: '02', label: 'Location', value: PERSONAL.location },
  { num: '03', label: 'Available', value: PERSONAL.availableFrom },
  { num: '04', label: 'Status', value: PERSONAL.status },
  { num: '05', label: 'Previously', value: 'Founded & sold Amirani Store (Afghan clothing, Belgium) — early 2026' },
] as const

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 px-[7vw] dot-grid">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={itemVariants}
        className="section-label"
      >
        <span className="idx">01</span>
        <h2>About</h2>
        <span className="rule" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">

        {/* LEFT — bio */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col gap-8"
        >
          <motion.h3
            variants={itemVariants}
            className="font-display font-bold text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight"
            style={{ color: 'var(--ink)' }}
          >
            Building things that actually work.
          </motion.h3>

          <motion.div variants={itemVariants} className="flex flex-col gap-5">
            {PERSONAL.bio.map((para, i) => (
              <p key={i} className="text-base leading-relaxed" style={{ color: 'var(--dim)' }}>
                {para}
              </p>
            ))}
          </motion.div>

          {/* Status block — left-rule stat rows instead of green-bordered card */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 pt-2">
            {STATUS_ITEMS.map(({ num, label, value }) => (
              <div
                key={label}
                className="flex gap-4 items-start pl-4 border-l-2 transition-colors duration-300 hover:border-[var(--amber)]"
                style={{ borderColor: 'var(--line)' }}
              >
                <span className="font-mono text-xs mt-0.5" style={{ color: 'var(--dim-2)' }}>
                  {num}
                </span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span
                    className="font-mono text-[0.65rem] tracking-widest uppercase"
                    style={{ color: 'var(--dim-2)' }}
                  >
                    {label}
                  </span>
                  <span className="text-sm break-words" style={{ color: 'var(--dim)' }}>
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Social links */}
          <motion.div variants={itemVariants} className="flex items-center gap-6 pt-1">
            <a
              href={SOCIAL.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs transition-colors duration-200"
              style={{ color: 'var(--dim-2)' }}
            >
              <GithubIcon />
              {SOCIAL.githubHandle}
            </a>
            <span aria-hidden="true" style={{ color: 'var(--line)' }}>·</span>
            <a
              href={SOCIAL.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs transition-colors duration-200"
              style={{ color: 'var(--dim-2)' }}
            >
              <LinkedinIcon />
              {SOCIAL.linkedinHandle}
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT — domain cards */}
        <motion.div
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start"
        >
          <motion.div variants={itemVariants} className="sm:col-span-2 mb-1">
            <span
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: 'var(--cyan)' }}
            >
              WHAT GETS BUILT
            </span>
          </motion.div>

          {DOMAIN_CARDS.map((card) => (
            <DomainCard key={card.id} card={card} />
          ))}
        </motion.div>
      </div>
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
        background: 'var(--bg-soft)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      <span className="font-mono text-sm font-semibold tracking-wider" style={{ color: 'var(--amber)' }} aria-hidden="true">
        {card.icon}
      </span>
      <h3 className="font-display font-semibold text-sm tracking-wide leading-snug" style={{ color: 'var(--ink)' }}>
        {card.title}
      </h3>
      <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--dim)' }}>
        {card.body}
      </p>
      <div className="flex flex-wrap gap-2 pt-1">
        {card.tags.map((tag) => (
          <span key={tag} className="tag-pill">{tag}</span>
        ))}
      </div>
    </motion.div>
  )
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
