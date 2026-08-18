import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../state/store'
import { onKey } from '../state/keybus'

// Mehrad at his desk — short quiffed dark hair, full beard, dark suit with
// a coral tie (his LinkedIn look, low-poly). Hands dip when the visitor
// types — because in interactive mode, they're his hands too.
export function Avatar() {
  const theme = useStore((s) => s.theme)
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const leftHand = useRef<THREE.Mesh>(null)
  const rightHand = useRef<THREE.Mesh>(null)
  const handDip = useRef({ left: 0, right: 0 })

  useEffect(
    () =>
      onKey((code, down) => {
        if (!down) return
        // rough left/right hand split by key column
        const rightSide = /Key[YUIOPHJKLNM]|Digit[67890]|Bracket|Semicolon|Quote|Comma|Period|Slash|Enter|Backspace/.test(code)
        if (rightSide) handDip.current.right = 1
        else handDip.current.left = 1
      }),
    [],
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      // breathing
      groupRef.current.position.y = Math.sin(t * 1.6) * 0.015
    }
    if (headRef.current) {
      // reading the screen, occasionally tilting
      headRef.current.rotation.y = Math.sin(t * 0.4) * 0.12
      headRef.current.rotation.z = Math.sin(t * 0.23) * 0.04
    }
    const decay = Math.exp(-delta * 10)
    handDip.current.left *= decay
    handDip.current.right *= decay
    if (leftHand.current) leftHand.current.position.y = 0.58 - handDip.current.left * 0.09
    if (rightHand.current) rightHand.current.position.y = 0.58 - handDip.current.right * 0.09
  })

  const suit = theme === 'dark' ? '#23232c' : '#33333e'
  const suitShade = theme === 'dark' ? '#1a1a21' : '#282832'
  const skin = '#c99f7f'
  const hair = '#241f1c'
  const accent = '#ff6b4a'

  return (
    <group position={[0, -0.3, 2.75]}>
      {/* chair */}
      <mesh position={[0, 0.28, 0.35]}>
        <cylinderGeometry args={[0.06, 0.09, 0.55, 6]} />
        <meshStandardMaterial color={suitShade} flatShading />
      </mesh>
      <mesh position={[0, 0.02, 0.35]}>
        <cylinderGeometry args={[0.42, 0.46, 0.06, 6]} />
        <meshStandardMaterial color={suitShade} flatShading />
      </mesh>
      <mesh position={[0, 0.58, 0.35]}>
        <boxGeometry args={[0.95, 0.1, 0.85]} />
        <meshStandardMaterial color={suitShade} flatShading />
      </mesh>
      <mesh position={[0, 1.15, 0.78]} rotation={[-0.12, 0, 0]}>
        <boxGeometry args={[0.95, 1.15, 0.14]} />
        <meshStandardMaterial color={suitShade} flatShading />
      </mesh>

      {/* body */}
      <group ref={groupRef}>
        {/* torso — dark suit jacket */}
        <mesh position={[0, 1.06, 0.32]} rotation={[0.06, 0, 0]}>
          <boxGeometry args={[0.82, 0.85, 0.48]} />
          <meshStandardMaterial color={suit} flatShading />
        </mesh>
        {/* white shirt + coral tie on his front (he faces -z, toward the monitor) */}
        <mesh position={[0, 1.33, 0.072]} rotation={[0.06, 0, 0]}>
          <boxGeometry args={[0.26, 0.28, 0.03]} />
          <meshStandardMaterial color="#efeff2" flatShading />
        </mesh>
        <mesh position={[0, 1.38, 0.055]} rotation={[0.06, 0, 0]}>
          <boxGeometry args={[0.11, 0.08, 0.03]} />
          <meshStandardMaterial color={accent} flatShading />
        </mesh>
        <mesh position={[0, 1.2, 0.055]} rotation={[0.06, 0, 0]}>
          <boxGeometry args={[0.08, 0.3, 0.03]} />
          <meshStandardMaterial color={accent} flatShading />
        </mesh>
        {/* head — short dark quiffed hair, full beard, brows (faces -z) */}
        <group ref={headRef} position={[0, 1.78, 0.28]}>
          <mesh>
            <icosahedronGeometry args={[0.24, 2]} />
            <meshStandardMaterial color={skin} flatShading />
          </mesh>
          {/* hair cap, tilted back so the front hairline sits above the brows */}
          <mesh position={[0, 0.035, 0.03]} rotation={[-0.22, 0, 0]}>
            <sphereGeometry args={[0.256, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.44]} />
            <meshStandardMaterial color={hair} flatShading />
          </mesh>
          {/* quiff, styled up at the front */}
          <mesh position={[0, 0.225, -0.1]} rotation={[-0.35, 0, 0]}>
            <boxGeometry args={[0.19, 0.09, 0.13]} />
            <meshStandardMaterial color={hair} flatShading />
          </mesh>
          {/* beard band around the jaw */}
          <mesh position={[0, -0.02, -0.01]} scale={[1, 1, 1.04]}>
            <sphereGeometry args={[0.243, 12, 6, 0, Math.PI * 2, Math.PI * 0.66, Math.PI * 0.34]} />
            <meshStandardMaterial color={hair} flatShading />
          </mesh>
          {/* brows + eyes */}
          <mesh position={[-0.09, 0.1, -0.2]} rotation={[0, 0, 0.08]}>
            <boxGeometry args={[0.08, 0.024, 0.03]} />
            <meshStandardMaterial color={hair} flatShading />
          </mesh>
          <mesh position={[0.09, 0.1, -0.2]} rotation={[0, 0, -0.08]}>
            <boxGeometry args={[0.08, 0.024, 0.03]} />
            <meshStandardMaterial color={hair} flatShading />
          </mesh>
          <mesh position={[-0.09, 0.03, -0.2]}>
            <sphereGeometry args={[0.032, 8, 8]} />
            <meshStandardMaterial color="#16161c" />
          </mesh>
          <mesh position={[0.09, 0.03, -0.2]}>
            <sphereGeometry args={[0.032, 8, 8]} />
            <meshStandardMaterial color="#16161c" />
          </mesh>
        </group>
        {/* upper arms reaching toward the keyboard */}
        <mesh position={[-0.46, 0.95, 0.0]} rotation={[0.9, 0.15, 0.25]}>
          <boxGeometry args={[0.18, 0.62, 0.18]} />
          <meshStandardMaterial color={suit} flatShading />
        </mesh>
        <mesh position={[0.46, 0.95, 0.0]} rotation={[0.9, -0.15, -0.25]}>
          <boxGeometry args={[0.18, 0.62, 0.18]} />
          <meshStandardMaterial color={suit} flatShading />
        </mesh>
        {/* hands hovering over the keyboard (world z ≈ 1.5, just above the caps) */}
        <mesh ref={leftHand} position={[-0.55, 0.58, -1.25]}>
          <boxGeometry args={[0.16, 0.09, 0.2]} />
          <meshStandardMaterial color={skin} flatShading />
        </mesh>
        <mesh ref={rightHand} position={[0.55, 0.58, -1.25]}>
          <boxGeometry args={[0.16, 0.09, 0.2]} />
          <meshStandardMaterial color={skin} flatShading />
        </mesh>
      </group>
    </group>
  )
}
