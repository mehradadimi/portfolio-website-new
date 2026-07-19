import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SECTIONS } from '../data/content'
import { scrollState } from '../state/scrollState'

let lenis: Lenis | null = null

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initScroll(): void {
  if (prefersReducedMotion() || lenis) return
  lenis = new Lenis({ autoRaf: false, lerp: 0.1 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)
}

export function destroyScroll(): void {
  lenis?.destroy()
  lenis = null
}

export function scrollToSection(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 3) })
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}

/**
 * Measure the page-progress value at which each section's center sits in the
 * viewport center, so the 3D camera path stays aligned with the DOM sections
 * regardless of their heights. Re-run on every ScrollTrigger refresh.
 */
export function measureSectionStops(): void {
  const max = document.documentElement.scrollHeight - window.innerHeight
  if (max <= 0) return
  const stops = SECTIONS.map((id) => {
    const el = document.getElementById(id)
    if (!el) return 0
    const center = el.offsetTop + el.offsetHeight / 2 - window.innerHeight / 2
    return Math.min(1, Math.max(0, center / max))
  })
  stops[0] = 0
  stops[stops.length - 1] = 1
  scrollState.stops = stops
}
