import { useState, type FormEvent } from 'react'
import { EXPERIENCE, OWNER, PROJECTS, SKILLS } from '../data/content'
import { perfTier } from '../hooks/perf'
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
            <>tap the keyboard — or just scroll</>
          ) : (
            <>
              &gt; type <b>"projects"</b> ↵ — or just scroll
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

export function Experience() {
  return (
    <section id="experience" className="section section-experience">
      <div className="section-inner">
        <h2 className="section-heading" data-reveal>{'// experience'}</h2>
        <p className="xp-sub" data-reveal>
          A timeline of where I've built, broken, and shipped things.
        </p>
        <div className="xp-list">
          {EXPERIENCE.map((job) => (
            <div key={job.role + job.period} className="glass xp-card" data-reveal>
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
          Whether it's a project, a role, or just to talk shop about MCP servers and mechanical keyboards — my
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
              {status === 'sent' && 'sent — talk soon!'}
              {status === 'error' && 'something broke — email me directly instead?'}
            </p>
          </form>
        )}
        <p className="site-footer" data-reveal>
          © {new Date().getFullYear()} Mehrad Adimi — three.js · GSAP · react — try the Konami code
        </p>
      </div>
    </section>
  )
}
