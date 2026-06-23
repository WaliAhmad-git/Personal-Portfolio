'use client'

/* app/skills/SkillsPageClient.tsx
   M10 REFACTOR: Extracted from page.tsx so the server wrapper
   can export metadata. Content identical to original page.tsx body. */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SKILLS_DETAIL } from '@/lib/data'
import type { SkillDetail } from '@/lib/data'

/* ─── Category config ───────────────────────────────────────── */
const CATEGORIES = [
  { key: 'all',       label: 'All Skills'  },
  { key: 'Language',  label: 'Languages'   },
  { key: 'Framework', label: 'Frameworks'  },
  { key: 'Database',  label: 'Databases'   },
  { key: 'Tool',      label: 'Tools'       },
  { key: 'Security',  label: 'Security'    },
  { key: 'ML',        label: 'ML / AI'     },
] as const

type CategoryKey = (typeof CATEGORIES)[number]['key']

const LEVEL_STYLE: Record<SkillDetail['level'], { color: string; bg: string; border: string }> = {
  Proficient:  { color: '#4dd9e8', bg: 'rgba(77,217,232,0.08)',  border: 'rgba(77,217,232,0.3)'  },
  Comfortable: { color: '#ffb13d', bg: 'rgba(255,177,61,0.08)',  border: 'rgba(255,177,61,0.3)'  },
  Learning:    { color: '#bc8cff', bg: 'rgba(188,140,255,0.08)', border: 'rgba(188,140,255,0.3)' },
}

const CAT_COLOR: Record<string, string> = {
  Language:  'var(--cyan)',
  Framework: 'var(--amber)',
  Database:  '#336791',
  Tool:      '#FCC624',
  Security:  '#ff7b72',
  ML:        '#bc8cff',
}

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

export default function SkillsPageClient() {
  const [active, setActive] = useState<CategoryKey>('all')

  const visibleSkills =
    active === 'all'
      ? SKILLS_DETAIL
      : SKILLS_DETAIL.filter((s) => s.category === active)

  const groupedKeys = active === 'all'
    ? ['Language', 'Framework', 'Database', 'Tool', 'Security', 'ML']
    : [active]

  const proficientCount   = SKILLS_DETAIL.filter((s) => s.level === 'Proficient').length
  const comfortableCount  = SKILLS_DETAIL.filter((s) => s.level === 'Comfortable').length

  return (
    <main className="min-h-screen" style={{ paddingTop: '7rem' }}>

      {/* ── Page header ───────────────────────────────────────── */}
      <section
        className="px-[7vw] dot-grid"
        style={{ paddingBottom: 'clamp(4rem, 7vw, 6rem)' }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.p
            variants={fadeUp}
            className="font-mono text-xs tracking-[0.2em] uppercase mb-4 flex items-center gap-2"
            style={{ color: 'var(--cyan)' }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)' }}
              aria-hidden="true"
            />
            /skills
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display font-extrabold leading-tight mb-5"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', color: 'var(--ink)' }}
          >
            Not just logos.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-base leading-relaxed max-w-xl mb-10"
            style={{ color: 'var(--dim)' }}
          >
            Every technology listed with what it actually means in practice — which frameworks,
            which libraries, and which real projects it powered.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-8">
            {[
              { value: String(SKILLS_DETAIL.length), label: 'Technologies' },
              { value: String(proficientCount),      label: 'Proficient'   },
              { value: String(comfortableCount),     label: 'Comfortable'  },
            ].map(({ value, label }) => (
              <div key={label}>
                <span className="block font-display font-bold text-3xl" style={{ color: 'var(--ink)' }}>
                  {value}
                </span>
                <span className="font-mono text-[0.68rem] tracking-widest uppercase" style={{ color: 'var(--dim-2)' }}>
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Filter tabs (sticky) ──────────────────────────────── */}
      <div
        className="sticky top-[4.5rem] z-40 px-[7vw] py-4 border-t border-b"
        style={{
          background: 'rgba(10,10,13,0.9)',
          backdropFilter: 'blur(12px)',
          borderColor: 'var(--line)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter skills by category"
        >
          {CATEGORIES.map(({ key, label }) => {
            const isActive = active === key
            const count =
              key === 'all'
                ? SKILLS_DETAIL.length
                : SKILLS_DETAIL.filter((s) => s.category === key).length

            return (
              <button
                key={key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(key)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded border font-mono text-xs tracking-widest transition-all duration-200"
                style={{
                  borderColor: isActive ? 'var(--amber)' : 'var(--line)',
                  background:  isActive ? 'rgba(255,177,61,0.08)' : 'transparent',
                  color:       isActive ? 'var(--amber)' : 'var(--dim)',
                  cursor:      'pointer',
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
      </div>

      {/* ── Skill groups ──────────────────────────────────────── */}
      <section
        className="px-[7vw]"
        style={{ paddingTop: 'clamp(4rem, 7vw, 6rem)', paddingBottom: 'clamp(5rem, 9vw, 8rem)' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col gap-16"
          >
            {groupedKeys.map((cat) => {
              const skills = visibleSkills.filter((s) => s.category === cat)
              if (skills.length === 0) return null

              return (
                <div key={cat}>
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    className="flex items-center gap-4 mb-8"
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full shrink-0"
                      style={{ background: CAT_COLOR[cat] ?? 'var(--dim-2)' }}
                      aria-hidden="true"
                    />
                    <span
                      className="font-mono text-xs tracking-[0.2em] uppercase"
                      style={{ color: CAT_COLOR[cat] ?? 'var(--dim-2)' }}
                    >
                      {cat}
                    </span>
                    <span className="flex-1 h-px" style={{ background: 'var(--line)' }} aria-hidden="true" />
                    <span className="font-mono text-[0.6rem] tracking-widest" style={{ color: 'var(--dim-2)' }}>
                      {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
                    </span>
                  </motion.div>

                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    {skills.map((skill) => (
                      <SkillCard key={skill.name} skill={skill} />
                    ))}
                  </motion.div>
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Legend ────────────────────────────────────────────── */}
      <div
        className="px-[7vw] py-6 border-t"
        style={{ borderColor: 'var(--line)', background: 'var(--bg-soft)' }}
      >
        <div className="flex flex-wrap items-center gap-6">
          <span className="font-mono text-[0.65rem] tracking-widest uppercase" style={{ color: 'var(--dim-2)' }}>
            Legend
          </span>
          {(Object.keys(LEVEL_STYLE) as SkillDetail['level'][]).map((level) => {
            const s = LEVEL_STYLE[level]
            return (
              <span
                key={level}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[0.62rem] tracking-widest border"
                style={{ color: s.color, background: s.bg, borderColor: s.border }}
              >
                {level}
              </span>
            )
          })}
        </div>
      </div>

    </main>
  )
}

function SkillCard({ skill }: { skill: SkillDetail }) {
  const lvl = LEVEL_STYLE[skill.level]

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -3,
        borderColor: skill.color,
        boxShadow: `0 0 20px ${skill.color}18`,
        transition: { duration: 0.2 },
      }}
      className="magnetic relative flex flex-col gap-5 p-6 rounded border"
      style={{ borderColor: 'var(--line)', background: 'var(--bg-soft)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="inline-block w-3 h-3 rounded-full shrink-0 mt-0.5"
            style={{ background: skill.color, boxShadow: `0 0 10px ${skill.color}60` }}
            aria-hidden="true"
          />
          <h3
            className="font-display font-bold text-base leading-snug"
            style={{ color: 'var(--ink)' }}
          >
            {skill.name}
          </h3>
        </div>
        <span
          className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[0.6rem] tracking-widest border"
          style={{ color: lvl.color, background: lvl.bg, borderColor: lvl.border }}
        >
          {skill.level}
        </span>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: 'var(--dim)' }}>
        {skill.summary}
      </p>

      <div className="flex flex-col gap-2">
        <span
          className="font-mono text-[0.62rem] tracking-[0.18em] uppercase"
          style={{ color: 'var(--dim-2)' }}
        >
          Frameworks &amp; Libraries
        </span>
        <div className="flex flex-wrap gap-1.5">
          {skill.frameworks.map((f) => (
            <span
              key={f}
              className="font-mono text-[0.68rem] px-2.5 py-0.5 rounded border"
              style={{ background: 'var(--bg)', borderColor: 'var(--line)', color: 'var(--dim)' }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 pt-1 border-t" style={{ borderColor: 'var(--line)' }}>
        <span
          className="font-mono text-[0.62rem] tracking-[0.18em] uppercase"
          style={{ color: 'var(--dim-2)' }}
        >
          Used In
        </span>
        <p className="font-mono text-xs leading-relaxed" style={{ color: 'var(--dim)' }}>
          {skill.projects.join(' · ')}
        </p>
      </div>
    </motion.div>
  )
}
