import { useEffect, useState } from 'react'
import { useStore } from '../state/store'
import { resetTerm } from '../interactive/terminal'

export function ModeChooser() {
  const chooserOpen = useStore((s) => s.chooserOpen)
  const setMode = useStore((s) => s.setMode)

  if (!chooserOpen) return null

  return (
    <div className="chooser" role="dialog" aria-label="Choose how to view the site">
      <p className="chooser-kicker">{'// mehradadimi.com'}</p>
      <h2 className="chooser-title">How do you want to visit?</h2>
      <div className="chooser-cards">
        <button className="chooser-card" onClick={() => setMode('normal')}>
          <h3>{'// classic'}</h3>
          <p>Scroll the site with the 3D desk as your backdrop. Skills, experience, projects, contact.</p>
          <span className="chooser-hint">the quick tour</span>
        </button>
        <button
          className="chooser-card chooser-card-accent"
          onClick={() => {
            resetTerm()
            setMode('interactive')
          }}
        >
          <h3>{'// interactive'}</h3>
          <p>Visit my desk in 3D. Drag to look around, type on my keyboard, poke around my computer.</p>
          <span className="chooser-hint">⌨ full desk experience</span>
        </button>
      </div>
      <p className="chooser-fine">either way, you can switch anytime. esc leaves the desk</p>
    </div>
  )
}

export function DeskHint() {
  const mode = useStore((s) => s.mode)
  const screenZoom = useStore((s) => s.screenZoom)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (mode !== 'interactive') return
    setVisible(true)
    const id = window.setTimeout(() => setVisible(false), 8000)
    return () => window.clearTimeout(id)
  }, [mode])

  if (mode !== 'interactive' || screenZoom || !visible) return null

  return <div className="desk-hint">drag to look around · scroll to zoom · click the screen or just type</div>
}

export function ExitChip() {
  const mode = useStore((s) => s.mode)
  const screenZoom = useStore((s) => s.screenZoom)
  const setScreenZoom = useStore((s) => s.setScreenZoom)
  const setMode = useStore((s) => s.setMode)

  if (mode !== 'interactive') return null

  return (
    <button
      className="exit-chip"
      onClick={() => {
        if (screenZoom) setScreenZoom(false)
        else setMode('normal')
      }}
    >
      {screenZoom ? 'esc · lean back' : 'esc · leave the desk'}
    </button>
  )
}
