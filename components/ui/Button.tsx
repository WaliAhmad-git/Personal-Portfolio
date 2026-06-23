'use client'

/* ═══════════════════════════════════════════════════════════
   components/ui/Button.tsx
   Shared CTA button — single source of truth for every clickable
   button on the site. Same API as before; restyled to the amber/
   cyan signal palette instead of the old acid-green theme.
   ═══════════════════════════════════════════════════════════ */

import { motion } from 'framer-motion'
import type { ReactNode, MouseEvent } from 'react'

export type ButtonVariant = 'primary' | 'secondary'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonIcon = 'none' | 'right' | 'external'

interface ButtonProps {
  children: ReactNode
  href?: string
  onClick?: (e: MouseEvent) => void
  variant?: ButtonVariant
  size?: ButtonSize
  external?: boolean
  icon?: ButtonIcon
  className?: string
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[0.7rem]',
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-sm',
}

const ICON_PX: Record<ButtonSize, number> = { sm: 10, md: 11, lg: 13 }

function variantStyle(variant: ButtonVariant) {
  if (variant === 'primary') {
    return {
      base: {
        background: 'var(--amber)',
        borderColor: 'var(--amber)',
        color: 'var(--bg)',
        boxShadow: '0 0 18px rgba(255,177,61,0.3)',
      },
      hover: {
        scale: 1.03,
        boxShadow: '0 0 30px rgba(255,177,61,0.5)',
      },
    }
  }

  return {
    base: {
      background: 'rgba(77,217,232,0.08)',
      borderColor: 'var(--cyan)',
      color: 'var(--cyan)',
      boxShadow: '0 0 0px rgba(77,217,232,0)',
    },
    hover: {
      scale: 1.03,
      backgroundColor: 'rgba(77,217,232,0.16)',
      boxShadow: '0 0 22px rgba(77,217,232,0.25)',
    },
  }
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'secondary',
  size = 'md',
  external = false,
  icon = 'none',
  className = '',
}: ButtonProps) {
  const { base, hover } = variantStyle(variant)
  const iconPx = ICON_PX[size]

  const classes = [
    'magnetic inline-flex items-center gap-2 rounded border-2',
    'font-mono font-semibold tracking-widest whitespace-nowrap',
    SIZE_CLASSES[size],
    className,
  ].join(' ')

  const content = (
    <>
      <span>{children}</span>
      {icon === 'right' && <RightArrow size={iconPx} />}
      {icon === 'external' && <ExternalArrow size={iconPx} />}
    </>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={onClick}
        style={base}
        whileHover={hover}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className={classes}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      style={base}
      whileHover={hover}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={classes}
    >
      {content}
    </motion.button>
  )
}

function RightArrow({ size }: { size: number }) {
  return (
    <span aria-hidden="true" style={{ fontSize: size + 4, lineHeight: 1 }}>
      →
    </span>
  )
}

function ExternalArrow({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  )
}
