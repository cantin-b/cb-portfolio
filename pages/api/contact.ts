import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_NAME_LENGTH = 120
const MAX_EMAIL_LENGTH = 254
const MAX_MESSAGE_LENGTH = 5000
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5

const requestsByIp = new Map<string, number[]>()

function getClientIp(req: NextApiRequest) {
  const forwardedFor = req.headers['x-forwarded-for']
  if (typeof forwardedFor === 'string') return forwardedFor.split(',')[0].trim()
  if (Array.isArray(forwardedFor)) return forwardedFor[0]
  return req.socket.remoteAddress || 'unknown'
}

function isRateLimited(ip: string) {
  const now = Date.now()
  const recentRequests = (requestsByIp.get(ip) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  )

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestsByIp.set(ip, recentRequests)
    return true
  }

  requestsByIp.set(ip, [...recentRequests, now])
  return false
}

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function textToHtml(value: string) {
  return escapeHtml(value).replace(/\n/g, '<br />')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const clientIp = getClientIp(req)
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests' })
  }

  const name = normalizeText(req.body?.name)
  const email = normalizeText(req.body?.email)
  const message = normalizeText(req.body?.message)
  const website = normalizeText(req.body?.website)

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  if (website) {
    return res.status(200).json({ message: 'Email sent successfully!' })
  }

  if (
    name.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return res.status(400).json({ error: 'Invalid field length' })
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  const smtpUser = process.env.HOSTINGER_USER
  const smtpPass = process.env.HOSTINGER_PASS

  if (!smtpUser || !smtpPass) {
    console.error('Missing SMTP configuration')
    return res.status(503).json({ error: 'Email service is not configured' })
  }

  // Get host from request to determine language
  const host = req.headers.host || ''
  const isFrench = host.startsWith('fr')
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = textToHtml(message)

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    // Email to yourself
    await transporter.sendMail({
      from: `"Cantin Bartel" <${smtpUser}>`,
      to: smtpUser,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `<p><strong>Name:</strong> ${safeName}</p>
             <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
             <p><strong>Message:</strong> ${safeMessage}</p>`,
    })

    // Auto-reply content
    const subject = isFrench
      ? 'Merci pour votre message !'
      : 'Thank You for Reaching Out!'

    const html = isFrench
      ? `<p>Bonjour ${safeName},</p>
         <p>Merci de m’avoir contacté ! J’ai bien reçu votre message et je reviens vers vous au plus vite.</p>
         <p>Bien cordialement,<br /><br>Cantin BARTEL<br>Développeur Full-Stack</p>`
      : `<p>Hello ${safeName},</p>
         <p>I appreciate you getting in touch! I’ve received your message and will get back to you as soon as possible.</p>
         <p>Kind Regards,<br /><br>Cantin BARTEL<br>Full-Stack Developer</p>`

    // Auto-reply content
    await transporter.sendMail({
      from: `"Cantin Bartel" <${smtpUser}>`,
      to: email,
      subject,
      html
    })

    return res.status(200).json({ message: 'Email sent successfully!' })
  } catch (error) {
    console.error('Error sending email:', error)
    return res.status(500).json({ error: 'Failed to send the email' })
  }
}
