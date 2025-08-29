# Shopify Headless Store Integration Setup Guide

## 🎉 Implementation Complete!

Your headless Shopify store has been successfully integrated into your React + Vite application. Here's what has been implemented:

## ✅ What's Been Implemented

### 1. **Environment Configuration**
- Updated `env.template` with Shopify environment variables
- You need to create a `.env` file with your actual Shopify credentials

### 2. **URQL GraphQL Client Setup**
- Configured in `src/main.tsx` with Shopify Storefront API
- Automatically includes authentication headers

### 3. **Cart State Management**
- Created `CartContext` with React Context API
- Persistent cart storage using localStorage
- Full cart operations (add, update, remove items)
- Error handling and loading states

### 4. **GraphQL Operations**
- Complete set of Shopify GraphQL queries in `src/lib/shopify.ts`
- Product fetching, cart management, and checkout operations
- TypeScript interfaces for type safety

### 5. **Store Components**
- **ProductList**: Grid display of products with lazy loading
- **ProductPage**: Detailed product view with variants and image gallery
- **Store**: Main store page with hero section
- **Cart**: Slide-out cart with quantity controls

### 6. **Navigation Integration**
- Added "Store" link to main navigation
- Cart icon with item count badge
- Mobile-responsive design

### 7. **Routing**
- `/store` - Main store page
- `/store/products/:handle` - Individual product pages
- Integrated with existing React Router setup

## 🔧 Final Setup Steps

### 1. Create Environment File
Create a `.env` file in your project root with your Shopify credentials:

```env
# Copy from env.template and add your actual values

# Sanity CMS Configuration
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production

# Google Sheets Webhook (Apps Script) for newsletter
VITE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/your-id/exec"

# Shopify Storefront API Configuration
VITE_SHOPIFY_STOREFRONT_API_TOKEN="your-storefront-api-token"
VITE_SHOPIFY_STORE_DOMAIN="your-store-name.myshopify.com"
```

### 2. Get Shopify Credentials

#### Storefront API Token:
1. Go to your Shopify Admin → Apps → Manage private apps
2. Create a private app or use existing one
3. Enable Storefront API access
4. Copy the Storefront access token

#### Store Domain:
- Your store domain format: `your-store-name.myshopify.com`

### 3. Test the Integration
1. Start your development server: `npm run dev`
2. Navigate to `/store` to see the product grid
3. Click on a product to view details
4. Add items to cart and test the cart functionality
5. Test checkout redirect to Shopify

## 🎨 Design Features

- **Maintains existing UI/UX**: Uses your current color scheme and typography
- **Mobile responsive**: Works perfectly on all device sizes  
- **Loading states**: Skeleton loaders for better UX
- **Error handling**: Graceful error messages
- **Toast notifications**: User feedback for cart operations
- **SEO friendly**: Proper meta tags and semantic HTML

## 🛒 Cart Features

- **Persistent cart**: Survives page refreshes and browser sessions
- **Real-time updates**: Automatically syncs with Shopify
- **Quantity controls**: Easy increment/decrement buttons
- **Remove items**: One-click item removal
- **Checkout redirect**: Seamless handoff to Shopify's secure checkout

## 🚀 Performance Optimizations

- **Lazy loading**: Products and images load on demand
- **Code splitting**: Store pages are lazy-loaded
- **Optimized queries**: Efficient GraphQL queries
- **Image optimization**: Using your existing LazyImage component

## 🔒 Security

- **Environment variables**: Sensitive data properly protected
- **Client-side only**: Storefront API token is safe for frontend use
- **HTTPS required**: Shopify requires secure connections for API calls

## 📱 Mobile Experience

- **Touch-friendly**: Optimized for mobile interactions
- **Responsive cart**: Slide-out cart works great on mobile
- **Fast navigation**: Smooth transitions between pages

## 🎯 Next Steps (Optional Enhancements)

1. **Product search and filtering**
2. **Product categories/collections**
3. **Customer account integration**
4. **Wishlist functionality**
5. **Product reviews**
6. **Related products**

## 🐛 Troubleshooting

### Common Issues:

1. **"Failed to fetch products"**
   - Check your environment variables
   - Verify Storefront API token permissions
   - Ensure store domain is correct

2. **Cart not persisting**
   - Check browser localStorage permissions
   - Verify cart creation mutations

3. **Images not loading**
   - Check Shopify image URLs
   - Verify CORS settings

### Environment Variables Not Loading:
Make sure your `.env` file is in the project root and variables start with `VITE_`

## 📞 Support

The integration is now complete and ready to use! All components follow your existing design patterns and maintain the high-quality UX of your current website.

---

**Happy Selling! 🛍️**
