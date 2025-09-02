import { useMemo } from 'react';
import { getImageOptimizationConfig, getSmartObjectPosition, getOptimizedImageUrl } from '@/lib/image-utils';

interface UseOptimizedImageProps {
  src: string;
  alt: string;
  context: 'hero' | 'product-main' | 'product-thumbnail' | 'product-card' | 'cart-item' | 'artisan' | 'journal' | 'general';
  productTitle?: string;
  productType?: string;
  productTags?: string[];
  width?: number;
  height?: number;
  format?: 'webp' | 'jpg' | 'png';
  quality?: number;
}

interface OptimizedImageConfig {
  src: string;
  alt: string;
  priority: boolean;
  loading: 'lazy' | 'eager';
  fetchPriority: 'high' | 'low' | 'auto';
  sizes: string;
  decoding: 'async' | 'sync' | 'auto';
  objectPosition: string;
  optimizedSrc: string;
}

export function useOptimizedImage({
  src,
  alt,
  context,
  productTitle,
  productType,
  productTags = [],
  width,
  height,
  format = 'webp',
  quality = 80
}: UseOptimizedImageProps): OptimizedImageConfig {
  const optimizationConfig = useMemo(() => {
    return getImageOptimizationConfig(context);
  }, [context]);

  const objectPosition = useMemo(() => {
    if (productTitle) {
      return getSmartObjectPosition(productTitle, src, productType, productTags);
    }
    return 'center center';
  }, [productTitle, src, productType, productTags]);

  const optimizedSrc = useMemo(() => {
    return getOptimizedImageUrl(src, width, height, format, quality);
  }, [src, width, height, format, quality]);

  return {
    src: optimizedSrc,
    alt,
    priority: optimizationConfig.priority,
    loading: optimizationConfig.loading,
    fetchPriority: optimizationConfig.fetchPriority,
    sizes: optimizationConfig.sizes,
    decoding: optimizationConfig.decoding,
    objectPosition,
    optimizedSrc
  };
}
