import Section from '../components/Section'
import Card from '../components/Card'
import Button from '../components/Button'

export default function About() {
  const capabilities = [
    {
      group: 'Frontend',
      items: [
        'React',
        'Vite',
        'Tailwind CSS',
        'Framer Motion',
        'Responsive UI',
        'Accessibility',
        'Performance tuning',
      ],
    },
    {
      group: 'Backend',
      items: [
        'Node.js',
        'Express.js',
        'REST APIs',
        'Auth & sessions',
        'Email/SMTP',
        'EJS templating',
      ],
    },
    {
      group: 'Tooling & DevOps',
      items: [
        'Git & GitHub',
        'Small, focused PRs',
        'Meaningful tests',
        'Render/Vercel deploys',
        'Analytics & SEO basics',
      ],
    },
    {
      group: 'Product',
      items: [
        'Marketing & product sites',
        'Booking flows',
        'Design systems',
        'Reusable components',
        'Clear docs & handover',
      ],
    },
  ]

  return (
    <Section
      id="about"
      eyebrow="About"
      title="Hi, I’m Owolabi Daniel"
      subtitle="BSc Computer Science • Covenant University (Nigeria) • Web developer (1+ year)"
    >
      <Card>
        <div className="space-y-4">
          <p className="text-slate-300 leading-relaxed">
            I’m a Nigerian software developer and a Computer Science graduate from
            Covenant University. Over the last year I’ve focused on modern web development
            building fast, accessible interfaces with React and Tailwind, and robust APIs with
            Node.js and Express.
          </p>

          <p className="text-slate-300 leading-relaxed">
            I’ve shipped for startups and SMEs: marketing &amp; product sites, booking flows,
            design systems and Node APIs. I care about clean abstractions, clear boundaries
            between concerns, and tiny pull requests with tests that actually catch things.
            My goal is simple: ship work that feels polished, performs well, and is easy to
            extend.
          </p>

          <p className="text-slate-300 leading-relaxed">
            Day-to-day that means component-driven UIs, thoughtful motion, solid API contracts,
            and a bias for clarity over cleverness. If you need a very dependable builder for a modern
            web experience, I’m your guy.
          </p>

          <div className="pt-2">
            <Button href="#contact">Work with me</Button>
          </div>
        </div>
      </Card>

      {/* Capabilities */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {capabilities.map((sec) => (
          <Card key={sec.group}>
            <h4 className="text-slate-200 font-semibold">{sec.group}</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {sec.items.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-1 rounded-md text-xs text-slate-300 border border-white/10 glass"
                >
                  {item}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
