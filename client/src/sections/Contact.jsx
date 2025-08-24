import Section from '../components/Section'
import Card from '../components/Card'
import { useState } from 'react'
import { Phone, Mail, Download, CheckCircle2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import config from '../config'

export default function Contact(){
  const [state, setState] = useState({ name:'', email:'', message:'', status:'idle' })
  const [toast, setToast] = useState(null) // { text: string }

  const showToast = (text) => {
    setToast({ text })
    // auto-hide after 1.2s
    setTimeout(() => setToast(null), 1200)
  }

  const safeCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = value
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(ta)
    }
  }

  const copyPhone = async () => {
    await safeCopy('+234 704 996 1522')
    showToast('Phone number copied')
  }

  const copyEmail = async (e) => {
    // Do not block mailto behavior — copy & let default continue
    await safeCopy('owohdaniel09@gmail.com')
    showToast('Email copied')
  }

  const submit = async (e) => {
    e.preventDefault()
    setState(s=>({...s, status:'loading'}))
    try{
      const res = await fetch(config.getApiUrl('api/contact'), {
        method: 'POST', headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ name: state.name, email: state.email, message: state.message })
      })
      if(!res.ok) throw new Error('Bad response')
      setState({ name:'', email:'', message:'', status:'success' })
    }catch(err){
      console.error('Contact form error:', err)
      setState(s=>({...s, status:'error'}))
    }
  }

  return (
    <Section id="contact" eyebrow="Get in touch" title="Contact" subtitle="Tell me about your project and timelines.">
      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg border border-white/10 glass text-slate-200 flex items-center gap-2"
            role="status" aria-live="polite"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span className="text-sm">{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Card>
        {/* Quick-contact + resume */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {/* Click-to-copy chips */}
          <div className="md:col-span-2 rounded-xl border border-white/10 glass p-4">
            <p className="text-slate-300 font-medium">Reach me</p>

            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              {/* PHONE — copy only */}
              <button
                type="button"
                onClick={copyPhone}
                title="Click to copy"
                className="text-left flex items-center gap-3 rounded-lg border border-white/10 glass px-3 py-2 hover:border-white/20 transition-colors"
              >
                <span className="p-2 rounded-md bg-slate-900/60 border border-white/10">
                  <Phone size={16}/>
                </span>
                <span className="text-sm text-slate-300 select-all">+234 704 996 1522</span>
              </button>

              {/* EMAIL — copies and still opens mail client */}
              <a
                href="mailto:owohdaniel09@gmail.com"
                onClick={copyEmail}
                title="Click to email (also copies)"
                className="flex items-center gap-3 rounded-lg border border-white/10 glass px-3 py-2 hover:border-white/20 transition-colors"
                rel="noopener noreferrer"
              >
                <span className="p-2 rounded-md bg-slate-900/60 border border-white/10">
                  <Mail size={16}/>
                </span>
                <span className="text-sm text-slate-300 select-all">owohdaniel09@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Resume actions */}
          <div className="flex flex-col justify-between rounded-xl border border-white/10 glass p-4">
            <div>
              <p className="text-slate-300 font-medium">Resume</p>
              <p className="text-xs text-slate-400 mt-1">Open the resume page or download the PDF directly.</p>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white"
              >
                <Download size={16}/> Download Resume
              </a>
              <a href="/resume" className="text-sm text-slate-300 hover:text-white underline underline-offset-4">
                Open resume page →
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400">Name</label>
            <input required value={state.name} onChange={e=>setState({...state, name:e.target.value})} className="mt-1 w-full rounded-xl bg-slate-900/60 border border-white/10 p-3 outline-none focus:border-primary-600"/>
          </div>
          <div>
            <label className="text-sm text-slate-400">Email</label>
            <input type="email" required value={state.email} onChange={e=>setState({...state, email:e.target.value})} className="mt-1 w-full rounded-xl bg-slate-900/60 border border-white/10 p-3 outline-none focus:border-primary-600"/>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-400">Message</label>
            <textarea required rows="5" value={state.message} onChange={e=>setState({...state, message:e.target.value})} className="mt-1 w-full rounded-xl bg-slate-900/60 border border-white/10 p-3 outline-none focus:border-primary-600"/>
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <button disabled={state.status==='loading'} className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60">{state.status==='loading' ? 'Sending…' : 'Send message'}</button>
            {state.status==='success' && <p className="text-emerald-400 text-sm">Sent! I’ll get back shortly.</p>}
            {state.status==='error' && <p className="text-rose-400 text-sm">Something went wrong. Try again.</p>}
          </div>
        </form>
      </Card>
    </Section>
  )
}
