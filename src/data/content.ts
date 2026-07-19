import uvicImg from '../assets/projects/uvic-scheduler.png'
import nutridineImg from '../assets/projects/nutridine.png'
import passedwordsImg from '../assets/projects/passedwords.jpg'
import seqbioImg from '../assets/projects/seq-bio.png'

export const OWNER = {
  name: 'Mehrad Adimi',
  role: 'Software Developer',
  location: 'Victoria, BC',
  tagline: 'I build things for the web, the terminal, and everything in between.',
  quote: '"Happiness is found in doing, not merely possessing." — Napoleon Hill',
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
    role: 'Software Developer I',
    company: 'Duplex',
    org: 'Redbrick Media',
    location: 'Victoria, BC',
    period: 'Jan 2025 — Present',
    bullets: [
      'Drove the DynamoDB → Postgres + OpenSearch migration across the core API in Python and Flask, retiring a legacy search and precomputed-feed stack.',
      'Architected an internal MCP server exposing a cross-repo knowledge graph over six private repos (Memgraph + OpenAI embeddings) — 15× token reduction, 5.5× faster than grep-and-read.',
      'Led the company-wide AI Working Group — MCP servers, Claude Code, Cursor, and authoring Claude Skills.',
    ],
    tech: ['Python', 'Flask', 'Postgres', 'OpenSearch', 'AWS', 'Terraform', 'TypeScript'],
  },
  {
    role: 'Software Engineer',
    company: 'Dopa',
    org: 'Part-Time',
    location: 'Remote',
    period: 'Apr 2025 — Present',
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
    period: 'Apr 2024 — Dec 2024',
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
    period: 'Sep 2021 — Jul 2022',
    bullets: [
      'Built an end-to-end Puppeteer test suite for a Chromium-based desktop browser — 120+ test cases across navigation, bookmarks, settings, and account flows.',
      'Led cross-platform release testing (Apple Silicon, Mac Intel, Windows); closed front-end React bugs surfaced by automation and earned a Full-Stack co-op return offer.',
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
    name: 'UVic Scheduler',
    subtitle: 'Course scheduling web app · University of Victoria',
    period: 'May 2023 — Sep 2023',
    description:
      'Key front-end developer on a course scheduling tool. React + TypeScript front-end with a Django back-end, CI/CD through GitHub Actions, deployed via GitHub Pages.',
    tech: ['React', 'TypeScript', 'Django', 'GitHub Actions'],
    image: uvicImg,
  },
  {
    name: 'NutriDine',
    subtitle: 'Progressive web app',
    period: 'Dec 2023 — Present',
    description:
      'Find restaurants by meal nutrition and calorie content. React + TypeScript with Firebase (Firestore, Auth via Google/GitHub/Twitter), NutritionX API and Google location-based suggestions. Deployed on Netlify.',
    tech: ['React', 'TypeScript', 'Firebase', 'NutritionX API'],
    link: 'https://nutridine.netlify.app',
    image: nutridineImg,
  },
  {
    name: 'PassedWords',
    subtitle: 'Mobile password manager',
    period: 'Oct 2024 — Present',
    description:
      'Secure password manager in React Native (Expo) with AES-256 encryption via CryptoES, Ethereum blockchain storage through Web3 & ethers.js, and Firebase Auth + Firestore.',
    tech: ['React Native', 'Expo', 'CryptoES', 'ethers.js', 'Firebase'],
    link: 'https://github.com/mehradadimi/PassedWords/',
    image: passedwordsImg,
  },
  {
    name: 'SEQ-Bio',
    subtitle: 'Rust bioinformatics toolkit',
    period: 'Sep 2023 — Dec 2023',
    description:
      'Contributor to rust-bio-seq: string matching (BNDM, BOM), sequence alignment, suffix trees (PSSM, Ukkonen), bit trees, wavelet matrices, and hidden Markov models.',
    tech: ['Rust', 'Bioinformatics', 'Algorithms'],
    image: seqbioImg,
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
