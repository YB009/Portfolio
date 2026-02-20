import nodemailer from "nodemailer";

function toBool(value) {
  return String(value || "").toLowerCase() === "true";
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return {};
  }
}

function makeTransport() {
  const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = toBool(process.env.SMTP_SECURE) || port === 465;
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASS || "").trim();

  if (!host || !user || !pass) {
    throw new Error("SMTP config incomplete");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: { minVersion: "TLSv1.2" },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, message } = await readJsonBody(req);
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const fromAddr = (process.env.SMTP_USER || "").trim();
    const toAddr = (process.env.MAIL_TO || fromAddr).trim();
    if (!fromAddr || !toAddr) {
      return res.status(500).json({ error: "Email destination not configured" });
    }

    const transport = makeTransport();
    await transport.verify();
    await transport.sendMail({
      from: fromAddr,
      to: toAddr,
      subject: `New message from ${name}`,
      replyTo: email,
      text: String(message),
      html: `
        <h2>New portfolio message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr/>
        <p>${String(message).replace(/\n/g, "<br/>")}</p>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("contact api error:", {
      message: error?.message,
      code: error?.code,
      response: error?.response && String(error.response),
    });
    return res.status(500).json({ error: "Failed to send" });
  }
}
