import { useEffect } from 'react';

interface ResourcePreloaderProps {
  images?: string[];
  fonts?: string[];
}

const ResourcePreloader = ({ images = [], fonts = [] }: ResourcePreloaderProps) => {
  useEffect(() => {
    // Preload critical images
    images.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload fonts
    fonts.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = href;
      document.head.appendChild(link);
    });
  }, [images, fonts]);

  return null;
};

export default ResourcePreloader;
