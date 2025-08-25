import Section from '../components/Section'
import Card from '../components/Card'
import projects from '../data/projects'
import LiquidGlass from '../components/LiquidGlass'
import { useEffect, useRef, useState } from 'react'

export default function Work() {
  const anchorRef = useRef(null)
  const [pillXY, setPillXY] = useState(null)

  // Place the pill just BELOW the topic text, with responsive spawn positions.
  // Recalculate on resize and when layout changes (via ResizeObserver).
  useEffect(() => {
    const computePosition = () => {
      const el = anchorRef.current
      if (!el) { setPillXY({ x: 16, y: 16 }); return }

      const r = el.getBoundingClientRect()
      const baseX = r.left + window.scrollX
      const baseY = r.bottom + window.scrollY

      // Tailwind-esque breakpoints
      const sm = window.matchMedia('(min-width: 640px)').matches
      const md = window.matchMedia('(min-width: 768px)').matches
      const lg = window.matchMedia('(min-width: 1024px)').matches

      let x
      let y = baseY + 12 // small gap beneath the label

      if (!sm) {
        // Phones: center-ish near the anchor so it doesn't overlap edges
        const approxPillWidth = Math.min(Math.max(window.innerWidth * 0.24, 150), 240)
        x = Math.max(12, Math.round((window.innerWidth - approxPillWidth) / 2))
      } else if (sm && !md) {
        // Small tablets: align with text but keep a small inset
        x = Math.max(12, baseX + 4)
      } else if (md && !lg) {
        // Tablets: align to text; layout is wider so no extra inset
        x = Math.max(12, baseX)
      } else {
        // Desktop and up: left align with the text block
        x = Math.max(16, baseX)
      }

      setPillXY({ x, y })
    }

    // Run after layout is ready
    const id = requestAnimationFrame(computePosition)

    // Listen for viewport resizes
    window.addEventListener('resize', computePosition)

    // Observe layout/content changes that might move the anchor
    const ro = new ResizeObserver(computePosition)
    ro.observe(document.documentElement)
    if (anchorRef.current) ro.observe(anchorRef.current)

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', computePosition)
      ro.disconnect()
    }
  }, [])

  return (
    <Section
      id="work"
      eyebrow="Selected projects"
      title="Work"
      subtitle="Real-world builds and iterative improvements."
    >
      {/* Projects grid */}
      <div className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.id}>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-white/10 glass overflow-hidden"
            >
              <div className="h-56 grid place-items-center">
                {p.logo ? (
                  <img
                    src={p.logo}
                    alt={`${p.title} logo`}
                    className="max-h-32 max-w-[70%] object-contain opacity-90"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement.style.background =
                        'linear-gradient(180deg, rgba(148,163,184,.15), rgba(148,163,184,.04))'
                    }}
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
            </a>

            <div className="mt-5">
              <h3 className="text-lg font-semibold text-slate-100">{p.title}</h3>
              <p className="mt-2 text-slate-400">{p.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-md text-xs text-slate-300 border border-white/10 glass"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-5 text-slate-200 hover:text-white"
              >
                View →
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Topic text (anchor for pill placement) */}
      <div className="mt-12" ref={anchorRef}>
        <h4 className="text-slate-200 text-lg font-semibold">Glass pill effect</h4>
        <p className="text-slate-400 text-sm mt-1">Drag to move around</p>
      </div>

      {/* Global pill — appears beneath the text and can be dragged anywhere across the page */}
      {pillXY && (
        <LiquidGlass
          initialXY={pillXY}
          width="clamp(150px, 24vw, 240px)"
          height="clamp(40px, 6vw, 56px)"  // shorter to avoid covering content on small screens
          radius={9999}
        />
      )}
    </Section>
  )
}
