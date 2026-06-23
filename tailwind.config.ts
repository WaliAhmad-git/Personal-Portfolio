import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0d',
          secondary: '#121217',
          tertiary: '#1a1a21',
        },
        accent: {
          amber: '#ffb13d',
          cyan: '#4dd9e8',
        },
        text: {
          primary: '#f3f1ea',
          secondary: '#8a8a92',
          muted: '#4a4a52',
        },
        border: '#23232b',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        'glow-amber': '0 0 20px rgba(255, 177, 61, 0.25)',
        'glow-cyan': '0 0 20px rgba(77, 217, 232, 0.25)',
      },
      animation: {
        marquee: 'marquee-scroll 28s linear infinite',
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
}

export default config
