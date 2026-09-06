import { useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { EXPERIENCE, OWNER, PROJECTS, SECTIONS, SKILLS, type SectionId } from '../data/content'
import { useStore } from '../state/store'
import { resetTerm } from '../interactive/terminal'
import { CheckIcon, CopyIcon, ExternalIcon, GithubIcon, LinkedinIcon, MailIcon } from '../components/Icons'
import deskPreview from '../assets/desk-preview.jpg'

// ---------------------------------------------------------------------------
// Scene shell: outer element sets the scroll length, inner pin stays
// fullscreen while the scene's timeline scrubs through its frames.
// ---------------------------------------------------------------------------

interface SceneProps {
  id: string
  index: number
  heightVh: number
  children: ReactNode
  build: (tl: gsap.core.Timeline) => void
}

function Scene({ id, index, heightVh, children, build }: SceneProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      })
      build(tl)
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (!self.isActive) return
          useStore.getState().setScene(index)
          if ((SECTIONS as readonly string[]).includes(id)) {
            useStore.getState().setActiveSection(id as SectionId)
          }
        },
      })
    },
    { scope: ref },
  )

  return (
    <section id={id} ref={ref} className="scene" style={{ height: `${heightVh}vh` }}>
      <div className="scene-pin">{children}</div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// SCENE 01 · OPENING
// ---------------------------------------------------------------------------

export function OpeningScene() {
  return (
    <Scene
      id="home"
      index={0}
      heightVh={220}
      build={(tl) => {
        // hold, then the title card recedes like a cut
        tl.to({}, { duration: 0.55 })
          .to('.op-name', { scale: 1.12, opacity: 0, duration: 0.3 }, 'out')
          .to('.op-kicker, .op-tag, .op-hint', { opacity: 0, y: -30, stagger: 0.04, duration: 0.22 }, 'out')
      }}
    >
      <div className="scene-inner op">
        <p className="mono op-kicker">{'// software developer · victoria, bc'}</p>
        <h1 className="op-name">
          MEHRAD
          <br />
          ADIMI<em>.</em>
        </h1>
        <p className="op-tag">{OWNER.tagline}</p>
        <p className="mono op-hint">scroll the story ↓</p>
      </div>
    </Scene>
  )
}

// ---------------------------------------------------------------------------
// SCENE 02 · SKILLS
// ---------------------------------------------------------------------------

export function SkillsScene() {
  return (
    <Scene
      id="skills"
      index={1}
      heightVh={300}
      build={(tl) => {
        // the first group is visible on arrival — never a blank screen
        gsap.set('.sk-row:not(.sk-row-0)', { opacity: 0, y: 44 })
        gsap.set('.sk-row:not(.sk-row-0) .keycap', { opacity: 0, y: 18, scale: 0.92 })
        tl.to({}, { duration: 0.14 })
        SKILLS.forEach((_, i) => {
          if (i === 0) return
          tl.to(`.sk-row-${i}`, { opacity: 1, y: 0, duration: 0.1 })
          tl.to(`.sk-row-${i} .keycap`, { opacity: 1, y: 0, scale: 1, stagger: 0.012, duration: 0.1 }, '<0.03')
          tl.to({}, { duration: 0.08 })
        })
        tl.to({}, { duration: 0.3 })
      }}
    >
      <div className="scene-inner">
        <h2 className="mono scene-heading">{'// skills'}</h2>
        <div className="sk-rows">
          {SKILLS.map((group, i) => (
            <div key={group.label} className={`sk-row sk-row-${i}`}>
              <span className="mono sk-label">{group.label}</span>
              <div className="sk-caps">
                {group.items.map((item) => (
                  <span key={item} className="keycap">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  )
}

// ---------------------------------------------------------------------------
// SCENE 03 · EXPERIENCE
// ---------------------------------------------------------------------------

export function ExperienceScene() {
  return (
    <Scene
      id="experience"
      index={2}
      heightVh={380}
      build={(tl) => {
        gsap.set('.xp-frame', { opacity: 0, y: 60, pointerEvents: 'none' })
        gsap.set('.xp-frame-0', { opacity: 1, y: 0 })
        EXPERIENCE.forEach((_, i) => {
          if (i > 0) {
            tl.to(`.xp-frame-${i - 1}`, { opacity: 0, y: -60, duration: 0.16 })
            tl.to(`.xp-frame-${i}`, { opacity: 1, y: 0, duration: 0.16 }, '<0.06')
          }
          tl.to({}, { duration: 0.55 })
        })
      }}
    >
      <div className="scene-inner">
        <h2 className="mono scene-heading">{'// experience'}</h2>
        {EXPERIENCE.map((job, i) => (
          <div key={job.role + job.period} className={`xp-frame xp-frame-${i}`}>
            <div className="xp-left">
              <span className="mono xp-index">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="xp-role">{job.role}</h3>
              <p className="xp-company">
                @ {job.company} <span className="mono">({job.org})</span>
              </p>
              <p className="mono xp-meta">
                {job.location} · {job.period}
              </p>
            </div>
            <div className="xp-right">
              <ul>
                {job.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
              <div className="sk-caps">
                {job.tech.map((t) => (
                  <span key={t} className="keycap keycap-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Scene>
  )
}

// ---------------------------------------------------------------------------
// SCENE 04 · PROJECTS
// ---------------------------------------------------------------------------

export function ProjectsScene() {
  return (
    <Scene
      id="projects"
      index={3}
      heightVh={460}
      build={(tl) => {
        gsap.set('.pr-frame', { opacity: 0, pointerEvents: 'none' })
        gsap.set('.pr-frame .pr-text', { y: 50 })
        gsap.set('.pr-frame .pr-media', { clipPath: 'inset(12% 12% 12% 12%)', scale: 1.06 })
        gsap.set('.pr-frame-0', { opacity: 1, pointerEvents: 'auto' })
        gsap.set('.pr-frame-0 .pr-text', { y: 0 })
        gsap.set('.pr-frame-0 .pr-media', { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 })
        PROJECTS.forEach((_, i) => {
          if (i > 0) {
            tl.to(`.pr-frame-${i - 1}`, { opacity: 0, pointerEvents: 'none', duration: 0.14 })
            tl.to(`.pr-frame-${i}`, { opacity: 1, pointerEvents: 'auto', duration: 0.14 }, '<0.05')
            tl.to(`.pr-frame-${i} .pr-text`, { y: 0, duration: 0.16 }, '<')
            tl.to(
              `.pr-frame-${i} .pr-media`,
              { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.18 },
              '<',
            )
          }
          tl.to({}, { duration: 0.5 })
        })
      }}
    >
      <div className="scene-inner">
        <h2 className="mono scene-heading">{'// projects'}</h2>
        {PROJECTS.map((project, i) => (
          <div key={project.name} className={`pr-frame pr-frame-${i}`}>
            <div className="pr-text">
              <p className="mono pr-sub">
                {String(i + 1).padStart(2, '0')} · {project.subtitle}
              </p>
              <h3 className="pr-name">{project.name}</h3>
              <p className="mono pr-period">{project.period}</p>
              <p className="pr-desc">{project.description}</p>
              <div className="sk-caps">
                {project.tech.map((t) => (
                  <span key={t} className="keycap keycap-sm">
                    {t}
                  </span>
                ))}
              </div>
              {project.link && (
                <a className="btn btn-accent pr-visit" href={project.link} target="_blank" rel="noreferrer noopener">
                  <ExternalIcon /> visit
                </a>
              )}
            </div>
            <div className="pr-media">
              <img src={project.image} alt={`${project.name} screenshot`} loading="lazy" />
            </div>
          </div>
        ))}
      </div>
    </Scene>
  )
}

// ---------------------------------------------------------------------------
// SCENE 05 · THE DESK
// ---------------------------------------------------------------------------

export function DeskScenePitch() {
  const setMode = useStore((s) => s.setMode)
  return (
    <Scene
      id="desk"
      index={4}
      heightVh={260}
      build={(tl) => {
        // both headline lines visible on arrival; the reveal is the media
        gsap.set('.dk-media', { opacity: 0, scale: 0.94, rotateX: 6 })
        gsap.set('.dk-actions', { opacity: 0, y: 24 })
        tl.to({}, { duration: 0.18 })
          .to('.dk-media', { opacity: 1, scale: 1, rotateX: 0, duration: 0.28 })
          .to('.dk-actions', { opacity: 1, y: 0, duration: 0.16 })
          .to({}, { duration: 0.38 })
      }}
    >
      <div className="scene-inner dk">
        <h2 className="dk-line">
          THIS SITE HAS A <em>SECOND MODE</em>.
        </h2>
        <h2 className="dk-line dk-line-2">SIT AT MY DESK.</h2>
        <div className="dk-media">
          <img src={deskPreview} alt="Mehrad's interactive 3D desk" />
        </div>
        <div className="dk-actions">
          <button
            className="btn btn-accent"
            onClick={() => {
              resetTerm()
              setMode('interactive')
            }}
          >
            ⌨ enter the desk
          </button>
          <p className="mono dk-hint">
            a 3D desk you can walk around. type on my keyboard, snoop through my computer. esc brings you back.
          </p>
        </div>
      </div>
    </Scene>
  )
}

// ---------------------------------------------------------------------------
// SCENE 06 · CONTACT
// ---------------------------------------------------------------------------

export function ContactScene() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(OWNER.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${OWNER.email}`
    }
  }

  return (
    <Scene
      id="contact"
      index={5}
      heightVh={200}
      build={(tl) => {
        // title visible on arrival; the rest staggers in
        gsap.set('.ct-blurb, .ct-actions, .ct-footer', { opacity: 0, y: 36 })
        tl.to({}, { duration: 0.1 })
          .to('.ct-blurb', { opacity: 1, y: 0, duration: 0.14 })
          .to('.ct-actions', { opacity: 1, y: 0, duration: 0.14 })
          .to('.ct-footer', { opacity: 1, y: 0, duration: 0.12 })
          .to({}, { duration: 0.5 })
      }}
    >
      <div className="scene-inner ct">
        <h2 className="mono scene-heading">{'// contact'}</h2>
        <h3 className="ct-title">
          LET'S BUILD
          <br />
          SOMETHING<em>.</em>
        </h3>
        <p className="ct-blurb">
          Whether it's a project, a role, or just to talk shop about MCP servers and mechanical keyboards, my inbox
          is open.
        </p>
        <div className="ct-actions">
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
        <p className="mono ct-footer">
          © {new Date().getFullYear()} Mehrad Adimi · fin · the konami code rolls the credits
        </p>
      </div>
    </Scene>
  )
}
