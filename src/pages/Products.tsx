import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ProductList from '@/components/ProductList';
import FilterSortDrawer from '@/components/FilterSortDrawer';
import { useFilterStore } from '@/stores/filter-store';
import { useQuery } from 'urql';
import { GET_PRODUCTS, GET_COLLECTIONS } from '@/lib/shopify';
import { useCanonicalUrl } from '@/hooks/use-canonical-url';
import { useCustomScroll } from '@/hooks/use-custom-scroll';
import { scrollToSectionWithRetry } from '@/lib/scroll-to-section';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const productsSectionRef = useRef<HTMLDivElement>(null);
  
  // Get filter store functions and state
  const {
    filters: currentFilters,
    sortBy,
    searchQuery,
    syncWithURL,
    updateURL,
    clearFilters,
    updateFilters,
    setSortBy,
    setSearchQuery
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

  // Memoize products query variables
  const productsVariables = React.useMemo(() => {
    const query = searchQuery ? `title:*${searchQuery}* OR tag:*${searchQuery}*` : '';
    const sortKey = sortBy === 'newest' ? 'CREATED_AT' :
                   sortBy === 'oldest' ? 'CREATED_AT' :
                   sortBy === 'price-low' ? 'PRICE' :
                   sortBy === 'price-high' ? 'PRICE' :
                   sortBy === 'alphabetical' ? 'TITLE' :
                   sortBy === 'best-selling' ? 'BEST_SELLING' : 'CREATED_AT';
    
    const reverse = sortBy === 'oldest' || sortBy === 'price-high';
    
    return {
      first: 50,
      query,
      sortKey,
      reverse
    };
  }, [searchQuery, sortBy]);

  const [productsResult] = useQuery({
    query: GET_PRODUCTS,
    variables: productsVariables,
  });

  const { data: productsData, fetching: productsLoading, error: productsError } = productsResult;

  // Memoize collections query variables
  const collectionsVariables = React.useMemo(() => ({ first: 10 }), []);

  const [collectionsResult] = useQuery({
    query: GET_COLLECTIONS,
    variables: collectionsVariables,
    requestPolicy: 'cache-first',
  });

  const { data: collectionsData } = collectionsResult;

  // Extract products and collections
  const products = productsData?.products?.edges || [];
  const collections = collectionsData?.collections?.edges || [];

  // Get available categories from collections
  const availableCategories = React.useMemo(() => 
    collections.map(edge => edge.node.title).filter(Boolean),
    [collections]
  );

  // Handle collection selection
  const handleCollectionSelect = React.useCallback((collectionTitle: string | null) => {
    if (collectionTitle) {
      updateFilters({ categories: [collectionTitle] });
      setSearchParams({ collection: collectionTitle });
    } else {
      updateFilters({ categories: [] });
      setSearchParams({});
    }

    // Scroll to products section using reliable utility
    scrollToSectionWithRetry('products', {
      behavior: 'smooth',
      offset: 20, // Smaller offset to ensure beginning of section
      timeout: 200
    });
  }, [updateFilters, setSearchParams, scrollToElement]);

  // Handle clear filters
  const handleClearAllFilters = React.useCallback(() => {
    clearFilters();
    setSearchParams({});
  }, [clearFilters, setSearchParams]);

  // Handle sort change
  const handleSortChange = React.useCallback((newSortBy: any) => {
    setSortBy(newSortBy);
  }, [setSortBy]);

  // Handle filters change
  const handleFiltersChange = React.useCallback((newFilters: any) => {
    updateFilters(newFilters);
  }, [updateFilters]);

  // Handle search clear
  const handleClearSearch = React.useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

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

          {/* Filter and Sort Controls */}
          <FilterSortDrawer
            sortBy={sortBy}
            onSortChange={handleSortChange}
            filters={currentFilters}
            onFiltersChange={handleFiltersChange}
            availableCategories={availableCategories}
            productCount={products.length}
            onClearAllFilters={handleClearAllFilters}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
          />

          {/* Product List */}
          <ProductList
            products={products}
            loading={productsLoading}
            error={productsError}
            sortBy={sortBy}
            filters={currentFilters}
            searchQuery={searchQuery}
            onClearAllFilters={handleClearAllFilters}
          />
        </div>
      </section>
    </div>
  );
};

export default Products;
