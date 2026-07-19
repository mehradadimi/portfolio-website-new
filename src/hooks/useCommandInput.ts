import { useEffect } from 'react'
import { COMMANDS } from '../data/content'
import { emitBuffer, emitKey } from '../state/keybus'
import { useStore } from '../state/store'
import { thock } from '../audio/thock'
import { scrollToSection } from '../scroll/scrollManager'

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA',
]

let buffer = ''
let konamiIndex = 0

export const EASTER_EGGS: Record<string, string> = {
  sudo: 'nice try.',
  help: 'commands: home · skills · experience · projects · contact — type one and hit ↵',
  devmode: 'dev mode toggled',
  vim: ':q! — you are free now',
}

/**
 * Global keyboard capture: presses 3D keys, plays thock, accumulates a typed
 * command buffer (navigate by typing "projects" + Enter), and watches for the
 * Konami code. Ignores typing inside form fields.
 */
export function useCommandInput(onFlash: (msg: string) => void): void {
  useEffect(() => {
    const isFormTarget = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)
    }

    const onDown = (e: KeyboardEvent) => {
      if (isFormTarget(e) || e.metaKey || e.ctrlKey || e.altKey) return
      if (!e.repeat) {
        emitKey(e.code, true)
        if (!useStore.getState().muted) thock()
      }

      // Konami tracking
      if (e.code === KONAMI[konamiIndex]) {
        konamiIndex++
        if (konamiIndex === KONAMI.length) {
          konamiIndex = 0
          buffer = ''
          emitBuffer('')
          const { devMode, setDevMode } = useStore.getState()
          setDevMode(!devMode)
          onFlash(devMode ? 'dev mode off' : '⌁ dev mode on')
          return
        }
      } else {
        konamiIndex = e.code === KONAMI[0] ? 1 : 0
      }

      // Command buffer
      if (/^[a-z]$/i.test(e.key)) {
        buffer = (buffer + e.key.toLowerCase()).slice(-24)
        emitBuffer(buffer)
      } else if (e.key === 'Backspace') {
        buffer = buffer.slice(0, -1)
        emitBuffer(buffer)
      } else if (e.key === 'Enter') {
        const cmd = buffer.trim()
        buffer = ''
        emitBuffer('')
        if (!cmd) return
        if (cmd in COMMANDS) {
          scrollToSection(COMMANDS[cmd])
          onFlash(`→ ${COMMANDS[cmd]}`)
        } else if (cmd in EASTER_EGGS) {
          if (cmd === 'devmode') {
            const { devMode, setDevMode } = useStore.getState()
            setDevMode(!devMode)
          }
          onFlash(EASTER_EGGS[cmd])
        } else {
          onFlash(`command not found: ${cmd} — try "help"`)
        }
      }
    }

    const onUp = (e: KeyboardEvent) => {
      emitKey(e.code, false)
    }

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [onFlash])
}
