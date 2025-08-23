import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

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

/**
 * Load .env in development so local Vite dev can hit this API route without
 * depending on Vite's client-side env injection. This keeps server code
 * responsible for its own configuration.
 */
function loadDevEnvIfNeeded(): void {
  if (process.env.NODE_ENV === 'production') return;
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) return;
    const content = fs.readFileSync(envPath, 'utf8');
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eqIndex = line.indexOf('=');
      if (eqIndex === -1) continue;
      const key = line.slice(0, eqIndex).trim();
      let value = line.slice(eqIndex + 1).trim();
      // Strip wrapping quotes if present
      value = value.replace(/^['\"]|['\"]$/g, '');
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch (err) {
    console.warn('[subscribe] Failed to load .env in development:', err);
  }
}

loadDevEnvIfNeeded();

// Retrieve Sheets webhook URL from env vars and sanitize by stripping accidental wrapping quotes.
const rawSheetsUrl = process.env.SHEETS_WEBHOOK_URL || process.env.VITE_SHEETS_WEBHOOK_URL || "";
// Remove any leading/trailing single or double quotes that may exist when the value is defined as
// SHEETS_WEBHOOK_URL="https://example.com" in the .env file.  Having quotes in the actual runtime
// value would result in an invalid URL and cause network errors.
const SHEETS_WEBHOOK_URL = rawSheetsUrl.replace(/^['"]|['"]$/g, "");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const allowedOrigins = [
    'https://theurbanpinnal.com',
    'https://www.theurbanpinnal.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
  ];
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
