'use client'

/* ═══════════════════════════════════════════════════════════
   components/sections/ProjectDetailCard.tsx
   Left panel now renders purpose-built SVG icons per project
   instead of screenshots. No broken image fallbacks.
   ═══════════════════════════════════════════════════════════ */

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import type { Project } from '@/lib/data'

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
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

const TERMINAL_NOTES: Record<string, string[]> = {
  'makkah-pos': [
    '→ 14-table PostgreSQL schema w/ stored procedures + soft deletes',
    '→ Six modules: auth, inventory, sales, VAT, receipts, reporting',
    '→ Zero JS frameworks — Vanilla JS, Apache on port 8081, Fedora Linux',
  ],
  'virtual-avatar': [
    '→ Deepgram STT → Gemini LLM → edge-tts pipeline, <2s latency',
    '→ PipeWire virtual mic — bot speaks audibly inside Google Meet',
    '→ Multi-Gemini-key fallback + OBS virtual camera for visual presence',
  ],
  'amirani-store': [
    '→ Custom order form + WhatsApp confirmation flow',
    '→ TikTok-linked marketing pages tied to social funnel',
    '→ Shipped to Belgium — real orders, real revenue, sold 2026',
  ],
  'portfolio': [
    '→ Matter.js physics simulation for tech stack visualization',
    '→ Framer Motion scroll animations + custom magnetic cursor',
    '→ Server/client component boundary — metadata SEO + interactivity',
  ],
  'text-to-braille': [
    '→ 6-pin solenoid array mapped to Braille dot positions',
    '→ Serial-driven character input → binary dot pattern lookup',
    '→ First hardware project — software logic meets physical actuators',
  ],
  'real-estate-ai': [
    '→ Natural language query → HuggingFace model → filtered listings',
    '→ Leaflet.js interactive map with real-time result plotting',
    '→ FastAPI + PostgreSQL backend, independently scoped and built',
  ],
  'z-context-switcher': [
    '→ 75% token-threshold detection triggers proactive warning banner',
    '→ Offline compression algorithm + optional Gemini API fidelity path',
    '→ Preview-before-inject flow for safe context handoff',
  ],
  'seizure-ml': [
    '→ 3 EEG datasets, 2 preprocessing pipelines, stratified 60/20/20 split',
    '→ L1 vs L2 vs Elastic Net regularisation compared on PR-AUC',
    '→ SMOTE, undersampling, class weighting tested for imbalance handling',
  ],
}

interface Props {
  project: Project
  index: number
}

export default function ProjectDetailCard({ project, index }: Props) {
  const badge      = BADGE_COLORS[project.category]
  const badgeLabel = BADGE_LABELS[project.category]
  const padNum     = String(index + 1).padStart(2, '0')
  const notes      = TERMINAL_NOTES[project.id] ?? []

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="relative grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-0 rounded border overflow-hidden"
      style={{ borderColor: 'var(--line)', background: 'var(--bg-soft)' }}
    >
      {/* LEFT — SVG icon panel */}
      <ProjectIcon id={project.id} padNum={padNum} year={project.year} />

      {/* RIGHT — content */}
      <div className="flex flex-col gap-6 p-8">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[0.62rem] tracking-widest border w-fit"
              style={{ color: badge.color, background: badge.bg, borderColor: badge.border }}
            >
              {badgeLabel}
            </span>
            <h2
              className="font-display font-bold leading-tight"
              style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)', color: 'var(--ink)' }}
            >
              {project.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap shrink-0">
            <Button href={project.githubUrl} variant="secondary" size="sm" icon="external" external>
              GITHUB
            </Button>
            {project.liveUrl && (
              <Button href={project.liveUrl} variant="primary" size="sm" icon="external" external>
                LIVE
              </Button>
            )}
          </div>
        </div>

        {/* Long description */}
        <p className="text-sm leading-relaxed" style={{ color: 'var(--dim)', maxWidth: '72ch' }}>
          {project.longDescription}
        </p>

        {/* Terminal notes */}
        {notes.length > 0 && (
          <div
            className="rounded border p-4 font-mono text-xs leading-relaxed"
            style={{ borderColor: 'var(--line)', background: 'var(--bg)', color: 'var(--cyan)' }}
          >
            <span className="block mb-2" style={{ color: 'var(--dim-2)' }}>
              $ cat {project.id}.notes
            </span>
            {notes.map((line, i) => (
              <span key={i} className="block" style={{ color: 'var(--dim)' }}>
                {line}
              </span>
            ))}
          </div>
        )}

        {/* Stack pills */}
        <div className="flex flex-col gap-2">
          <span
            className="font-mono text-[0.62rem] tracking-[0.18em] uppercase"
            style={{ color: 'var(--dim-2)' }}
          >
            Stack
          </span>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span key={tech} className="tag-pill">{tech}</span>
            ))}
          </div>
        </div>

        {/* Footer note */}
        {!project.liveUrl && (
          <p className="font-mono text-[0.65rem] tracking-widest" style={{ color: 'var(--dim-2)' }}>
            {project.id === 'makkah-pos'
              ? '// Production system — no public demo'
              : project.id === 'portfolio'
              ? '// You are looking at it right now'
              : project.id === 'amirani-store'
              ? '// Business sold in 2026 — no live URL'
              : '// No public demo available'}
          </p>
        )}
      </div>
    </motion.article>
  )
}

/* ── Per-project SVG icon panels ─────────────────────────── */
function ProjectIcon({ id, padNum, year }: { id: string; padNum: string; year: string }) {
  return (
    <div
      className="relative flex items-center justify-center border-b lg:border-b-0 lg:border-r overflow-hidden"
      style={{ borderColor: 'var(--line)', background: 'var(--bg)', minHeight: '280px' }}
    >
      {/* Ghost number */}
      <span
        className="absolute top-4 left-5 font-mono font-bold select-none pointer-events-none leading-none z-10"
        style={{ fontSize: '5rem', color: 'var(--ink)', opacity: 0.05 }}
        aria-hidden="true"
      >
        {padNum}
      </span>

      {/* Icon */}
      <div className="relative z-10 flex items-center justify-center w-full h-full p-10">
        {id === 'makkah-pos'    && <POSIcon />}
        {id === 'virtual-avatar' && <AvatarIcon />}
        {id === 'amirani-store' && <StoreIcon />}
        {id === 'portfolio'     && <PortfolioIcon />}
        {id === 'text-to-braille'     && <BrailleIcon />}
        {id === 'real-estate-ai'     && <RealEstateIcon />}
        {id === 'z-context-switcher' && <ContextSwitcherIcon />}
        {id === 'seizure-ml'          && <SeizureIcon />}
      </div>

      {/* Year */}
      <span
        className="absolute bottom-4 right-5 font-mono text-xs tracking-widest z-10"
        style={{ color: 'var(--dim-2)' }}
      >
        {year}
      </span>
    </div>
  )
}

/* POS System — register / receipt icon */
function POSIcon() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Screen */}
      <rect x="20" y="16" width="120" height="76" rx="6" stroke="#4dd9e8" strokeWidth="2.5" fill="rgba(77,217,232,0.06)" />
      {/* Screen inner lines */}
      <line x1="32" y1="32" x2="80" y2="32" stroke="#4dd9e8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="32" y1="44" x2="96" y2="44" stroke="#23232b" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <rect x="32" y="54" width="36" height="8" rx="2" fill="rgba(77,217,232,0.15)" stroke="#4dd9e8" strokeWidth="1" />
      <rect x="76" y="54" width="36" height="8" rx="2" fill="rgba(255,177,61,0.15)" stroke="#ffb13d" strokeWidth="1" />
      <line x1="32" y1="72" x2="128" y2="72" stroke="#23232b" strokeWidth="1" opacity="0.5" />
      <line x1="32" y1="80" x2="100" y2="80" stroke="#23232b" strokeWidth="1" opacity="0.5" />
      {/* Stand */}
      <line x1="80" y1="92" x2="80" y2="108" stroke="#4a4a52" strokeWidth="3" strokeLinecap="round" />
      <line x1="56" y1="108" x2="104" y2="108" stroke="#4a4a52" strokeWidth="3" strokeLinecap="round" />
      {/* Keypad */}
      {[0,1,2].map(row =>
        [0,1,2].map(col => (
          <rect
            key={`${row}-${col}`}
            x={56 + col * 18}
            y={116 + row * 12}
            width="12"
            height="8"
            rx="2"
            fill={row === 2 && col === 2 ? 'rgba(255,177,61,0.4)' : 'rgba(77,217,232,0.1)'}
            stroke={row === 2 && col === 2 ? '#ffb13d' : '#23232b'}
            strokeWidth="1"
          />
        ))
      )}
      {/* GBP symbol */}
      <text x="116" y="132" fontFamily="monospace" fontSize="14" fill="#ffb13d" opacity="0.9">£</text>
    </svg>
  )
}

/* Z Avatar — waveform + bot icon */
function AvatarIcon() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Outer ring */}
      <circle cx="80" cy="68" r="38" stroke="#bc8cff" strokeWidth="2" fill="rgba(188,140,255,0.05)" />
      {/* Bot face */}
      <circle cx="80" cy="68" r="26" fill="rgba(188,140,255,0.1)" stroke="#bc8cff" strokeWidth="1.5" />
      {/* Eyes */}
      <circle cx="70" cy="64" r="4" fill="#bc8cff" opacity="0.9" />
      <circle cx="90" cy="64" r="4" fill="#bc8cff" opacity="0.9" />
      {/* Pupil glow */}
      <circle cx="70" cy="64" r="2" fill="white" opacity="0.6" />
      <circle cx="90" cy="64" r="2" fill="white" opacity="0.6" />
      {/* Mouth / speaker */}
      <rect x="68" y="74" width="24" height="5" rx="2.5" fill="rgba(188,140,255,0.4)" stroke="#bc8cff" strokeWidth="1" />
      {/* Antenna */}
      <line x1="80" y1="30" x2="80" y2="42" stroke="#bc8cff" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="80" cy="27" r="3" fill="#bc8cff" opacity="0.8" />
      {/* Sound wave lines left */}
      <path d="M 28 68 Q 34 58 34 68 Q 34 78 28 68" stroke="#4dd9e8" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />
      <path d="M 18 68 Q 26 50 26 68 Q 26 86 18 68" stroke="#4dd9e8" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
      {/* Sound wave lines right */}
      <path d="M 132 68 Q 126 58 126 68 Q 126 78 132 68" stroke="#4dd9e8" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />
      <path d="M 142 68 Q 134 50 134 68 Q 134 86 142 68" stroke="#4dd9e8" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
      {/* Bottom waveform bar */}
      {[0,1,2,3,4,5,6,7,8].map((i) => {
        const heights = [6,12,18,10,22,14,8,16,6]
        const h = heights[i]
        return (
          <rect
            key={i}
            x={36 + i * 11}
            y={116 - h / 2}
            width="7"
            height={h}
            rx="3.5"
            fill="#bc8cff"
            opacity={0.3 + (i % 3) * 0.2}
          />
        )
      })}
      {/* Label */}
      <text x="80" y="148" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#bc8cff" opacity="0.6" letterSpacing="3">Z AVATAR</text>
    </svg>
  )
}

/* Amirani Store — clothing / hanger icon */
function StoreIcon() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Hanger hook */}
      <path d="M 80 22 A 10 10 0 0 1 90 32" stroke="#ffb13d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="90" y1="32" x2="80" y2="48" stroke="#ffb13d" strokeWidth="2.5" strokeLinecap="round" />
      {/* Hanger arms */}
      <path d="M 80 48 L 30 80 L 30 88" stroke="#ffb13d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 80 48 L 130 80 L 130 88" stroke="#ffb13d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Garment body */}
      <path
        d="M 30 88 L 30 138 Q 30 142 34 142 L 126 142 Q 130 142 130 138 L 130 88 Z"
        fill="rgba(255,177,61,0.08)"
        stroke="#ffb13d"
        strokeWidth="2"
      />
      {/* Collar V */}
      <path d="M 62 88 L 80 108 L 98 88" stroke="#ffb13d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Fabric pattern lines */}
      <line x1="44" y1="100" x2="44" y2="130" stroke="#ffb13d" strokeWidth="1" opacity="0.2" />
      <line x1="58" y1="100" x2="58" y2="130" stroke="#ffb13d" strokeWidth="1" opacity="0.2" />
      <line x1="102" y1="100" x2="102" y2="130" stroke="#ffb13d" strokeWidth="1" opacity="0.2" />
      <line x1="116" y1="100" x2="116" y2="130" stroke="#ffb13d" strokeWidth="1" opacity="0.2" />
      {/* WhatsApp ping dot */}
      <circle cx="126" cy="38" r="10" fill="rgba(37,211,102,0.15)" stroke="#25d366" strokeWidth="1.5" />
      <text x="126" y="43" textAnchor="middle" fontSize="10" fill="#25d366">✓</text>
      {/* TikTok note */}
      <circle cx="34" cy="38" r="10" fill="rgba(255,177,61,0.1)" stroke="#ffb13d" strokeWidth="1.5" />
      <text x="34" y="43" textAnchor="middle" fontSize="10" fill="#ffb13d">♪</text>
      {/* Label */}
      <text x="80" y="156" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#ffb13d" opacity="0.6" letterSpacing="3">AMIRANI</text>
    </svg>
  )
}

/* Portfolio — browser window + code icon */
function PortfolioIcon() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Browser chrome */}
      <rect x="16" y="28" width="128" height="100" rx="6" stroke="#4dd9e8" strokeWidth="2" fill="rgba(77,217,232,0.04)" />
      {/* Title bar */}
      <rect x="16" y="28" width="128" height="24" rx="6" fill="rgba(77,217,232,0.08)" stroke="#4dd9e8" strokeWidth="2" />
      <rect x="16" y="40" width="128" height="12" fill="rgba(77,217,232,0.08)" />
      {/* Traffic dots */}
      <circle cx="32" cy="40" r="4" fill="#ff7b72" opacity="0.7" />
      <circle cx="46" cy="40" r="4" fill="#ffb13d" opacity="0.7" />
      <circle cx="60" cy="40" r="4" fill="#4dd9e8" opacity="0.7" />
      {/* URL bar */}
      <rect x="74" y="34" width="58" height="12" rx="3" fill="rgba(255,255,255,0.04)" stroke="#23232b" strokeWidth="1" />
      <text x="103" y="43.5" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="#4a4a52">waliahmadhotak.dev</text>
      {/* Code lines inside browser */}
      <text x="28" y="68" fontFamily="monospace" fontSize="9" fill="#bc8cff" opacity="0.9">{'<WAH/>'}</text>
      <line x1="28" y1="78" x2="80" y2="78" stroke="#23232b" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="88" x2="96" y2="88" stroke="#23232b" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="98" x2="68" y2="98" stroke="#23232b" strokeWidth="1.5" strokeLinecap="round" />
      {/* Accent block */}
      <rect x="100" y="68" width="32" height="14" rx="3" fill="rgba(255,177,61,0.2)" stroke="#ffb13d" strokeWidth="1" />
      <text x="116" y="78.5" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="#ffb13d">AMBER</text>
      <rect x="100" y="88" width="32" height="14" rx="3" fill="rgba(77,217,232,0.15)" stroke="#4dd9e8" strokeWidth="1" />
      <text x="116" y="98.5" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="#4dd9e8">CYAN</text>
      {/* Matter.js dots hint */}
      {[0,1,2,3].map(i => (
        <circle key={i} cx={28 + i * 14} cy={116} r={3 + (i % 2)} fill="#4dd9e8" opacity={0.2 + i * 0.15} />
      ))}
      <text x="80" y="148" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#4dd9e8" opacity="0.5" letterSpacing="2">NEXT.JS 16 · TS · FM</text>
    </svg>
  )
}

/* Text-to-Braille Converter — Braille cell dot grid icon */
function BrailleIcon() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Outer cell boundary */}
      <rect x="40" y="20" width="80" height="116" rx="8" stroke="#4dd9e8" strokeWidth="1.5" fill="rgba(77,217,232,0.03)" opacity="0.4" />
      {/* 6-dot Braille cell — pattern for letter 'A' (100000) raised top-left */}
      {[
        { cx: 60, cy: 42, raised: true },
        { cx: 100, cy: 42, raised: false },
        { cx: 60, cy: 78, raised: false },
        { cx: 100, cy: 78, raised: false },
        { cx: 60, cy: 114, raised: false },
        { cx: 100, cy: 114, raised: false },
      ].map((dot, i) => (
        <g key={i}>
          <circle cx={dot.cx} cy={dot.cy} r="14" stroke="#4dd9e8" strokeWidth="1.5" fill={dot.raised ? 'rgba(77,217,232,0.25)' : 'rgba(77,217,232,0.04)'} opacity={dot.raised ? 1 : 0.35} />
          {dot.raised && <circle cx={dot.cx} cy={dot.cy} r="6" fill="#4dd9e8" opacity="0.8" />}
        </g>
      ))}
      {/* Pin/solenoid hint lines below cell */}
      <line x1="60" y1="128" x2="60" y2="138" stroke="#4a4a52" strokeWidth="2" strokeLinecap="round" />
      <line x1="100" y1="128" x2="100" y2="138" stroke="#4a4a52" strokeWidth="2" strokeLinecap="round" />
      {/* Label */}
      <text x="80" y="152" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#4dd9e8" opacity="0.6" letterSpacing="2">BRAILLE · A</text>
    </svg>
  )
}

/* Real Estate AI Search — map pin + house icon */
function RealEstateIcon() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Map base grid */}
      <rect x="18" y="18" width="124" height="100" rx="6" stroke="#bc8cff" strokeWidth="1.5" fill="rgba(188,140,255,0.03)" />
      <line x1="18" y1="48" x2="142" y2="48" stroke="#23232b" strokeWidth="1" opacity="0.5" />
      <line x1="18" y1="78" x2="142" y2="78" stroke="#23232b" strokeWidth="1" opacity="0.5" />
      <line x1="58" y1="18" x2="58" y2="118" stroke="#23232b" strokeWidth="1" opacity="0.4" />
      <line x1="102" y1="18" x2="102" y2="118" stroke="#23232b" strokeWidth="1" opacity="0.4" />
      {/* House shape inside map pin */}
      <path d="M 80 30 L 110 54 L 110 92 L 50 92 L 50 54 Z" fill="rgba(188,140,255,0.1)" stroke="#bc8cff" strokeWidth="2" strokeLinejoin="round" />
      <rect x="68" y="68" width="14" height="24" fill="rgba(188,140,255,0.2)" stroke="#bc8cff" strokeWidth="1.5" />
      <rect x="88" y="68" width="14" height="14" fill="rgba(77,217,232,0.15)" stroke="#4dd9e8" strokeWidth="1.5" />
      {/* Map pin marker below */}
      <path d="M 80 100 C 80 100 96 116 96 128 C 96 137 88.8 144 80 144 C 71.2 144 64 137 64 128 C 64 116 80 100 80 100 Z" fill="rgba(255,177,61,0.15)" stroke="#ffb13d" strokeWidth="2" />
      <circle cx="80" cy="124" r="6" fill="#ffb13d" opacity="0.8" />
      {/* Search magnifier accent top-right */}
      <circle cx="124" cy="32" r="8" stroke="#4dd9e8" strokeWidth="2" fill="none" />
      <line x1="130" y1="38" x2="136" y2="44" stroke="#4dd9e8" strokeWidth="2" strokeLinecap="round" />
      <text x="80" y="156" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#bc8cff" opacity="0.6" letterSpacing="2">REAL ESTATE AI</text>
    </svg>
  )
}

/* Z Context Switcher — browser tab + swap arrows icon */
function ContextSwitcherIcon() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Two browser tab windows representing context switch */}
      <rect x="14" y="34" width="60" height="68" rx="5" stroke="#4dd9e8" strokeWidth="2" fill="rgba(77,217,232,0.05)" />
      <rect x="14" y="34" width="60" height="14" rx="5" fill="rgba(77,217,232,0.1)" stroke="#4dd9e8" strokeWidth="2" />
      <line x1="22" y1="62" x2="58" y2="62" stroke="#23232b" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="72" x2="50" y2="72" stroke="#23232b" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="82" x2="62" y2="82" stroke="#23232b" strokeWidth="1.5" strokeLinecap="round" />

      <rect x="86" y="58" width="60" height="68" rx="5" stroke="#bc8cff" strokeWidth="2" fill="rgba(188,140,255,0.05)" />
      <rect x="86" y="58" width="60" height="14" rx="5" fill="rgba(188,140,255,0.1)" stroke="#bc8cff" strokeWidth="2" />
      <line x1="94" y1="86" x2="130" y2="86" stroke="#23232b" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="94" y1="96" x2="122" y2="96" stroke="#23232b" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="94" y1="106" x2="134" y2="106" stroke="#23232b" strokeWidth="1.5" strokeLinecap="round" />

      {/* Swap arrows between the two tabs */}
      <path d="M 74 50 L 90 50" stroke="#ffb13d" strokeWidth="2" strokeLinecap="round" markerEnd="url(#arrowhead)" />
      <path d="M 78 44 L 90 50 L 78 56" stroke="#ffb13d" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 86 112 L 70 112" stroke="#ffb13d" strokeWidth="2" strokeLinecap="round" />
      <path d="M 82 106 L 70 112 L 82 118" stroke="#ffb13d" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      <text x="80" y="148" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#4dd9e8" opacity="0.6" letterSpacing="2">Z CONTEXT SWITCHER</text>
    </svg>
  )
}

/* Seizure Prediction ML — EEG waveform + pulse icon */
function SeizureIcon() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Monitor frame */}
      <rect x="16" y="34" width="128" height="70" rx="6" stroke="#bc8cff" strokeWidth="2" fill="rgba(188,140,255,0.04)" />
      {/* Grid lines inside monitor */}
      {[0,1,2,3].map(i => (
        <line key={i} x1={16 + (i+1) * 25.6} y1="34" x2={16 + (i+1) * 25.6} y2="104" stroke="#23232b" strokeWidth="1" opacity="0.3" />
      ))}
      {/* EEG waveform — irregular spiking pattern */}
      <path
        d="M 22 70 L 36 70 L 42 50 L 48 88 L 54 64 L 60 70 L 70 70 L 76 36 L 82 100 L 88 60 L 94 70 L 104 70 L 110 54 L 116 84 L 122 70 L 138 70"
        stroke="#bc8cff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pulse dot marker on a spike */}
      <circle cx="82" cy="100" r="4" fill="#ff7b72" opacity="0.9" />
      <circle cx="82" cy="100" r="9" stroke="#ff7b72" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* Classification tag */}
      <rect x="100" y="112" width="44" height="16" rx="3" fill="rgba(255,123,114,0.1)" stroke="#ff7b72" strokeWidth="1" />
      <text x="122" y="123.5" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#ff7b72">SEIZURE</text>
      {/* Stat readout */}
      <text x="16" y="123" fontFamily="monospace" fontSize="8" fill="#bc8cff" opacity="0.7">PR-AUC 0.50</text>
      <text x="80" y="148" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#bc8cff" opacity="0.6" letterSpacing="2">EEG · SCIKIT-LEARN</text>
    </svg>
  )
}
