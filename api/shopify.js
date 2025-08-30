// File: /api/shopify.js

export default async function handler(request, response) {
  try {
    console.log('Shopify proxy called with method:', request.method);
    console.log('Request URL:', request.url);
    console.log('Request headers:', request.headers);
    console.log('Request body:', request.body);

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      response.setHeader('Access-Control-Allow-Origin', 'https://theurbanpinnal.com');
      response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Shopify-Storefront-Access-Token');
      response.setHeader('Access-Control-Max-Age', '86400');
      return response.status(200).end();
    }

    // Handle both GET and POST requests for debugging
    if (request.method === 'GET') {
      console.log('GET request detected - this should not happen with proper GraphQL setup');
      console.log('Query params:', request.query);
      return response.status(400).json({ 
        error: 'GraphQL queries should use POST method',
        method: request.method,
        suggestion: 'Check frontend urql configuration to ensure POST requests are sent'
      });
    }
    
    if (request.method !== 'POST') {
      console.log('Method not allowed:', request.method);
      return response.status(405).json({ 
        error: 'Method Not Allowed',
        method: request.method,
        allowed: 'POST'
      });
    }

    // Set CORS headers for POST requests
    response.setHeader('Access-Control-Allow-Origin', 'https://theurbanpinnal.com');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Shopify-Storefront-Access-Token');

    const {
      VITE_SHOPIFY_STORE_DOMAIN,
      VITE_SHOPIFY_STOREFRONT_API_TOKEN,
      SHOPIFY_STORE_DOMAIN,
      SHOPIFY_STOREFRONT_API_TOKEN
    } = process.env;

    // Use VITE_ prefixed variables if available, otherwise use non-prefixed ones
    const storeDomain = VITE_SHOPIFY_STORE_DOMAIN || SHOPIFY_STORE_DOMAIN;
    const storefrontToken = VITE_SHOPIFY_STOREFRONT_API_TOKEN || SHOPIFY_STOREFRONT_API_TOKEN;

    console.log('Environment variables:', {
      domain: storeDomain,
      hasToken: !!storefrontToken,
      viteDomain: !!VITE_SHOPIFY_STORE_DOMAIN,
      viteToken: !!VITE_SHOPIFY_STOREFRONT_API_TOKEN,
      plainDomain: !!SHOPIFY_STORE_DOMAIN,
      plainToken: !!SHOPIFY_STOREFRONT_API_TOKEN
    });

    if (!storeDomain || !storefrontToken) {
      console.error('Missing environment variables');
      return response.status(500).json({ 
        error: 'Missing Shopify configuration',
        domain: !!storeDomain,
        token: !!storefrontToken,
        available: {
          viteDomain: !!VITE_SHOPIFY_STORE_DOMAIN,
          viteToken: !!VITE_SHOPIFY_STOREFRONT_API_TOKEN,
          plainDomain: !!SHOPIFY_STORE_DOMAIN,
          plainToken: !!SHOPIFY_STOREFRONT_API_TOKEN
        }
      });
    }

    const shopifyApiUrl = `https://${storeDomain}/api/2024-01/graphql.json`;
    console.log('Forwarding to Shopify URL:', shopifyApiUrl);

    try {
      // Forward the client's request to the Shopify API
      const shopifyResponse = await fetch(shopifyApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontToken,
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
  } catch (outerError) {
    console.error('Outer handler error:', outerError);
    return response.status(500).json({ 
      error: 'Handler Error',
      message: outerError instanceof Error ? outerError.message : 'Unknown error'
    });
  }
}
