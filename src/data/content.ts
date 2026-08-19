import doorknobImg from '../assets/projects/doorknob.png'
import hiveImg from '../assets/projects/hive.png'
import codebaseMasterImg from '../assets/projects/codebase-master.png'
import meetingVaultImg from '../assets/projects/meeting-vault.png'
import nutridineImg from '../assets/projects/nutridine.png'

export const OWNER = {
  name: 'Mehrad Adimi',
  role: 'Software Developer',
  location: 'Victoria, BC',
  tagline: 'I build things for the web, the terminal, and everything in between.',
  quote: '"Happiness is found in doing, not merely possessing." (Napoleon Hill)',
  email: 'mehradadimica@gmail.com',
  formRecipient: 'meri.ad900@gmail.com',
  github: 'https://github.com/mehradadimi/',
  linkedin: 'https://www.linkedin.com/in/mehradadimi2020/',
  domain: 'https://mehradadimi.com/',
}

export interface Job {
  role: string
  company: string
  org: string
  location: string
  period: string
  bullets: string[]
  tech: string[]
}

export const EXPERIENCE: Job[] = [
  {
    role: 'Software Developer II',
    company: 'Duplex',
    org: 'a Redbrick company',
    location: 'Victoria, BC',
    period: 'Jan 2025 - Present',
    bullets: [
      'Cut agent token use 15x and cross-repo query time 5.5x by building the Duplex Context Engine, a company brain linking every repository into a Memgraph graph served over an authenticated MCP server.',
      'Led the company AI Working Group and shipped opt-in automated code review any team enables in five lines of CI, on a provider-agnostic library spanning Anthropic, OpenAI and Google.',
      'Automated article categorization for a news platform in Python on AWS Lambda and Step Functions, sorting every article into a 12-category taxonomy with structured-output prompting and a rules-based fallback.',
      'Delivered an embeddable widget SDK that put a personalized ad-supported feed on partner sites in one script tag, with versioned CDN releases so partners picked up updates without touching their embed.',
      'Owned the ingestion pipeline behind a partner integration serving roughly 200M monthly pageviews, cutting runtime from 13 to 5 minutes and adding per-partner source controls and deduplication.',
      'Lifted reader engagement 35% by leading the ground-up rebuild of qz.com, delivering every reader-facing template on Next.js and a headless CMS behind a feature flag, then retiring the legacy design stack.',
    ],
    tech: ['Python', 'TypeScript', 'Next.js', 'AWS Lambda', 'Step Functions', 'Memgraph', 'MCP'],
  },
  {
    role: 'Software Engineer',
    company: 'Dopa',
    org: 'Part-Time',
    location: 'Remote',
    period: 'Apr 2025 - Present',
    bullets: [
      'Architected an iOS health-verification subsystem: Postgres with row-level security, a Deno edge function with per-user rate limiting, and a HealthKit abstraction gating daily check-ins.',
      'Built the analytics + feature-flag system on PostHog with identify-on-signin, anonymous-to-identified merging, and a typed feature-flag registry.',
    ],
    tech: ['React Native', 'Expo', 'Supabase', 'Postgres', 'Deno', 'PostHog', 'HealthKit'],
  },
  {
    role: 'Full-Stack Developer Co-op',
    company: 'Shift',
    org: 'Redbrick Media',
    location: 'Victoria, BC',
    period: 'Apr 2024 - Dec 2024',
    bullets: [
      "Owned migration of Chromium's built-in pages (bookmarks, history, settings, downloads) onto the product's design system via a CSS injection layer.",
      "Built bidirectional sync between Chromium's native bookmarks engine and a MobX state store, plus the custom keyboard-shortcut system on Chromium's commands API.",
    ],
    tech: ['React', 'MobX', 'Chromium', 'TypeScript'],
  },
  {
    role: 'QA Specialist Co-op',
    company: 'Shift',
    org: 'Redbrick Media',
    location: 'Victoria, BC',
    period: 'Sep 2021 - Jul 2022',
    bullets: [
      'Built an end-to-end Puppeteer test suite for a Chromium-based desktop browser with 120+ test cases across navigation, bookmarks, settings, and account flows.',
      'Led cross-platform release testing (Apple Silicon, Mac Intel, Windows), closed front-end React bugs surfaced by automation, and earned a Full-Stack co-op return offer.',
    ],
    tech: ['Puppeteer', 'JavaScript', 'React'],
  },
]

export interface SkillGroup {
  label: string
  key: string
  items: string[]
}

export const SKILLS: SkillGroup[] = [
  { label: 'Languages', key: 'L', items: ['Python', 'TypeScript', 'JavaScript', 'Rust', 'SQL', 'Bash', 'HTML', 'CSS'] },
  { label: 'Frameworks', key: 'F', items: ['React', 'Next.js', 'Vue', 'Nuxt', 'React Native', 'Expo', 'Node.js', 'Express', 'Nest.js', 'Flask', 'Tauri', 'Tailwind CSS'] },
  { label: 'Infrastructure', key: 'I', items: ['AWS', 'GCP', 'Docker', 'Terraform', 'Cloudflare', 'Vercel', 'Fly.io', 'GitHub Actions', 'Sentry'] },
  { label: 'Databases', key: 'D', items: ['Postgres', 'MySQL', 'SQLite', 'Firebase', 'OpenSearch', 'Memgraph'] },
  { label: 'Tools', key: 'T', items: ['Git', 'Jira', 'Stripe', 'Datadog', 'PostHog', 'Claude Code', 'Cursor', 'MCP', 'Whisper', 'Ollama', 'Apple HealthKit'] },
]

export interface Project {
  name: string
  subtitle: string
  period: string
  description: string
  tech: string[]
  link?: string
  image: string
}

export const PROJECTS: Project[] = [
  {
    name: 'Meeting Vault',
    subtitle: '100% local meeting intelligence · macOS',
    period: 'Mar 2026 - Present',
    description:
      'Records meeting audio with ScreenCaptureKit, transcribes on-device via whisper.cpp, separates speakers, and has a local Ollama LLM extract decisions and action items into a SQLite-backed knowledge graph with RAG search. No network, one binary, all local.',
    tech: ['Tauri', 'Rust', 'React 19', 'whisper.cpp', 'Ollama', 'SQLite', 'ScreenCaptureKit'],
    image: meetingVaultImg,
  },
  {
    name: 'Doorknob',
    subtitle: 'AI receptionist for local businesses',
    period: 'Jul 2026 - Present',
    description:
      "Rebuilds a local business's one-page site with an AI receptionist embedded that answers customers and books real appointments 24/7, no phone ringing. Built on the Claude Agent SDK with an in-process MCP booking tool, and one backend serves every business as a config row, not a deployment.",
    tech: ['Next.js', 'TypeScript', 'Claude Agent SDK', 'MCP', 'Zod', 'Vercel'],
    image: doorknobImg,
  },
  {
    name: 'Hive',
    subtitle: 'NFC digital business cards',
    period: 'Jan 2026 - Present',
    description:
      'Tap a physical NFC card, share your profile instantly. A mobile-first PWA with five card templates, follow-up emails, lifetime analytics, Apple Wallet passes, and Stripe-powered card sales and subscriptions.',
    tech: ['Next.js', 'React 19', 'TypeScript', 'Supabase', 'Drizzle', 'Stripe', 'Fly.io'],
    link: 'https://tryhive.co',
    image: hiveImg,
  },
  {
    name: 'Codebase Master',
    subtitle: 'Retrieval + graph MCP stack',
    period: 'Dec 2025',
    description:
      'Ingests any codebase, JIRA project, and Confluence space into a unified vector + Neo4j graph store, exposed over MCP so AI assistants can trace Issue ↔ PR ↔ Commit ↔ File ↔ Symbol and answer "which issues touch this file?"',
    tech: ['Python', 'TypeScript', 'Neo4j', 'Postgres', 'OpenAI embeddings', 'MCP', 'Docker'],
    image: codebaseMasterImg,
  },
  {
    name: 'NutriDine',
    subtitle: 'Progressive web app',
    period: 'Dec 2023 - Present',
    description:
      'Find restaurants by meal nutrition and calorie content. React + TypeScript with Firebase (Firestore, Auth via Google/GitHub/Twitter), NutritionX API and Google location-based suggestions. Deployed on Netlify.',
    tech: ['React', 'TypeScript', 'Firebase', 'NutritionX API'],
    link: 'https://nutridine.netlify.app',
    image: nutridineImg,
  },
]

export const SECTIONS = ['home', 'skills', 'experience', 'projects', 'contact'] as const
export type SectionId = (typeof SECTIONS)[number]

export const COMMANDS: Record<string, SectionId> = {
  home: 'home',
  top: 'home',
  skills: 'skills',
  ls: 'skills',
  experience: 'experience',
  exp: 'experience',
  work: 'experience',
  projects: 'projects',
  proj: 'projects',
  contact: 'contact',
  hi: 'contact',
  email: 'contact',
}
