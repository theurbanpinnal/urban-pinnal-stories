/**
 * Smart image positioning utilities for product images
 */

export interface ProductImageAnalysis {
  optimalPosition: string;
  confidence: number;
  detectedFeatures: string[];
}

export interface ImageOptimizationConfig {
  priority: boolean;
  loading: 'lazy' | 'eager';
  fetchPriority: 'high' | 'low' | 'auto';
  sizes: string;
  decoding: 'async' | 'sync' | 'auto';
}

/**
 * Get optimized image configuration based on context
 */
export function getImageOptimizationConfig(
  context: 'hero' | 'product-main' | 'product-thumbnail' | 'product-card' | 'cart-item' | 'artisan' | 'journal' | 'general'
): ImageOptimizationConfig {
  const configs: Record<string, ImageOptimizationConfig> = {
    hero: {
      priority: true,
      loading: 'eager',
      fetchPriority: 'high',
      sizes: '100vw',
      decoding: 'async'
    },
    'product-main': {
      priority: true,
      loading: 'eager',
      fetchPriority: 'high',
      sizes: '(max-width: 768px) 100vw, 50vw',
      decoding: 'async'
    },
    'product-thumbnail': {
      priority: false,
      loading: 'lazy',
      fetchPriority: 'low',
      sizes: '(max-width: 768px) 25vw, 12.5vw',
      decoding: 'async'
    },
    'product-card': {
      priority: false,
      loading: 'lazy',
      fetchPriority: 'low',
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
      decoding: 'async'
    },
    'cart-item': {
      priority: false,
      loading: 'lazy',
      fetchPriority: 'low',
      sizes: '64px',
      decoding: 'async'
    },
    artisan: {
      priority: false,
      loading: 'lazy',
      fetchPriority: 'low',
      sizes: '(max-width: 768px) 100vw, 33vw',
      decoding: 'async'
    },
    journal: {
      priority: false,
      loading: 'lazy',
      fetchPriority: 'low',
      sizes: '(max-width: 768px) 100vw, 33vw',
      decoding: 'async'
    },
    general: {
      priority: false,
      loading: 'lazy',
      fetchPriority: 'auto',
      sizes: '100vw',
      decoding: 'async'
    }
  };

  return configs[context] || configs.general;
}

/**
 * Analyzes product type and suggests optimal object positioning
 */
export function getOptimalObjectPosition(
  productTitle: string,
  imageUrl: string,
  productType?: string
): string {
  const title = productTitle.toLowerCase();
  const type = productType?.toLowerCase() || '';
  
  // Bag and purse products typically look better showing the bottom/handle
  if (
    title.includes('bag') || 
    title.includes('purse') || 
    title.includes('tote') || 
    title.includes('handbag') ||
    title.includes('clutch') ||
    title.includes('backpack') ||
    type.includes('bag')
  ) {
    return 'center bottom';
  }
  
  // Jewelry typically looks better centered or slightly top
  if (
    title.includes('necklace') || 
    title.includes('earring') || 
    title.includes('bracelet') ||
    title.includes('ring') ||
    title.includes('jewelry') ||
    type.includes('jewelry')
  ) {
    return 'center top';
  }
  
  // Home decor items often look better showing the base/bottom
  if (
    title.includes('vase') || 
    title.includes('bowl') || 
    title.includes('basket') ||
    title.includes('decor') ||
    title.includes('lamp') ||
    type.includes('home') ||
    type.includes('decor')
  ) {
    return 'center bottom';
  }
  
  // Textiles and clothing typically look better centered
  if (
    title.includes('scarf') || 
    title.includes('shawl') || 
    title.includes('textile') ||
    title.includes('fabric') ||
    title.includes('cloth') ||
    type.includes('apparel') ||
    type.includes('textile')
  ) {
    return 'center center';
  }
  
  // Wall art and framed items look better centered
  if (
    title.includes('art') || 
    title.includes('painting') || 
    title.includes('frame') ||
    title.includes('print') ||
    type.includes('art')
  ) {
    return 'center center';
  }
  
  // Default to center bottom for handcrafted items (often look better showing base)
  return 'center bottom';
}

/**
 * Enhanced analysis with confidence scoring
 */
export function analyzeProductImage(
  productTitle: string,
  imageUrl: string,
  productType?: string,
  tags: string[] = []
): ProductImageAnalysis {
  const title = productTitle.toLowerCase();
  const type = productType?.toLowerCase() || '';
  const allTags = tags.map(tag => tag.toLowerCase());
  
  let optimalPosition = 'center center';
  let confidence = 0.5;
  const detectedFeatures: string[] = [];
  
  // High confidence patterns
  const patterns = [
    {
      keywords: ['bag', 'tote', 'purse', 'handbag', 'clutch', 'backpack'],
      position: 'center bottom',
      confidence: 0.9,
      feature: 'Bag/Purse product'
    },
    {
      keywords: ['necklace', 'earring', 'bracelet', 'ring', 'jewelry'],
      position: 'center top',
      confidence: 0.85,
      feature: 'Jewelry item'
    },
    {
      keywords: ['vase', 'bowl', 'basket', 'pot', 'lamp'],
      position: 'center bottom',
      confidence: 0.8,
      feature: 'Base-heavy object'
    },
    {
      keywords: ['scarf', 'shawl', 'textile', 'fabric'],
      position: 'center center',
      confidence: 0.75,
      feature: 'Textile product'
    }
  ];
  
  // Check title and type for patterns
  for (const pattern of patterns) {
    const found = pattern.keywords.some(keyword => 
      title.includes(keyword) || 
      type.includes(keyword) ||
      allTags.some(tag => tag.includes(keyword))
    );
    
    if (found && pattern.confidence > confidence) {
      optimalPosition = pattern.position;
      confidence = pattern.confidence;
      detectedFeatures.push(pattern.feature);
    }
  }
  
  // Shopify image URL analysis for additional context
  if (imageUrl.includes('shopify')) {
    // If it's a Shopify image, we can assume it's a product shot
    confidence = Math.min(confidence + 0.1, 0.95);
    detectedFeatures.push('Shopify product image');
  }
  
  return {
    optimalPosition,
    confidence,
    detectedFeatures
  };
}

/**
 * Get smart object position for LazyImage component
 */
export function getSmartObjectPosition(
  productTitle: string,
  imageUrl: string,
  productType?: string,
  tags: string[] = []
): string {
  const analysis = analyzeProductImage(productTitle, imageUrl, productType, tags);
  return analysis.optimalPosition;
}

/**
 * Generate optimized image URL with Shopify transformations
 */
export function getOptimizedImageUrl(
  originalUrl: string,
  width?: number,
  height?: number,
  format: 'webp' | 'jpg' | 'png' = 'webp',
  quality: number = 80
): string {
  if (!originalUrl || !originalUrl.includes('shopify')) {
    return originalUrl;
  }

  const url = new URL(originalUrl);
  
  // Add width parameter if specified
  if (width) {
    url.searchParams.set('w', width.toString());
  }
  
  // Add height parameter if specified
  if (height) {
    url.searchParams.set('h', height.toString());
  }
  
  // Add format parameter
  url.searchParams.set('fm', format);
  
  // Add quality parameter
  url.searchParams.set('q', quality.toString());
  
  // Add fit parameter for better cropping
  url.searchParams.set('fit', 'crop');
  
  return url.toString();
}

/**
 * Preload critical images for better performance
 */
export function preloadCriticalImages(imageUrls: string[]): void {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Get responsive image sizes for different contexts
 */
export function getResponsiveSizes(context: string): string {
  const sizesMap: Record<string, string> = {
    hero: '100vw',
    'product-main': '(max-width: 768px) 100vw, 50vw',
    'product-thumbnail': '(max-width: 768px) 25vw, 12.5vw',
    'product-card': '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    'cart-item': '64px',
    artisan: '(max-width: 768px) 100vw, 33vw',
    journal: '(max-width: 768px) 100vw, 33vw',
    general: '100vw'
  };

  return sizesMap[context] || sizesMap.general;
}
