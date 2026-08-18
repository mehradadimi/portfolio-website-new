import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { EXPERIENCE, OWNER, PROJECTS, SKILLS, type SectionId } from '../data/content'
import { onBuffer } from '../state/keybus'
import { useStore } from '../state/store'
import { onTerm, termState, getPrompt } from '../interactive/terminal'

const W = 1024
const H = 640
const PROMPT = 'mehrad@desk ~ %'

function linesFor(section: SectionId): Array<[string, 'prompt' | 'out' | 'dim']> {
  switch (section) {
    case 'home':
      return [
        [`${PROMPT} whoami`, 'prompt'],
        [`${OWNER.name}, ${OWNER.role}`, 'out'],
        [`${PROMPT} pwd`, 'prompt'],
        ['/canada/victoria-bc', 'out'],
        ['', 'out'],
        ['tip: just start typing. "help" ↵ lists commands.', 'dim'],
      ]
    case 'skills':
      return [
        [`${PROMPT} ls skills/`, 'prompt'],
        ...SKILLS.map(
          (g) => [`${g.label.toLowerCase()}/  ${g.items.slice(0, 4).join('  ')} …`, 'out'] as [string, 'out'],
        ),
      ]
    case 'experience':
      return [
        [`${PROMPT} git log --oneline career`, 'prompt'],
        ...EXPERIENCE.map(
          (j, i) =>
            [`${(0xd9e86e0 + i * 0x1f).toString(16).slice(0, 7)} ${j.role} @ ${j.company} (${j.period})`, 'out'] as [string, 'out'],
        ),
      ]
    case 'projects':
      return [
        [`${PROMPT} ls ~/projects`, 'prompt'],
        ...PROJECTS.map((p) => [`${p.name.toLowerCase().replace(/\s+/g, '-')}/  → ${p.subtitle}`, 'out'] as [string, 'out']),
      ]
    case 'contact':
      return [
        [`${PROMPT} echo $EMAIL`, 'prompt'],
        [OWNER.email, 'out'],
        [`${PROMPT} open github linkedin`, 'prompt'],
        ['github.com/mehradadimi · linkedin.com/in/mehradadimi2020', 'out'],
      ]
  }
}

export function Monitor(props: { position?: [number, number, number] }) {
  const theme = useStore((s) => s.theme)
  const section = useStore((s) => s.activeSection)
  const mode = useStore((s) => s.mode)
  const setScreenZoom = useStore((s) => s.setScreenZoom)

  const { ctx, texture } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return { canvas, ctx, texture }
  }, [])

  const state = useRef({ buffer: '', blink: true, dirty: true, lastBlink: 0 })

  useEffect(
    () =>
      onBuffer((b) => {
        state.current.buffer = b
        state.current.dirty = true
      }),
    [],
  )

  useEffect(
    () =>
      onTerm(() => {
        state.current.dirty = true
      }),
    [],
  )

  useEffect(() => {
    state.current.dirty = true
  }, [section, mode])

  useEffect(() => () => texture.dispose(), [texture])

  useFrame(({ clock }) => {
    const s = state.current
    if (clock.elapsedTime - s.lastBlink > 0.53) {
      s.blink = !s.blink
      s.lastBlink = clock.elapsedTime
      s.dirty = true
    }
    if (!s.dirty) return
    s.dirty = false

    ctx.fillStyle = '#0a0a0e'
    ctx.fillRect(0, 0, W, H)

    if (useStore.getState().mode === 'interactive') {
      // live shell
      ctx.font = '24px "PT Mono", monospace'
      const { lines, input, cursor } = termState()
      const visible = lines.slice(-15)
      let y = 48
      for (const line of visible) {
        ctx.fillStyle =
          line.kind === 'in' || line.kind === 'accent' ? '#ff6b4a' : line.kind === 'dim' ? '#6f6f78' : '#d8d8e0'
        ctx.fillText(line.text.slice(0, 64), 32, y)
        y += 36
      }
      ctx.fillStyle = '#ff6b4a'
      // block cursor that sits mid-line when editing with ←/→
      const cursorChar = s.blink ? '▌' : (input[cursor] ?? ' ')
      const shown = input.slice(0, cursor) + cursorChar + input.slice(cursor + 1)
      const tail = `${getPrompt()} ${shown}`
      ctx.fillText(tail.slice(-64), 32, y)
    } else {
      ctx.font = '26px "PT Mono", monospace'
      const lines = linesFor(section)
      let y = 56
      for (const [text, kind] of lines) {
        ctx.fillStyle = kind === 'prompt' ? '#ff6b4a' : kind === 'dim' ? '#6f6f78' : '#d8d8e0'
        ctx.fillText(text.slice(0, 62), 36, y)
        y += 40
      }
      ctx.fillStyle = '#ff6b4a'
      const tail = `${PROMPT} ${s.buffer}${s.blink ? '▌' : ' '}`
      ctx.fillText(tail.slice(0, 62), 36, H - 44)
      // in classic mode the screen is set dressing — dim it so it never
      // competes with the DOM content in front of it
      ctx.fillStyle = 'rgba(10, 10, 14, 0.45)'
      ctx.fillRect(0, 0, W, H)
    }
    texture.needsUpdate = true
  })

  return (
    <group {...props}>
      {/* stand */}
      <mesh position={[0, 0.35, -0.08]}>
        <cylinderGeometry args={[0.09, 0.13, 0.7, 8]} />
        <meshStandardMaterial color={theme === 'dark' ? '#1d1d24' : '#c9c9d2'} flatShading />
      </mesh>
      <mesh position={[0, 0.03, -0.05]}>
        <boxGeometry args={[1.1, 0.07, 0.7]} />
        <meshStandardMaterial color={theme === 'dark' ? '#1d1d24' : '#c9c9d2'} flatShading />
      </mesh>
      {/* bezel + screen */}
      <RoundedBox args={[3.95, 2.55, 0.14]} radius={0.05} smoothness={2} position={[0, 1.95, 0]}>
        <meshStandardMaterial color={theme === 'dark' ? '#16161c' : '#2b2b34'} flatShading />
      </RoundedBox>
      <mesh
        position={[0, 1.95, 0.075]}
        onClick={(e) => {
          if (useStore.getState().mode !== 'interactive') return
          e.stopPropagation()
          setScreenZoom(!useStore.getState().screenZoom)
        }}
        onPointerOver={(e) => {
          if (useStore.getState().mode !== 'interactive') return
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
        }}
      >
        <planeGeometry args={[3.68, 2.3]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}
