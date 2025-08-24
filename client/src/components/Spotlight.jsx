import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useRef } from 'react'


export default function Spotlight({children}){
const ref = useRef(null)
const x = useMotionValue(0)
const y = useMotionValue(0)
const bg = useTransform([x,y], ([mx,my]) => `radial-gradient(280px 180px at ${mx}px ${my}px, rgba(99,102,241,.18), transparent 70%)`)


return (
<motion.div
ref={ref}
onMouseMove={(e)=>{
const r = ref.current.getBoundingClientRect()
x.set(e.clientX - r.left); y.set(e.clientY - r.top)
}}
style={{ backgroundImage: bg }}
className="rounded-2xl border border-white/10 glass"
>
{children}
</motion.div>
)
}