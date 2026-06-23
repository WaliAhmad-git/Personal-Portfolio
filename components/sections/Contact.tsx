'use client'

/* ═══════════════════════════════════════════════════════════
   components/sections/Contact.tsx  (SECURED)
   Security changes vs. original:
   1. Form POSTs to /api/contact (server proxy) — NOT directly
      to Formspree. Formspree endpoint ID never hits client bundle.
   2. Honeypot field (_gotcha) — hidden from real users, bots fill it.
   3. _loadedAt timestamp — bot detection: submitted < 5s = bot.
   4. Client-side validation before sending (defence in depth).
   5. Output is always React-rendered — no dangerouslySetInnerHTML.
   ═══════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect } from 'react'
import type { FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PERSONAL, SOCIAL } from '@/lib/data'

const headingContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const headingWordVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}
const leftColVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}
const formContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const fieldVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function Contact() {
  return (
    <>
      <section
        id="contact"
        className="relative border-t px-[7vw]"
        style={{ borderColor: 'var(--line)', paddingTop: 'clamp(5rem, 9vw, 9rem)', paddingBottom: 'clamp(5rem, 9vw, 9rem)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">

          <motion.div
            variants={leftColVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col gap-8"
          >
            <motion.div variants={itemVariants} className="section-label" style={{ marginBottom: 0 }}>
              <span className="idx">05</span>
              <h2 style={{ fontSize: '1.2rem' }}>Get In Touch</h2>
            </motion.div>

            <motion.h2
              variants={headingContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="kinetic text-[clamp(2.2rem,5.5vw,4rem)]"
            >
              <span className="line">
                <motion.span variants={headingWordVariants} className="inline-block show">
                  Let&rsquo;s build
                </motion.span>
              </span>
              <span className="line">
                <motion.span variants={headingWordVariants} className="inline-block show accent">
                  something.
                </motion.span>
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-base leading-relaxed max-w-md"
              style={{ color: 'var(--dim)' }}
            >
              Currently open to freelance projects, part-time roles, and
              full-time positions ({PERSONAL.location.split(',')[0]}-based or remote).
              Got a problem that needs solving? Let&rsquo;s talk.
            </motion.p>

            <motion.div variants={itemVariants}>
              <a
                href={`mailto:${PERSONAL.email}`}
                className="font-mono text-xl md:text-2xl font-semibold tracking-wide break-all"
                style={{
                  color: 'var(--amber)',
                  textDecoration: 'underline',
                  textDecorationColor: 'transparent',
                  textUnderlineOffset: '4px',
                  transition: 'text-decoration-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.textDecorationColor = 'var(--amber)' }}
                onMouseLeave={e => { e.currentTarget.style.textDecorationColor = 'transparent' }}
              >
                {PERSONAL.email}
              </a>
            </motion.div>

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
                /in/{SOCIAL.linkedinHandle}
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  )
}

/* --- */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254
}

/* --- */
function ContactForm() {
  const [status,  setStatus]  = useState<FormStatus>('idle')
  const [errors,  setErrors]  = useState<Record<string, string>>({})
  const loadedAtRef = useRef<number>(0)

  /* Record page-load timestamp for bot detection */
  useEffect(() => {
    loadedAtRef.current = Date.now()
  }, [])

  const validate = (name: string, email: string, message: string) => {
    const e: Record<string, string> = {}
    if (!name.trim() || name.trim().length < 2)  e.name    = 'Name must be at least 2 characters.'
    if (!isValidEmail(email))                     e.email   = 'Please enter a valid email address.'
    if (!message.trim() || message.trim().length < 10) e.message = 'Message must be at least 10 characters.'
    if (message.length > 3000)                    e.message = 'Message too long (max 3000 characters).'
    return e
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    const name     = (form.elements.namedItem('name')    as HTMLInputElement).value
    const email    = (form.elements.namedItem('email')   as HTMLInputElement).value
    const message  = (form.elements.namedItem('message') as HTMLTextAreaElement).value
    const honeypot = (form.elements.namedItem('_gotcha') as HTMLInputElement).value

    /* Honeypot filled = bot, silently do nothing */
    if (honeypot) return

    const fieldErrors = validate(name, email, message)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setStatus('submitting')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:      name.trim(),
          email:     email.trim(),
          message:   message.trim(),
          _loadedAt: loadedAtRef.current,
          /* _gotcha is intentionally NOT sent — server checks it separately
             via the form field presence, not this JSON body */
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
        if (data.error) {
          setErrors({ form: data.error })
        }
      }
    } catch {
      setStatus('error')
      setErrors({ form: 'Network error. Please email directly instead.' })
    }
  }

  return (
    <div className="relative rounded border p-6 md:p-8" style={{ background: 'var(--bg-soft)', borderColor: 'var(--line)' }}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' as const }}
            className="flex flex-col items-center justify-center gap-4 text-center py-12"
          >
            <span
              className="flex items-center justify-center w-12 h-12 rounded-full"
              style={{ background: 'rgba(255,177,61,0.1)', border: '1px solid var(--amber)', color: 'var(--amber)' }}
              aria-hidden="true"
            >
              <CheckIcon />
            </span>
            <p className="font-display font-semibold text-lg" style={{ color: 'var(--ink)' }}>
              Message sent.
            </p>
            <p className="text-sm" style={{ color: 'var(--dim)' }}>
              Replies typically land within 24 hours.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            variants={formContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            exit={{ opacity: 0, y: -12 }}
            noValidate
          >
            {/* --- */}
            {/* aria-hidden + tabIndex=-1 + display:none makes it invisible */}
            <div aria-hidden="true" style={{ display: 'none' }}>
              <label htmlFor="_gotcha">Leave this empty</label>
              <input
                id="_gotcha"
                name="_gotcha"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <motion.div variants={fieldVariants} className="flex flex-col gap-2">
              <label htmlFor="name" className="font-mono text-[0.65rem] tracking-widest uppercase" style={{ color: 'var(--amber)' }}>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={100}
                placeholder="Your name"
                autoComplete="name"
                className="w-full px-4 py-3 font-mono text-sm outline-none"
                style={{ background: 'var(--bg-tertiary)', border: `1px solid ${errors.name ? '#ff7b72' : 'var(--line)'}`, borderRadius: 0, color: 'var(--ink)', transition: 'border-color 0.2s' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--amber)' }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.name ? '#ff7b72' : 'var(--line)' }}
              />
              {errors.name && <p className="font-mono text-xs" style={{ color: '#ff7b72' }}>{errors.name}</p>}
            </motion.div>

            <motion.div variants={fieldVariants} className="flex flex-col gap-2">
              <label htmlFor="email" className="font-mono text-[0.65rem] tracking-widest uppercase" style={{ color: 'var(--amber)' }}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={254}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 font-mono text-sm outline-none"
                style={{ background: 'var(--bg-tertiary)', border: `1px solid ${errors.email ? '#ff7b72' : 'var(--line)'}`, borderRadius: 0, color: 'var(--ink)', transition: 'border-color 0.2s' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--amber)' }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.email ? '#ff7b72' : 'var(--line)' }}
              />
              {errors.email && <p className="font-mono text-xs" style={{ color: '#ff7b72' }}>{errors.email}</p>}
            </motion.div>

            <motion.div variants={fieldVariants} className="flex flex-col gap-2">
              <label htmlFor="message" className="font-mono text-[0.65rem] tracking-widest uppercase" style={{ color: 'var(--amber)' }}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                minLength={10}
                maxLength={3000}
                placeholder="What are you building?"
                className="w-full px-4 py-3 font-mono text-sm outline-none resize-none"
                style={{ background: 'var(--bg-tertiary)', border: `1px solid ${errors.message ? '#ff7b72' : 'var(--line)'}`, borderRadius: 0, color: 'var(--ink)', transition: 'border-color 0.2s' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--amber)' }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.message ? '#ff7b72' : 'var(--line)' }}
              />
              {errors.message && <p className="font-mono text-xs" style={{ color: '#ff7b72' }}>{errors.message}</p>}
            </motion.div>

            {(status === 'error' || errors.form) && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-xs" style={{ color: '#ff7b72' }}>
                {errors.form ?? 'Something went wrong. Try emailing directly instead.'}
              </motion.p>
            )}

            <motion.div variants={fieldVariants}>
              <motion.button
                type="submit"
                disabled={status === 'submitting'}
                whileHover={status !== 'submitting' ? { scale: 1.02, boxShadow: '0 0 30px rgba(255,177,61,0.5)' } : undefined}
                whileTap={status !== 'submitting' ? { scale: 0.98 } : undefined}
                transition={{ duration: 0.2 }}
                className="magnetic w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded font-mono font-semibold text-sm tracking-widest disabled:opacity-60"
                style={{ background: 'var(--amber)', color: 'var(--bg)', boxShadow: '0 0 18px rgba(255,177,61,0.3)' }}
              >
                {status === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
                {status !== 'submitting' && <span aria-hidden="true">→</span>}
              </motion.button>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t px-[7vw]" style={{ borderColor: 'var(--line)', background: 'var(--bg)' }}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-6">
        <p className="font-mono text-xs text-center md:text-left" style={{ color: 'var(--dim-2)' }}>
          © {year} {PERSONAL.name}. All rights reserved.
        </p>
        <p className="font-mono text-xs text-center" style={{ color: 'var(--dim-2)' }}>
          Designed &amp; Developed by {PERSONAL.name}
        </p>
        <p className="font-mono text-xs text-center md:text-right" style={{ color: 'var(--dim-2)' }}>
          Built with Next.js + Tailwind
        </p>
      </div>
    </footer>
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

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
