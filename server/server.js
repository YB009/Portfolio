import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

dotenv.config()

const app = express()

/* ------------------------------- middleware ------------------------------- */
app.use(express.json({ limit: '1mb' }))

// CORS: allow explicit ORIGIN in prod; allow localhost in dev
const ORIGIN =
  process.env.ORIGIN?.split(',').map(s => s.trim()).filter(Boolean) ||
  ['http://localhost:5173']

app.use(
  cors({
    origin: ORIGIN,
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: false,
  })
)

/* --------------------------------- routes -------------------------------- */
app.get('/api/health', (req, res) => res.json({ ok: true }))

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {}
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  try {
    // 465 => SMTPS (secure:true), 587 => STARTTLS (secure:false)
    const port = Number(process.env.SMTP_PORT || 587)
    const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // optional: verify transport (helpful on Render first run)
    await transporter.verify()

    await transporter.sendMail({
      from: `Portfolio <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO || process.env.SMTP_USER,
      subject: `New message from ${name}`,
      replyTo: email,
      text: message,
      html: `
        <h2>New portfolio message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr/>
        <p>${String(message).replace(/\n/g, '<br/>')}</p>
      `,
    })

    res.json({ ok: true })
  } catch (e) {
    console.error('Email error:', e && (e.response?.toString?.() || e.message || e))
    res.status(500).json({ error: 'Failed to send', details: e?.message || 'Unknown error' })
  }
})

/* ------------------ serve React build in production (SPA) ----------------- */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.join(__dirname, '../client/dist')

if (fs.existsSync(distPath)) {
  // static files (JS/CSS/assets)
  app.use(express.static(distPath))
  // SPA fallback: any non-/api route sends index.html
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' })
    res.sendFile(path.join(distPath, 'index.html'))
  })
} else {
  // dev mode: remind that the client must run on Vite
  app.get('/', (_req, res) =>
    res.status(200).send('API is running. Start the client at http://localhost:5173')
  )
}

/* --------------------------------- server --------------------------------- */
const PORT = Number(process.env.PORT || 3001)
app.listen(PORT, () => {
  console.log(`API${fs.existsSync(distPath) ? ' + Web' : ''} running on http://localhost:${PORT}`)
})
