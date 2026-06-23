/* ═══════════════════════════════════════════════════════════
   lib/data.ts  —  Single source of truth for all portfolio content.
   M1  CHANGES: PERSONAL.status → ''; HERO_STATS updated
   M8  CHANGES: Added SkillDetail interface + SKILLS_DETAIL array
   M10 CHANGES: CURRENTLY.building — removed "Wali handles" named
               third-person reference (caught in M10 content audit)
   PROJECT SNAPSHOTS: makkah-pos + virtual-avatar imagePaths set
   PROJECTS PATCH: removed real-estate-ai + siem-platform, added
               'portfolio' entry; imagePath cleared on all (SVG icons
               now rendered directly in ProjectDetailCard left panel)
   ═══════════════════════════════════════════════════════════ */

export const PERSONAL = {
  name: 'Wali Ahmad Hotak',
  nameShort: 'Wali',
  email: 'ahmadhotakwali@gmail.com',
  title: 'Full Stack Developer & Security Enthusiast',
  university: 'IMSciences Peshawar',
  degree: 'BS Computer Science',
  session: '2023–2027',
  cgpa: '3.44',
  location: 'Peshawar, Pakistan',
  availableFrom: 'June 2027 (Full Time after Graduation)',
  status: '', // M1: cleared — status line removed from Hero rendering
  bio: [
    "Computer Science student at IMSciences Peshawar building production systems — not tutorials, not toy projects, real software deployed for real clients.",
    "Delivered a full POS system for a UK grocery store, conducted a penetration test on a live LMS, trained an EEG-based seizure prediction model, and deployed an AI-powered virtual meeting assistant. Each project shipped end-to-end.",
    "Founded and operated Amirani Store — an Afghan clothing business shipping to Belgium, marketed via TikTok, and sold in early 2026. Equally at home understanding systems and the people who use them.",
  ],
  currentProject: 'Real Estate AI Search · Z Context Switcher',
  watermark: '<WAH/>',
} as const

/* --- */
export const SOCIAL = {
  github: 'https://github.com/WaliAhmad-git',
  linkedin: 'https://linkedin.com/in/wali-ahmad-hotak-452663297',
  githubHandle: '@WaliAhmad-git',
  linkedinHandle: 'wali-ahmad-hotak',
} as const

/* --- */
export const RESUME_PATH = '/Wali_Ahmad_Hotak_CV.pdf'

/* --- */
export const HERO_STATS = [
  { value: '4+',   label: 'Projects' },
  { value: '2+',   label: 'Years of Experience' },
  { value: '24/7', label: 'Availability' },
] as const

/* --- */
export const TYPEWRITER_ROLES = [
  'Full Stack Developer',
  'Security Enthusiast',
  'ML Engineer',
  'Problem Solver',
] as const

/* --- */
export const TERMINAL_LINES = [
  { type: 'command', text: '$ whoami' },
  { type: 'output',  text: 'wali-ahmad-hotak' },
  { type: 'blank',   text: '' },
  { type: 'command', text: '$ cat skills.txt' },
  { type: 'output',  text: '→ FastAPI, PostgreSQL, Python' },
  { type: 'output',  text: '→ Vanilla JS, HTML, CSS' },
  { type: 'output',  text: '→ Kali Linux, Penetration Testing' },
  { type: 'output',  text: '→ Machine Learning, Scikit-learn' },
  { type: 'blank',   text: '' },
  { type: 'command', text: '$ ls projects/' },
  { type: 'output',  text: 'pos-system/  real-estate-ai/' },
  { type: 'output',  text: 'z-context/  amirani-store/' },
  { type: 'blank',   text: '' },
  { type: 'command', text: '$ echo "Currently building..."' },
  { type: 'output',  text: 'Real Estate AI Search + Z Context Switcher' },
  { type: 'blank',   text: '' },
  { type: 'prompt',  text: '$ _' },
] as const

/* --- */
export const DOMAIN_CARDS = [
  {
    id: 'frontend',
    icon: '</>',
    title: 'Frontend Development',
    body: 'Reactive interfaces, dashboard design, interactive UI systems built with Vanilla JS, HTML/CSS, Next.js, and React.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Next.js'],
  },
  {
    id: 'backend',
    icon: '[DB]',
    title: 'Backend & APIs',
    body: 'REST APIs with FastAPI, PostgreSQL schema design with stored procedures and views, authentication systems, relational data modelling.',
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'REST API'],
  },
  {
    id: 'security',
    icon: '[⚡]',
    title: 'Cybersecurity',
    body: 'Penetration testing with Kali Linux, IDOR and session vulnerability research on live systems, SIEM platform development, network scanning and enumeration.',
    tags: ['Kali Linux', 'Nmap', 'Burp Suite', 'SIEM'],
  },
  {
    id: 'ml',
    icon: '[~]',
    title: 'Machine Learning',
    body: 'Supervised learning pipelines, EEG signal classification, class imbalance handling with SMOTE and Elastic Net regularization. Scikit-learn and Pandas.',
    tags: ['Python', 'Scikit-learn', 'Pandas', 'Gemini API'],
  },
] as const

/* --- */
export type TimelineType = 'EDUCATION' | 'PROJECT' | 'SECURITY' | 'ML' | 'CURRENT'

export interface TimelineEntry {
  id: string
  year: string
  side: 'left' | 'right'
  title: string
  type: TimelineType
  body: string
  highlight?: boolean
}

export const TIMELINE: TimelineEntry[] = [
  {
    id: 'bscs-start',
    year: '2023',
    side: 'left',
    title: 'Started BSCS @ IMSciences',
    type: 'EDUCATION',
    body: 'Began Computer Science degree with focus on programming fundamentals, data structures, and systems. Started Linux setup, learned Python and C++.',
  },
  {
    id: 'braille',
    year: '2023',
    side: 'right',
    title: 'First Real Project: Text-to-Braille Converter',
    type: 'PROJECT',
    body: 'Built a Python tool converting text input to Braille output for visually impaired users. First experience building something with a real-world purpose.',
  },
  {
    id: 'real-estate',
    year: '2024',
    side: 'left',
    title: 'Real Estate AI Search Tool',
    type: 'PROJECT',
    body: 'Team project integrating a HuggingFace model into a property search system. First hands-on experience with AI model integration and team collaboration.',
  },
  {
    id: 'pentest',
    year: '2024',
    side: 'right',
    title: 'IMDigital LMS Penetration Test',
    type: 'SECURITY',
    body: 'Conducted a full penetration test of imdigital.bsoft.pk. Found exposed FTP/SSH ports, IDOR on instructor endpoints, session state disclosure. Generated a formal ReportLab PDF report.',
  },
  {
    id: 'pos',
    year: '2025',
    side: 'left',
    title: 'Makkah Foods POS System',
    type: 'PROJECT',
    body: 'Built a production-grade POS system for a UK grocery store — FastAPI backend, PostgreSQL with 14 tables, Vanilla JS frontend. Six full modules including auth, inventory, sales, VAT, receipts, and reporting.',
  },
  {
    id: 'ai-bot',
    year: '2025',
    side: 'right',
    title: 'Z Avatar — Meeting Bot',
    type: 'PROJECT',
    body: 'Built an AI-powered Google Meet presence bot using Deepgram (STT), Gemini (LLM), edge-tts (voice), and PipeWire virtual mic. Bot attends meetings, takes notes, and responds.',
  },
  {
    id: 'seizure-ml',
    year: '2025',
    side: 'left',
    title: 'Seizure Prediction ML Model',
    type: 'ML',
    body: 'EEG dataset-based seizure prediction using Scikit-learn pipelines. Best config: Pipeline B + Elastic Net + Class Weighting. Published IEEE-format report and GitHub repo.',
  },
  {
    id: 'real-estate-personal',
    year: '2026',
    side: 'right',
    title: 'Real Estate AI Search Tool',
    type: 'CURRENT',
    highlight: true,
    body: 'Personal project — AI-powered property search with HuggingFace model integration, natural language queries, and an interactive map UI. Built independently alongside university coursework.',
  },
  {
    id: 'z-context-switcher',
    year: '2026',
    side: 'left',
    title: 'Z Context Switcher — Chrome Extension',
    type: 'CURRENT',
    highlight: true,
    body: 'Personal project — Chrome extension for preserving and restoring AI context across sessions. Proactive token usage warnings, offline compression, and a preview-before-inject flow.',
  },
]

/* --- */
export interface TechItem {
  name: string
  icon: string
  category: 'language' | 'framework' | 'database' | 'tool' | 'security'
  color: string
}

export const TECH_STACK: TechItem[] = [
  { name: 'Python',       icon: 'python',      category: 'language',  color: '#3572A5' },
  { name: 'JavaScript',   icon: 'javascript',  category: 'language',  color: '#F7DF1E' },
  { name: 'TypeScript',   icon: 'typescript',  category: 'language',  color: '#3178C6' },
  { name: 'C++',          icon: 'cpp',         category: 'language',  color: '#00599C' },
  { name: 'FastAPI',      icon: 'fastapi',     category: 'framework', color: '#009688' },
  { name: 'Next.js',      icon: 'nextjs',      category: 'framework', color: '#ffffff' },
  { name: 'React',        icon: 'react',       category: 'framework', color: '#61DAFB' },
  { name: 'PostgreSQL',   icon: 'postgresql',  category: 'database',  color: '#336791' },
  { name: 'Linux',        icon: 'linux',       category: 'tool',      color: '#FCC624' },
  { name: 'Git',          icon: 'git',         category: 'tool',      color: '#F05032' },
  { name: 'Docker',       icon: 'docker',      category: 'tool',      color: '#2496ED' },
  { name: 'Kali Linux',   icon: 'kali',        category: 'security',  color: '#557C94' },
  { name: 'Burp Suite',   icon: 'burpsuite',   category: 'security',  color: '#FF6633' },
  { name: 'Scikit-learn', icon: 'sklearn',     category: 'framework', color: '#F89939' },
  { name: 'Pandas',       icon: 'pandas',      category: 'framework', color: '#150458' },
]

/* --- */
export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  stack: string[]
  githubUrl: string
  liveUrl?: string
  imagePath: string
  featured: boolean
  year: string
  category: 'fullstack' | 'security' | 'ml' | 'business'
}

export const PROJECTS: Project[] = [
  {
    id: 'text-to-braille',
    title: 'Text-to-Braille Converter',
    description: 'Hardware Braille output device built with Arduino, solenoids, and resistors. Physical dots activate in response to text input — a DLD project with real accessibility purpose.',
    longDescription:
      'A Digital Logic Design project — built in hardware, not software. ' +
      'An Arduino-driven Braille output device using solenoids, resistors, and custom wiring to physically raise and lower Braille dots in response to text input. ' +
      'Programmed in Arduino IDE. Converts typed characters into the correct solenoid activation patterns to form Braille cells. ' +
      'First experience bridging software logic with physical hardware — built for visually impaired users, not as a toy project.',
    stack: ['Arduino', 'Arduino IDE', 'C++', 'Solenoids', 'Digital Logic'],
    githubUrl: 'https://github.com/WaliAhmad-git',
    imagePath: '',
    featured: false,
    year: '2024',
    category: 'fullstack',
  },
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
    githubUrl: 'https://github.com/WaliAhmad-git/Point-of-Sale-System',
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
    githubUrl: 'https://github.com/WaliAhmad-git/Z-Avatar',
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
    githubUrl: 'https://github.com/WaliAhmad-git',
    imagePath: '',
    featured: true,
    year: '2025',
    category: 'business',
  },
  {
    id: 'real-estate-ai',
    title: 'Real Estate AI Search Tool',
    description: 'AI-powered property search with natural language queries, HuggingFace model integration, and an interactive map UI. Personal project built alongside coursework.',
    longDescription:
      'A personal project that integrates a HuggingFace language model into a property search platform. ' +
      'Users describe what they are looking for in natural language — the model interprets intent, ' +
      'filters listings, and surfaces results on an interactive Leaflet.js map. ' +
      'Built with a FastAPI backend, PostgreSQL for listing storage, and a Vanilla JS frontend with real-time filtering. ' +
      'Independently scoped and developed — not a team or academic project.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'HuggingFace', 'Leaflet.js', 'Vanilla JS'],
    githubUrl: 'https://github.com/WaliAhmad-git',
    imagePath: '',
    featured: true,
    year: '2025',
    category: 'ml',
  },
  {
    id: 'z-context-switcher',
    title: 'Z Context Switcher — Chrome Extension',
    description: 'Chrome extension for preserving AI context across sessions. Proactive token warnings, offline compression, and a preview-before-inject flow for seamless context handoff.',
    longDescription:
      'A Chrome extension designed to solve context loss when starting a new AI chat session. ' +
      'Detects when a conversation is approaching the token limit (75% threshold) and shows a proactive warning banner. ' +
      'The extension compresses the current session context using an offline algorithm — with an optional Gemini API path for higher fidelity. ' +
      'Before injecting into a new session, a preview panel shows the compressed summary with token count and allows editing. ' +
      'Designed as a personal productivity tool for developers who work in long, context-heavy AI sessions daily.',
    stack: ['Chrome Extension API', 'JavaScript', 'Gemini API', 'HTML/CSS'],
    githubUrl: 'https://github.com/WaliAhmad-git',
    imagePath: '',
    featured: true,
    year: '2026',
    category: 'fullstack',
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
    githubUrl: 'https://github.com/WaliAhmad-git/Developer-Portfolio',
    imagePath: '',
    featured: false,
    year: '2026',
    category: 'fullstack',
  },
]

/* --- */
export const CURRENTLY = {
  // M10 FIX: removed "Wali handles red team/offensive security" — named third-person
  // reference inconsistent with M2 voice audit. Replaced with role description.
  building: 'Real Estate AI Search Tool (personal) · Z Context Switcher Chrome extension (personal)',
  reading: [
    { title: "The Web Application Hacker's Handbook", author: 'Stuttard & Pinto' },
    { title: 'Thinking, Fast and Slow',               author: 'Daniel Kahneman' },
  ],
  learning: 'Next.js App Router, Framer Motion, offensive security tooling for FYP',
  listeningTo: 'Lofi hip-hop / coding playlists',
  workingWith: 'Fedora Linux, VS Code, Neovim, Postgres, FastAPI',
} as const

/* --- */
export const MARQUEE_TEXT =
  'FULL STACK DEVELOPER • SECURITY ENTHUSIAST • OPEN SOURCE • PYTHON • FASTAPI • POSTGRESQL • ETHICAL HACKING • MACHINE LEARNING • NEXT.JS • FEDORA LINUX •'

/* ═══════════════════════════════════════════════════════════
   M8 — SKILLS_DETAIL
   ═══════════════════════════════════════════════════════════ */

export type SkillLevel = 'Proficient' | 'Comfortable' | 'Learning'

export interface SkillDetail {
  name: string
  icon: string
  category: 'Language' | 'Framework' | 'Database' | 'Tool' | 'Security' | 'ML'
  color: string
  summary: string
  frameworks: string[]
  projects: string[]
  level: SkillLevel
}

export const SKILLS_DETAIL: SkillDetail[] = [
  /* ── Languages ─────────────────────────────────────────── */
  {
    name: 'Python',
    icon: 'python',
    category: 'Language',
    color: '#3572A5',
    summary: 'Primary backend language. Used for REST APIs, ML pipelines, automation scripts, and tooling.',
    frameworks: ['FastAPI', 'Scikit-learn', 'Pandas', 'NumPy', 'ReportLab', 'Deepgram SDK', 'Ollama'],
    projects: ['Makkah Foods POS', 'Seizure Prediction ML', 'Z Avatar', 'IMDigital Pentest'],
    level: 'Proficient',
  },
  {
    name: 'JavaScript',
    icon: 'javascript',
    category: 'Language',
    color: '#F7DF1E',
    summary: 'Frontend scripting for browser-based UIs. Vanilla JS for DOM manipulation, canvas charts, and AJAX calls.',
    frameworks: ['Vanilla JS', 'Next.js (App Router)', 'React', 'Chart.js', 'Leaflet.js'],
    projects: ['Makkah Foods POS (frontend)', 'Real Estate AI (map UI)', 'Personal Portfolio'],
    level: 'Proficient',
  },
  {
    name: 'TypeScript',
    icon: 'typescript',
    category: 'Language',
    color: '#3178C6',
    summary: 'Typed JavaScript for Next.js projects. Component props, data interfaces, and API response types.',
    frameworks: ['Next.js 14', 'React', 'Framer Motion'],
    projects: ['Personal Portfolio'],
    level: 'Comfortable',
  },
  {
    name: 'C++',
    icon: 'cpp',
    category: 'Language',
    color: '#00599C',
    summary: 'Academic coursework — data structures, OOP, algorithm design, compiler construction exercises.',
    frameworks: ['STL', 'OOP patterns'],
    projects: ['Academic — DAA assignments', 'Compiler Construction coursework'],
    level: 'Comfortable',
  },

  /* ── Frameworks ─────────────────────────────────────────── */
  {
    name: 'FastAPI',
    icon: 'fastapi',
    category: 'Framework',
    color: '#009688',
    summary: 'Preferred Python web framework. Async endpoints, automatic OpenAPI docs, dependency injection, Pydantic validation.',
    frameworks: ['SQLAlchemy', 'Pydantic v2', 'Uvicorn', 'Alembic', 'python-multipart'],
    projects: ['Makkah Foods POS', 'Real Estate AI', 'SIEM Platform', 'Z Avatar'],
    level: 'Proficient',
  },
  {
    name: 'Next.js',
    icon: 'nextjs',
    category: 'Framework',
    color: '#ffffff',
    summary: 'React framework for production web apps. App Router, server components, API routes, Vercel deployment.',
    frameworks: ['React 19', 'Tailwind CSS v4', 'Framer Motion', 'next/image', 'next/font'],
    projects: ['Personal Portfolio', 'Amirani Store'],
    level: 'Comfortable',
  },
  {
    name: 'Scikit-learn',
    icon: 'sklearn',
    category: 'Framework',
    color: '#F89939',
    summary: 'Primary ML library for supervised learning, pipeline composition, and model evaluation.',
    frameworks: ['Pipeline API', 'SMOTE (imbalanced-learn)', 'Elastic Net', 'GridSearchCV', 'cross_val_score'],
    projects: ['Seizure Prediction ML Model'],
    level: 'Comfortable',
  },

  /* ── Databases ──────────────────────────────────────────── */
  {
    name: 'PostgreSQL',
    icon: 'postgresql',
    category: 'Database',
    color: '#336791',
    summary: 'Relational database for all production projects. Schema design, stored procedures, views, indexing, soft deletes.',
    frameworks: ['SQLAlchemy ORM', 'Raw SQL', 'psycopg2', 'pgAdmin 4'],
    projects: ['Makkah Foods POS (14-table schema)', 'Real Estate AI', 'SIEM Platform'],
    level: 'Proficient',
  },

  /* ── Tools ──────────────────────────────────────────────── */
  {
    name: 'Linux',
    icon: 'linux',
    category: 'Tool',
    color: '#FCC624',
    summary: 'Daily driver OS (Fedora). System administration, bash scripting, process management, KVM/QEMU lab setup.',
    frameworks: ['Bash scripting', 'Systemd', 'PipeWire', 'KVM/QEMU', 'Ollama', 'Apache'],
    projects: ['All projects — developed entirely on Linux'],
    level: 'Proficient',
  },
  {
    name: 'Git',
    icon: 'git',
    category: 'Tool',
    color: '#F05032',
    summary: 'Version control for all projects. Feature branches, PAT-authenticated pushes, GitHub remote management.',
    frameworks: ['GitHub', 'PAT auth', 'Bash push scripts'],
    projects: ['All projects'],
    level: 'Proficient',
  },
  {
    name: 'Docker',
    icon: 'docker',
    category: 'Tool',
    color: '#2496ED',
    summary: 'Containerisation for deployment and environment isolation. Used in SIEM FYP infrastructure layer.',
    frameworks: ['Dockerfile', 'docker-compose', 'volume mounts'],
    projects: ['SIEM Platform (FYP)'],
    level: 'Learning',
  },

  /* ── Security ───────────────────────────────────────────── */
  {
    name: 'Kali Linux',
    icon: 'kali',
    category: 'Security',
    color: '#557C94',
    summary: 'Offensive security OS for penetration testing practice and real-client engagements.',
    frameworks: ['Nmap', 'Burp Suite', 'Metasploit', 'Netcat', 'Hydra', 'Gobuster'],
    projects: ['IMDigital LMS Pentest', 'KVM lab practice (Metasploitable 2)'],
    level: 'Comfortable',
  },
  {
    name: 'Burp Suite',
    icon: 'burpsuite',
    category: 'Security',
    color: '#FF6633',
    summary: 'Web application security testing. Intercepting proxies, IDOR discovery, session analysis, parameter tampering.',
    frameworks: ['Proxy', 'Repeater', 'Intruder', 'Scanner'],
    projects: ['IMDigital LMS Pentest'],
    level: 'Comfortable',
  },

  /* ── ML / AI ────────────────────────────────────────────── */
  {
    name: 'Gemini API',
    icon: 'gemini',
    category: 'ML',
    color: '#4285F4',
    summary: 'LLM integration for real-time Q&A, note generation, and multi-key fallback in production AI systems.',
    frameworks: ['google-generativeai SDK', 'Files API', 'multi-key cascade'],
    projects: ['Z Avatar', 'youtube_notes.py lecture recorder'],
    level: 'Comfortable',
  },
  {
    name: 'Pandas',
    icon: 'pandas',
    category: 'ML',
    color: '#150458',
    summary: 'Data manipulation and preprocessing for ML pipelines. EEG dataset cleaning, feature engineering, export.',
    frameworks: ['DataFrames', 'read_csv', 'groupby', 'merge', 'sklearn integration'],
    projects: ['Seizure Prediction ML Model'],
    level: 'Comfortable',
  },
]
