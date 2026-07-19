import { create } from 'zustand'
import type { SectionId } from '../data/content'

type Theme = 'dark' | 'light'

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
  toggleTheme: () => void
  toggleMuted: () => void
  setDevMode: (on: boolean) => void
  setActiveSection: (s: SectionId) => void
}

export const useStore = create<UIState>((set) => ({
  theme: initialTheme(),
  muted: localStorage.getItem('muted') === '1',
  devMode: false,
  activeSection: 'home',
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
