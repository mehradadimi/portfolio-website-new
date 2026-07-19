import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Navbar } from './components/Navbar'
import { CommandHUD, type Flash } from './components/CommandHUD'
import { Hero, Skills, Experience, Projects, Contact } from './sections/Sections'
import { useCommandInput } from './hooks/useCommandInput'
import { useStore } from './state/store'
import { scrollState } from './state/scrollState'
import { SECTIONS } from './data/content'
import {
  destroyScroll,
  initScroll,
  measureSectionStops,
  prefersReducedMotion,
} from './scroll/scrollManager'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const SceneCanvas = lazy(() => import('./scene/SceneCanvas'))

const Poster = () => <div className="scene-poster" aria-hidden="true" />

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [canvasReady, setCanvasReady] = useState(false)
  const [flash, setFlash] = useState<Flash | null>(null)

  const onFlash = useCallback((msg: string) => setFlash({ msg, id: Date.now() }), [])
  useCommandInput(onFlash)

  // Let the DOM paint first (LCP), then mount the WebGL canvas.
  useEffect(() => {
    const id = window.setTimeout(() => setCanvasReady(true), 120)
    return () => window.clearTimeout(id)
  }, [])

  useGSAP(
    () => {
      initScroll()

      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          scrollState.progress = self.progress
        },
      })

      SECTIONS.forEach((id) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) useStore.getState().setActiveSection(id)
          },
        })
      })

      measureSectionStops()
      ScrollTrigger.addEventListener('refresh', measureSectionStops)

      if (!prefersReducedMotion()) {
        gsap.set('[data-reveal]', { opacity: 0, y: 28 })
        ScrollTrigger.batch('[data-reveal]', {
          start: 'top 88%',
          once: true,
          onEnter: (els) =>
            gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }),
        })
      }

      return () => {
        ScrollTrigger.removeEventListener('refresh', measureSectionStops)
        destroyScroll()
      }
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef}>
      {canvasReady ? (
        <Suspense fallback={<Poster />}>
          <SceneCanvas />
        </Suspense>
      ) : (
        <Poster />
      )}
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <CommandHUD flash={flash} />
    </div>
  )
}
