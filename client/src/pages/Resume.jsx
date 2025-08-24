import { useEffect, useRef, useState } from 'react'
import { Footer } from '../components/Footer'

export default function ResumePage() {
  const [pdfUrl, setPdfUrl] = useState(null)   // blob URL if we verified a real PDF
  const [useImage, setUseImage] = useState(true)
  const [imgOk, setImgOk] = useState(false)
  const [imgDims, setImgDims] = useState({ w: null, h: null })
  const imgRef = useRef(null)

  // Verify and auto-download the PDF (prevents downloading index.html mislabeled as .pdf)
  useEffect(() => {
    let revoked = false
    ;(async () => {
      try {
        const res = await fetch('/resume.pdf', { cache: 'no-store' })
        const type = res.headers.get('Content-Type') || ''
        if (!res.ok || !type.includes('application/pdf')) throw new Error('Not a PDF')
        const blob = await res.blob()
        if (blob.size < 1024) throw new Error('Tiny file')
        const url = URL.createObjectURL(blob)
        if (revoked) return
        setPdfUrl(url)

        // polite auto-download (keeps the page visible)
        const a = document.createElement('a')
        a.href = url
        a.download = 'Owolabi_Daniel_Resume.pdf'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      } catch {
        setPdfUrl(null)
      }
    })()
    return () => { revoked = true; if (pdfUrl) URL.revokeObjectURL(pdfUrl) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Prefer image preview; detect availability + capture natural size
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImgOk(true)
      setImgDims({ w: img.naturalWidth, h: img.naturalHeight })
    }
    img.onerror = () => setUseImage(false)
    img.src = '/resume.jpg'
  }, [])

  const onImgLoad = () => {
    const el = imgRef.current
    if (!el) return
    setImgDims({ w: el.naturalWidth, h: el.naturalHeight })
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Ambient glow (keeps the site’s background feel) */}
      <div className="fixed inset-0 -z-10 pointer-events-none shadow-glow" />

      {/* No Navbar on this page as requested */}

      <main className="container pt-10 md:pt-12 space-y-8">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Resume</p>
            <h1 className="mt-1 text-3xl md:text-4xl font-display font-extrabold gradient-text">
              Owolabi Daniel — CV
            </h1>
            <p className="text-slate-400 mt-2">
              A download has started automatically. You can also view it below.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="/resume.pdf"
              download
              className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white"
            >
              Download PDF
            </a>
            <a
              href="/"
              className="px-4 py-2 rounded-xl border border-white/10 glass hover:border-white/20"
            >
              ← Back to Home
            </a>
          </div>
        </header>

        {/* Viewer */}
        {useImage && imgOk ? (
          // Outer wrapper allows horizontal scroll if image is wider than the viewport
          <div className="w-full overflow-auto">
            <div
              className="mx-auto rounded-xl border border-white/10 glass overflow-hidden"
              style={{
                width: imgDims.w ? `${imgDims.w}px` : 'auto',
                height: imgDims.h ? `${imgDims.h}px` : 'auto'
              }}
            >
              <img
                ref={imgRef}
                src="/resume.jpg"
                alt="Resume preview"
                onLoad={onImgLoad}
                className="block w-full h-full"
                loading="eager"
              />
            </div>
          </div>
        ) : pdfUrl ? (
          <section className="rounded-xl border border-white/10 glass overflow-hidden">
            <object data={pdfUrl} type="application/pdf" className="w-full h-[75vh] md:h-[80vh]">
              <iframe title="Resume PDF" src={pdfUrl} className="w-full h-[75vh] md:h-[80vh] border-0" />
            </object>
          </section>
        ) : (
          <section className="rounded-xl border border-white/10 glass p-6 text-slate-300">
            Couldn’t verify the PDF on this environment. You can still{' '}
            <a href="/resume.pdf" className="text-primary-200 hover:text-white underline underline-offset-4">
              download it directly
            </a>.
          </section>
        )}

        {/* Optional viewer toggle if you keep both paths */}
        {(imgOk || pdfUrl) && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Viewer mode:</span>
            <button
              onClick={() => setUseImage(true)}
              className={`px-3 py-1 rounded-lg border ${
                useImage ? 'border-primary-600 text-slate-200' : 'border-white/10 hover:border-white/20'
              }`}
            >
              Image
            </button>
            <button
              onClick={() => setUseImage(false)}
              className={`px-3 py-1 rounded-lg border ${
                !useImage ? 'border-primary-600 text-slate-200' : 'border-white/10 hover:border-white/20'
              }`}
            >
              PDF
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
