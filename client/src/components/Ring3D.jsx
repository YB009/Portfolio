import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * 3D neon ring (three.js)
 * - keeps subtle auto-rotation, parallax tilt, gentle bob
 * - NEW: horizontal bounce that adapts to the viewport width
 */
export default function Ring3D({ tilt = { x: 0, y: 0 } }) {
  const mountRef = useRef(null)
  const tiltRef = useRef(tilt)
  useEffect(() => { tiltRef.current = tilt }, [tilt])

  useEffect(() => {
    const mount = mountRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0, 3)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    mount.appendChild(renderer.domElement)

    // --- Lights
    scene.add(new THREE.AmbientLight(0x6677ff, 0.6))
    const dir1 = new THREE.DirectionalLight(0x88aaff, 0.9)
    dir1.position.set(5, 5, 5)
    scene.add(dir1)

    // --- Ring inside a group so we can move it horizontally as one unit
    const group = new THREE.Group()
    scene.add(group)

    const geo = new THREE.TorusGeometry(0.7, 0.22, 64, 256) // major=0.7, tube=0.22
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#6366f1'),
      emissive: new THREE.Color('#4338ca'),
      emissiveIntensity: 0.65,
      metalness: 0.45,
      roughness: 0.2,
    })
    const ring = new THREE.Mesh(geo, mat)
    ring.rotation.x = -0.6
    group.add(ring)

    // --- Bounce params
    const SPEED = 0.6 // units / second (tweak for faster/slower)
    const R_MAJOR = 0.7
    const R_TUBE = 0.22
    const R_HALF = R_MAJOR + R_TUBE // max horizontal half-extent of torus (~0.92)
    const EDGE_MARGIN = 0.1 // keep a little gap from the edge

    const state = { dir: 1, bounds: 1 }

    // Calculate horizontal bounds in world units at z=0 so we can clamp
    const calcBounds = () => {
      const vFov = (camera.fov * Math.PI) / 180
      const halfH = Math.tan(vFov / 2) * camera.position.z
      const halfW = halfH * camera.aspect
      // leave space so the whole ring stays visible
      return Math.max(0.2, halfW - (R_HALF + EDGE_MARGIN))
    }

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      state.bounds = calcBounds()
      // clamp position inside new bounds
      group.position.x = Math.max(-state.bounds, Math.min(state.bounds, group.position.x))
    }

    resize()
    window.addEventListener('resize', resize)

    // Start near the left side so motion is obvious
    group.position.x = -state.bounds

    // --- Animate
    let raf
    const clock = new THREE.Clock()
    const render = () => {
      const dt = clock.getDelta()
      const t = clock.elapsedTime

      // keep existing motions
      const { x, y } = tiltRef.current
      ring.rotation.y += 0.006
      ring.rotation.x = -0.6 + x * 0.25
      ring.rotation.z = y * 0.25
      ring.position.z = Math.sin(t * 0.6) * 0.02

      // horizontal bounce with edge clamp
      group.position.x += state.dir * SPEED * dt
      if (group.position.x >= state.bounds) {
        group.position.x = state.bounds
        state.dir = -1
      } else if (group.position.x <= -state.bounds) {
        group.position.x = -state.bounds
        state.dir = 1
      }

      renderer.render(scene, camera)
      raf = requestAnimationFrame(render)
    }
    render()

    // Cleanup
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      geo.dispose()
      mat.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="loader-canvas" />
}
