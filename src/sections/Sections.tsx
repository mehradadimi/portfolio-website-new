import { useRef, useState, type FormEvent } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { EXPERIENCE, OWNER, PROJECTS, SKILLS } from '../data/content'
import { perfTier } from '../hooks/perf'
import { prefersReducedMotion } from '../scroll/scrollManager'
import { CheckIcon, CopyIcon, ExternalIcon, GithubIcon, LinkedinIcon, MailIcon } from '../components/Icons'

export function Hero() {
  return (
    <section id="home" className="section section-home">
      <div className="section-inner">
        <p className="hero-kicker" data-reveal>{'// software developer · victoria, bc'}</p>
        <h1 className="hero-name" data-reveal>
          Mehrad
          <br />
          Adimi<em>.</em>
        </h1>
        <p className="hero-tag" data-reveal>{OWNER.quote}</p>
        <p className="hero-hint" data-reveal>
          {perfTier.isTouch ? (
            <>tap the keyboard, or just scroll</>
          ) : (
            <>
              &gt; type <b>"projects"</b> ↵ or just scroll
            </>
          )}
        </p>
      </div>
    </section>
  )
}

export function Skills() {
  return (
    <section id="skills" className="section section-skills">
      <div className="section-inner">
        <h2 className="section-heading" data-reveal>{'// skills'}</h2>
        <div className="skills-grid">
          {SKILLS.map((group) => (
            <div key={group.label} className="glass skill-card" data-reveal>
              <h3>{group.label}</h3>
              <div className="chips">
                {group.items.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const COMMIT_HASHES = EXPERIENCE.map((_, i) => (0xd9e86e0 + i * 0x1f).toString(16).slice(0, 7))

export function Experience() {
  const listRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // The "career tree": a trunk that draws itself with scroll, sprouting a
  // branch + commit node + card per job.
  useGSAP(
    () => {
      const list = listRef.current
      const svg = svgRef.current
      if (!list || !svg) return
      const trunk = svg.querySelector<SVGPathElement>('.tree-trunk')!
      const branches = Array.from(svg.querySelectorAll<SVGPathElement>('.tree-branch'))
      const nodes = Array.from(svg.querySelectorAll<SVGGElement>('.tree-node'))
      const inners = Array.from(svg.querySelectorAll<SVGGElement>('.tree-node-inner'))
      const cards = Array.from(list.querySelectorAll<HTMLElement>('.xp-item'))
      const reduced = prefersReducedMotion()

      const build = () => {
        const W = list.clientWidth
        const H = list.clientHeight
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
        const mobile = window.innerWidth < 880
        const cx = mobile ? 14 : W / 2
        const amp = mobile ? 6 : 20
        trunk.setAttribute(
          'd',
          `M ${cx} 0 C ${cx - amp} ${H * 0.18} ${cx + amp} ${H * 0.32} ${cx} ${H * 0.5} C ${cx - amp} ${H * 0.68} ${cx + amp} ${H * 0.82} ${cx} ${H}`,
        )
        const trunkLen = trunk.getTotalLength()
        gsap.set(trunk, { strokeDasharray: trunkLen, strokeDashoffset: reduced ? 0 : trunkLen })

        cards.forEach((card, i) => {
          const y = card.offsetTop + 30
          // nearest point on the curved trunk to this card's anchor height
          let pt = { x: cx, y }
          let best = Infinity
          for (let s = 0; s <= 80; s++) {
            const p = trunk.getPointAtLength((trunkLen * s) / 80)
            const d = Math.abs(p.y - y)
            if (d < best) {
              best = d
              pt = { x: p.x, y: p.y }
            }
          }
          // nth-child parity counts the svg as the first child, so card 0 sits right
          const left = !mobile && i % 2 === 1
          const bx = mobile
            ? card.offsetLeft - 6
            : left
              ? card.offsetLeft + card.offsetWidth + 6
              : card.offsetLeft - 6
          branches[i]?.setAttribute('d', `M ${pt.x} ${pt.y} Q ${(pt.x + bx) / 2} ${pt.y - 16} ${bx} ${y}`)
          const bLen = branches[i]?.getTotalLength() ?? 0
          if (branches[i]) {
            gsap.set(branches[i], { strokeDasharray: bLen, strokeDashoffset: reduced ? 0 : bLen })
          }
          nodes[i]?.setAttribute('transform', `translate(${pt.x} ${pt.y})`)
          const label = nodes[i]?.querySelector('text')
          if (label) {
            const labelLeft = mobile ? false : !left // hash sits opposite the card
            label.setAttribute('x', labelLeft ? '-16' : '16')
            label.setAttribute('text-anchor', labelLeft ? 'end' : 'start')
          }
        })

        if (!reduced) {
          gsap.set(inners, { scale: 0, transformOrigin: '0 0' })
          gsap.set(cards, { opacity: 0, y: 26 })
        }
      }

      build()
      ScrollTrigger.addEventListener('refresh', build)

      if (!reduced) {
        gsap.to(trunk, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: list, start: 'top 78%', end: 'bottom 65%', scrub: 0.6 },
        })
        cards.forEach((card, i) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: card, start: 'top 82%', toggleActions: 'play none none reverse' },
          })
          if (branches[i]) tl.to(branches[i], { strokeDashoffset: 0, duration: 0.45, ease: 'power2.out' })
          if (inners[i]) tl.to(inners[i], { scale: 1, duration: 0.35, ease: 'back.out(2.5)' }, '-=0.15')
          tl.to(card, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')
        })
      }

      return () => ScrollTrigger.removeEventListener('refresh', build)
    },
    { scope: listRef },
  )

  return (
    <section id="experience" className="section section-experience">
      <div className="section-inner">
        <h2 className="section-heading" data-reveal>{'// experience'}</h2>
        <p className="xp-sub" data-reveal>
          A timeline of where I've built, broken, and shipped things, one branch at a time.
        </p>
        <div className="xp-list" ref={listRef}>
          <svg ref={svgRef} className="tree-svg" aria-hidden="true">
            <path className="tree-trunk" />
            {EXPERIENCE.map((_, i) => (
              <path key={`b${i}`} className="tree-branch" />
            ))}
            {EXPERIENCE.map((_, i) => (
              <g key={`n${i}`} className="tree-node">
                <g className="tree-node-inner">
                  <circle className="tree-ring" r="9" />
                  <circle className="tree-dot" r="4.5" />
                  <polygon className="tree-leaf" points="0,-19 7,-9 -4,-8" />
                  <text className="tree-hash" y="4">
                    {COMMIT_HASHES[i]}
                  </text>
                </g>
              </g>
            ))}
          </svg>
          {EXPERIENCE.map((job) => (
            <div key={job.role + job.period} className="glass xp-card xp-item">
              <h3>
                {job.role} <span>@ {job.company}</span>
              </h3>
              <p className="xp-meta">
                {job.org} · {job.location} · {job.period}
              </p>
              <ul>
                {job.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <div className="chips">
                {job.tech.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Projects() {
  return (
    <section id="projects" className="section section-projects">
      <div className="section-inner">
        <h2 className="section-heading" data-reveal>{'// projects'}</h2>
        <div className="projects-grid">
          {PROJECTS.map((project) => (
            <div key={project.name} className="glass project-card" data-reveal>
              <img src={project.image} alt={`${project.name} screenshot`} loading="lazy" />
              <div className="project-body">
                <h3>{project.name}</h3>
                <p className="project-period">
                  {project.subtitle} · {project.period}
                </p>
                <p>{project.description}</p>
                <div className="chips">
                  {project.tech.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <div className="project-links">
                    <a className="btn" href={project.link} target="_blank" rel="noreferrer noopener">
                      <ExternalIcon /> visit
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const BREVO_KEY: string | undefined = import.meta.env.VITE_BREVO_API_KEY

export function Contact() {
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(OWNER.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${OWNER.email}`
    }
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!BREVO_KEY) return
    const form = e.currentTarget
    const data = new FormData(form)
    setStatus('sending')
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': BREVO_KEY, 'content-type': 'application/json' },
        body: JSON.stringify({
          sender: { name: String(data.get('name')), email: OWNER.formRecipient },
          to: [{ email: OWNER.formRecipient }],
          replyTo: { email: String(data.get('email')) },
          subject: `Portfolio message from ${String(data.get('name'))}`,
          textContent: String(data.get('message')),
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section section-contact">
      <div className="section-inner">
        <h2 className="section-heading" data-reveal>{'// contact me'}</h2>
        <h3 className="contact-title" data-reveal>
          Let's build something.
        </h3>
        <p className="contact-blurb" data-reveal>
          Whether it's a project, a role, or just to talk shop about MCP servers and mechanical keyboards, my
          inbox is open.
        </p>
        <div className="contact-actions" data-reveal>
          <button className="btn btn-accent" onClick={copyEmail}>
            {copied ? <CheckIcon /> : <CopyIcon />} {copied ? 'copied!' : OWNER.email}
          </button>
          <a className="btn" href={`mailto:${OWNER.email}`}>
            <MailIcon /> email
          </a>
          <a className="btn" href={OWNER.github} target="_blank" rel="noreferrer noopener">
            <GithubIcon /> github
          </a>
          <a className="btn" href={OWNER.linkedin} target="_blank" rel="noreferrer noopener">
            <LinkedinIcon /> linkedin
          </a>
        </div>
        {BREVO_KEY && (
          <form className="contact-form" data-reveal onSubmit={submit}>
            <div>
              <label htmlFor="cf-name">name</label>
              <input id="cf-name" name="name" required autoComplete="name" />
            </div>
            <div>
              <label htmlFor="cf-email">email</label>
              <input id="cf-email" name="email" type="email" required autoComplete="email" />
            </div>
            <div>
              <label htmlFor="cf-message">message</label>
              <textarea id="cf-message" name="message" required />
            </div>
            <button className="btn btn-accent" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'sending…' : 'send'}
            </button>
            <p className="form-status">
              {status === 'sent' && 'sent. talk soon!'}
              {status === 'error' && 'something broke. email me directly instead?'}
            </p>
          </form>
        )}
        <p className="site-footer" data-reveal>
          © {new Date().getFullYear()} Mehrad Adimi
        </p>
      </div>
    </section>
  )
}
