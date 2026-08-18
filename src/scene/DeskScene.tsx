import { useMemo } from 'react'
import { Float } from '@react-three/drei'
import { Suspense } from 'react'
import { Keyboard } from './Keyboard'
import { Monitor } from './Monitor'
import { Avatar } from './Avatar'
import { AvatarModel } from './AvatarModel'
import { FloatingKeycaps, Constellation } from './FloatingBits'
import { ProjectPanels } from './ProjectPanels'
import { useStore } from '../state/store'
import { prefersReducedMotion } from '../scroll/scrollManager'

interface SceneColors {
  stone: string
  wood: string
  metal: string
  foliage: string
  pot: string
  mug: string
  accent: string
  paper: string
}

const COLORS: Record<'dark' | 'light', SceneColors> = {
  dark: {
    stone: '#1b1b22',
    wood: '#3a2e24',
    metal: '#1d1d24',
    foliage: '#3d4a41',
    pot: '#2b2b34',
    mug: '#e8e8ec',
    accent: '#ff6b4a',
    paper: '#ff6b4a',
  },
  light: {
    stone: '#d4d4dd',
    wood: '#c9a37c',
    metal: '#b9b9c3',
    foliage: '#5d7a63',
    pot: '#a9a9b3',
    mug: '#2b2b34',
    accent: '#ff6b4a',
    paper: '#ff6b4a',
  },
}

export function DeskScene() {
  const theme = useStore((s) => s.theme)
  const devMode = useStore((s) => s.devMode)
  const mode = useStore((s) => s.mode)
  const c = COLORS[theme]
  const reduced = useMemo(prefersReducedMotion, [])

  return (
    <group>
      <Float speed={reduced || mode === 'interactive' ? 0 : 1} rotationIntensity={0.04} floatIntensity={0.3}>
        <group>
          {/* island base — hexagonal inverted cone (triangle facets everywhere) */}
          <mesh position={[0, -2.1, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[4.8, 3.6, 6]} />
            <meshStandardMaterial color={c.stone} flatShading wireframe={devMode} />
          </mesh>
          {/* desk slab */}
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[8, 0.3, 4.6]} />
            <meshStandardMaterial color={c.wood} flatShading wireframe={devMode} />
          </mesh>

          <Keyboard position={[0, 0.14, 1.0]} scale={0.32} />
          <Monitor position={[0, 0, -1.4]} />
          {mode === 'interactive' && (
            <>
              {/* real scanned Mehrad; low-poly stand-in while the GLB streams */}
              <Suspense fallback={<Avatar />}>
                <AvatarModel />
              </Suspense>
              {/* soft fill so orbiting doesn't land in the dark */}
              <pointLight position={[0, 4, 2.5]} intensity={theme === 'dark' ? 6 : 2} distance={12} decay={1.6} color="#ffe7d6" />
            </>
          )}

          {/* mug */}
          <group position={[2.4, 0, 0.6]}>
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.2, 0.17, 0.32, 10]} />
              <meshStandardMaterial color={c.mug} flatShading />
            </mesh>
            <mesh position={[0.24, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.1, 0.03, 6, 10]} />
              <meshStandardMaterial color={c.mug} flatShading />
            </mesh>
          </group>

          {/* triangular plant */}
          <group position={[-3.1, 0, 0.7]}>
            <mesh position={[0, 0.14, 0]}>
              <cylinderGeometry args={[0.22, 0.17, 0.28, 6]} />
              <meshStandardMaterial color={c.pot} flatShading />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <coneGeometry args={[0.28, 0.5, 5]} />
              <meshStandardMaterial color={c.foliage} flatShading />
            </mesh>
            <mesh position={[0, 0.85, 0]}>
              <coneGeometry args={[0.2, 0.42, 5]} />
              <meshStandardMaterial color={c.foliage} flatShading />
            </mesh>
          </group>

          {/* lamp */}
          <group position={[-3.2, 0, -1.5]}>
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.26, 0.3, 0.1, 8]} />
              <meshStandardMaterial color={c.metal} flatShading />
            </mesh>
            <mesh position={[0, 0.75, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 1.4, 6]} />
              <meshStandardMaterial color={c.metal} flatShading />
            </mesh>
            <mesh position={[0.25, 1.42, 0.25]} rotation={[0.5, 0, -0.6]}>
              <coneGeometry args={[0.24, 0.4, 8, 1, true]} />
              <meshStandardMaterial color={c.metal} flatShading />
            </mesh>
            <pointLight
              position={[0.45, 1.25, 0.45]}
              color="#ffd9b0"
              intensity={theme === 'dark' ? 9 : 2}
              distance={9}
              decay={1.8}
            />
          </group>

          {/* book stack */}
          <group position={[3.0, 0, -1.5]}>
            <mesh position={[0, 0.06, 0]}>
              <boxGeometry args={[0.85, 0.12, 0.6]} />
              <meshStandardMaterial color={c.pot} flatShading />
            </mesh>
            <mesh position={[0.05, 0.17, -0.03]} rotation={[0, 0.25, 0]}>
              <boxGeometry args={[0.75, 0.1, 0.55]} />
              <meshStandardMaterial color={c.accent} flatShading />
            </mesh>
          </group>

          {/* sticky note */}
          <mesh position={[1.5, 0.01, 1.7]} rotation={[-Math.PI / 2, 0, 0.3]}>
            <planeGeometry args={[0.35, 0.35]} />
            <meshStandardMaterial color={c.paper} flatShading />
          </mesh>
        </group>
      </Float>

      {/* signal beacon above the desk */}
      <Float speed={reduced ? 0 : 2} rotationIntensity={reduced ? 0 : 1.6} floatIntensity={0.8}>
        <mesh position={[0, 4.1, -1.4]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color={c.accent} emissive={c.accent} emissiveIntensity={0.9} flatShading />
        </mesh>
      </Float>

      {/* floating rocks */}
      {(
        [
          [4.6, -1.4, 1.9],
          [-5.3, -2.2, -1.1],
          [3.9, -3.1, -2.7],
        ] as const
      ).map((pos, i) => (
        <Float key={i} speed={reduced ? 0 : 1.2} rotationIntensity={0.3} floatIntensity={0.9}>
          <mesh position={[...pos]}>
            <icosahedronGeometry args={[0.28 + i * 0.08, 0]} />
            <meshStandardMaterial color={c.stone} flatShading wireframe={devMode} />
          </mesh>
        </Float>
      ))}

      <FloatingKeycaps />
      <Constellation />
      <ProjectPanels />
    </group>
  )
}
