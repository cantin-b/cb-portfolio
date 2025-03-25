import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.HOSTINGER_USER,
        pass: process.env.HOSTINGER_PASS,
      },
    })

    // Email to yourself
    await transporter.sendMail({
      from: `"Cantin Bartel" <${process.env.HOSTINGER_USER}>`,
      to: process.env.HOSTINGER_USER,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
             <p><strong>Message:</strong> ${message}</p>`,
    })

    // Auto-reply
    await transporter.sendMail({
      from: `"Cantin Bartel" <${process.env.HOSTINGER_USER}>`,
      to: email,
      subject: 'Thank You for Reaching Out!',
      html: `<p>Hello ${name},</p>
             <p>I appreciate you getting in touch! I’ve received your message and will get back to you as soon as possible.</p>
             <p>Kind Regards,<br>
             Cantin Bartel<br>
             Full-Stack Developer</p>`,
    })

    return res.status(200).json({ message: 'Email sent successfully!' })
  } catch (error) {
    console.error('Error sending email:', error)
    return res.status(500).json({ error: 'Failed to send the email' })
  }
}
