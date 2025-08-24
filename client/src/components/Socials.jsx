// client/src/components/Socials.jsx
import { Github, Linkedin, Mail } from 'lucide-react'

const LINKS = {
  github: 'https://github.com/YB009',
  linkedin: 'https://www.linkedin.com/in/daniel-owolabi-8b9651378',
  email: 'owohdaniel09@gmail.com',
}

export default function Socials() {
  return (
    <div className="flex items-center gap-3">
      {/* GitHub */}
      <a
        href={LINKS.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub profile"
        title="GitHub"
        className="h-11 w-11 grid place-items-center rounded-xl border border-white/10 glass text-slate-200 hover:border-white/20 transition will-change-transform active:scale-95"
      >
        <Github className="h-5 w-5" />
      </a>

      {/* LinkedIn */}
      <a
        href={LINKS.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn profile"
        title="LinkedIn"
        className="h-11 w-11 grid place-items-center rounded-xl border border-white/10 glass text-slate-200 hover:border-white/20 transition will-change-transform active:scale-95"
      >
        <Linkedin className="h-5 w-5" />
      </a>

      {/* Email */}
      <a
        href={`mailto:${LINKS.email}`}
        aria-label="Send me an email"
        title={LINKS.email}
        className="h-11 w-11 grid place-items-center rounded-xl border border-white/10 glass text-slate-200 hover:border-white/20 transition will-change-transform active:scale-95"
      >
        <Mail className="h-5 w-5" />
      </a>
    </div>
  )
}
