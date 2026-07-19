import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { perfTier } from '../hooks/perf'
import { useStore } from '../state/store'

// Floating triangular shards (tetrahedra) drifting around the island.
// Konami dev mode fires them outward before they settle back.
export function Shards() {
  const count = perfTier.shardCount
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const devMode = useStore((s) => s.devMode)
  const theme = useStore((s) => s.theme)

  const data = useMemo(() => {
    const items = []
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 5.5 + Math.random() * 6
      items.push({
        home: new THREE.Vector3(Math.cos(angle) * radius, (Math.random() - 0.35) * 7, Math.sin(angle) * radius),
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        spin: (Math.random() - 0.5) * 0.6,
        scale: 0.5 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
      })
    }
    items.forEach((it) => it.pos.copy(it.home))
    return items
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    if (!devMode) return
    for (const it of data) {
      it.vel.set((Math.random() - 0.5) * 14, (Math.random() - 0.2) * 12, (Math.random() - 0.5) * 14)
    }
  }, [devMode, data])

  useFrame((state, delta) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = state.clock.elapsedTime
    const damp = Math.exp(-delta * 1.4)
    for (let i = 0; i < data.length; i++) {
      const it = data[i]
      // spring home + burst velocity
      it.vel.multiplyScalar(damp)
      it.pos.addScaledVector(it.vel, delta)
      it.pos.lerp(it.home, 1 - Math.exp(-delta * 0.8))
      dummy.position.set(
        it.pos.x,
        it.pos.y + Math.sin(t * 0.5 + it.phase) * 0.35,
        it.pos.z,
      )
      it.rot.x += delta * it.spin
      it.rot.y += delta * it.spin * 0.7
      dummy.rotation.copy(it.rot)
      dummy.scale.setScalar(it.scale * 0.16)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={theme === 'dark' ? '#3a3a45' : '#c5c5cf'}
        flatShading
        roughness={0.7}
      />
    </instancedMesh>
  )
}
