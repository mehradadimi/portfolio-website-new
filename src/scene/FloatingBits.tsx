import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import ptMonoWoff from '@fontsource/pt-mono/files/pt-mono-latin-400-normal.woff'
import { onKey } from '../state/keybus'
import { useStore } from '../state/store'
import { perfTier } from '../hooks/perf'

const ACCENT = new THREE.Color('#ff6b4a')

// Spare keycaps adrift around the island. Typing a letter makes its floating
// twin glow and tumble.
const CAP_CHARS = ['M', 'E', 'H', 'R', 'A', 'D', 'I', '{', '}', ';', '/', '>', 'CMD', '⏎']
const ACCENT_CAPS = new Set([13, 7]) // ⏎ and {

interface CapData {
  char: string
  home: THREE.Vector3
  vel: THREE.Vector3
  rot: THREE.Euler
  spin: THREE.Vector3
  phase: number
  scale: number
}

export function FloatingKeycaps() {
  const theme = useStore((s) => s.theme)
  const devMode = useStore((s) => s.devMode)
  const count = perfTier.isTouch ? 9 : CAP_CHARS.length

  const caps = useMemo<CapData[]>(
    () =>
      CAP_CHARS.slice(0, count).map((char, i) => {
        // two side bands flanking the island — never in front of the camera
        // or intersecting the desk (|x| >= 5.5, z biased back)
        const side = i % 2 === 0 ? 1 : -1
        const x = side * (5.5 + ((i * 53) % 30) / 10)
        const z = ((i * 37) % 70) / 10 - 4.5
        return {
          char,
          home: new THREE.Vector3(x, -0.5 + ((i * 29) % 50) / 10, z),
          vel: new THREE.Vector3(),
          rot: new THREE.Euler((i * 0.7) % 1, (i * 1.3) % 2, (i * 0.4) % 1),
          spin: new THREE.Vector3(0.1 + (i % 3) * 0.05, 0.15, 0.05),
          phase: i * 1.7,
          scale: 0.3 + (i % 4) * 0.035,
        }
      }),
    [count],
  )

  const groupRefs = useRef<(THREE.Group | null)[]>([])
  const matRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([])
  const glow = useRef(new Float32Array(count))

  useEffect(
    () =>
      onKey((code, down) => {
        if (!down) return
        const letter = code.startsWith('Key') ? code.slice(3) : code === 'Enter' ? '⏎' : code.startsWith('Meta') ? 'CMD' : null
        if (!letter) return
        caps.forEach((cap, i) => {
          if (cap.char === letter) {
            glow.current[i] = 1.6
            cap.spin.set(1.6, 2.2, 0.9) // tumble impulse
          }
        })
      }),
    [caps],
  )

  useEffect(() => {
    if (!devMode) return
    for (const cap of caps) {
      cap.vel.set((Math.random() - 0.5) * 12, (Math.random() - 0.1) * 10, (Math.random() - 0.5) * 12)
    }
  }, [devMode, caps])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const damp = Math.exp(-delta * 1.4)
    const spinDamp = Math.exp(-delta * 1.1)
    const decay = Math.exp(-delta * 2.2)
    for (let i = 0; i < caps.length; i++) {
      const g = groupRefs.current[i]
      const m = matRefs.current[i]
      const cap = caps[i]
      if (!g || !m) continue
      cap.vel.multiplyScalar(damp)
      g.position.addScaledVector(cap.vel, delta)
      g.position.lerp(cap.home, 1 - Math.exp(-delta * 0.5))
      g.position.y += Math.sin(t * 0.5 + cap.phase) * 0.004
      cap.spin.multiplyScalar(spinDamp)
      cap.rot.x += delta * (0.1 + cap.spin.x)
      cap.rot.y += delta * (0.14 + cap.spin.y)
      cap.rot.z += delta * cap.spin.z
      g.rotation.copy(cap.rot)
      glow.current[i] *= decay
      m.emissiveIntensity = glow.current[i]
    }
  })

  const alphaColor = theme === 'dark' ? '#2b2b34' : '#e2e2e9'
  const legendColor = theme === 'dark' ? '#c9c9d2' : '#3a3a42'

  return (
    <group>
      {caps.map((cap, i) => {
        const isAccent = ACCENT_CAPS.has(i)
        return (
          <group
            key={i}
            position={cap.home}
            scale={cap.scale}
            ref={(el) => {
              groupRefs.current[i] = el
            }}
          >
            <RoundedBox args={[cap.char.length > 1 ? 1.7 : 1, 0.42, 0.95]} radius={0.09} smoothness={2}>
              <meshStandardMaterial
                ref={(el) => {
                  matRefs.current[i] = el
                }}
                color={isAccent ? '#ff6b4a' : alphaColor}
                emissive={ACCENT}
                emissiveIntensity={0}
                roughness={0.55}
                flatShading
              />
            </RoundedBox>
            <Text
              font={ptMonoWoff}
              fontSize={cap.char.length > 1 ? 0.3 : 0.42}
              color={isAccent ? '#1d1d24' : legendColor}
              anchorX="center"
              anchorY="middle"
              position={[0, 0.215, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              {cap.char}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

// A faint knowledge-graph constellation deep in the background — nodes joined
// by thin lines, drifting slowly. (A nod to the MCP cross-repo knowledge graph.)
export function Constellation() {
  const theme = useStore((s) => s.theme)
  const groupRef = useRef<THREE.Group>(null)
  const nodeCount = perfTier.isTouch ? 26 : 46

  const { nodes, linePositions } = useMemo(() => {
    // deterministic pseudo-random spherical shell behind the scene
    const rand = (n: number) => {
      const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
      return x - Math.floor(x)
    }
    const nodes: THREE.Vector3[] = []
    for (let i = 0; i < nodeCount; i++) {
      const theta = rand(i) * Math.PI * 2
      const y = (rand(i + 100) - 0.35) * 16
      const radius = 13 + rand(i + 200) * 8
      nodes.push(new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius - 4))
    }
    // connect each node to its 2 nearest neighbours
    const pairs = new Set<string>()
    const pts: number[] = []
    nodes.forEach((a, i) => {
      const near = nodes
        .map((b, j) => ({ j, d: i === j ? Infinity : a.distanceToSquared(b) }))
        .sort((x, y) => x.d - y.d)
        .slice(0, 2)
      for (const { j } of near) {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (pairs.has(key)) continue
        pairs.add(key)
        pts.push(a.x, a.y, a.z, nodes[j].x, nodes[j].y, nodes[j].z)
      }
    })
    return { nodes, linePositions: new Float32Array(pts) }
  }, [nodeCount])

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    return geo
  }, [linePositions])

  useEffect(() => () => lineGeometry.dispose(), [lineGeometry])

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.012
  })

  const nodeColor = theme === 'dark' ? '#9a9aa8' : '#7a7a88'
  const lineColor = theme === 'dark' ? '#3c3c4a' : '#b9b9c6'

  return (
    <group ref={groupRef} raycast={() => null}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={lineColor} transparent opacity={theme === 'dark' ? 0.35 : 0.5} />
      </lineSegments>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <octahedronGeometry args={[i % 7 === 0 ? 0.14 : 0.08, 0]} />
          <meshBasicMaterial color={i % 7 === 0 ? '#ff6b4a' : nodeColor} />
        </mesh>
      ))}
    </group>
  )
}
