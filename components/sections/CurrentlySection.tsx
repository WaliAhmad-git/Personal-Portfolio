'use client'

/* ═══════════════════════════════════════════════════════════
   components/sections/CurrentlySection.tsx
   Module 8 — Currently Reading + Blog Teaser. Restyled spines/
   accents to amber/cyan; content unchanged from data.ts.
   ═══════════════════════════════════════════════════════════ */

import { motion } from 'framer-motion'
import { CURRENTLY, PERSONAL } from '@/lib/data'
import Button from '@/components/ui/Button'

const SPINE_COLORS = ['#4dd9e8', '#bc8cff', '#ff7b72', '#ffb13d'] as const

const READING_NOTES: Record<string, string> = {
  "The Web Application Hacker's Handbook":
    'The bible of web app exploitation — feeding directly into the SIEM FYP.',
  'Thinking, Fast and Slow':
    'Cognitive biases and how the brain actually works.',
}

const DRAFT_POSTS = [
  'Building a POS system for a UK grocery store',
  'Penetration testing a live LMS: key findings',
  'Building an AI meeting bot with Deepgram + Gemini',
] as const

const sectionHeaderVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
}
const bookContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const bookCardVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}
const draftContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
}
const draftItemVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

export default function CurrentlySection() {
  return (
    <section
      id="currently"
      className="relative border-t border-b px-[7vw]"
      style={{ borderColor: 'var(--line)', background: 'var(--bg-soft)', paddingTop: 'clamp(5rem, 9vw, 9rem)', paddingBottom: 'clamp(5rem, 9vw, 9rem)' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">

        <div className="flex flex-col gap-8">
          <motion.div
            variants={sectionHeaderVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="section-label"
            style={{ marginBottom: 0 }}
          >
            <span className="idx">04</span>
            <h2 style={{ fontSize: '1.4rem' }}>Currently Reading</h2>
            <span className="rule" />
          </motion.div>

          <motion.div
            variants={bookContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-wrap gap-4"
          >
            {CURRENTLY.reading.map((book, i) => (
              <BookCard
                key={book.title}
                title={book.title}
                author={book.author}
                note={READING_NOTES[book.title] ?? 'Currently working through this one.'}
                spineColor={SPINE_COLORS[i % SPINE_COLORS.length]}
              />
            ))}
          </motion.div>
        </div>

        <div className="flex flex-col gap-8">
          <motion.div
            variants={sectionHeaderVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <MutedLabel>WRITING SOON</MutedLabel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: 'easeOut' as const }}
            className="rounded border p-6 md:p-8 flex flex-col gap-6 flex-1"
            style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}
          >
            <span className="font-display font-bold text-[clamp(1.4rem,3vw,1.9rem)] leading-tight" style={{ color: 'var(--dim-2)' }}>
              Coming Soon
              <span className="cursor-blink" aria-hidden="true">_</span>
            </span>

            <motion.div
              variants={draftContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="flex flex-col gap-3"
            >
              {DRAFT_POSTS.map((title) => (
                <motion.p
                  key={title}
                  variants={draftItemVariants}
                  className="font-mono text-sm leading-snug"
                  style={{ color: 'var(--dim)', opacity: 0.6 }}
                >
                  <span style={{ color: 'var(--cyan)' }}>→</span> {title}
                </motion.p>
              ))}
            </motion.div>

            <p className="font-mono text-xs italic" style={{ color: 'var(--dim-2)' }}>
              &ldquo;First posts dropping this summer.&rdquo;
            </p>

            <div>
              <Button href={notifyMeHref(PERSONAL.email)} variant="secondary" size="sm" icon="external" external>
                NOTIFY ME
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function notifyMeHref(email: string) {
  return `https://mail.google.com/mail/?view=cm&to=${email}&su=${encodeURIComponent(
    'Notify me when the blog drops'
  )}&body=${encodeURIComponent('Hey Wali — let me know when your first post is up!')}`
}

function BookCard({
  title,
  author,
  note,
  spineColor,
}: {
  title: string
  author: string
  note: string
  spineColor: string
}) {
  return (
    <motion.div
      variants={bookCardVariants}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="magnetic flex-1 min-w-[200px] rounded p-4 flex flex-col gap-2 border"
      style={{ background: 'var(--bg)', borderColor: 'var(--line)', borderLeft: `3px solid ${spineColor}` }}
    >
      <h3 className="font-display font-bold text-sm leading-snug" style={{ color: 'var(--ink)' }}>
        {title}
      </h3>
      <span className="text-xs" style={{ color: 'var(--dim-2)' }}>{author}</span>
      <p className="text-xs leading-relaxed pt-1" style={{ color: 'var(--dim)' }}>
        {note}
      </p>
    </motion.div>
  )
}

function MutedLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-block rounded-full shrink-0" style={{ width: 8, height: 8, background: 'var(--dim-2)' }} aria-hidden="true" />
      <span className="font-display font-semibold text-xs tracking-[0.15em] uppercase" style={{ color: 'var(--dim-2)' }}>
        {children}
      </span>
      <span className="flex-1 h-px" style={{ maxWidth: 60, background: 'var(--line)' }} aria-hidden="true" />
    </div>
  )
}
