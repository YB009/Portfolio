export default function Marquee({items}){
    return (
    <div className="overflow-hidden whitespace-nowrap py-2 text-xs tracking-wider text-slate-400">
    <div className="animate-[scroll_25s_linear_infinite] inline-block [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
    {items.concat(items).map((t, i)=>(
    <span key={i} className="mx-6 opacity-70">{t}</span>
    ))}
    </div>
    <style>{`@keyframes scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
    )
    }