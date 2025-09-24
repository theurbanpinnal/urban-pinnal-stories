import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ProductList from '@/components/ProductList';
import { useFilterStore } from '@/stores/filter-store';
import { useCanonicalUrl } from '@/hooks/use-canonical-url';
import { useCustomScroll } from '@/hooks/use-custom-scroll';
import { scrollToSectionWithRetry } from '@/lib/scroll-to-section';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const productsSectionRef = useRef<HTMLDivElement>(null);
  
  // Get filter store functions and state
  const {
    syncWithURL
  } = useFilterStore();

  // Set canonical URL
  useCanonicalUrl();

  // Custom scroll for smooth scrolling
  const { scrollToElement } = useCustomScroll({
    smooth: true,
    momentum: true,
    enableTouch: true,
    enableWheel: true
  });

  // Sync with URL on mount and when URL changes
  useEffect(() => {
    syncWithURL();
  }, [searchParams, syncWithURL]);

  // Scroll to products section when arriving with collection filter
  useEffect(() => {
    const collectionParam = searchParams.get('collection');
    const searchParam = searchParams.get('search');
    
    if (collectionParam || searchParam) {
      // Use reliable scroll-to-section utility
      scrollToSectionWithRetry('products', {
        behavior: 'smooth',
        offset: 20, // Smaller offset to ensure beginning of section
        timeout: 300
      });
    }
  }, [searchParams]);

  // Handle back to store
  const handleBackToStore = React.useCallback(() => {
    navigate('/store');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <button 
              onClick={handleBackToStore}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Store
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Products</span>
          </nav>
        </div>
      </div>

      {/* Products Section */}
      <section 
        id="products" 
        ref={productsSectionRef}
        className="py-16"
      >
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Handcrafted with Love
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Each piece in our collection is carefully crafted by skilled artisans, 
              preserving traditional techniques while creating modern, timeless designs 
              that bring beauty and authenticity to your everyday life.
            </p>
          </div>

          {/* Product List */}
          <ProductList
            limit={50}
            showFilters={true}
          />
        </div>
      </section>
    </div>
  );
};

export default Products;
