import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import ptMonoWoff from '@fontsource/pt-mono/files/pt-mono-latin-400-normal.woff'
import { KEYS } from './keyboardLayout'
import { onKey, emitKey } from '../state/keybus'
import { useStore } from '../state/store'
import { thock } from '../audio/thock'

const LEGEND_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-=[]\\;\',./ESCDELTABPNRHIFCMOL'

interface Palette {
  alpha: string
  mod: string
  accent: string
  legend: string
  legendOnAccent: string
  caseColor: string
}

const PALETTES: Record<'dark' | 'light', Palette> = {
  dark: {
    alpha: '#2b2b34',
    mod: '#1d1d24',
    accent: '#ff6b4a',
    legend: '#e8e8ec',
    legendOnAccent: '#1d1d24',
    caseColor: '#131318',
  },
  light: {
    alpha: '#ececf1',
    mod: '#d3d3dc',
    accent: '#ff6b4a',
    legend: '#2b2b34',
    legendOnAccent: '#fff4f0',
    caseColor: '#c2c2cc',
  },
}

const KEY_TRAVEL = -0.16
const ACCENT = new THREE.Color('#ff6b4a')

export function Keyboard(props: { position?: [number, number, number]; scale?: number }) {
  const theme = useStore((s) => s.theme)
  const pal = PALETTES[theme]

  const groupRefs = useRef<(THREE.Group | null)[]>([])
  const matRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([])
  const targets = useRef(new Float32Array(KEYS.length))
  const glow = useRef(new Float32Array(KEYS.length))

  const codeToIndices = useMemo(() => {
    const map = new Map<string, number[]>()
    KEYS.forEach((k, i) => {
      const list = map.get(k.code) ?? []
      list.push(i)
      map.set(k.code, list)
    })
    return map
  }, [])

  useEffect(
    () =>
      onKey((code, down) => {
        const indices = codeToIndices.get(code)
        if (!indices) return
        for (const i of indices) {
          targets.current[i] = down ? KEY_TRAVEL : 0
          if (down) glow.current[i] = 1
        }
      }),
    [codeToIndices],
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const skillsWave = useStore.getState().activeSection === 'skills'
    const k = 1 - Math.exp(-delta * 26)
    const decay = Math.exp(-delta * 5)
    for (let i = 0; i < KEYS.length; i++) {
      const g = groupRefs.current[i]
      const m = matRefs.current[i]
      if (!g || !m) continue
      g.position.y += (targets.current[i] - g.position.y) * k
      glow.current[i] *= decay
      let intensity = glow.current[i]
      if (skillsWave) {
        const wave = 0.18 + 0.16 * Math.sin(t * 2.2 + KEYS[i].x * 0.9 + KEYS[i].z * 0.6)
        intensity = Math.max(intensity, wave)
      }
      m.emissiveIntensity = intensity
    }
  })

  const press = (i: number) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    emitKey(KEYS[i].code, true)
    if (!useStore.getState().muted) thock()
  }
  const release = (i: number) => () => emitKey(KEYS[i].code, false)

  return (
    <group {...props}>
      {/* case */}
      <RoundedBox args={[15.7, 0.55, 5.7]} radius={0.12} smoothness={2} position={[0, -0.35, 0]}>
        <meshStandardMaterial color={pal.caseColor} flatShading />
      </RoundedBox>
      {KEYS.map((key, i) => {
        const capColor = key.accent ? pal.accent : key.mod ? pal.mod : pal.alpha
        const legendColor = key.accent ? pal.legendOnAccent : pal.legend
        return (
          <group
            key={i}
            position={[key.x, 0, key.z]}
            ref={(el) => {
              groupRefs.current[i] = el
            }}
            onPointerDown={press(i)}
            onPointerUp={release(i)}
            onPointerOut={release(i)}
          >
            <RoundedBox args={[key.width - 0.14, 0.42, 0.86]} radius={0.09} smoothness={2}>
              <meshStandardMaterial
                ref={(el) => {
                  matRefs.current[i] = el
                }}
                color={capColor}
                emissive={ACCENT}
                emissiveIntensity={0}
                roughness={0.55}
              />
            </RoundedBox>
            {key.label !== '' && (
              <Text
                font={ptMonoWoff}
                fontSize={key.label.length > 1 ? 0.26 : 0.34}
                color={legendColor}
                anchorX="center"
                anchorY="middle"
                position={[0, 0.215, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                characters={LEGEND_CHARS}
              >
                {key.label}
              </Text>
            )}
          </group>
        )
      })}
    </group>
  )
}
