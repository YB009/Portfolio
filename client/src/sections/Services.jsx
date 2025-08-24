import Section from '../components/Section'
import Card from '../components/Card'
import { services } from '../data/services'
import Spotlight from '../components/Spotlight'


export default function Services(){
return (
<Section id="services" eyebrow="Capabilities" title="Services" subtitle="The stack and specialties I bring to every engagement.">
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
{services.map((s, i)=> (
<Spotlight key={i}>
<Card className="h-full">
<h3 className="font-semibold text-lg">{s.title}</h3>
<p className="mt-2 text-sm text-slate-400">{s.desc}</p>
</Card>
</Spotlight>
))}
</div>
</Section>
)
}