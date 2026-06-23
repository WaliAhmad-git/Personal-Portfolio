'use client'

/* ═══════════════════════════════════════════════════════════
   components/sections/WhyHireMe.tsx
   Module 5 / M9 — Value proposition section.
   Answers the question a recruiter or hiring manager is
   implicitly asking. Four concrete differentiators, no I-language.
   ═══════════════════════════════════════════════════════════ */

import { motion } from 'framer-motion'

const WHY_HIRE_ME = [
  {
    icon: '[⚡]',
    title: 'Ships Real Software',
    body: 'Every project in this portfolio was built for a real client or real use case — a UK grocery store, a live LMS, a deployed e-commerce business. Not demos. Not tutorials.',
    accent: 'var(--amber)',
  },
  {
    icon: '[🛡]',
    title: 'Security-Aware by Default',
    body: "Full-stack development with a penetration tester's mindset. Systems get built with authentication, input validation, and IDOR prevention baked in — not patched in after.",
    accent: '#ff7b72',
  },
  {
    icon: '[⚙]',
    title: 'Full Stack Without the Gaps',
    body: "Database schema design, REST API architecture, frontend UI, and Linux deployment — the entire chain. No hand-off points. No \"that's not my domain\".",
    accent: 'var(--cyan)',
  },
  {
    icon: '[~]',
    title: 'Comfortable with Ambiguity',
    body: 'Founded a business, conducted a real pentest, trained ML models on messy real-world data. Built things without a tutorial showing the answer. That is the actual job.',
    accent: '#bc8cff',
  },
] as const

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

export default function WhyHireMe() {
  return (
    <section
      id="why-hire-me"
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
          WHY HIRE ME
        </span>
        <h2
          className="font-display font-bold"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--ink)' }}
        >
          What you actually get.
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {WHY_HIRE_ME.map((item) => (
          <WhyCard key={item.title} item={item} />
        ))}
      </motion.div>
    </section>
  )
}

interface WhyCardProps {
  item: {
    icon: string
    title: string
    body: string
    accent: string
  }
}

function WhyCard({ item }: WhyCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -3,
        transition: { duration: 0.2 },
      }}
      className="magnetic relative flex flex-col gap-4 p-7 rounded border"
      style={{
        borderColor: 'var(--line)',
        background: 'var(--bg)',
        borderLeft: `2px solid ${item.accent}`,
      }}
    >
      <span
        className="font-mono text-base font-semibold"
        style={{ color: item.accent }}
        aria-hidden="true"
      >
        {item.icon}
      </span>
      <h3
        className="font-display font-bold text-base leading-snug"
        style={{ color: 'var(--ink)' }}
      >
        {item.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--dim)' }}>
        {item.body}
      </p>
    </motion.div>
  )
}
