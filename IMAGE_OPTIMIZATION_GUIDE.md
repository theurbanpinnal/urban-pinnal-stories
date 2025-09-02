# Image Optimization Strategy

This document outlines the comprehensive image optimization strategy implemented across the Urban Pinnal Stories website to ensure fast loading and consistent rendering.

## Overview

The image optimization system consists of several components working together to provide:
- **Fast loading** through strategic loading strategies (eager for non-products, lazy for products)
- **Consistent rendering** across all components
- **Smart positioning** based on product type
- **Responsive sizing** for different screen sizes
- **Error handling** with graceful fallbacks
- **Selective lazy loading** - only for product images to improve user experience

## Components

### 1. Enhanced LazyImage Component (`src/components/LazyImage.tsx`)

The base LazyImage component provides:
- Intersection Observer-based lazy loading
- Priority loading for critical images
- Enhanced placeholder with shimmer animation
- Error state handling
- Performance attributes (fetchpriority, decoding, sizes)

### 2. OptimizedLazyImage Component (`src/components/OptimizedLazyImage.tsx`)

An enhanced version that uses the optimization hook for:
- Context-aware configuration
- Automatic image optimization
- Smart object positioning
- Shopify URL transformations

### 3. Image Optimization Hook (`src/hooks/use-optimized-image.ts`)

Provides consistent configuration based on context:
- Hero images: High priority, eager loading
- Product main images: High priority, eager loading
- Product thumbnails: Low priority, lazy loading
- Product cards: Low priority, lazy loading
- Cart items: Low priority, lazy loading

### 4. Image Utilities (`src/lib/image-utils.ts`)

Comprehensive utilities for:
- Smart object positioning based on product type
- Image URL optimization with Shopify transformations
- Responsive sizing configuration
- Critical image preloading

## Usage Guidelines

### For Hero Images (Store page, landing pages)
```tsx
<LazyImage
  src={heroImage}
  alt="Hero description"
  className="w-full h-full object-cover"
  loading="eager"
  priority={true}
  fetchPriority="high"
  sizes="100vw"
/>
```

### For Artisan Images
```tsx
<LazyImage
  src={artisanImage}
  alt="Artisan description"
  className="w-full h-full object-cover"
  loading="eager"
  priority={true}
  fetchPriority="high"
  sizes="(max-width: 768px) 100vw, 33vw"
/>
```

### For Journal Images
```tsx
<LazyImage
  src={journalImage}
  alt="Journal description"
  className="w-full h-full object-cover"
  loading="eager"
  priority={true}
  fetchPriority="high"
  sizes="(max-width: 768px) 100vw, 33vw"
/>
```

### For Product Main Images
```tsx
<LazyImage
  src={productImage}
  alt={product.title}
  className="w-full h-auto object-contain"
  loading="eager"
  priority={true}
  fetchPriority="high"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### For Product Cards
```tsx
<LazyImage
  src={productImage}
  alt={product.title}
  className="w-full h-full object-cover"
  placeholderClassName="w-full h-full"
  loading="lazy"
  priority={false}
  fetchPriority="low"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  objectPosition={getSmartObjectPosition(
    product.title,
    productImage,
    product.productType,
    product.tags
  )}
/>
```

### For Cart Items
```tsx
<LazyImage
  src={productImage}
  alt={product.title}
  className="w-full h-full object-cover"
  placeholderClassName="w-full h-full"
  loading="lazy"
  priority={false}
  fetchPriority="low"
  objectPosition={getSmartObjectPosition(
    product.title,
    productImage,
    product.productType,
    product.tags
  )}
/>
```

## Smart Object Positioning

The system automatically determines optimal object positioning based on product type:

- **Bags/Purses**: `center bottom` (shows handles)
- **Jewelry**: `center top` (shows details)
- **Home Decor**: `center bottom` (shows base)
- **Textiles**: `center center` (balanced view)
- **Art**: `center center` (balanced view)

## Performance Optimizations

## Performance Optimizations

### 1. Loading Strategy
- **Hero images**: `priority={true}`, `loading="eager"`, `fetchPriority="high"` (no lazy loading)
- **Artisan/Journal images**: `priority={true}`, `loading="eager"`, `fetchPriority="high"` (no lazy loading)
- **Product main images**: `priority={true}`, `loading="eager"`, `fetchPriority="high"` (no lazy loading)
- **Product thumbnails**: `priority={false}`, `loading="lazy"`, `fetchPriority="low"` (lazy loading)
- **Product cards**: `priority={false}`, `loading="lazy"`, `fetchPriority="low"` (lazy loading)
- **Cart items**: `priority={false}`, `loading="lazy"`, `fetchPriority="low"` (lazy loading)

### 2. Lazy Loading Logic
- **Non-product images** (hero, artisan, journal): Load immediately without intersection observer
- **Product images**: Use intersection observer with 100px root margin for lazy loading
- **Critical images**: Always load immediately regardless of context

### 3. Responsive Sizing
- Hero: `100vw`
- Product main: `(max-width: 768px) 100vw, 50vw`
- Product cards: `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw`
- Cart items: `64px`

### 4. Shopify Optimizations
- Automatic WebP format conversion
- Quality optimization (80% default)
- Width/height parameters for proper sizing
- Crop fitting for better aspect ratios

## Error Handling

### Placeholder States
- Shimmer animation during loading
- Gradient background with pulse effect
- Smooth opacity transitions

### Error States
- Graceful fallback with icon
- "Image unavailable" message
- Maintains layout integrity

## Best Practices

1. **Always use LazyImage** instead of regular `<img>` tags
2. **Set appropriate context** for automatic optimization
3. **Provide meaningful alt text** for accessibility
4. **Use smart object positioning** for product images
5. **Set priority correctly** for above-the-fold images
6. **Include sizes attribute** for responsive loading
7. **Handle errors gracefully** with fallback states
8. **Use eager loading for non-product images** (hero, artisan, journal)
9. **Use lazy loading only for product images** (product cards, thumbnails, cart items)
10. **Prioritize critical images** that are above the fold

## Monitoring and Analytics

The system includes:
- Load event tracking
- Error event tracking
- Performance metrics
- User experience monitoring

## Future Enhancements

Planned improvements:
- WebP/AVIF format detection
- Automatic image compression
- CDN integration
- Advanced caching strategies
- Real-time performance monitoring
