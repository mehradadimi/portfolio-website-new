import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { scrollState, sectionFloat } from '../state/scrollState'
import { prefersReducedMotion } from '../scroll/scrollManager'
import { useStore } from '../state/store'

// One camera waypoint per DOM section, in section order.
const WAYPOINTS: Array<{ pos: THREE.Vector3; look: THREE.Vector3 }> = [
  { pos: new THREE.Vector3(0, 2.5, 8.6), look: new THREE.Vector3(-2.0, 0.9, -0.2) }, // home — desk on the right, text left
  { pos: new THREE.Vector3(0, 4.6, 4.1), look: new THREE.Vector3(0, -0.7, 0.9) }, // skills — centered fly-over of the keyboard
  { pos: new THREE.Vector3(0, 2.2, 6.2), look: new THREE.Vector3(0, 2.9, -1.4) }, // experience — monitor centered, below the heading
  { pos: new THREE.Vector3(0, 2.2, 9.5), look: new THREE.Vector3(0, 1.6, -0.5) }, // projects — panels flank both sides
  { pos: new THREE.Vector3(0, 3.0, 12.6), look: new THREE.Vector3(0, 3.9, 0) }, // contact — island low, text above
]

const smoothstep = (t: number) => t * t * (3 - 2 * t)

// interactive-mode POVs: over Mehrad's shoulder, and zoomed onto the screen
const POV_DESK = { pos: new THREE.Vector3(1.5, 3.05, 5.2), look: new THREE.Vector3(-0.1, 1.6, -1.4) }
const SCREEN_LOOK = new THREE.Vector3(0, 1.94, -1.45)
// monitor screen: 3.68 × 2.3 world units at z ≈ -1.33
const SCREEN_W = 3.68
const SCREEN_H = 2.3
const SCREEN_Z = -1.33
const SCREEN_MARGIN = 1.12

export function CameraRig() {
  const reduced = useMemo(prefersReducedMotion, [])
  const desired = useRef(new THREE.Vector3())
  const desiredLook = useRef(new THREE.Vector3())
  const look = useRef(new THREE.Vector3(0, 0.8, -0.2))

  useFrame(({ camera, pointer, size }, delta) => {
    const { mode, screenZoom } = useStore.getState()
    if (mode === 'interactive') {
      let lookTarget = POV_DESK.look
      if (screenZoom) {
        // back the camera off just far enough that the whole screen fits
        // this viewport, whatever its aspect ratio
        const persp = camera as THREE.PerspectiveCamera
        const tanHalf = Math.tan(THREE.MathUtils.degToRad(persp.fov) / 2)
        const aspect = size.width / size.height
        const dist = Math.max(
          (SCREEN_H * SCREEN_MARGIN) / (2 * tanHalf),
          (SCREEN_W * SCREEN_MARGIN) / (2 * tanHalf * aspect),
        )
        desired.current.set(0, 1.94, SCREEN_Z + dist)
        lookTarget = SCREEN_LOOK
      } else {
        desired.current.copy(POV_DESK.pos)
        if (!reduced) {
          desired.current.x += pointer.x * 0.18
          desired.current.y += pointer.y * 0.1
        }
      }
      const ki = reduced ? 1 : 1 - Math.exp(-delta * 3.5)
      camera.position.lerp(desired.current, ki)
      look.current.lerp(lookTarget, ki)
      camera.lookAt(look.current)
      return
    }

    const sec = sectionFloat(scrollState.progress)
    const i = Math.min(WAYPOINTS.length - 2, Math.floor(sec))
    const t = smoothstep(Math.min(1, Math.max(0, sec - i)))
    desired.current.lerpVectors(WAYPOINTS[i].pos, WAYPOINTS[i + 1].pos, t)
    desiredLook.current.lerpVectors(WAYPOINTS[i].look, WAYPOINTS[i + 1].look, t)

    // narrow viewports (portrait phones) get a wider shot
    const aspect = size.width / size.height
    if (aspect < 1.05) {
      const zoomOut = aspect < 0.75 ? 1.55 : 1.25
      desired.current.sub(desiredLook.current).multiplyScalar(zoomOut).add(desiredLook.current)
    }

    if (!reduced) {
      // subtle mouse parallax
      desired.current.x += pointer.x * 0.35
      desired.current.y += pointer.y * 0.2
    }

    const k = reduced ? 1 : 1 - Math.exp(-delta * 4.5)
    camera.position.lerp(desired.current, k)
    look.current.lerp(desiredLook.current, k)
    camera.lookAt(look.current)
  })

  return null
}
