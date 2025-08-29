import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  console.log('Shopify proxy called with method:', request.method);
  console.log('Request URL:', request.url);
  console.log('Request headers:', request.headers);

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Shopify-Storefront-Access-Token');
    response.setHeader('Access-Control-Max-Age', '86400');
    return response.status(200).end();
  }

  // We only want to handle POST requests, which is what GraphQL uses
  if (request.method !== 'POST') {
    console.log('Method not allowed:', request.method);
    return response.status(405).json({ 
      error: 'Method Not Allowed',
      method: request.method,
      allowed: 'POST'
    });
  }

  // Set CORS headers for POST requests
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Shopify-Storefront-Access-Token');

  const {
    VITE_SHOPIFY_STORE_DOMAIN,
    VITE_SHOPIFY_STOREFRONT_API_TOKEN
  } = process.env;

  console.log('Environment variables:', {
    domain: VITE_SHOPIFY_STORE_DOMAIN,
    hasToken: !!VITE_SHOPIFY_STOREFRONT_API_TOKEN
  });

  if (!VITE_SHOPIFY_STORE_DOMAIN || !VITE_SHOPIFY_STOREFRONT_API_TOKEN) {
    console.error('Missing environment variables');
    return response.status(500).json({ 
      error: 'Missing Shopify configuration',
      domain: !!VITE_SHOPIFY_STORE_DOMAIN,
      token: !!VITE_SHOPIFY_STOREFRONT_API_TOKEN
    });
  }

  const shopifyApiUrl = `https://${VITE_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;
  console.log('Forwarding to Shopify URL:', shopifyApiUrl);

  try {
    // Forward the client's request to the Shopify API
    const shopifyResponse = await fetch(shopifyApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': VITE_SHOPIFY_STOREFRONT_API_TOKEN,
      },
      body: JSON.stringify(request.body), // Forward the GraphQL query
    });

    console.log('Shopify response status:', shopifyResponse.status);

    if (!shopifyResponse.ok) {
      const errorText = await shopifyResponse.text();
      console.error('Shopify API error:', errorText);
      // Forward Shopify's error status and message
      return response.status(shopifyResponse.status).json({ 
        error: 'Error from Shopify API', 
        details: errorText,
        status: shopifyResponse.status
      });
    }

    const data = await shopifyResponse.json();
    console.log('Successfully forwarded Shopify response');
    // Send the successful response from Shopify back to the client
    return response.status(200).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    return response.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
