import { MARQUEE_TEXT } from '@/lib/data'

export default function Marquee() {
  return (
    <div
      className="relative w-full h-12 bg-bg-secondary border-t border-b border-border overflow-hidden flex items-center"
      aria-hidden="true"
    >
      {/* --- */}
      <div className="flex whitespace-nowrap">
        {/* Two identical spans — first exits left, second fills in seamlessly */}
        <span className="marquee-span font-mono text-xs tracking-widest text-text-muted uppercase pr-8">
          {MARQUEE_TEXT}&nbsp;&nbsp;
        </span>
        <span className="marquee-span font-mono text-xs tracking-widest text-text-muted uppercase pr-8">
          {MARQUEE_TEXT}&nbsp;&nbsp;
        </span>
      </div>

      {/* --- */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to right, var(--bg-secondary) 0%, transparent 100%)',
        }}
      />

      {/* --- */}
      <div
        className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to left, var(--bg-secondary) 0%, transparent 100%)',
        }}
      />

      {/* --- */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent-dim font-mono text-xs tracking-widest text-accent-green whitespace-nowrap"
          style={{ background: 'rgba(0, 255, 65, 0.07)' }}
        >
          👋 AVAILABLE FOR WORK
        </span>
      </div>

      {/* --- */}
      <style>{`
        .marquee-span {
          display: inline-block;
          animation: marquee-scroll 35s linear infinite;
        }
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-span { animation: none; }
        }
      `}</style>
    </div>
  )
}
