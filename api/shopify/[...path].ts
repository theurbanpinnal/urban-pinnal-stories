import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests for GraphQL
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { path } = req.query;
    const shopifyPath = Array.isArray(path) ? path.join('/') : path;
    
    // Construct the full Shopify API URL
    const shopifyDomain = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'enzqhm-e2.myshopify.com';
    const shopifyUrl = `https://${shopifyDomain}/api/${shopifyPath}`;
    
    // Get the Shopify access token from environment
    const accessToken = process.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN;
    
    if (!accessToken) {
      return res.status(500).json({ error: 'Shopify access token not configured' });
    }

    // Forward the request to Shopify
    const shopifyResponse = await fetch(shopifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
        // Forward any additional headers from the client
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization }),
      },
      body: JSON.stringify(req.body),
    });

    // Get the response data
    const data = await shopifyResponse.json();
    
    // Set CORS headers for production
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Shopify-Storefront-Access-Token');
    
    // Return the Shopify response
    return res.status(shopifyResponse.status).json(data);
    
  } catch (error) {
    console.error('Shopify proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function options(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Shopify-Storefront-Access-Token');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  return res.status(200).end();
}
