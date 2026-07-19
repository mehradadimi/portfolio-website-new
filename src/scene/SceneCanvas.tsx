import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, Preload } from '@react-three/drei'
import { DeskScene } from './DeskScene'
import { CameraRig } from './CameraRig'
import { useStore } from '../state/store'
import { perfTier } from '../hooks/perf'

export default function SceneCanvas() {
  const theme = useStore((s) => s.theme)
  const bg = theme === 'dark' ? '#0b0b0f' : '#e8e8ec'

  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        dpr={perfTier.dpr}
        camera={{ fov: 42, position: [0, 2.4, 7.4], near: 0.1, far: 60 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[bg]} />
        <fog attach="fog" args={[bg, 13, 32]} />
        <ambientLight intensity={theme === 'dark' ? 0.55 : 0.95} />
        <directionalLight position={[5, 8, 4]} intensity={theme === 'dark' ? 2.2 : 2.8} />
        <directionalLight position={[-6, 4, -6]} intensity={0.7} color="#8fa0ff" />
        <Suspense fallback={null}>
          <DeskScene />
          <Preload all />
        </Suspense>
        <CameraRig />
        <AdaptiveDpr />
      </Canvas>
    </div>
  )
}
