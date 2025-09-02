import { useState, useRef, useEffect } from 'react';
import { useOptimizedImage } from '@/hooks/use-optimized-image';

interface OptimizedLazyImageProps {
  src: string;
  alt: string;
  context: 'hero' | 'product-main' | 'product-thumbnail' | 'product-card' | 'cart-item' | 'artisan' | 'journal' | 'general';
  className?: string;
  placeholderClassName?: string;
  productTitle?: string;
  productType?: string;
  productTags?: string[];
  width?: number;
  height?: number;
  format?: 'webp' | 'jpg' | 'png';
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedLazyImage = ({ 
  src, 
  alt, 
  context,
  className = '', 
  placeholderClassName = '',
  productTitle,
  productType,
  productTags = [],
  width,
  height,
  format,
  quality,
  onLoad,
  onError
}: OptimizedLazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const {
    src: optimizedSrc,
    priority,
    loading,
    fetchPriority,
    sizes,
    decoding,
    objectPosition
  } = useOptimizedImage({
    src,
    alt,
    context,
    productTitle,
    productType,
    productTags,
    width,
    height,
    format,
    quality
  });

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '100px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Enhanced placeholder with better styling
  const renderPlaceholder = () => {
    if (isLoaded || hasError) return null;
    
    return (
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-sm ${placeholderClassName}`}
        style={{
          backgroundImage: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite'
        }}
      />
    );
  };

  // Enhanced error state
  const renderErrorState = () => {
    if (!hasError) return null;
    
    return (
      <div className={`absolute inset-0 bg-gray-100 flex items-center justify-center ${placeholderClassName}`}>
        <div className="text-center text-gray-500">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">Image unavailable</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${placeholderClassName}`} ref={imgRef}>
      {renderPlaceholder()}
      {renderErrorState()}
      
      {(isInView || priority) && !hasError && (
        <img
          src={optimizedSrc}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          loading={loading}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          decoding={decoding}
          sizes={sizes}
          {...(fetchPriority !== 'auto' && { fetchpriority: fetchPriority })}
          style={{ 
            aspectRatio: width && height ? `${width}/${height}` : undefined,
            objectPosition: objectPosition
          }}
        />
      )}
      
      {/* Add CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default OptimizedLazyImage;
