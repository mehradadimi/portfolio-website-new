import { create } from 'zustand'
import type { SectionId } from '../data/content'

type Theme = 'dark' | 'light'
export type SiteMode = 'normal' | 'interactive'

function initialTheme(): Theme {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

interface UIState {
  theme: Theme
  muted: boolean
  devMode: boolean
  activeSection: SectionId
  mode: SiteMode
  chooserOpen: boolean
  screenZoom: boolean
  toggleTheme: () => void
  toggleMuted: () => void
  setDevMode: (on: boolean) => void
  setActiveSection: (s: SectionId) => void
  setMode: (m: SiteMode) => void
  setScreenZoom: (z: boolean) => void
}

const isTouch = window.matchMedia('(pointer: coarse)').matches

export const useStore = create<UIState>((set) => ({
  theme: initialTheme(),
  muted: localStorage.getItem('muted') === '1',
  devMode: false,
  activeSection: 'home',
  mode: 'normal',
  // interactive mode is desktop-only; remember the choice for this session
  chooserOpen: !isTouch && !sessionStorage.getItem('siteMode'),
  screenZoom: false,
  toggleTheme: () =>
    set((s) => {
      const theme: Theme = s.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', theme)
      return { theme }
    }),
  toggleMuted: () =>
    set((s) => {
      localStorage.setItem('muted', s.muted ? '0' : '1')
      return { muted: !s.muted }
    }),
  setDevMode: (devMode) => set({ devMode }),
  setActiveSection: (activeSection) => set({ activeSection }),
  setMode: (mode) => {
    sessionStorage.setItem('siteMode', mode)
    set({ mode, chooserOpen: false, screenZoom: false })
  },
  setScreenZoom: (screenZoom) => set({ screenZoom }),
}))

// Mirror theme onto <html data-theme> so CSS variables follow the store.
useStore.subscribe((s) => {
  document.documentElement.dataset.theme = s.theme
})
document.documentElement.dataset.theme = useStore.getState().theme

// Follow OS theme changes live (matches the old site's behavior).
window
  .matchMedia('(prefers-color-scheme: light)')
  .addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      useStore.setState({ theme: e.matches ? 'light' : 'dark' })
    }
  })
