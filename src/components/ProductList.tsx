import { useQuery } from 'urql';
import { Link } from 'react-router-dom';
import { GET_PRODUCTS, GET_PRODUCTS_SIMPLE, GET_COLLECTIONS, ShopifyProduct, ShopifyCollection } from '@/lib/shopify';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import LazyImage from '@/components/LazyImage';
import StarRating from '@/components/ui/star-rating';
import { formatCurrency } from '@/lib/utils';
import FilterSortDrawer, { FilterOptions, SortOption } from '@/components/FilterSortDrawer';
import { useState, useMemo } from 'react';

interface ProductListProps {
  limit?: number;
  showFilters?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ limit = 20, showFilters = true }) => {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: { min: 0, max: 10000 }, // Increased max to avoid filtering out expensive items
    availability: 'all',
  });
  const [result] = useQuery({
    query: GET_PRODUCTS,
    variables: { first: limit },
  });

  const [collectionsResult] = useQuery({
    query: GET_COLLECTIONS,
    variables: { first: 50 }, // Fetch up to 50 collections
  });

  const { data, fetching, error } = result;
  const { data: collectionsData, fetching: fetchingCollections } = collectionsResult;
  
  const rawProducts = data?.products?.edges?.map(({ node }: { node: ShopifyProduct }) => node) || [];
  


  // Get available categories from collections with fallback to productType
  const availableCategories = useMemo(() => {
    // First try to get collections
    const collections = collectionsData?.collections?.edges?.map(({ node }: { node: ShopifyCollection }) => node.title) || [];
    

    
    // If no collections available, fallback to productType as categories
    if (collections.length === 0) {
      const productTypes = rawProducts
        .map(product => product.productType)
        .filter((type): type is string => Boolean(type))
        .filter((type, index, arr) => arr.indexOf(type) === index);
      return productTypes;
    }
    return collections.filter((collection, index, arr) => arr.indexOf(collection) === index);
  }, [collectionsData, rawProducts]);

  // Filter and sort products
  const products = useMemo(() => {
    let filtered = [...rawProducts];

    // Apply category filter using collections or fallback to productType
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => {
        // First try filtering by collections
        if (product.collections?.edges && product.collections.edges.length > 0) {
          const productCollections = product.collections.edges.map(edge => edge.node.title);
          return filters.categories.some(selectedCategory => 
            productCollections.includes(selectedCategory)
          );
        }
        
        // Fallback to productType filtering
        return product.productType && filters.categories.includes(product.productType);
      });
    }

    // Apply price filter
    filtered = filtered.filter(product => {
      const price = parseFloat(product.priceRange.minVariantPrice.amount);
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });

    // Apply availability filter
    if (filters.availability === 'in-stock') {
      filtered = filtered.filter(product => 
        product.totalInventory && product.totalInventory > 10
      );
    } else if (filters.availability === 'low-stock') {
      filtered = filtered.filter(product => 
        product.totalInventory && product.totalInventory <= 10 && product.totalInventory > 0
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount);
        case 'price-high':
          return parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return 0; // Maintain original order for newest
      }
    });

    return filtered;
  }, [rawProducts, filters, sortBy]);

  // Handle loading and error states after all hooks
  if (fetching || fetchingCollections) return <ProductListSkeleton />;
  
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
          No Products Available
        </h3>
        <p className="text-gray-600">
          Please check back later for new arrivals.
        </p>
      </div>
    );
  }

  return (
    <div>
      {showFilters && (
        <FilterSortDrawer
          sortBy={sortBy}
          onSortChange={setSortBy}
          filters={filters}
          onFiltersChange={setFilters}
          availableCategories={availableCategories}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: ShopifyProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const primaryImage = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  
  // Extract rating from metafields
  const ratingMetafield = product.metafields?.find(m => m.key === 'rating');
  const reviewCountMetafield = product.metafields?.find(m => m.key === 'count');
  const rating = ratingMetafield ? parseFloat(ratingMetafield.value) : 0;
  const reviewCount = reviewCountMetafield ? parseInt(reviewCountMetafield.value) : 0;
  
  // Check if low stock
  const isLowStock = product.totalInventory && product.totalInventory <= 10 && product.totalInventory > 0;

  return (
    <Link to={`/store/products/${product.handle}`} className="group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-card text-card-foreground">
        <div className="aspect-square overflow-hidden relative bg-gray-50">
          {primaryImage ? (
            <LazyImage
              src={primaryImage.url}
              alt={primaryImage.altText || product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              placeholderClassName="w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
          {isLowStock && (
            <Badge 
              variant="destructive" 
              className="absolute top-2 left-2 text-xs"
            >
              Low Stock
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-serif font-semibold text-lg md:text-xl text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          {rating > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={rating} size="sm" />
              {reviewCount > 0 && (
                <span className="text-xs text-muted-foreground">({reviewCount})</span>
              )}
            </div>
          )}
          {product.description && (
            <p className="text-base md:text-lg text-muted-foreground mb-3 line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-base font-semibold">
              {formatCurrency(price.amount, price.currencyCode)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const ProductListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="aspect-square overflow-hidden relative bg-gray-50">
            <Skeleton className="w-full h-full" />
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-3" />
            <Skeleton className="h-6 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;
