import type { IncomingMessage, ServerResponse } from 'http';

// Minimal local versions of Vercel's Request/Response for type safety during development.
interface VercelRequest extends IncomingMessage {
  body: any;
  query: Record<string, string | string[]>;
  cookies: Record<string, string>;
}

interface VercelResponse extends ServerResponse {
  json: (body: unknown) => void;
  status: (code: number) => VercelResponse;
}

/**
 * Newsletter subscription handler
 * -------------------------------------------------------------
 * Stores subscriber emails in a Google Sheet through a low-friction
 * “sheet webhook” service (for example sheet.best, Sheety, NoCodeAPI,
 * or a Google Apps Script web-app).  Configure the webhook URL in the
 * environment variable `SHEETS_WEBHOOK_URL`.
 *
 * The function expects a JSON body: { email: "person@example.com" }
 * and will POST that email (and a timestamp) to the Sheets webhook.
 */

// Prefer the server-side variable but fall back to the Vite-prefixed one so
// `vite dev` or `vercel dev` pick it up from a plain `.env` file.
const SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL || process.env.VITE_SHEETS_WEBHOOK_URL;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const allowedOrigins = ['https://theurbanpinnal.com', 'https://www.theurbanpinnal.com'];
  const originHeader = req.headers.origin as string | undefined;
  if (originHeader && allowedOrigins.includes(originHeader)) {
    res.setHeader('Access-Control-Allow-Origin', originHeader);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Allow only POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  if (!SHEETS_WEBHOOK_URL) {
    console.error('SHEETS_WEBHOOK_URL env var is missing.');
    return res.status(500).json({ success: false, message: 'Server configuration error.' });
  }

  // Vercel automatically parses JSON if Content-Type header is correct.
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const { email } = body;

  console.log('[Newsletter] Incoming subscribe request:', { email });

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: 'A valid email is required.' });
  }

  try {
    const payload = {
      email,
      timestamp: new Date().toISOString(),
    };

    console.log('[Newsletter] Sending to Sheets webhook:', { url: SHEETS_WEBHOOK_URL, payload });

    const sheetsRes = await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // sheet.best & most similar services return 200 or 201 on success
    if (sheetsRes.ok) {
      return res.status(200).json({ success: true, message: 'You have been subscribed successfully!' });
    }

    const sheetsData = await safeJson(sheetsRes);
    console.error('Sheets webhook error', { status: sheetsRes.status, body: sheetsData });
    return res.status(sheetsRes.status).json({ success: false, message: 'Failed to save subscription.' });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
  }
}

/**
 * Helper: safely parse JSON without throwing on invalid JSON responses.
 */
async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch (_) {
    return null;
  }
}
