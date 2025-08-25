import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { sendEmail } from './email-service.js'

dotenv.config()

const app = express()

/* ------------------------------- middleware ------------------------------- */
app.use(express.json({ limit: '1mb' }))

// CORS: allow explicit origins in ORIGIN (comma-separated); sensible defaults for dev
const ORIGIN =
  (process.env.ORIGIN
    ? process.env.ORIGIN.split(',').map(s => s.trim()).filter(Boolean)
    : ['http://localhost:5173'])

app.use(
  cors({
    origin: ORIGIN,
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: false,
  })
)

/* --------------------------------- routes --------------------------------- */

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {}
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  try {
    await sendEmail({ name, email, message })
    res.json({ ok: true })
  } catch (e) {
    console.error('Email error:', {
      message: e?.message,
      code: e?.code,
      command: e?.command,
      response: e?.response && e.response.toString(),
    })
    res.status(500).json({
      error: 'Failed to send',
      hint: 'Email service temporarily unavailable. Please try again later.',
    })
  }
})

/* ------------------ serve React build in production (SPA) ------------------ */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.join(__dirname, '../client/dist')

if (fs.existsSync(distPath)) {
  // Serve static assets
  app.use(express.static(distPath))
  // SPA fallback for client-side routes
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' })
    res.sendFile(path.join(distPath, 'index.html'))
  })
} else {
  // Dev convenience message if the client isn't built
  app.get('/', (_req, res) =>
    res
      .status(200)
      .send('API is running. Start the client at http://localhost:5173 or build to /client/dist.')
  )
}

/* --------------------------------- server --------------------------------- */

const PORT = Number(process.env.PORT || 3001)
app.listen(PORT, () => {
  console.log(`API${fs.existsSync(distPath) ? ' + Web' : ''} running on http://localhost:${PORT}`)
})
