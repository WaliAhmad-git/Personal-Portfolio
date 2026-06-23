'use client'

/* app/about/AboutPageClient.tsx
   Sections (top → bottom):
     01  Hero — kinetic headline + bio + social links
     02  At a Glance — 5 status stat rows
     03  What Gets Built — domain cards
     04  Currently Reading + Writing Soon — inlined, correct idx
     05  Outside of Code — 4 interest cards
     06  Education — degree card + coursework
   ─────────────────────────────────────────────────────────── */

import { motion } from 'framer-motion'
import { PERSONAL, DOMAIN_CARDS, SOCIAL, CURRENTLY } from '@/lib/data'
import Button from '@/components/ui/Button'

/* ── animation presets ──────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const viewport = { once: true, margin: '-70px' }

/* ── data ───────────────────────────────────────────────── */
const STATUS_ITEMS = [
  { num: '01', label: 'Currently Building', value: 'Real Estate AI Search · Z Context Switcher' },
  { num: '02', label: 'Location',           value: PERSONAL.location },
  { num: '03', label: 'Available',          value: PERSONAL.availableFrom },
  { num: '04', label: 'Degree',             value: `${PERSONAL.degree} — ${PERSONAL.session}` },
  { num: '05', label: 'Previously',         value: 'Founded & sold Amirani Store (Afghan clothing, Belgium) — early 2026' },
] as const

const SPINE_COLORS = ['#4dd9e8', '#bc8cff'] as const

const READING_NOTES: Record<string, string> = {
  "The Web Application Hacker's Handbook":
    'The bible of web app exploitation — every chapter feeds directly into real-world security work.',
  'Thinking, Fast and Slow':
    'Cognitive biases and dual-process theory. Changes how you debug, communicate, and make decisions under pressure.',
}

const DRAFT_POSTS = [
  { title: 'Building a POS system for a UK grocery store',      tag: 'FULL STACK' },
  { title: 'Penetration testing a live LMS: key findings',      tag: 'SECURITY'   },
  { title: 'Building an AI meeting bot with Deepgram + Gemini', tag: 'AI / ML'    },
] as const

const TAG_COLORS: Record<string, string> = {
  'FULL STACK': '#4dd9e8',
  'SECURITY':   '#ff7b72',
  'AI / ML':    '#bc8cff',
}

const INTEREST_CARDS = [
  {
    icon: '🥊',
    title: 'Boxing & Muay Thai',
    accent: 'var(--amber)',
    body: 'Regular training sessions — discipline, composure under pressure, and the ability to take a hit and keep going.',
  },
  {
    icon: '♟',
    title: 'Chess',
    accent: 'var(--cyan)',
    body: 'Active on Chess.com. Rapid time controls mostly — pattern recognition and long-term positional thinking.',
  },
  {
    icon: '📚',
    title: 'Reading',
    accent: '#bc8cff',
    body: 'Alternates between technical deep-dives and psychology/decision-making. Currently: hacker handbook + Kahneman.',
  },
  {
    icon: '🏪',
    title: 'Entrepreneurship',
    accent: '#ff7b72',
    body: 'Founded Amirani Store — Afghan clothing shipped to Belgium, marketed via TikTok. Operated 2024–2026, then sold.',
  },
] as const

const COURSEWORK = [
  'Data Structures & Algorithms',
  'Database Systems',
  'Web Engineering',
  'Machine Learning',
  'Human-Computer Interaction',
  'Compiler Construction',
  'Professional Practices',
  'Theory of Computation',
] as const

/* ═══════════════════════════════════════════════════════════
   ROOT
   ═══════════════════════════════════════════════════════════ */
export default function AboutPageClient() {
  return (
    <main>

      {/* ── 01 HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-[65vh] flex flex-col justify-center pt-40 pb-28 px-[7vw] dot-grid">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8 max-w-3xl"
        >
          <motion.p
            variants={fadeUp}
            className="font-mono text-xs tracking-[0.2em] uppercase flex items-center gap-2"
            style={{ color: 'var(--cyan)' }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)' }}
              aria-hidden="true"
            />
            about
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="kinetic"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)' }}
          >
            <span className="line"><span className="show">Engineer.</span></span>
            <span className="line">
              <span className="show">Builder. <span className="accent">Hacker.</span></span>
            </span>
          </motion.h1>

          <motion.div variants={stagger} className="flex flex-col gap-5 max-w-2xl">
            {PERSONAL.bio.map((para, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                className="text-base leading-relaxed"
                style={{ color: 'var(--dim)' }}
              >
                {para}
              </motion.p>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-5 pt-1">
            <a
              href={SOCIAL.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs transition-opacity duration-200 hover:opacity-70"
              style={{ color: 'var(--cyan)' }}
            >
              <GithubIcon />
              {SOCIAL.githubHandle}
            </a>
            <span aria-hidden="true" style={{ color: 'var(--line)' }}>·</span>
            <a
              href={SOCIAL.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs transition-opacity duration-200 hover:opacity-70"
              style={{ color: 'var(--cyan)' }}
            >
              <LinkedinIcon />
              {SOCIAL.linkedinHandle}
            </a>
            <span aria-hidden="true" style={{ color: 'var(--line)' }}>·</span>
            <a
              href={`mailto:${PERSONAL.email}`}
              className="font-mono text-xs transition-opacity duration-200 hover:opacity-70"
              style={{ color: 'var(--dim)' }}
            >
              {PERSONAL.email}
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 02 AT A GLANCE ───────────────────────────────────── */}
      <section
        className="border-t border-b px-[7vw]"
        style={{
          borderColor: 'var(--line)',
          background: 'var(--bg-soft)',
          paddingTop: 'clamp(4rem, 7vw, 6rem)',
          paddingBottom: 'clamp(4rem, 7vw, 6rem)',
        }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="section-label"
        >
          <span className="idx">01</span>
          <h2>At a Glance</h2>
          <span className="rule" />
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5"
        >
          {STATUS_ITEMS.map(({ num, label, value }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="group flex gap-4 items-start pl-4 border-l-2 py-2 transition-colors duration-300"
              style={{ borderColor: 'var(--line)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--amber)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
            >
              <span className="font-mono text-xs mt-0.5 shrink-0" style={{ color: 'var(--dim-2)' }}>
                {num}
              </span>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-mono text-[0.65rem] tracking-widest uppercase" style={{ color: 'var(--dim-2)' }}>
                  {label}
                </span>
                <span className="text-sm break-words" style={{ color: 'var(--dim)' }}>
                  {value}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 03 WHAT GETS BUILT ───────────────────────────────── */}
      <section className="relative py-24 md:py-32 px-[7vw]" style={{ background: 'var(--bg)' }}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="section-label"
        >
          <span className="idx">02</span>
          <h2>What Gets Built</h2>
          <span className="rule" />
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {DOMAIN_CARDS.map((card) => (
            <InlineDomainCard key={card.id} card={card} />
          ))}
        </motion.div>
      </section>

      {/* ── 04 CURRENTLY READING + WRITING SOON ─────────────── */}
      <section
        id="currently"
        className="relative border-t border-b px-[7vw]"
        style={{
          borderColor: 'var(--line)',
          background: 'var(--bg-soft)',
          paddingTop: 'clamp(4rem, 7vw, 6rem)',
          paddingBottom: 'clamp(4rem, 7vw, 6rem)',
        }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="section-label"
        >
          <span className="idx">03</span>
          <h2>Currently</h2>
          <span className="rule" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">

          {/* LEFT — books */}
          <div className="flex flex-col gap-8">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="font-mono text-xs tracking-[0.18em] uppercase"
              style={{ color: 'var(--cyan)' }}
            >
              Reading
            </motion.p>

            <motion.div
              variants={staggerFast}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="flex flex-col gap-4"
            >
              {CURRENTLY.reading.map((book, i) => (
                <motion.div
                  key={book.title}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
                  }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="magnetic flex gap-5 p-5 rounded border"
                  style={{
                    background: 'var(--bg)',
                    borderColor: 'var(--line)',
                    borderLeft: `3px solid ${SPINE_COLORS[i % SPINE_COLORS.length]}`,
                  }}
                >
                  {/* spine accent */}
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <h3 className="font-display font-bold text-sm leading-snug" style={{ color: 'var(--ink)' }}>
                      {book.title}
                    </h3>
                    <span className="font-mono text-xs" style={{ color: 'var(--dim-2)' }}>
                      {book.author}
                    </span>
                    <p className="text-xs leading-relaxed pt-2" style={{ color: 'var(--dim)' }}>
                      {READING_NOTES[book.title] ?? 'Currently working through this one.'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* also building */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="flex flex-col gap-3 pl-4 border-l-2"
              style={{ borderColor: 'var(--amber)' }}
            >
              <span className="font-mono text-[0.65rem] tracking-widest uppercase" style={{ color: 'var(--amber)' }}>
                Currently Building
              </span>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm" style={{ color: 'var(--dim)' }}>
                  <span style={{ color: 'var(--cyan)' }}>→</span> Real Estate AI Search Tool
                </span>
                <span className="text-sm" style={{ color: 'var(--dim)' }}>
                  <span style={{ color: 'var(--cyan)' }}>→</span> Z Context Switcher (Chrome Extension)
                </span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — writing soon */}
          <div className="flex flex-col gap-8">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="font-mono text-xs tracking-[0.18em] uppercase"
              style={{ color: 'var(--dim-2)' }}
            >
              Writing Soon
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="rounded border p-6 md:p-8 flex flex-col gap-6 flex-1"
              style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="font-display font-bold leading-tight"
                  style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', color: 'var(--dim-2)' }}
                >
                  Coming Soon
                </span>
                <span className="cursor-blink font-display font-bold text-2xl" style={{ color: 'var(--cyan)' }} aria-hidden="true">
                  _
                </span>
              </div>

              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="flex flex-col gap-3"
              >
                {DRAFT_POSTS.map(({ title, tag }) => (
                  <motion.div
                    key={title}
                    variants={{
                      hidden: { opacity: 0, x: 14 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                    }}
                    className="flex items-start gap-3 py-2 border-b"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    <span
                      className="font-mono text-[0.58rem] tracking-widest px-1.5 py-0.5 rounded border shrink-0 mt-0.5"
                      style={{
                        color: TAG_COLORS[tag],
                        borderColor: TAG_COLORS[tag],
                        background: `${TAG_COLORS[tag]}14`,
                      }}
                    >
                      {tag}
                    </span>
                    <p className="font-mono text-xs leading-relaxed" style={{ color: 'var(--dim)' }}>
                      {title}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              <p className="font-mono text-xs italic" style={{ color: 'var(--dim-2)' }}>
                &ldquo;First posts dropping this summer.&rdquo;
              </p>

              <Button
                href={`https://mail.google.com/mail/?view=cm&to=${PERSONAL.email}&su=${encodeURIComponent('Notify me when the blog drops')}&body=${encodeURIComponent('Hey Wali — let me know when your first post is up!')}`}
                variant="secondary"
                size="sm"
                icon="external"
                external
              >
                NOTIFY ME
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 05 OUTSIDE OF CODE ───────────────────────────────── */}
      <section
        className="relative border-t py-24 md:py-32 px-[7vw]"
        style={{ borderColor: 'var(--line)', background: 'var(--bg)' }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="section-label"
        >
          <span className="idx">04</span>
          <h2>Outside of Code</h2>
          <span className="rule" />
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {INTEREST_CARDS.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex flex-col gap-4 p-5 rounded border"
              style={{ borderColor: 'var(--line)', background: 'var(--bg-soft)', borderTop: `2px solid ${card.accent}` }}
            >
              <span className="text-2xl" aria-hidden="true">{card.icon}</span>
              <h3 className="font-display font-semibold text-sm leading-snug" style={{ color: 'var(--ink)' }}>
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--dim)' }}>
                {card.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 06 EDUCATION ─────────────────────────────────────── */}
      <section
        className="relative border-t border-b py-24 md:py-32 px-[7vw]"
        style={{ borderColor: 'var(--line)', background: 'var(--bg-soft)' }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="section-label"
        >
          <span className="idx">05</span>
          <h2>Education</h2>
          <span className="rule" />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 max-w-4xl"
        >
          {/* Degree card */}
          <div
            className="rounded border-l-4 p-8 flex flex-col gap-4"
            style={{
              borderColor: 'var(--amber)',
              background: 'var(--bg)',
              boxShadow: '0 0 24px rgba(255,177,61,0.07)',
            }}
          >
            <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--amber)' }}>
              {PERSONAL.session}
            </span>
            <h3
              className="font-display font-bold leading-snug"
              style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', color: 'var(--ink)' }}
            >
              {PERSONAL.degree}
            </h3>
            <p className="font-mono text-sm" style={{ color: 'var(--cyan)' }}>
              {PERSONAL.university}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--dim)' }}>
              Peshawar, Pakistan · 6th Semester · 87 credit hours completed.
              Focus on systems, security, and applied machine learning.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button href="/#contact" variant="primary" size="sm">
                GET IN TOUCH
              </Button>
              <Button href="/projects" variant="secondary" size="sm" icon="right">
                SEE PROJECTS
              </Button>
            </div>
          </div>

          {/* Coursework */}
          <div className="flex flex-col gap-4">
            <span
              className="font-mono text-[0.65rem] tracking-[0.2em] uppercase"
              style={{ color: 'var(--dim-2)' }}
            >
              Notable Coursework
            </span>
            <div className="flex flex-col">
              {COURSEWORK.map((course, i) => (
                <div
                  key={course}
                  className="flex items-center gap-3 py-2.5 border-b"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <span className="font-mono text-xs shrink-0" style={{ color: 'var(--dim-2)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--dim)' }}>
                    {course}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

    </main>
  )
}

/* ── inline domain card ─────────────────────────────────── */
function InlineDomainCard({
  card,
}: {
  card: { id: string; icon: string; title: string; body: string; tags: readonly string[] }
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{
        y: -4,
        borderColor: 'var(--amber)',
        boxShadow: '0 0 20px rgba(255,177,61,0.1)',
        transition: { duration: 0.2 },
      }}
      className="magnetic flex flex-col gap-4 p-5 rounded border cursor-default"
      style={{ borderColor: 'var(--line)', background: 'var(--bg-soft)' }}
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

/* ── icons ──────────────────────────────────────────────── */
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
