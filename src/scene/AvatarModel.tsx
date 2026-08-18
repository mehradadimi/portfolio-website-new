import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { onKey } from '../state/keybus'
import { Chair } from './Avatar'

const AVATAR_URL = '/mehrad-avatar.glb'

// Seated pose, applied to the Avaturn/Mixamo rig. Values are local euler
// rotations in radians, tuned by screenshot iteration.
const POSE: Record<string, [number, number, number]> = {
  Spine: [0.1, 0, 0],
  Spine1: [0.06, 0, 0],
  Spine2: [0.04, 0, 0],
  Neck: [-0.12, 0, 0],
  Head: [-0.06, 0, 0],
  LeftUpLeg: [1.5, 0.12, 0.06],
  RightUpLeg: [1.5, -0.12, -0.06],
  LeftLeg: [1.1, 0, 0],
  RightLeg: [1.1, 0, 0],
  LeftFoot: [0.45, 0, 0],
  RightFoot: [0.45, 0, 0],
  LeftShoulder: [0, 0, 0],
  RightShoulder: [0, 0, 0],
}

// world-space directions the limb segments should point (he faces -z)
const AIM: Array<[bone: string, child: string, dir: [number, number, number]]> = [
  ['LeftArm', 'LeftForeArm', [-0.18, -0.85, -0.5]],
  ['RightArm', 'RightForeArm', [0.18, -0.85, -0.5]],
  ['LeftForeArm', 'LeftHand', [-0.05, -0.38, -1]],
  ['RightForeArm', 'RightHand', [0.05, -0.38, -1]],
  ['LeftHand', 'LeftHandMiddle1', [-0.05, -0.45, -1]],
  ['RightHand', 'RightHandMiddle1', [0.05, -0.45, -1]],
]

// gentle finger curl over the keys
const FINGER_CURL = 0.3

export function AvatarModel() {
  const { scene } = useGLTF(AVATAR_URL)
  const dipRef = useRef({ left: 0, right: 0 })
  const baseQ = useRef<{ l?: THREE.Quaternion; r?: THREE.Quaternion }>({})
  const dipQ = useMemo(() => new THREE.Quaternion(), [])
  const xAxis = useMemo(() => new THREE.Vector3(1, 0, 0), [])

  const bones = useMemo(() => {
    const map = new Map<string, THREE.Object3D>()
    scene.traverse((o) => {
      if ((o as THREE.SkinnedMesh).isSkinnedMesh) {
        o.frustumCulled = false
      }
      map.set(o.name, o)
    })
    return map
  }, [scene])

  // apply the static pose once
  useEffect(() => {
    for (const [name, [x, y, z]] of Object.entries(POSE)) {
      bones.get(name)?.rotation.set(x, y, z)
    }
    // arms: aim each segment at a world-space direction — robust against
    // whatever local axes the rig uses
    const bp = new THREE.Vector3()
    const cp = new THREE.Vector3()
    const pq = new THREE.Quaternion()
    for (const [boneName, childName, dir] of AIM) {
      const bone = bones.get(boneName)
      const child = bones.get(childName)
      if (!bone || !child || !bone.parent) continue
      scene.updateMatrixWorld(true)
      bone.getWorldPosition(bp)
      child.getWorldPosition(cp)
      const cur = cp.sub(bp).normalize()
      const des = new THREE.Vector3(...dir).normalize()
      const qWorld = new THREE.Quaternion().setFromUnitVectors(cur, des)
      bone.parent.getWorldQuaternion(pq)
      const qLocal = pq.clone().invert().multiply(qWorld).multiply(pq)
      bone.quaternion.premultiply(qLocal)
    }
    for (const side of ['Left', 'Right']) {
      for (const finger of ['Index', 'Middle', 'Ring', 'Pinky']) {
        for (const seg of ['1', '2', '3']) {
          const knuckle = bones.get(`${side}Hand${finger}${seg}`)
          if (knuckle) knuckle.rotation.x += FINGER_CURL
        }
      }
    }
    baseQ.current.l = bones.get('LeftForeArm')?.quaternion.clone()
    baseQ.current.r = bones.get('RightForeArm')?.quaternion.clone()
  }, [bones, scene])

  useEffect(
    () =>
      onKey((code, down) => {
        if (!down) return
        const rightSide = /Key[YUIOPHJKLNM]|Digit[67890]|Bracket|Semicolon|Quote|Comma|Period|Slash|Enter|Backspace/.test(code)
        if (rightSide) dipRef.current.right = 1
        else dipRef.current.left = 1
      }),
    [],
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    // breathing + reading the screen
    const spine = bones.get('Spine1')
    if (spine) spine.rotation.x = POSE.Spine1[0] + Math.sin(t * 1.6) * 0.012
    const head = bones.get('Head')
    if (head) {
      head.rotation.y = Math.sin(t * 0.4) * 0.1
      head.rotation.z = Math.sin(t * 0.23) * 0.03
    }
    // forearms dip toward the keys when the visitor types
    const decay = Math.exp(-delta * 10)
    dipRef.current.left *= decay
    dipRef.current.right *= decay
    const lf = bones.get('LeftForeArm')
    if (lf && baseQ.current.l) {
      dipQ.setFromAxisAngle(xAxis, dipRef.current.left * 0.14)
      lf.quaternion.copy(baseQ.current.l).multiply(dipQ)
    }
    const rf = bones.get('RightForeArm')
    if (rf && baseQ.current.r) {
      dipQ.setFromAxisAngle(xAxis, dipRef.current.right * 0.14)
      rf.quaternion.copy(baseQ.current.r).multiply(dipQ)
    }
  })

  return (
    <group>
      <Chair />
      {/* model origin is at the feet — sink the group so the hips land on
          the lowered chair seat (top ≈ y -0.10 world) with legs under the desk */}
      <group position={[0, -1.67, 2.72]} rotation={[0, Math.PI, 0]} scale={1.65}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

useGLTF.preload(AVATAR_URL)
