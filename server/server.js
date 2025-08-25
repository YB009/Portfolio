import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { sendEmail, verifyTransport } from './email-service.js'

dotenv.config()

const app = express()

/* ------------------------------ diagnostics ------------------------------ */
// log every request with timing; this guarantees something shows in Render logs
app.use((req, res, next) => {
  const t0 = Date.now()
  res.on('finish', () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - t0}ms)`
    )
  })
  next()
})

// catch unhandled errors so they hit logs
process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection:', err?.message || err)
})
process.on('uncaughtException', (err) => {
  console.error('uncaughtException:', err?.message || err)
})

/* --------------------------------- common -------------------------------- */
app.use(express.json({ limit: '1mb' }))

// CORS: ORIGIN can be comma-separated list; default dev origin
const ORIGIN = (process.env.ORIGIN
  ? process.env.ORIGIN.split(',').map(s => s.trim()).filter(Boolean)
  : ['http://localhost:5173'])

app.use(cors({
  origin: ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
}))

/* --------------------------------- routes -------------------------------- */
app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.get('/api/test-email', async (_req, res) => {
  try {
    await verifyTransport()
    await sendEmail({
      name: 'Render Test',
      email: 'test@example.com',
      message: 'This is a test email from /api/test-email.'
    })
    res.json({ ok: true })
  } catch (e) {
    console.error('Email test failed:', {
      message: e?.message,
      code: e?.code,
      response: e?.response && e.response.toString(),
    })
    res.status(500).json({ error: 'Email test failed' })
  }
})

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
      response: e?.response && e.response.toString(),
    })
    res.status(500).json({ error: 'Failed to send' })
  }
})

/* ------------------ serve React build in production (SPA) ----------------- */
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const distPath   = path.join(__dirname, '../client/dist')

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' })
    res.sendFile(path.join(distPath, 'index.html'))
  })
} else {
  app.get('/', (_req, res) =>
    res.status(200).send('API is running. Start the client at http://localhost:5173 or build to /client/dist.')
  )
}

/* --------------------------------- server -------------------------------- */
const PORT = Number(process.env.PORT || 3001)
app.listen(PORT, () => {
  console.log(`API${fs.existsSync(distPath) ? ' + Web' : ''} running on http://localhost:${PORT}`)
})
