export function Footer(){
    return (
    <footer className="mt-24 border-t border-white/5">
    <div className="container py-10 text-sm text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
    <p>© {new Date().getFullYear()} Owolabi Daniel. All rights reserved.</p>
    <p className="opacity-70">Built with React, Tailwind & Express.</p>
    </div>
    </footer>
    )
    }