import { useEffect, useMemo } from 'react'
import { EXPERIENCE, OWNER, PROJECTS, SKILLS } from '../data/content'
import { useStore } from '../state/store'
import { SCENE_LABELS } from '../scenes/SceneHUD'

// The Konami payoff: end credits for a site built like a film. Every line is
// true — the crew is the actual stack, the counts come from the site's data.
export function CreditsRoll() {
  const open = useStore((s) => s.creditsOpen)
  const setCreditsOpen = useStore((s) => s.setCreditsOpen)

  const counts = useMemo(() => {
    const tech = new Set<string>()
    PROJECTS.forEach((p) => p.tech.forEach((t) => tech.add(t)))
    EXPERIENCE.forEach((j) => j.tech.forEach((t) => tech.add(t)))
    SKILLS.forEach((g) => g.items.forEach((i) => tech.add(i)))
    return {
      scenes: SCENE_LABELS.length,
      projects: PROJECTS.length,
      roles: EXPERIENCE.length,
      tech: tech.size,
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCreditsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setCreditsOpen])

  if (!open) return null

  const crew: Array<[string, string]> = [
    ['DIRECTED BY', OWNER.name],
    ['WRITTEN BY', OWNER.name],
    ['STARRING', 'a 60% mechanical keyboard'],
    ['SUPPORTING CAST', 'one very patient office chair'],
    ['CAMERA', 'react-three-fiber'],
    ['LIGHTING', 'three.js'],
    ['CHOREOGRAPHY', 'GSAP ScrollTrigger'],
    ['DOLLY GRIP', 'Lenis'],
    ['ORIGINAL SCORE', 'Web Audio API (thock, synthesized)'],
    ['TYPEFACES', 'Tektur · Inter · PT Mono'],
    ['BUILT WITH', 'Vite · React 19 · TypeScript'],
    ['VISUAL EFFECTS', 'far too much quaternion math'],
    ['CATERING', 'coffee, mostly'],
  ]

  const stats: Array<[string, string]> = [
    ['SCENES', String(counts.scenes)],
    ['PROJECTS SHIPPED', String(counts.projects)],
    ['ROLES PLAYED', String(counts.roles)],
    ['TECHNOLOGIES CREDITED', String(counts.tech)],
    ['KEYCAPS PRESSED', '∞'],
  ]

  return (
    <div
      className="credits"
      role="dialog"
      aria-label="End credits"
      onClick={() => setCreditsOpen(false)}
    >
      <div className="credits-roll">
        <p className="mono credits-presents">{OWNER.name.toUpperCase()} PRESENTS</p>
        <h2 className="credits-title">
          THE DESK<em>.</em>
        </h2>
        <p className="mono credits-tag">a portfolio in six scenes</p>

        <div className="credits-block">
          {crew.map(([role, who]) => (
            <div className="credits-row" key={role}>
              <span className="mono credits-role">{role}</span>
              <span className="credits-who">{who}</span>
            </div>
          ))}
        </div>

        <p className="mono credits-section">BY THE NUMBERS</p>
        <div className="credits-block">
          {stats.map(([label, value]) => (
            <div className="credits-row" key={label}>
              <span className="mono credits-role">{label}</span>
              <span className="credits-who">{value}</span>
            </div>
          ))}
        </div>

        <p className="mono credits-section">FILMED ON LOCATION IN</p>
        <p className="credits-location">{OWNER.location}</p>

        <p className="mono credits-fine">No keycaps were harmed in the making of this website.</p>
        <p className="mono credits-fine">
          You found the Konami code. That earns you an email address:{' '}
          <a href={`mailto:${OWNER.email}`}>{OWNER.email}</a>
        </p>

        <p className="credits-fin">FIN<em>.</em></p>
      </div>
      <button className="credits-close mono" onClick={() => setCreditsOpen(false)}>
        esc · skip credits
      </button>
    </div>
  )
}
