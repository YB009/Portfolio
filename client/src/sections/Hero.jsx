import { motion } from 'framer-motion'
import Button from '../components/Button'
import Socials from '../components/Socials'
import Marquee from '../components/Marquee'
import FollowEyes from '../components/FollowEyes'

export default function Hero() {
  return (
    // removed pt-20 md:pt-28; keep anchor offset for fixed navbar
    <section id="home" className="pt-0 md:pt-0 scroll-mt-24">
      <div className="text-center max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-xs uppercase tracking-[0.25em] text-slate-400"
        >
          Trusted engineer since 2024
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-3 text-4xl md:text-6xl font-display font-extrabold leading-tight"
        >
          <span className="gradient-text">My Workspace</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-4 text-slate-400"
        >
          Full Web Development, UI/UX Design, Diagnostics, wiring APIs, component systems, performance tuning and DX-friendly tooling 
          delivered with precision and care.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <Button href="#contact">Book a project</Button>
          <a href="#work" className="px-5 py-2.5 rounded-xl border border-white/10 glass">
            See my work
          </a>
        </motion.div>

        <div className="mt-5 flex justify-center">
          <FollowEyes />
        </div>

        <div className="mt-10 flex items-center justify-center">
          <Socials />
        </div>
      </div>

      <div className="mt-10">
        <Marquee
          items={[
            'Dealer-level tools',
            'Same-day callouts',
            'EV-aware',
            'Accessible UI',
            'Core Web Vitals',
            'Design systems',
          ]}
        />
      </div>
    </section>
  )
}
