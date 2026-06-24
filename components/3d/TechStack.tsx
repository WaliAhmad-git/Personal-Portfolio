'use client'

/* ═══════════════════════════════════════════════════════════
   components/3d/TechStack.tsx
   Module 6 — Physics-based Tech Stack section (Matter.js)
   Fixed: proper canvas resize on window resize, mobile balls
   fully visible, walls recalculate on resize.
   ═══════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { TECH_STACK } from '@/lib/data'
import type { TechItem } from '@/lib/data'

const CANVAS_HEIGHT_DESKTOP = 500
const CANVAS_HEIGHT_MOBILE  = 400
const BALL_RADIUS_DESKTOP   = 54
const BALL_RADIUS_MOBILE    = 40
const DROP_STAGGER_MS       = 140
const WALL_THICKNESS        = 60

const CATEGORY_ORDER: TechItem['category'][] = ['language', 'framework', 'database', 'tool', 'security']

const headerVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

export default function TechStack() {
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const containerRef   = useRef<HTMLDivElement>(null)
  const sectionRef     = useRef<HTMLDivElement>(null)
  const engineRef      = useRef<Matter.Engine | null>(null)
  const renderRef      = useRef<Matter.Render | null>(null)
  const runnerRef      = useRef<Matter.Runner | null>(null)
  const mouseRef       = useRef<Matter.MouseConstraint | null>(null)
  const dropTimersRef  = useRef<ReturnType<typeof setTimeout>[]>([])
  const hasDroppedRef  = useRef(false)
  const wallsRef       = useRef<Matter.Body[]>([])

  const [isMobile, setIsMobile]   = useState(false)
  const [isReady,  setIsReady]    = useState(false)
  const [ballCount, setBallCount] = useState(0)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const canvasHeight = isMobile ? CANVAS_HEIGHT_MOBILE : CANVAS_HEIGHT_DESKTOP
  const ballRadius   = isMobile ? BALL_RADIUS_MOBILE   : BALL_RADIUS_DESKTOP

  const cleanupMatter = useCallback(() => {
    dropTimersRef.current.forEach(clearTimeout)
    dropTimersRef.current = []

    if (mouseRef.current && engineRef.current) {
      try {
        const Matter = require('matter-js') as typeof import('matter-js')
        Matter.World.remove(engineRef.current.world, mouseRef.current as unknown as Matter.Body)
      } catch (_) { /* ignore */ }
      mouseRef.current = null
    }
    if (runnerRef.current) {
      try {
        const Matter = require('matter-js') as typeof import('matter-js')
        Matter.Runner.stop(runnerRef.current)
      } catch (_) { /* ignore */ }
      runnerRef.current = null
    }
    if (renderRef.current) {
      try {
        const Matter = require('matter-js') as typeof import('matter-js')
        Matter.Render.stop(renderRef.current)
      } catch (_) { /* ignore */ }
      renderRef.current = null
    }
    if (engineRef.current) {
      try {
        const Matter = require('matter-js') as typeof import('matter-js')
        Matter.World.clear(engineRef.current.world, false)
        Matter.Engine.clear(engineRef.current)
      } catch (_) { /* ignore */ }
      engineRef.current = null
    }
    wallsRef.current = []
  }, [])

  const dropBall = useCallback(
    (Matter: typeof import('matter-js'), world: Matter.World, item: TechItem, canvasWidth: number, radius: number) => {
      /* Cluster balls by category into horizontal bands so similar
         technologies group together on one side instead of scattering
         fully at random across the whole width. */
      const usableWidth = canvasWidth - radius * 3
      const bandCount    = CATEGORY_ORDER.length
      const bandWidth     = usableWidth / bandCount
      const bandIndex     = Math.max(0, CATEGORY_ORDER.indexOf(item.category))
      const bandStart      = radius * 1.5 + bandIndex * bandWidth

      const x = bandStart + Math.random() * bandWidth
      const y = -radius - Math.random() * 60

      const body = Matter.Bodies.circle(x, y, radius, {
        restitution: 0.55,
        friction: 0.08,
        frictionAir: 0.012,
        density: 0.002,
        label: item.name,
        render: {
          fillStyle: item.color,
          strokeStyle: 'rgba(255,255,255,0.18)',
          lineWidth: 1.5,
        },
      })

      Matter.World.add(world, body)
      setBallCount(c => c + 1)
    },
    []
  )

  const setupAfterRender = useCallback(
    (Matter: typeof import('matter-js'), render: Matter.Render, engine: Matter.Engine, radius: number) => {
      Matter.Events.on(render, 'afterRender', () => {
        const ctx    = render.context
        const bodies = Matter.Composite.allBodies(engine.world)

        bodies.forEach((body) => {
          if (body.isStatic) return
          const { x, y } = body.position

          ctx.save()
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.clip()

          const grad = ctx.createRadialGradient(
            x - radius * 0.3, y - radius * 0.3, radius * 0.05,
            x, y, radius
          )
          grad.addColorStop(0, 'rgba(255,255,255,0.22)')
          grad.addColorStop(1, 'rgba(0,0,0,0.28)')
          ctx.fillStyle = grad
          ctx.fill()
          ctx.restore()

          ctx.save()
          ctx.fillStyle = isLightColor(body.render.fillStyle as string)
            ? 'rgba(0,0,0,0.85)'
            : 'rgba(255,255,255,0.92)'
          ctx.textAlign    = 'center'
          ctx.textBaseline = 'middle'
          ctx.shadowColor  = 'rgba(0,0,0,0.5)'
          ctx.shadowBlur   = 3
          drawFittedLabel(ctx, body.label, x, y, radius)
          ctx.restore()
        })
      })
    },
    []
  )

  const getCanvasWidth = useCallback(() => {
    if (containerRef.current) return containerRef.current.clientWidth
    if (canvasRef.current)    return canvasRef.current.clientWidth
    return window.innerWidth < 768 ? window.innerWidth - 32 : 800
  }, [])

  const initMatter = useCallback(async () => {
    if (!canvasRef.current) return

    cleanupMatter()
    hasDroppedRef.current = false
    setBallCount(0)

    const Matter = (await import('matter-js')) as typeof import('matter-js')
    const canvasWidth = getCanvasWidth()

    const engine = Matter.Engine.create({ gravity: { y: 1.2 } })
    engineRef.current = engine

    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine,
      options: {
        width:      canvasWidth,
        height:     canvasHeight,
        background: 'transparent',
        wireframes: false,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      },
    })
    renderRef.current = render

    const wallOpts = {
      isStatic: true,
      render: { fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 },
    }
    const floor = Matter.Bodies.rectangle(
      canvasWidth / 2, canvasHeight + WALL_THICKNESS / 2,
      canvasWidth + WALL_THICKNESS * 2, WALL_THICKNESS,
      wallOpts
    )
    const wallL = Matter.Bodies.rectangle(
      -WALL_THICKNESS / 2, canvasHeight / 2,
      WALL_THICKNESS, canvasHeight * 2,
      wallOpts
    )
    const wallR = Matter.Bodies.rectangle(
      canvasWidth + WALL_THICKNESS / 2, canvasHeight / 2,
      WALL_THICKNESS, canvasHeight * 2,
      wallOpts
    )
    Matter.World.add(engine.world, [floor, wallL, wallR])
    wallsRef.current = [floor, wallL, wallR]

    const mouse = Matter.Mouse.create(canvasRef.current)
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    })
    Matter.World.add(engine.world, mouseConstraint as unknown as Matter.Body)
    mouseRef.current = mouseConstraint
    render.mouse = mouse

    /* Matter.js attaches wheel/mousewheel listeners to the canvas element
       that call preventDefault(), which blocks normal page scrolling
       whenever the cursor is over the canvas. Remove them — drag-to-play
       still works via mousedown/mousemove/mouseup, only scroll-blocking
       wheel capture is removed. */
    const mouseEl = mouse.element as unknown as HTMLElement
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mw = (mouse as any).mousewheel
    if (mw) {
      mouseEl.removeEventListener('mousewheel', mw)
      mouseEl.removeEventListener('DOMMouseScroll', mw)
      mouseEl.removeEventListener('wheel', mw)
    }

    setupAfterRender(Matter, render, engine, ballRadius)

    const runner = Matter.Runner.create()
    runnerRef.current = runner
    Matter.Runner.run(runner, engine)
    Matter.Render.run(render)

    setIsReady(true)
  }, [canvasHeight, ballRadius, cleanupMatter, setupAfterRender, getCanvasWidth])

  const dropAllBalls = useCallback(async () => {
    if (!canvasRef.current || !engineRef.current) return

    const Matter = (await import('matter-js')) as typeof import('matter-js')
    const world  = engineRef.current.world
    const canvasWidth = getCanvasWidth()

    const bodies  = Matter.Composite.allBodies(world)
    const dynamic = bodies.filter(b => !b.isStatic)
    Matter.World.remove(world, dynamic as unknown as Matter.Body)
    setBallCount(0)

    dropTimersRef.current.forEach(clearTimeout)
    dropTimersRef.current = []

    TECH_STACK.forEach((item, i) => {
      const t = setTimeout(() => {
        dropBall(Matter, world, item, canvasWidth, ballRadius)
      }, i * DROP_STAGGER_MS)
      dropTimersRef.current.push(t)
    })
  }, [ballRadius, dropBall, getCanvasWidth])

  /* Resize handler — rebuilds walls + canvas dimensions */
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>

    const handleResize = async () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(async () => {
        if (!renderRef.current || !engineRef.current || !canvasRef.current) return

        const Matter     = (await import('matter-js')) as typeof import('matter-js')
        const newWidth   = getCanvasWidth()
        const newHeight  = window.innerWidth < 768 ? CANVAS_HEIGHT_MOBILE : CANVAS_HEIGHT_DESKTOP

        /* Update canvas dimensions */
        renderRef.current.options.width  = newWidth
        renderRef.current.options.height = newHeight
        renderRef.current.canvas.width   = newWidth * (Math.min(window.devicePixelRatio || 1, 2))
        renderRef.current.canvas.height  = newHeight * (Math.min(window.devicePixelRatio || 1, 2))
        renderRef.current.canvas.style.width  = '100%'
        renderRef.current.canvas.style.height = `${newHeight}px`

        /* Remove old walls, add new ones */
        if (wallsRef.current.length) {
          Matter.World.remove(engineRef.current.world, wallsRef.current as unknown as Matter.Body)
        }
        const wallOpts = {
          isStatic: true,
          render: { fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 },
        }
        const floor = Matter.Bodies.rectangle(
          newWidth / 2, newHeight + WALL_THICKNESS / 2,
          newWidth + WALL_THICKNESS * 2, WALL_THICKNESS,
          wallOpts
        )
        const wallL = Matter.Bodies.rectangle(
          -WALL_THICKNESS / 2, newHeight / 2,
          WALL_THICKNESS, newHeight * 2,
          wallOpts
        )
        const wallR = Matter.Bodies.rectangle(
          newWidth + WALL_THICKNESS / 2, newHeight / 2,
          WALL_THICKNESS, newHeight * 2,
          wallOpts
        )
        Matter.World.add(engineRef.current.world, [floor, wallL, wallR])
        wallsRef.current = [floor, wallL, wallR]

        /* Re-drop balls so they're within new bounds */
        hasDroppedRef.current = false
        await dropAllBalls()
        hasDroppedRef.current = true
      }, 300)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [dropAllBalls, getCanvasWidth])

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasDroppedRef.current) {
          hasDroppedRef.current = true
          dropAllBalls()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [dropAllBalls])

  useEffect(() => {
    initMatter()
    return () => { cleanupMatter() }
  }, [initMatter, cleanupMatter])

  const handleReset = useCallback(async () => {
    hasDroppedRef.current = false
    await dropAllBalls()
    hasDroppedRef.current = true
  }, [dropAllBalls])

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24"
      style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}
    >
      <div
        className="mx-auto px-4 md:px-10"
        style={{ width: '100%', maxWidth: '1152px' }}
      >
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="section-label"
        >
          <span className="idx">03</span>
          <h2 style={{ fontSize: '1.4rem' }}>Tech Stack</h2>
          <span className="rule" />
        </motion.div>

        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-8 flex flex-col gap-2"
        >
          <h2 className="font-display font-bold leading-tight" style={{ fontSize: 'clamp(1.4rem, 4vw, 2.8rem)', color: 'var(--ink)' }}>
            The tools I actually use.
          </h2>
          <p className="font-mono text-xs tracking-widest" style={{ color: 'var(--dim-2)' }}>
            {'>'} Click and drag to play with them.
          </p>
        </motion.div>

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: 'easeOut' as const }}
          className="relative w-full rounded-xl overflow-hidden"
          style={{
            border: '1px solid var(--line)',
            background: 'var(--bg-soft)',
            height: canvasHeight,
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, transparent, var(--cyan), transparent)', opacity: 0.5 }}
            aria-hidden="true"
          />

          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <span className="font-mono text-xs tracking-widest animate-pulse" style={{ color: 'var(--dim-2)' }}>
                {'> Initializing physics...'}
              </span>
            </div>
          )}

          <canvas
            ref={canvasRef}
            style={{
              width:   '100%',
              height:  canvasHeight,
              display: 'block',
              cursor:  'grab',
              touchAction: 'none',
            }}
          />

          {isReady && (
            <div
              className="absolute top-3 right-4 font-mono pointer-events-none z-10"
              style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--dim-2)' }}
              aria-live="polite"
            >
              {ballCount} / {TECH_STACK.length} loaded
            </div>
          )}

          <div
            className="absolute bottom-3 left-4 font-mono pointer-events-none z-10"
            style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--cyan)', opacity: 0.6 }}
            aria-hidden="true"
          >
            matter.js • physics engine
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-5 flex items-center justify-between gap-4 flex-wrap"
        >
          <p className="font-mono" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--dim-2)' }}>
            {TECH_STACK.length} technologies in the stack
          </p>

          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded border font-mono text-xs tracking-widest transition-colors duration-200"
            style={{ borderColor: 'var(--line)', color: 'var(--dim-2)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.color = 'var(--amber)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)';  e.currentTarget.style.color = 'var(--dim-2)' }}
            aria-label="Reset physics simulation"
          >
            <ResetIcon />
            RESET
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.45 }}
          className="mt-6 flex flex-wrap gap-3"
        >
          {CATEGORY_LEGEND.map(({ label, color }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 font-mono"
              style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--dim-2)' }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: color }}
                aria-hidden="true"
              />
              {label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const CATEGORY_LEGEND = [
  { label: 'Language',  color: '#3572A5' },
  { label: 'Framework', color: '#009688' },
  { label: 'Database',  color: '#336791' },
  { label: 'Tool',      color: '#FCC624' },
  { label: 'Security',  color: '#FF6633' },
]

function isLightColor(hex: string): boolean {
  const clean = hex.replace('#', '')
  if (clean.length < 6) return false
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55
}

/* Renders the full tech name inside a ball of given radius. Shrinks the
   font until it fits on one line; if it still doesn't fit at the minimum
   readable size, splits the name into two lines at a space/hyphen and
   fits each line independently. */
function drawFittedLabel(
  ctx: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
  radius: number
) {
  const maxWidth  = radius * 1.7
  const maxFont   = radius * 0.34
  const minFont   = radius * 0.16

  const fitFontSize = (text: string) => {
    let size = maxFont
    ctx.font = `bold ${size}px "JetBrains Mono", monospace`
    while (ctx.measureText(text).width > maxWidth && size > minFont) {
      size -= 1
      ctx.font = `bold ${size}px "JetBrains Mono", monospace`
    }
    return size
  }

  const singleLineSize = fitFontSize(label)
  ctx.font = `bold ${singleLineSize}px "JetBrains Mono", monospace`

  if (ctx.measureText(label).width <= maxWidth) {
    ctx.fillText(label, x, y)
    return
  }

  /* Doesn't fit on one line even at minimum size — split into 2 lines */
  const splitPoint = label.indexOf('-') > -1 ? label.indexOf('-') + 1 : label.indexOf(' ')
  const line1 = splitPoint > -1 ? label.slice(0, splitPoint).trim() : label
  const line2 = splitPoint > -1 ? label.slice(splitPoint).trim() : ''

  if (!line2) {
    ctx.fillText(label, x, y)
    return
  }

  const lineFont = Math.max(fitFontSize(line1), fitFontSize(line2), minFont)
  ctx.font = `bold ${Math.min(lineFont, maxFont)}px "JetBrains Mono", monospace`
  ctx.fillText(line1, x, y - lineFont * 0.55)
  ctx.fillText(line2, x, y + lineFont * 0.55)
}

function ResetIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}
