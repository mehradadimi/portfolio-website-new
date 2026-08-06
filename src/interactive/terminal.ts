// The interactive-mode shell that runs "on" the 3D monitor. A tiny virtual
// filesystem is generated from the site content; keystrokes come in via
// termKey(), and the Monitor canvas repaints on every change.
import { EXPERIENCE, OWNER, PROJECTS, SKILLS } from '../data/content'
import { useStore } from '../state/store'

export type TermKind = 'in' | 'out' | 'accent' | 'dim'
export interface TermLine {
  text: string
  kind: TermKind
}

export const TERM_PROMPT = 'visitor@mehrad-desk ~ %'
const COLS = 62
const MAX_LINES = 400

const BANNER: TermLine[] = [
  { text: 'MEHRAD-DESK v2.0 — welcome, visitor.', kind: 'accent' },
  { text: 'you are typing on my actual keyboard. be nice to it.', kind: 'dim' },
  { text: 'type "help" to see what you can do.', kind: 'dim' },
  { text: '', kind: 'out' },
]

let lines: TermLine[] = [...BANNER]
let input = ''
let history: string[] = []
let histIdx = -1

const listeners = new Set<() => void>()
export function onTerm(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
function notify() {
  for (const fn of listeners) fn()
}

export function termState(): { lines: TermLine[]; input: string } {
  return { lines, input }
}

function push(text: string, kind: TermKind = 'out') {
  // wrap long lines to the monitor's column width
  if (text.length <= COLS) {
    lines.push({ text, kind })
  } else {
    for (let i = 0; i < text.length; i += COLS) {
      lines.push({ text: text.slice(i, i + COLS), kind })
    }
  }
  if (lines.length > MAX_LINES) lines = lines.slice(-MAX_LINES)
}

// ---------- virtual filesystem ----------

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '-')

const FILES: Record<string, () => string[]> = {
  'about.txt': () => [
    `${OWNER.name} — ${OWNER.role}`,
    OWNER.location,
    '',
    OWNER.tagline,
    OWNER.quote,
  ],
  'contact.txt': () => [
    `email:    ${OWNER.email}`,
    `github:   ${OWNER.github}`,
    `linkedin: ${OWNER.linkedin}`,
  ],
  'experience.log': () =>
    EXPERIENCE.flatMap((j) => [
      `* ${j.role} @ ${j.company} (${j.period})`,
      `  ${j.org} · ${j.location}`,
      ...j.bullets.map((b) => `  - ${b}`),
      '',
    ]),
  'secrets.txt': () => [],
}
for (const g of SKILLS) {
  FILES[`skills/${g.label.toLowerCase()}`] = () => [g.items.join(', ')]
}
for (const p of PROJECTS) {
  FILES[`projects/${slug(p.name)}.md`] = () => [
    `# ${p.name} — ${p.subtitle}`,
    p.period,
    '',
    p.description,
    '',
    `tech: ${p.tech.join(', ')}`,
    ...(p.link ? [`link: ${p.link}   (try: open ${slug(p.name)})`] : ['(private build — no public link)']),
  ]
}

const DIRS: Record<string, string[]> = {
  '': ['about.txt', 'contact.txt', 'experience.log', 'projects/', 'skills/', 'secrets.txt'],
  projects: PROJECTS.map((p) => `${slug(p.name)}.md`),
  skills: SKILLS.map((g) => g.label.toLowerCase()),
}

// ---------- commands ----------

function exec(raw: string) {
  push(`${TERM_PROMPT} ${raw}`, 'in')
  const [cmd, ...args] = raw.trim().split(/\s+/)
  const arg = args.join(' ')

  switch (cmd) {
    case '':
      break
    case 'help':
      push('commands:', 'accent')
      push('  ls [dir]        look around (try: ls projects)')
      push('  cat <file>      read a file (try: cat about.txt)')
      push('  open <project>  open a project in a new tab')
      push('  neofetch        system info')
      push('  whoami · pwd · clear · theme <dark|light>')
      push('  exit            leave my desk, back to the site')
      break
    case 'ls': {
      const dir = arg.replace(/\/$/, '')
      const entries = DIRS[dir]
      if (entries) entries.forEach((e) => push(e))
      else push(`ls: ${arg}: no such directory`, 'dim')
      break
    }
    case 'cat': {
      if (arg === 'secrets.txt') {
        push('cat: secrets.txt: permission denied', 'dim')
        push('(you could always try sudo…)', 'dim')
        break
      }
      const file = FILES[arg.replace(/^\.\//, '')]
      if (file) file().forEach((l) => push(l))
      else push(`cat: ${arg}: no such file`, 'dim')
      break
    }
    case 'open': {
      const p = PROJECTS.find((x) => slug(x.name) === slug(arg).replace(/\.md$/, ''))
      if (p?.link) {
        push(`opening ${p.name} …`, 'accent')
        window.open(p.link, '_blank', 'noopener')
      } else if (p) {
        push(`${p.name} is a private build — nothing to open. cat projects/${slug(p.name)}.md instead.`, 'dim')
      } else {
        push(`open: ${arg}: not found. try "ls projects"`, 'dim')
      }
      break
    }
    case 'neofetch':
      push('        ▲          visitor@mehrad-desk', 'accent')
      push('       ▲ ▲         ------------------', 'dim')
      push(`      ▲   ▲        OS:      mehradOS (100% local)`)
      push(`     ▲ ▲ ▲ ▲       Host:    floating desk island`)
      push(`                   Shell:   you, apparently`)
      push(`    ${OWNER.name}   Uptime:  shipping since 2021`)
      push(`                   Editor:  Claude Code + Cursor`)
      push(`                   Theme:   ${useStore.getState().theme} (+ coral)`)
      break
    case 'whoami':
      push('visitor — but the desk belongs to:')
      FILES['about.txt']().forEach((l) => push(l))
      break
    case 'pwd':
      push('/home/mehrad/desk')
      break
    case 'clear':
      lines = []
      break
    case 'theme': {
      const t = arg === 'light' || arg === 'dark' ? arg : null
      if (t) {
        if (useStore.getState().theme !== t) useStore.getState().toggleTheme()
        push(`theme set to ${t}`, 'accent')
      } else push('usage: theme <dark|light>', 'dim')
      break
    }
    case 'sudo':
      if (arg.includes('secrets')) {
        push('[sudo] password for visitor: ********', 'dim')
        push('secrets.txt:', 'accent')
        push('  the konami code works everywhere on this site.')
        push('  ↑ ↑ ↓ ↓ ← → ← → B A', 'accent')
      } else {
        push('visitor is not in the sudoers file.', 'dim')
        push('this incident will be reported. (to no one. it is my desk.)', 'dim')
      }
      break
    case 'exit':
      push('logging out…', 'accent')
      window.setTimeout(() => useStore.getState().setMode('normal'), 350)
      break
    case 'vim':
    case 'nano':
    case 'emacs':
      push(`${cmd}: no editors at my desk. we use Claude Code here.`, 'dim')
      break
    case 'rm':
      push('rm: nice try.', 'dim')
      break
    default:
      push(`${cmd}: command not found — try "help"`, 'dim')
  }
}

export function termKey(key: string, _code: string): void {
  if (key.length === 1) {
    input += key
  } else if (key === 'Backspace') {
    input = input.slice(0, -1)
  } else if (key === 'Enter') {
    const cmd = input
    input = ''
    if (cmd.trim()) {
      history.push(cmd)
      if (history.length > 50) history = history.slice(-50)
    }
    histIdx = -1
    exec(cmd)
  } else if (key === 'ArrowUp') {
    if (history.length) {
      histIdx = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1)
      input = history[histIdx]
    }
  } else if (key === 'ArrowDown') {
    if (histIdx >= 0) {
      histIdx = histIdx >= history.length - 1 ? -1 : histIdx + 1
      input = histIdx < 0 ? '' : history[histIdx]
    }
  } else {
    return
  }
  notify()
}

export function resetTerm(): void {
  lines = [...BANNER]
  input = ''
  notify()
}
