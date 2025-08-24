import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Navigation links
const links = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '/resume', label: 'Resume' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  // Close on Esc / when resizing to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
    const onKeyDown = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  // Lock page scroll when menu is open
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    if (open) { html.style.overflow = 'hidden'; body.style.overflow = 'hidden' }
    else { html.style.overflow = ''; body.style.overflow = '' }
  }, [open])

  // Full-screen overlay via portal so it sits above everything
  const overlay = createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100]"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: '#0f172a', // slate-950
              backgroundImage:
                "var(--noise), radial-gradient(1200px 600px at 50% -100px, rgba(99,102,241,0.25), transparent 60%)",
              backgroundBlendMode: 'soft-light, normal',
            }}
          />
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 p-2 rounded-lg border border-white/10 glass text-slate-200"
            >
              <X size={20} />
            </button>

            <div className="container h-full pt-20 pb-10 flex flex-col gap-8">
              <div className="mt-8 flex-1 flex flex-col justify-center gap-6">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-4xl font-semibold text-slate-100 hover:text-white"
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-slate-50 w-full sm:w-max"
                >
                  Contact
                </a>
              </div>

              <p className="text-sm text-slate-400/80">
                © {new Date().getFullYear()} Owolabi Daniel
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-slate-950/70 backdrop-blur border-b border-white/5">
        <nav className="container flex items-center justify-between py-4">
          {/* Brand — logo removed, name updated */}
          <a href="#home" className="flex items-center">
            <span className="font-display font-extrabold tracking-tight">
              Owolabi Daniel
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-slate-300 hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg glass border border-white/10"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {overlay}
    </>
  )
}
