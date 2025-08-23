import type { VercelRequest, VercelResponse } from '@vercel/node';

const MAILERLITE_API_KEY = process.env.VITE_MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = process.env.VITE_MAILERLITE_GROUP_ID;

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

  // 3. Validate email
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: 'A valid email is required.' });
  }

  try {
    // 4. Send data to MailerLite
    const mailerliteRes = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({ 
        email,
        groups: [MAILERLITE_GROUP_ID],
        // You can add more fields like 'name' here if your form collects them
      }),
    });

    const mailerliteData = await mailerliteRes.json();

    // 5. Handle MailerLite's response
    if (mailerliteRes.ok && mailerliteData.data) {
      return res.status(200).json({ success: true, message: 'You have been subscribed successfully!' });
    } else {
      // Forward the error from MailerLite if available, otherwise send a generic message
      const errorMessage = mailerliteData?.error?.message || 'An error occurred with the subscription service.';
      console.error('MailerLite API Error:', mailerliteData);
      return res.status(mailerliteRes.status).json({ success: false, message: errorMessage });
    }
  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
  }
}
