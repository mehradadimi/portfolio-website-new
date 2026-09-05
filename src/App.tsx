import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Navbar } from './components/Navbar'
import { ModeChooser, ExitChip, DeskHint } from './components/ModeChooser'
import { CommandHUD, type Flash } from './components/CommandHUD'
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

  // Interactive mode owns the page: no scrolling, no scenes.
  useEffect(() => {
    pauseScroll(mode === 'interactive')
    return () => pauseScroll(false)
  }, [mode])

  useGSAP(
    () => {
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
    <div ref={rootRef} className={mode === 'interactive' ? 'interactive' : ''}>
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
      <CommandHUD flash={flash} />
      <ExitChip />
      <DeskHint />
      <ModeChooser />
    </div>
  )
}
