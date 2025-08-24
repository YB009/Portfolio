import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import Hero from './sections/Hero'
import Services from './sections/Services'
import Work from './sections/Work'
import About from './sections/About'
import Contact from './sections/Contact'
import Loader from './components/Loader'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    if (loading) { html.style.overflow = 'hidden'; body.style.overflow = 'hidden' }
    else { html.style.overflow = ''; body.style.overflow = '' }
    return () => { html.style.overflow = prevHtml || ''; body.style.overflow = prevBody || '' }
  }, [loading])

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none shadow-glow" />

      {loading && <Loader text={"Owolabi Daniel's Portfolio"} onDone={() => setLoading(false)} />}

      <Navbar />

      {/* ↓ smaller offset so the hero sits right under the navbar */}
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: loading ? 0 : 1, y: loading ? 8 : 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="container pt-14 md:pt-16 space-y-28 md:space-y-36"
      >
        <div id="home" className="h-0" />
        <Hero />
        <Services />
        <Work />
        <About />
        <Contact />
      </motion.main>

      <Footer />
    </div>
  )
}
