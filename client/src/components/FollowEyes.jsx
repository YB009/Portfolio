import { useEffect, useRef, useState } from 'react'

export default function FollowEyes() {
  const eyeRefs = useRef([])
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 768px)').matches
  })
  const [offsets, setOffsets] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia('(min-width: 768px)')
    const onChange = (e) => setEnabled(e.matches)
    setEnabled(mql.matches)
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange)
    } else {
      mql.addListener(onChange)
    }
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', onChange)
      } else {
        mql.removeListener(onChange)
      }
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    let raf = null
    let last = { x: 0, y: 0 }

    const update = () => {
      raf = null
      const next = eyeRefs.current.map((eye) => {
        if (!eye) return { x: 0, y: 0 }
        const r = eye.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = last.x - cx
        const dy = last.y - cy
        const dist = Math.hypot(dx, dy) || 1
        const max = Math.min(r.width, r.height) * 0.18
        return {
          x: (dx / dist) * max,
          y: (dy / dist) * max,
        }
      })
      setOffsets(next)
    }

    const onMove = (e) => {
      last = { x: e.clientX, y: e.clientY }
      if (!raf) raf = requestAnimationFrame(update)
    }

    const onLeave = () => {
      setOffsets([
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ])
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="flex items-center justify-center gap-6">
      {[0, 1].map((i) => (
        <div
          key={i}
          ref={(el) => {
            eyeRefs.current[i] = el
          }}
          className="relative w-16 h-10 rounded-full bg-slate-100/90 border border-white/30 shadow-inner"
        >
          <div
            className="absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-slate-900"
            style={{
              transform: `translate(-50%, -50%) translate(${offsets[i]?.x ?? 0}px, ${offsets[i]?.y ?? 0}px)`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
