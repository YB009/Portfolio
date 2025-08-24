// Global pill "liquid glass" panel (portal; draggable across the whole page)
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'

export default function LiquidGlass({
  // Very compact, phone-friendly pill by default
  width = 'clamp(150px, 24vw, 240px)',
  height = 'clamp(40px, 6vw, 56px)',
  radius = 9999,
  initialXY = { x: 16, y: 16 },
}) {
  const surfaceRef = useRef(null)
  const [docSize, setDocSize] = useState({ w: 0, h: 0 })

  const toCss = (v) => (typeof v === 'number' ? `${v}px` : v)

  // Make the drag surface cover the WHOLE document (not just the viewport)
  useEffect(() => {
    const measure = () => {
      const d = document.documentElement
      const b = document.body
      const w = Math.max(d.scrollWidth, b.scrollWidth, window.innerWidth)
      const h = Math.max(d.scrollHeight, b.scrollHeight, window.innerHeight)
      setDocSize({ w, h })
    }
    measure()
    window.addEventListener('resize', measure)
    // if content grows after hydration
    const obs = new ResizeObserver(measure)
    obs.observe(document.documentElement)
    return () => {
      window.removeEventListener('resize', measure)
      obs.disconnect()
    }
  }, [])

  const node = (
    // Absolute surface spans the full document — pill can live anywhere vertically
    <div
      ref={surfaceRef}
      className="absolute left-0 top-0 pointer-events-none z-[60]" // above navbar (z-50), below mobile menu overlay (z-[100])
      style={{ width: docSize.w, height: docSize.h }}
    >
      <motion.div
        drag
        dragConstraints={surfaceRef}
        dragElastic={0.12}
        dragMomentum={0.28}
        whileTap={{ scale: 0.985 }}
        initial={{ x: initialXY.x, y: initialXY.y }}
        className="pointer-events-auto relative"
        style={{
          width: toCss(width),
          height: toCss(height),
          borderRadius: radius,
          // extra-clear glass look
          background:
            'linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.04))',
          backdropFilter: 'blur(2px) saturate(135%)',
          WebkitBackdropFilter: 'blur(2px) saturate(135%)',
          border: '1px solid rgba(255,255,255,.06)',
          boxShadow:
            '0 14px 46px rgba(0,0,0,.45), 0 2px 0 rgba(255,255,255,.06) inset, 0 0 0 1px rgba(255,255,255,.09) inset',
          touchAction: 'none',
        }}
      >
        {/* minimal specular to sell the glass */}
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,.20), rgba(255,255,255,0) 42%)',
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{ boxShadow: 'inset 0 0 60px rgba(255,255,255,.035)' }}
        />
      </motion.div>
    </div>
  )

  // Use a portal so it floats globally above the page content
  return createPortal(node, document.body)
}
