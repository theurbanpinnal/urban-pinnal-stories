import type { VercelRequest, VercelResponse } from '@vercel/node';

// Prefer server-side env vars without VITE_ prefix because those are not
// automatically exposed to serverless functions in Vercel.
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY || process.env.VITE_MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID || process.env.VITE_MAILERLITE_GROUP_ID;

const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // 1. Validate request method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  // 2. Check for required secrets
  if (!MAILERLITE_API_KEY || !MAILERLITE_GROUP_ID) {
    console.error('MailerLite API key or Group ID is not configured.');
    return res.status(500).json({ success: false, message: 'Server configuration error.' });
  }
  
  const { email } = req.body;

  // Debug: log incoming request
  console.log('[Newsletter] Incoming subscribe request:', { email });

  // 3. Validate email
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: 'A valid email is required.' });
  }

  try {
    // 4. Send data to MailerLite (v2) via group endpoint
    const groupEndpoint = `${MAILERLITE_API_URL}/groups/${MAILERLITE_GROUP_ID}/subscribers`;

    const payload = { email };

    // Debug: log outgoing request
    console.log('[Newsletter] Sending to MailerLite:', { groupEndpoint, payload });

    const mailerliteRes = await fetch(groupEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({ email }),
    });

    const mailerliteData = await mailerliteRes.json();

    // Debug: log MailerLite response
    console.log('[Newsletter] MailerLite response:', {
      status: mailerliteRes.status,
      body: mailerliteData,
    });

    if ((mailerliteRes.status === 200 || mailerliteRes.status === 201) && mailerliteData.data) {
      return res.status(200).json({ success: true, message: 'You have been subscribed successfully!' });
    }

    // If subscriber already exists (status 409) we still consider it success
    if (mailerliteRes.status === 409) {
      return res.status(200).json({ success: true, message: 'You are already subscribed!' });
    }

    const errorMessage = mailerliteData?.error?.message || 'An error occurred with the subscription service.';
    console.error('MailerLite API Error:', mailerliteData);
    return res.status(mailerliteRes.status).json({ success: false, message: errorMessage });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
  }
}
