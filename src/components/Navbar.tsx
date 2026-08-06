import { SECTIONS } from '../data/content'
import { useStore } from '../state/store'
import { scrollToSection } from '../scroll/scrollManager'
import { resetTerm } from '../interactive/terminal'
import { MoonIcon, SoundOffIcon, SoundOnIcon, SunIcon } from './Icons'
import { thock } from '../audio/thock'

export function Navbar() {
  const theme = useStore((s) => s.theme)
  const muted = useStore((s) => s.muted)
  const active = useStore((s) => s.activeSection)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const toggleMuted = useStore((s) => s.toggleMuted)
  const setMode = useStore((s) => s.setMode)

  return (
    <nav className="navbar">
      <a
        className="nav-logo"
        href="/"
        onClick={(e) => {
          e.preventDefault()
          scrollToSection('home')
        }}
      >
        Mehrad Adimi
      </a>
      <div className="nav-links">
        {SECTIONS.map((id) => (
          <button key={id} className={active === id ? 'active' : ''} onClick={() => scrollToSection(id)}>
            {'// '}
            {id === 'contact' ? 'contact me' : id}
          </button>
        ))}
        <button
          className="nav-desk"
          onClick={() => {
            resetTerm()
            setMode('interactive')
          }}
        >
          {'// sit at my desk'}
        </button>
      </div>
      <div className="nav-actions">
        <button
          className="icon-btn"
          onClick={() => {
            toggleMuted()
            if (muted) thock() // audible feedback when turning sound on
          }}
          title={muted ? 'Turn on typing sounds' : 'Turn off typing sounds'}
          aria-label={muted ? 'Turn on typing sounds' : 'Turn off typing sounds'}
        >
          {muted ? <SoundOffIcon /> : <SoundOnIcon />}
        </button>
        <button
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </nav>
  )
}
