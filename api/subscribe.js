import fs from 'fs';
import path from 'path';

// Load .env in development to support local dev without relying on Vite env injection
function loadDevEnvIfNeeded() {
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
      value = value.replace(/^['\"]|['\"]$/g, '');
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch (err) {
    console.warn('[subscribe.js] Failed to load .env in development:', err);
  }
}

loadDevEnvIfNeeded();

const rawSheetsUrl = process.env.SHEETS_WEBHOOK_URL || process.env.VITE_SHEETS_WEBHOOK_URL || '';
const SHEETS_WEBHOOK_URL = rawSheetsUrl.replace(/^['\"]|['\"]$/g, '');

export default async function handler(req, res) {
  const allowedOrigins = [
    'https://theurbanpinnal.com',
    'https://www.theurbanpinnal.com',
    'https://theurbanpinnal.in',
    'https://www.theurbanpinnal.in',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
  ];

  const originHeader = req.headers.origin;
  if (originHeader && allowedOrigins.includes(originHeader)) {
    res.setHeader('Access-Control-Allow-Origin', originHeader);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  if (!SHEETS_WEBHOOK_URL) {
    console.error('SHEETS_WEBHOOK_URL env var is missing.');
    return res.status(500).json({ success: false, message: 'Server configuration error.' });
  }

  let bodyObj = {};
  try {
    bodyObj = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (_) {
    bodyObj = {};
  }

  const { email } = bodyObj;

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (sheetsRes.ok) {
      return res.status(200).json({ success: true, message: 'You have been subscribed successfully!' });
    }

    let debugText = null;
    try {
      debugText = await sheetsRes.text();
    } catch (_) {
      debugText = null;
    }

    let debugJson = null;
    try {
      debugJson = debugText ? JSON.parse(debugText) : null;
    } catch (_) {
      debugJson = null;
    }

    console.error('Sheets webhook error', {
      status: sheetsRes.status,
      json: debugJson,
      text: debugText ? debugText.slice(0, 2000) : null,
    });

    return res.status(sheetsRes.status || 500).json({ success: false, message: 'Failed to save subscription.' });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
  }
}
