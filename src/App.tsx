import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Navbar } from './components/Navbar'
import { ModeChooser, ExitChip, DeskHint } from './components/ModeChooser'
import { CommandHUD, type Flash } from './components/CommandHUD'
import { CreditsRoll } from './components/CreditsRoll'
import { SceneHUD } from './scenes/SceneHUD'
import {
  OpeningScene,
  SkillsScene,
  ExperienceScene,
  ProjectsScene,
  DeskScenePitch,
  ContactScene,
} from './scenes/Scenes'
import { useCommandInput } from './hooks/useCommandInput'
import { useStore } from './state/store'
import { destroyScroll, initScroll, pauseScroll } from './scroll/scrollManager'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const SceneCanvas = lazy(() => import('./scene/SceneCanvas'))

const Poster = () => <div className="scene-poster" aria-hidden="true" />

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [flash, setFlash] = useState<Flash | null>(null)

  const onFlash = useCallback((msg: string) => setFlash({ msg, id: Date.now() }), [])
  useCommandInput(onFlash)

  const mode = useStore((s) => s.mode)
  const devMode = useStore((s) => s.devMode)

  // Interactive mode owns the page: no scrolling, no scenes. Coming back,
  // the scenes re-appear from display:none, so ScrollTrigger must re-measure
  // or every scrubbed timeline is left with collapsed positions.
  useEffect(() => {
    pauseScroll(mode === 'interactive')
    if (mode === 'normal') {
      requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()))
    }
    return () => pauseScroll(false)
  }, [mode])

  useGSAP(
    () => {
      // mobile URL bars show/hide constantly; don't rebuild trigger positions
      // on those viewport-height-only resizes
      ScrollTrigger.config({ ignoreMobileResize: true })
      initScroll()

      // gentle snap when the visitor stops near a scene boundary, without
      // hijacking mid-scene frame reading
      let bounds: number[] = []
      const measure = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        if (max <= 0) return
        bounds = [...document.querySelectorAll<HTMLElement>('.scene')].map((el) => el.offsetTop / max)
      }
      measure()
      ScrollTrigger.addEventListener('refresh', measure)
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        snap: {
          snapTo: (value) => {
            let best = value
            let dist = 1
            for (const b of bounds) {
              const d = Math.abs(value - b)
              if (d < dist) {
                dist = d
                best = b
              }
            }
            return dist < 0.04 ? best : value
          },
          duration: { min: 0.25, max: 0.6 },
          delay: 0.15,
          ease: 'power2.out',
        },
      })

      return () => {
        ScrollTrigger.removeEventListener('refresh', measure)
        destroyScroll()
      }
    },
    { scope: rootRef },
  )

  return (
    <div
      ref={rootRef}
      className={`${mode === 'interactive' ? 'interactive' : ''} ${devMode ? 'directors-cut' : ''}`}
    >
      {mode === 'interactive' && (
        <Suspense fallback={<Poster />}>
          <SceneCanvas />
        </Suspense>
      )}
      <Navbar />
      <main>
        <OpeningScene />
        <SkillsScene />
        <ExperienceScene />
        <ProjectsScene />
        <DeskScenePitch />
        <ContactScene />
      </main>
      <SceneHUD />
      {devMode && mode === 'normal' && (
        <>
          <div className="dc-marks" aria-hidden="true">
            <span /><span /><span /><span />
          </div>
          <div className="dc-badge mono" aria-hidden="true">
            ⌁ DIRECTOR'S CUT
          </div>
        </>
      )}
      <CommandHUD flash={flash} />
      <ExitChip />
      <DeskHint />
      <ModeChooser />
      <CreditsRoll />
    </div>
  )
}
