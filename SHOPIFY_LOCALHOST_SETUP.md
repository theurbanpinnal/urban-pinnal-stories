# Shopify Storefront API - Localhost Setup Guide

## 🎯 Goal
Ensure the Shopify Storefront API works properly on localhost for development without affecting production.

## ✅ What's Been Configured

### 1. **Enhanced Vite Proxy Configuration**
- Updated `vite.config.ts` to properly forward Shopify authentication headers
- Added fallback to use environment variables for API token
- Improved CORS middleware for development

### 2. **Updated URQL Client**
- Modified `src/main.tsx` to include authentication headers
- Ensures all GraphQL requests include the Storefront API token

### 3. **Debug Component**
- Added `ShopifyDebug.tsx` component to test API connection
- Temporarily included in Store page for testing

## 🔧 Setup Steps

### 1. Create Environment File
```bash
cp env.template .env
```

### 2. Add Your Shopify Credentials
Edit `.env` and add your actual values:
```env
# Shopify Storefront API Configuration
VITE_SHOPIFY_STORE_DOMAIN=enzqhm-e2.myshopify.com
VITE_SHOPIFY_STOREFRONT_API_TOKEN=your_storefront_access_token

# Other existing variables...
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
VITE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/your-id/exec"
```

### 3. Get Your Shopify Storefront API Token
1. Go to your Shopify Admin → Apps → Manage private apps
2. Create a private app or use existing one
3. Enable Storefront API access
4. Copy the Storefront access token

### 4. Start Development Server
```bash
npm run dev
```

### 5. Test the API Connection
1. Open `http://localhost:8080/store` in your browser
2. Look for the "Shopify API Test" debug component
3. Check if it shows "Connection Successful" with green checkmark

## 🔍 How It Works

### Development Flow:
1. **Frontend Request**: React app makes GraphQL requests to `/shopify/api/2024-01/graphql.json`
2. **Vite Proxy**: Intercepts requests and forwards to `https://enzqhm-e2.myshopify.com/api/2024-01/graphql.json`
3. **Authentication**: Automatically adds `X-Shopify-Storefront-Access-Token` header
4. **CORS**: Vite handles CORS headers for localhost
5. **Response**: Returns data to your React app

### Key Files Modified:
- `vite.config.ts` - Enhanced proxy and CORS configuration
- `src/main.tsx` - Added authentication headers to URQL client
- `src/components/ShopifyDebug.tsx` - Debug component for testing

## 🐛 Troubleshooting

### If you get "Connection Failed":
1. **Check Environment Variables**:
   ```bash
   # Verify your .env file exists and has correct values
   cat .env | grep SHOPIFY
   ```

2. **Verify API Token Permissions**:
   - Ensure your private app has Storefront API access enabled
   - Check that the token has read permissions for products, collections, etc.

3. **Test Direct API Call**:
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

### If you get CORS errors:
1. Restart the dev server: `Ctrl+C` then `npm run dev`
2. Clear browser cache
3. Check browser console for specific error messages

### If products don't load:
1. Check browser network tab for GraphQL requests
2. Verify the request URL is `/shopify/api/2024-01/graphql.json`
3. Check response for GraphQL errors

## 🧹 Cleanup After Testing

Once you confirm the API is working:

1. **Remove Debug Component**:
   - Remove the import and usage of `ShopifyDebug` from `src/pages/Store.tsx`
   - Delete `src/components/ShopifyDebug.tsx`

2. **Verify Production Still Works**:
   - The changes only affect development
   - Production will continue using the existing configuration

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SHOPIFY_STORE_DOMAIN` | Your Shopify store domain (e.g., `enzqhm-e2.myshopify.com`) | Yes |
| `VITE_SHOPIFY_STOREFRONT_API_TOKEN` | Storefront API access token from private app | Yes |

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Debug component shows "Connection Successful"
- ✅ Store name, domain, and currency are displayed
- ✅ Product list loads without errors
- ✅ No CORS errors in browser console
- ✅ Network tab shows successful GraphQL requests

## 🚀 Next Steps

Once the API is working on localhost:
1. Test product browsing and filtering
2. Test cart functionality
3. Test checkout flow
4. Remove debug component
5. Continue with your development

---

**Happy Developing! 🛍️**
