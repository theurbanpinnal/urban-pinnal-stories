import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to manage canonical URLs for SEO
 * Automatically sets canonical URL based on current pathname
 * 
 * @param customUrl - Optional custom canonical URL (overrides automatic generation)
 */
export const useCanonicalUrl = (customUrl?: string) => {
  const location = useLocation();

  useEffect(() => {
    // Remove existing canonical link if it exists
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Generate canonical URL
    const canonicalUrl = customUrl || `https://theurbanpinnal.com${location.pathname}`;

    // Create and add new canonical link
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = canonicalUrl;
    document.head.appendChild(canonicalLink);

    // Cleanup function to remove canonical link when component unmounts
    return () => {
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.remove();
      }
    };
  }, [location.pathname, customUrl]);
};

export default useCanonicalUrl;
