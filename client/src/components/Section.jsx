import { motion } from 'framer-motion'

export default function Section({ id, eyebrow, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="mb-10">
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mt-2 text-3xl md:text-5xl font-display font-extrabold gradient-text">
              {title}
            </h2>
          )}
          {subtitle && <p className="mt-3 max-w-2xl text-slate-400">{subtitle}</p>}
        </div>
        {children}
      </motion.div>
    </section>
  )
}
