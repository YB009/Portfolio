import nodemailer from 'nodemailer'

/**
 * Resolve a reliable Gmail transport from env.
 * Works with:
 *   - PORT=465 + SMTP_SECURE=true  (SMTPS/SSL)
 *   - PORT=587 + SMTP_SECURE=false (STARTTLS)
 * Requires a Gmail App Password (NOT your normal password).
 */
function createTransportFromEnv() {
  const host   = (process.env.SMTP_HOST || 'smtp.gmail.com').trim()
  const port   = Number(process.env.SMTP_PORT || 587)
  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465
  const user   = (process.env.SMTP_USER || '').trim()
  const pass   = (process.env.SMTP_PASS || '').trim()

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration incomplete. Ensure SMTP_HOST, SMTP_USER, SMTP_PASS are set.')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,                               // 465 => true, 587 => false (STARTTLS)
    auth: { user, pass },
    // Gmail requires modern TLS
    tls: { minVersion: 'TLSv1.2' },
    // Conservative timeouts for cloud platforms
    connectionTimeout: 60_000,
    greetingTimeout:   30_000,
    socketTimeout:     60_000,
  })
}

/**
 * Send a contact message email.
 */
export async function sendEmail({ name, email, message }) {
  const fromAddr = (process.env.SMTP_USER || '').trim()         // must match authenticated Gmail
  const toAddr   = (process.env.MAIL_TO || process.env.SMTP_USER || '').trim()

  if (!fromAddr || !toAddr) {
    throw new Error('MAIL_TO/SMTP_USER not configured')
  }

  const transporter = createTransportFromEnv()

  // Will throw if auth/TLS/host are wrong — great for first-deploy diagnostics
  await transporter.verify()

  const info = await transporter.sendMail({
    from: fromAddr,                       // keep it exact for Gmail
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
    `,
  })

  return { success: true, messageId: info.messageId }
}
