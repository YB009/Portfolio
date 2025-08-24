
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'


dotenv.config()


const app = express()
app.use(cors())
app.use(express.json())


app.get('/api/health', (req,res)=> res.json({ ok: true }))


app.post('/api/contact', async (req,res)=>{
const { name, email, message } = req.body || {}
if(!name || !email || !message) return res.status(400).json({ error: 'Missing fields' })


try {
const transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST,
port: Number(process.env.SMTP_PORT || 587),
secure: process.env.SMTP_SECURE === 'true',
auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})


await transporter.sendMail({
from: `Portfolio <${process.env.SMTP_USER}>`,
to: process.env.MAIL_TO || process.env.SMTP_USER,
subject: `New message from ${name}`,
replyTo: email,
text: message,
html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`
})


res.json({ ok: true })
} catch (e) {
console.error('Email error:', e.message)
res.status(500).json({ error: 'Failed to send' })
}
})


const port = Number(process.env.PORT || 3001)
app.listen(port, ()=> console.log(`API running on http://localhost:${port}`))