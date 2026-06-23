// REPLACE the entire PROJECTS array in lib/data.ts with this:

export const PROJECTS: Project[] = [
  {
    id: 'makkah-pos',
    title: 'Makkah Foods POS System',
    description: 'Production-grade point-of-sale system for a UK grocery store. Full billing, inventory, staff management, and VAT reporting.',
    longDescription:
      'A production-grade Point of Sale system built for Makkah Foods, a real UK grocery store. ' +
      'Six complete modules — inventory management, sales processing, GBP cash handling with quick-amount buttons, ' +
      'receipt generation via a custom print modal, staff authentication with admin and employee roles, and a full reporting dashboard. ' +
      'The backend is a FastAPI REST API with a 14-table PostgreSQL schema featuring stored procedures, ' +
      'views, and soft-delete patterns. The Vanilla JS frontend runs in-browser with zero frameworks. ' +
      'Built and debugged entirely on Fedora Linux with Apache on port 8081.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Vanilla JS', 'HTML/CSS', 'Apache'],
    githubUrl: 'https://github.com/WaliAhmad-git/makkah-pos',
    imagePath: '',
    featured: true,
    year: '2025',
    category: 'fullstack',
  },
  {
    id: 'virtual-avatar',
    title: 'Z Avatar — AI Meeting Bot',
    description: 'AI-powered Google Meet bot that attends classes, listens via Deepgram STT, generates responses with Gemini, and speaks through a PipeWire virtual mic.',
    longDescription:
      'An AI meeting presence system that joins Google Meet sessions as a virtual student. ' +
      'Deepgram handles real-time speech-to-text, Gemini processes the transcript and generates ' +
      'context-aware responses, and edge-tts converts replies to speech streamed through a PipeWire ' +
      'virtual microphone — so the bot is audible in-meeting. OBS handles the visual presence. ' +
      'Key engineering challenges: Meet tab cleanup between sessions, AI_Mic persistence across ' +
      'reconnects, OBS error suppression, and multi-Gemini-key fallback for quota limits. ' +
      'Shipped with a clean settings UI for API key management, voice config, and trigger words.',
    stack: ['Python', 'Deepgram', 'Gemini API', 'edge-tts', 'PipeWire', 'OBS', 'FastAPI'],
    githubUrl: 'https://github.com/WaliAhmad-git/virtual-avatar',
    imagePath: '',
    featured: true,
    year: '2025',
    category: 'ml',
  },
  {
    id: 'amirani-store',
    title: 'Amirani Store',
    description: 'E-commerce platform for an Afghan clothing business that shipped to Belgium. Custom orders, WhatsApp integration, TikTok-linked marketing pages.',
    longDescription:
      'Amirani Store was a real Afghan clothing business (ready-made garments + custom-tailored pieces) ' +
      'that shipped orders to Belgium and was marketed through TikTok. Full web platform built: ' +
      'a product catalog with fabric and sizing options, a custom order form with WhatsApp confirmation flow, ' +
      'and TikTok-linked marketing pages tied to the social media funnel. ' +
      'The business operated, made sales, and was sold in early 2026. ' +
      'Not a tutorial, not a side project — an actual business with customers and revenue.',
    stack: ['Next.js', 'Tailwind CSS', 'FastAPI', 'PostgreSQL'],
    githubUrl: 'https://github.com/WaliAhmad-git/amirani-store',
    imagePath: '',
    featured: true,
    year: '2025',
    category: 'business',
  },
  {
    id: 'portfolio',
    title: 'Personal Portfolio',
    description: 'This site. Built with Next.js 14, TypeScript, Framer Motion, and Matter.js. Dark-theme design system, physics-based tech stack visualization.',
    longDescription:
      'The portfolio you are looking at right now. Built module by module with a strict design system — ' +
      'amber/cyan accent palette, custom CSS variables, JetBrains Mono + Inter typography. ' +
      'Features a Matter.js physics simulation for the tech stack section, Framer Motion scroll animations, ' +
      'a custom magnetic cursor, and a contact form with Formspree and server-side rate limiting via Next.js proxy middleware. ' +
      'Server components for SEO metadata, client components for interactivity — clean boundary separation throughout.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Matter.js', 'Formspree'],
    githubUrl: 'https://github.com/WaliAhmad-git/portfolio',
    imagePath: '',
    featured: false,
    year: '2026',
    category: 'fullstack',
  },
]
