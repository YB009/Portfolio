import nodemailer from 'nodemailer'

function buildTransport() {
  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim()
  const port = Number(process.env.SMTP_PORT || 587)
  const secure =
    String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465

  const user = (process.env.SMTP_USER || '').trim()
  const pass = (process.env.SMTP_PASS || '').trim()

  if (!host || !user || !pass) {
    throw new Error('SMTP config incomplete. Set SMTP_HOST, SMTP_USER, SMTP_PASS.')
  }

  const debug = String(process.env.SMTP_DEBUG || '').toLowerCase() === 'true'

  return nodemailer.createTransport({
    host,
    port,
    secure,                       // 465 => true (SSL), 587 => false (STARTTLS)
    auth: { user, pass },
    tls: { minVersion: 'TLSv1.2' },
    connectionTimeout: 60_000,
    greetingTimeout:   30_000,
    socketTimeout:     60_000,
    logger: debug,
    debug
  })
}

export async function verifyTransport() {
  const t = buildTransport()
  await t.verify()
  return true
}

export async function sendEmail({ name, email, message }) {
  const fromAddr = (process.env.SMTP_USER || '').trim()   // must match Gmail user
  const toAddr   = (process.env.MAIL_TO || fromAddr).trim()
  if (!fromAddr || !toAddr) throw new Error('MAIL_TO/SMTP_USER not configured.')

  const t = buildTransport()
  await t.verify()  // throws if auth/TLS/host wrong

  const info = await t.sendMail({
    from: fromAddr,
    to:   toAddr,
    subject: `New message from ${name}`,
    replyTo: email,
    text: message,
    html: `
      <h2>New portfolio message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <hr/>
      <p>${String(message).replace(/\n/g, '<br/>')}</p>
    `
  })

  return { success: true, messageId: info.messageId }
}
