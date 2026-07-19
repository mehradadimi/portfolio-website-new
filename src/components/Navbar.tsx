import { SECTIONS } from '../data/content'
import { useStore } from '../state/store'
import { scrollToSection } from '../scroll/scrollManager'
import { MoonIcon, SoundOffIcon, SoundOnIcon, SunIcon } from './Icons'

export function Navbar() {
  const theme = useStore((s) => s.theme)
  const muted = useStore((s) => s.muted)
  const active = useStore((s) => s.activeSection)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const toggleMuted = useStore((s) => s.toggleMuted)

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
        mehrad<em>.</em>adimi
      </a>
      <div className="nav-links">
        {SECTIONS.map((id) => (
          <button key={id} className={active === id ? 'active' : ''} onClick={() => scrollToSection(id)}>
            {'// '}
            {id === 'contact' ? 'contact me' : id}
          </button>
        ))}
      </div>
      <div className="nav-actions">
        <button
          className="icon-btn"
          onClick={toggleMuted}
          aria-label={muted ? 'Unmute keyboard sounds' : 'Mute keyboard sounds'}
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
