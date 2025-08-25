import nodemailer from 'nodemailer'

// Email service configuration with fallback options
export async function sendEmail({ name, email, message }) {
  const emailContent = {
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
  }

  // Try Gmail SMTP first
  try {
    const port = Number(process.env.SMTP_PORT || 587)
    const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465

    console.log('Attempting Gmail SMTP...', {
      host: process.env.SMTP_HOST,
      port,
      secure,
      user: process.env.SMTP_USER,
      hasPass: !!process.env.SMTP_PASS
    })
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Enhanced timeout settings for cloud deployments
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      pool: false,
      maxConnections: 1,
      maxMessages: 3,
      // Additional options for better reliability
      tls: {
        rejectUnauthorized: false
      },
      debug: true, // Enable debug output
      logger: true // Enable logging
    })

    console.log('Verifying SMTP connection...')
    await transporter.verify()
    console.log('SMTP verification successful, sending email...')
    
    const result = await transporter.sendMail(emailContent)
    console.log('Email sent successfully via Gmail SMTP:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Gmail SMTP failed:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    })
    
    // If Gmail fails, try alternative approach or return error
    throw new Error(`Email service unavailable: ${error.message}`)
  }
}
