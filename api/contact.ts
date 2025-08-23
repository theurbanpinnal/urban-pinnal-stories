import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

// Validation schema for the contact form
const contactSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().max(254),
  subject: z.string().min(5).max(100),
  message: z.string().min(10).max(1000),
  _honeypot: z.string().optional(),
});

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_ATTEMPTS = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const existing = rateLimitMap.get(ip);
  
  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (existing.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return true;
  }
  
  existing.count++;
  return false;
}

// Simple email sending function (you can replace with SendGrid, Resend, etc.)
async function sendEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  // This is a placeholder - replace with your preferred email service
  // Options: SendGrid, Resend, Nodemailer with SMTP, etc.
  
  const emailContent = `
New contact form submission from The Urban Pinnal website:

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

---
This email was sent from the contact form at https://theurbanpinnal.com/contact
  `;

  // For now, just log the email content
  // In production, replace this with actual email sending
  console.log('Email to send:', {
    to: 'support@theurbanpinnal.com',
    subject: `Contact Form: ${data.subject}`,
    content: emailContent,
  });

  // Simulate email sending success
  return { success: true };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Allowed origins for CORS (adjust domains as needed)
  const allowedOrigins = ['https://theurbanpinnal.com', 'https://www.theurbanpinnal.com'];
  const originHeader = req.headers.origin as string | undefined;
  if (originHeader && allowedOrigins.includes(originHeader)) {
    res.setHeader('Access-Control-Allow-Origin', originHeader);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Rate limiting
    const clientIP = req.headers['x-forwarded-for'] as string || 
                    req.headers['x-real-ip'] as string || 
                    'unknown';
    
    if (isRateLimited(clientIP)) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please wait a minute before trying again.',
      });
    }

    // Validate request body
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
    const parsed = rawBody ? JSON.parse(rawBody) : {};
    const result = contactSchema.safeParse(parsed);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid form data',
        errors: result.error.issues,
      });
    }

    const { name, email, subject, message, _honeypot } = result.data;

    // Check honeypot field for spam protection
    if (_honeypot) {
      return res.status(400).json({
        success: false,
        message: 'Spam detected',
      });
    }

    // Send email
    const emailResult = await sendEmail({ name, email, subject, message });
    
    if (!emailResult.success) {
      throw new Error('Failed to send email');
    }

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.',
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
}
