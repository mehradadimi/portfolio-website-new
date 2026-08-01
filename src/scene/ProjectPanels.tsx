import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useTexture, RoundedBox, Float } from '@react-three/drei'
import { PROJECTS } from '../data/content'
import { scrollState, sectionFloat } from '../state/scrollState'

// two panels either side of the centered content column, angled toward camera
const SLOTS: Array<{ pos: [number, number, number]; rot: number }> = [
  { pos: [-4.9, 2.7, 0.6], rot: 0.42 },
  { pos: [-4.3, 1.0, -0.8], rot: 0.38 },
  { pos: [4.3, 2.6, -0.8], rot: -0.38 },
  { pos: [4.9, 1.0, 0.6], rot: -0.42 },
]

// Floating glass screens beside the desk, visible around the projects section.
export function ProjectPanels() {
  const textures = useTexture(PROJECTS.map((p) => p.image)) as THREE.Texture[]
  const groupRef = useRef<THREE.Group>(null)
  const mats = useRef<(THREE.Material | null)[]>([])

  const sized = useMemo(
    () =>
      textures.map((t) => {
        t.colorSpace = THREE.SRGBColorSpace
        const img = t.image as { width: number; height: number }
        const aspect = img.width / img.height
        const w = aspect > 1 ? 1.35 : 0.9
        return { w, h: w / aspect }
      }),
    [textures],
  )

  useFrame((_, delta) => {
    // fade with distance from the projects section (index 3)
    const sec = sectionFloat(scrollState.progress)
    const target = Math.max(0, 1 - Math.abs(sec - 3) * 1.6)
    const k = 1 - Math.exp(-delta * 5)
    for (const m of mats.current) {
      if (!m) continue
      m.opacity += (target - m.opacity) * k
      m.visible = m.opacity > 0.02
    }
    if (groupRef.current) groupRef.current.visible = target > 0.01
  })

  return (
    <group ref={groupRef}>
      {PROJECTS.map((project, i) => {
        const { w, h } = sized[i]
        const slot = SLOTS[i]
        return (
          <Float key={project.name} speed={1.4} rotationIntensity={0.08} floatIntensity={0.5}>
            <group
              position={slot.pos}
              rotation={[0, slot.rot, 0]}
              onClick={() => {
                if (project.link) window.open(project.link, '_blank', 'noopener')
              }}
              onPointerOver={(e) => {
                e.stopPropagation()
                if (project.link) document.body.style.cursor = 'pointer'
              }}
              onPointerOut={() => {
                document.body.style.cursor = ''
              }}
            >
              <RoundedBox args={[w + 0.14, h + 0.14, 0.05]} radius={0.03} smoothness={2}>
                <meshStandardMaterial
                  ref={(el) => {
                    mats.current[i * 2] = el
                  }}
                  color="#16161c"
                  transparent
                  opacity={0}
                  flatShading
                />
              </RoundedBox>
              <mesh position={[0, 0, 0.032]}>
                <planeGeometry args={[w, h]} />
                <meshBasicMaterial
                  ref={(el) => {
                    mats.current[i * 2 + 1] = el
                  }}
                  map={textures[i]}
                  transparent
                  opacity={0}
                  toneMapped={false}
                />
              </mesh>
            </group>
          </Float>
        )
      })}
    </group>
  )
}
