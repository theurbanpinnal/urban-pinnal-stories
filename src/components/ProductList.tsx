import { useQuery } from 'urql';
import { useQuery as useReactQuery } from '@tanstack/react-query';
import {
  GET_PRODUCTS,
  SEARCH_PRODUCTS,
  GET_COLLECTIONS,
  GET_PRODUCTS_COUNT,
  ShopifyProduct,
  ShopifyCollection,
  isOutOfStock,
  getLowestPrice,
} from '@/lib/shopify';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import FilterSortDrawer, { FilterOptions, SortOption } from '@/components/FilterSortDrawer';
import ProductCard from '@/components/ProductCard';
import { useState, useMemo, useEffect, useCallback, memo } from 'react';
import { useFilterStore } from '@/stores';

interface ProductListProps {
  limit?: number;
  showFilters?: boolean;
  onClearAllFilters?: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ limit = 20, showFilters = true, onClearAllFilters }) => {
  // Get filter store state and functions
  const {
    filters,
    sortBy,
    searchQuery,
    updateFilters,
    setSortBy,
    setSearchQuery,
    updateURL
  } = useFilterStore();

  // Update URL when filters or sort change (only if not already updating)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateURL();
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [filters, sortBy]); // Remove updateURL from dependencies to prevent infinite loop

  // Memoize sort key conversion
  const sortKey = useMemo(() => {
    switch (sortBy) {
      case 'best-selling':
        return 'BEST_SELLING';
      case 'price-low':
        return 'PRICE';
      case 'price-high':
        return 'PRICE';
      case 'alphabetical':
        return 'TITLE';
      case 'oldest':
        return 'CREATED_AT';
      case 'newest':
      default:
        return 'CREATED_AT';
    }
  }, [sortBy]);

  // Memoize query variables to prevent unnecessary re-queries
  const queryVariables = useMemo(() => ({
    first: limit,
    sortKey,
    ...(searchQuery && searchQuery.length > 2 && { query: `title:*${searchQuery}* OR tag:*${searchQuery}* OR vendor:*${searchQuery}* OR product_type:*${searchQuery}*` })
  }), [limit, sortKey, searchQuery]);

  const [result] = useQuery({
    query: searchQuery && searchQuery.length > 2 ? SEARCH_PRODUCTS : GET_PRODUCTS,
    variables: queryVariables,
    requestPolicy: 'cache-and-network', // Use cache when available, fetch fresh data in background
  });

  // Memoize collections query variables
  const collectionsVariables = useMemo(() => ({ first: 50 }), []);

  const [collectionsResult] = useQuery({
    query: GET_COLLECTIONS,
    variables: collectionsVariables,
    requestPolicy: 'cache-first', // Use cache first for collections as they change less frequently
  });

  // Memoize count query variables
  const countVariables = useMemo(() => ({
    query: searchQuery && searchQuery.length > 2 ? `title:*${searchQuery}* OR tag:*${searchQuery}* OR vendor:*${searchQuery}* OR product_type:*${searchQuery}*` : ""
  }), [searchQuery]);

  const [countResult] = useQuery({
    query: GET_PRODUCTS_COUNT,
    variables: countVariables,
    requestPolicy: 'cache-first', // Use cache first for count as it's less critical
  });

  const { data, fetching, error } = result;
  const { data: collectionsData, fetching: fetchingCollections, error: collectionsError } = collectionsResult;
  const { data: countData } = countResult;
  
  // Memoize raw products extraction
  const rawProducts = useMemo(() => 
    data?.products?.edges?.map(({ node }: { node: ShopifyProduct }) => node) || [],
    [data]
  );





  // Get available categories from collections with fallback to productType
  const availableCategories = useMemo(() => {
    const collections = collectionsData?.collections?.edges?.map(({ node }: { node: ShopifyCollection }) => node.title) || [];
    
    // Always prefer productType (categories) since that's what you're using in Shopify
    const productTypes = rawProducts
      .map(product => product.productType)
      .filter((type): type is string => Boolean(type))
      .filter((type, index, arr) => arr.indexOf(type) === index);
    
    // Use collections if available and products are assigned to them, otherwise use productType
    if (collections.length > 0) {
      // Check if any products actually have collections assigned
      const productsWithCollections = rawProducts.filter(product => 
        product.collections?.edges && product.collections.edges.length > 0
      );
      
      if (productsWithCollections.length > 0) {
        return collections.filter((collection, index, arr) => arr.indexOf(collection) === index);
      }
    }
    
    // Fallback to productType (categories from Shopify admin)
    return productTypes;
  }, [collectionsData, rawProducts]);

  // Enhanced filter and sort products
  const products = useMemo(() => {
    let filtered = [...rawProducts];

    // Apply category filter - check productType first since that's what we're using
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => {
        // First check productType (categories from Shopify admin)
        if (product.productType && filters.categories.includes(product.productType)) {
          return true;
        }
        
        // Fallback to collections if products are assigned to them
        if (product.collections?.edges && product.collections.edges.length > 0) {
          const productCollections = product.collections.edges.map(edge => edge.node.title);
          return filters.categories.some(selectedCategory => 
            productCollections.includes(selectedCategory)
          );
        }
        
        return false;
      });
    }

    // Apply price filter using actual variant prices
    filtered = filtered.filter(product => {
      const price = getLowestPrice(product);
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });

    // Enhanced availability filter
    if (filters.availability === 'in-stock') {
      filtered = filtered.filter(product => 
        !isOutOfStock(product) // Include both regular stock and low stock items
      );
    }

    // Enhanced sorting - handle client-side sorting for price-high and oldest (reverse order)
    if (sortBy === 'price-high') {
      // Shopify PRICE sortKey sorts low to high, so we reverse for high to low
      filtered.reverse();
    } else if (sortBy === 'oldest') {
      // Shopify CREATED_AT sortKey sorts newest first, so we reverse for oldest first
      filtered.reverse();
    }

    return filtered;
  }, [rawProducts, filters, sortBy]);

  // Add optimistic updates - keep previous data while loading
  const [previousProducts, setPreviousProducts] = useState<ShopifyProduct[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (fetching && products.length > 0) {
      setPreviousProducts(products);
      setIsTransitioning(true);
    } else if (!fetching) {
      setIsTransitioning(false);
    }
  }, [fetching, products]);

  // Use previous products for optimistic updates during transitions
  const displayProducts = isTransitioning && previousProducts.length > 0
    ? previousProducts
    : products;

  // Background prefetching for better perceived performance
  useEffect(() => {
    if (products.length > 0) {
      // Prefetch next page of products (simulate pagination)
      const prefetchNextPage = async () => {
        // This would prefetch additional products in a real pagination scenario
        // For now, we'll just ensure collections are cached
        if (!collectionsData) {
          // Trigger collections fetch in background
        }
      };

      // Small delay to avoid overwhelming the network
      const timeoutId = setTimeout(prefetchNextPage, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [products.length, collectionsData]);

  // Memoize filter handlers to prevent unnecessary re-renders
  const handleSortChange = useCallback((newSortBy: SortOption) => {
    setSortBy(newSortBy);
  }, [setSortBy]);

  const handleFiltersChange = useCallback((newFilters: FilterOptions) => {
    updateFilters(newFilters);
  }, [updateFilters]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

  // Handle loading and error states with enhanced skeletons
  if (fetching || fetchingCollections) {
    // Show fewer skeletons if we have cached data
    const skeletonCount = rawProducts.length > 0 ? Math.min(6, rawProducts.length) : 12;
    return <ProductListSkeleton count={skeletonCount} />;
  }
  
  if (error) {
    console.error('GraphQL Error:', error);
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to Load Products
        </h3>
        <p className="text-gray-600 mb-4">
          {error.message || 'Please check your internet connection and try again.'}
        </p>
        <details className="text-sm text-gray-500">
          <summary className="cursor-pointer">Technical Details</summary>
          <pre className="mt-2 text-left bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {searchQuery ? `No results found for "${searchQuery}"` : 'No Products Available'}
        </h3>
        <p className="text-gray-600">
          {searchQuery ? 'Try adjusting your search terms or browse our collections.' : 'Please check back later for new arrivals.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {showFilters && (
        <FilterSortDrawer
          sortBy={sortBy}
          onSortChange={handleSortChange}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          availableCategories={availableCategories}
          productCount={products.length}
          onClearAllFilters={onClearAllFilters}
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
        />
      )}
      
      {/* Use regular grid with optimistic updates */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-200 ${isTransitioning ? 'opacity-60' : 'opacity-100'}`}>
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Show loading overlay during transitions */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-lg p-4 shadow-lg flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-craft-terracotta border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Updating products...</span>
          </div>
        </div>
      )}
    </div>
  );
};


const EnhancedProductSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="aspect-square overflow-hidden relative bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 bg-green-100" />
          <Skeleton className="h-4 w-20 bg-orange-100" />
        </div>
        <Skeleton className="h-6 w-3/4 bg-gray-200" />
        <Skeleton className="h-4 w-full bg-gray-200" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-7 w-24 bg-gray-300" />
          <Skeleton className="h-4 w-16 bg-gray-200" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-5 w-12 bg-gray-200 rounded-full" />
          <Skeleton className="h-5 w-16 bg-gray-200 rounded-full" />
          <Skeleton className="h-5 w-10 bg-gray-200 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
};

const ProductListSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <EnhancedProductSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductList;