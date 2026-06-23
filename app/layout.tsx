import type { Metadata } from 'next'
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import CursorFX from '@/components/ui/CursorFX'
import Navbar from '@/components/sections/Navbar'
import ResumeButton from '@/components/ui/ResumeButton'

/* --- */
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

/* --- */
export const metadata: Metadata = {
  title: 'Wali Ahmad Hotak | Full Stack Developer & Security Enthusiast',
  description:
    'BSCS student at IMSciences Peshawar. Building production-grade systems in FastAPI, PostgreSQL, and Next.js. Open to work.',
  keywords: [
    'full stack developer',
    'Peshawar',
    'FastAPI',
    'cybersecurity',
    'Python',
    'Next.js',
    'portfolio',
    'Wali Ahmad Hotak',
    'IMSciences',
  ],
  authors: [{ name: 'Wali Ahmad Hotak', url: 'https://wali-portfolio.vercel.app' }],
  creator: 'Wali Ahmad Hotak',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wali-portfolio.vercel.app',
    title: 'Wali Ahmad Hotak | Full Stack Developer',
    description:
      'BSCS student at IMSciences Peshawar. Building production-grade systems in FastAPI, PostgreSQL, and Next.js. Open to work.',
    siteName: 'Wali Ahmad Hotak Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Wali Ahmad Hotak — Full Stack Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wali Ahmad Hotak | Full Stack Developer',
    description: 'Building production-grade systems. FastAPI, PostgreSQL, Next.js.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://wali-portfolio.vercel.app'),
}

/* --- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      {/*
        M10 FIX: body was using old Tailwind aliases (bg-bg-primary, text-text-primary, font-body)
        that don't exist in Tailwind v4 without explicit config. Replaced with inline CSS vars
        which are always available via globals.css. antialiased stays as a Tailwind utility.
      */}
      <body
        className="antialiased"
        style={{
          backgroundColor: 'var(--bg)',
          color: 'var(--ink)',
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
        }}
      >
        <CursorFX />
        <Navbar />
        <ResumeButton />
        {children}
      </body>
    </html>
  )
}
