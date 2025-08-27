# Shopify CORS Fix Setup Guide

## Problem
You were getting CORS errors when trying to fetch from Shopify's GraphQL API directly from `http://localhost:8080`.

## Solution
I've configured a proxy in Vite that routes `/shopify/*` requests through the development server, bypassing CORS restrictions.

## What Changed

### 1. Updated `src/main.tsx`
- Changed urql client URL from direct Shopify endpoint to proxy route
- Now uses `/shopify/api/2024-01/graphql.json` instead of `https://enzqhm-e2.myshopify.com/api/2024-01/graphql.json`

### 2. Enhanced `vite.config.ts`
- Added CORS middleware for development server
- Added proxy configuration for `/shopify/*` routes
- Proxy forwards requests to `https://enzqhm-e2.myshopify.com` with proper headers

### 3. Updated `env.template`
- Added Shopify environment variables template

## Setup Steps

### 1. Create Environment File
```bash
cp env.template .env
```

### 2. Add Your Shopify Credentials
Edit `.env` and add your actual values:
```env
VITE_SHOPIFY_STORE_DOMAIN=enzqhm-e2.myshopify.com
VITE_SHOPIFY_STOREFRONT_API_TOKEN=your_storefront_access_token
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Test
1. Open `http://localhost:8080` in your browser
2. Check browser console - no more CORS errors
3. Product data should load from Shopify

## How It Works

1. **Frontend Request**: Your React app makes requests to `/shopify/api/2024-01/graphql.json`
2. **Vite Proxy**: Intercepts these requests and forwards them to `https://enzqhm-e2.myshopify.com/api/2024-01/graphql.json`
3. **CORS Headers**: Vite adds proper CORS headers to the response
4. **Browser**: Sees the response as coming from same origin (`localhost:8080`)

## Troubleshooting

### If you still get CORS errors:
1. Check that your `.env` file exists with correct values
2. Restart the dev server (`Ctrl+C` then `npm run dev`)
3. Clear browser cache

### If you get authentication errors:
1. Verify your Shopify Storefront Access Token is correct
2. Make sure the token has the right permissions (read products, etc.)

### To test the proxy directly:
Open browser dev tools and run:
```javascript
fetch('/shopify/api/2024-01/graphql.json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': 'your_token_here'
  },
  body: JSON.stringify({
    query: '{ shop { name } }'
  })
}).then(r => r.json()).then(console.log)
```

## Production
This setup only works in development. In production, you'll need to:
1. Configure CORS headers on your hosting platform, or
2. Use Shopify's App Proxy feature, or
3. Host your frontend on the same domain as your Shopify store

## Next Steps
Once CORS is resolved, you can continue with:
1. Building the Shopify theme (see SHOPIFY_THEME_README.md)
2. Testing product listings and cart functionality
3. Implementing checkout flow
