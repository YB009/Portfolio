import { useEffect, useRef, useState } from 'react'
import Ring3D from './Ring3D'
import FollowEyes from './FollowEyes'

/**
 * Loader screen:
 * - 3D ring background (three.js)
 * - Two 3D text layers (CSS perspective)
 * - Stays until user click/scroll/tap/keypress
 * - Subtle exit animation
 */
export default function Loader({ onDone, textTop = "Owolabi Daniel's Portfolio", textSub = "Click/Scroll to explore" }) {
  const [exiting, setExiting] = useState(false)
  const wrapRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 }) // normalized -1..1

  // Keep page stationary under loader
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    const finish = () => {
      if (exiting) return
      setExiting(true)
      setTimeout(() => {
        html.style.overflow = prevHtml
        body.style.overflow = prevBody
        onDone?.()
      }, 480)
    }

    const onClick = () => finish()
    const onKey = () => finish()
    const onWheel = (e) => { e.preventDefault(); finish() }
    const onTouchStart = () => finish()
    const onTouchMove = (e) => { e.preventDefault(); finish() }

    window.addEventListener('click', onClick, { once: true })
    window.addEventListener('keydown', onKey, { once: true })
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { once: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [exiting, onDone])

  // Pointer-based parallax tilt (like the reference)
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const handle = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)))
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)))
      setTilt({ x: -ny, y: nx }) // rotateX follows vertical movement
      el.style.transform = `rotateX(${(-ny) * 7}deg) rotateY(${nx * 7}deg)`
    }
    const reset = () => { el.style.transform = 'rotateX(0deg) rotateY(0deg)'; setTilt({ x: 0, y: 0 }) }

    window.addEventListener('pointermove', handle)
    window.addEventListener('pointerleave', reset)
    return () => {
      window.removeEventListener('pointermove', handle)
      window.removeEventListener('pointerleave', reset)
    }
  }, [])

  return (
    <div className={`loader-root fixed inset-0 z-[100] bg-slate-950 ${exiting ? 'loader-exit' : ''}`}>
      {/* 3D ring (behind text) */}
      <Ring3D tilt={tilt} />

      {/* Text layers (front) */}
      <div className="absolute inset-x-0 top-0 flex justify-center pt-[76px] z-[3]">
        <FollowEyes />
      </div>

      <div className="loader-3d">
        <div ref={wrapRef} className="loader-layers">
          <h1 className="loader-title" style={{ transform: 'translateZ(80px)' }}>
            {textTop}
          </h1>
          <p className="loader-subtitle" style={{ transform: 'translateZ(40px)' }}>
            {textSub}
          </p>
        </div>
      </div>

      {/* Interaction hint (fallback if motion reduced) */}
      <p className="loader-hint">Click, scroll, or tap to continue</p>
    </div>
  )
}
