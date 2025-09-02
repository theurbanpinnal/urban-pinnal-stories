# Image Optimization Strategy

This document outlines the comprehensive image optimization strategy implemented across the Urban Pinnal Stories website to ensure fast loading and consistent rendering.

## Overview

The image optimization system consists of several components working together to provide:
- **Fast loading** through lazy loading and priority loading
- **Consistent rendering** across all components
- **Smart positioning** based on product type
- **Responsive sizing** for different screen sizes
- **Error handling** with graceful fallbacks

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

### 1. Lazy Loading
- Uses Intersection Observer with 100px root margin
- Loads images before they enter viewport
- Disables observer for priority images

### 2. Priority Loading
- Hero images: `priority={true}`, `loading="eager"`, `fetchPriority="high"`
- Product main images: Same as hero
- Other images: `priority={false}`, `loading="lazy"`, `fetchPriority="low"`

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
