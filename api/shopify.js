import { Readable } from 'stream';

export default async function handler(req, res) {
  console.log(`[info] Shopify proxy called with method: ${req.method}`);
  
  const shopifyDomain = process.env.VITE_SHOPIFY_STORE_DOMAIN;
  const storefrontApiToken = process.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN;

  console.log(`[info] Environment variables: { domain: '${shopifyDomain}', hasToken: ${!!storefrontApiToken} }`);

  if (!shopifyDomain || !storefrontApiToken) {
    console.error('[error] Missing environment variables');
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  const shopifyApiUrl = `https://${shopifyDomain}/api/2024-01/graphql.json`;

  let body;
  let method = req.method;

  if (req.method === 'GET') {
    console.log('[info] GET request detected. Converting to POST.');
    const { query, variables, operationName } = req.query;
    
    // Ensure that if variables is a string, it's parsed.
    const parsedVariables = typeof variables === 'string' ? JSON.parse(variables) : variables;

    body = JSON.stringify({
      query,
      variables: parsedVariables,
      operationName,
    });
    method = 'POST'; // We'll now send a POST request to Shopify
  } else {
    // For POST, PUT, etc., read the body as before
    body = await new Promise((resolve) => {
      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  try {
    const shopifyRes = await fetch(shopifyApiUrl, {
      method: method, // Use the determined method
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontApiToken,
      },
      body,
    });

    if (!shopifyRes.ok) {
      const errorBody = await shopifyRes.text();
      console.error(`[error] Error from Shopify API: ${shopifyRes.status} ${errorBody}`);
      return res.status(shopifyRes.status).send(errorBody);
    }

    const data = await shopifyRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(`[error] Error proxying request to Shopify: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
