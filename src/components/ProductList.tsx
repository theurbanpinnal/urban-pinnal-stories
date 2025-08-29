import { useQuery } from 'urql';
import { Link } from 'react-router-dom';
import { 
  GET_PRODUCTS, 
  GET_COLLECTIONS, 
  ShopifyProduct, 
  ShopifyCollection,
  getProductBadges,
  formatDateRelative,
  getPrimaryMedia,
  hasMultipleVariants,
  isProductOnSale,
  isLowStock,
  isOutOfStock,
  isNewProduct,
  calculateDiscountPercentage,
  getLowestPrice,
  getHighestCompareAtPrice
} from '@/lib/shopify';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import LazyImage from '@/components/LazyImage';
import StarRating from '@/components/ui/star-rating';
import { formatCurrency } from '@/lib/utils';
import { getSmartObjectPosition } from '@/lib/image-utils';
import FilterSortDrawer, { FilterOptions, SortOption } from '@/components/FilterSortDrawer';
import { useState, useMemo, useEffect } from 'react';
import { Clock, Package, Star, Zap } from 'lucide-react';

interface ProductListProps {
  limit?: number;
  showFilters?: boolean;
  initialCollection?: string | null;
}

const ProductList: React.FC<ProductListProps> = ({ limit = 20, showFilters = true, initialCollection = null }) => {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: initialCollection ? [initialCollection] : [],
    priceRange: { min: 0, max: 10000 },
    availability: 'all',
  });

  // Convert sortBy to Shopify sortKey
  const getSortKey = (sortBy: SortOption) => {
    switch (sortBy) {
      case 'best-selling':
        return 'BEST_SELLING';
      case 'price-low':
        return 'PRICE';
      case 'price-high':
        return 'PRICE';
      case 'alphabetical':
        return 'TITLE';
      case 'newest':
      default:
        return 'CREATED_AT';
    }
  };

  const [result] = useQuery({
    query: GET_PRODUCTS,
    variables: { 
      first: limit,
      sortKey: getSortKey(sortBy)
    },
  });

  const [collectionsResult] = useQuery({
    query: GET_COLLECTIONS,
    variables: { first: 50 },
  });

  const { data, fetching, error } = result;
  const { data: collectionsData, fetching: fetchingCollections } = collectionsResult;
  
  const rawProducts = data?.products?.edges?.map(({ node }: { node: ShopifyProduct }) => node) || [];

  // Update filters when initialCollection changes
  useEffect(() => {
    if (initialCollection) {
      setFilters(prev => ({
        ...prev,
        categories: [initialCollection]
      }));
    }
  }, [initialCollection]);

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
        !isOutOfStock(product) && !isLowStock(product)
      );
    } else if (filters.availability === 'low-stock') {
      filtered = filtered.filter(product => 
        isLowStock(product) || isOutOfStock(product)
      );
    }

    // Enhanced sorting - only handle client-side sorting for price-high (reverse order)
    if (sortBy === 'price-high') {
      // Shopify PRICE sortKey sorts low to high, so we reverse for high to low
      filtered.reverse();
    }

    return filtered;
  }, [rawProducts, filters, sortBy]);

  // Handle loading and error states
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
  const primaryImageUrl = getPrimaryMedia(product);
  const primaryImage = product.images.edges[0]?.node;

  // Enhanced pricing logic - select a representative variant for pricing display
  const selectRepresentativeVariant = () => {
    if (!product.variants?.edges?.length) {
      return null;
    }

    // Priority 1: First variant with compareAtPrice (for showing discounts)
    const variantWithCompareAtPrice = product.variants.edges.find(({ node: variant }) =>
      variant.compareAtPrice?.amount &&
      parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount)
    );

    if (variantWithCompareAtPrice) {
      return variantWithCompareAtPrice.node;
    }

    // Priority 2: Lowest priced variant (fallback)
    let lowestVariant = product.variants.edges[0].node;
    let lowestPrice = parseFloat(lowestVariant.price.amount);

    for (const { node: variant } of product.variants.edges) {
      const price = parseFloat(variant.price.amount);
      if (price < lowestPrice) {
        lowestPrice = price;
        lowestVariant = variant;
      }
    }

    return lowestVariant;
  };

  const selectedVariant = selectRepresentativeVariant();
  const currentPrice = selectedVariant ? parseFloat(selectedVariant.price.amount) : getLowestPrice(product);
  const currencyCode = selectedVariant ? selectedVariant.price.currencyCode : product.priceRange.minVariantPrice.currencyCode;

  // Get compare-at price from selected variant
  let originalPrice: number | null = null;
  let compareAtCurrency: string | null = null;

  if (selectedVariant?.compareAtPrice?.amount) {
    const compareAtPrice = parseFloat(selectedVariant.compareAtPrice.amount);
    if (compareAtPrice > currentPrice) {
      originalPrice = compareAtPrice;
      compareAtCurrency = selectedVariant.compareAtPrice.currencyCode;
    }
  }
  
  // Get all product badges
  const badges = getProductBadges(product);
  
  // Check if product is on sale
  const onSale = isProductOnSale(product);
  
  // Get discount percentage
  const discountPercentage = calculateDiscountPercentage(product);
  
  // Check inventory status
  const lowStock = isLowStock(product);
  const outOfStock = isOutOfStock(product);
  
  // Check if it's a new product
  const isNew = isNewProduct(product);

  return (
    <Link to={`/store/products/${product.handle}`} className="group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-card text-card-foreground relative">
        <div className="aspect-square overflow-hidden relative bg-gray-50">
          {primaryImageUrl ? (
            <LazyImage
              src={primaryImageUrl}
              alt={primaryImage?.altText || product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              placeholderClassName="w-full h-full"
              objectPosition={getSmartObjectPosition(
                product.title,
                primaryImageUrl,
                product.productType,
                product.tags
              )}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          {/* Product Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && (
              <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600">
                <Zap className="w-3 h-3 mr-1" />
                New
              </Badge>
            )}
            {/* Sale badge - now consistent with enhanced pricing logic */}
            {selectedVariant?.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) && (
              <Badge variant="destructive" className="text-xs">
                {discountPercentage > 0 ? `${discountPercentage}% OFF` : 'SALE'}
              </Badge>
            )}
            {badges.includes('Featured') && (
              <Badge variant="secondary" className="text-xs bg-amber-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          {/* Stock Status Badge */}
          <div className="absolute top-2 right-2">
            {outOfStock && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
            {lowStock && !outOfStock && (
              <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-300">
                <Clock className="w-3 h-3 mr-1" />
                Low Stock
              </Badge>
            )}
          </div>

          {/* Multiple Variants Indicator */}
          {hasMultipleVariants(product) && (
            <div className="absolute bottom-2 right-2">
              <Badge variant="outline" className="text-xs bg-white/90">
                +{(product.variants?.edges?.length || 1) - 1} variants
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">

          {/* Product Title */}
          <h3 className="font-serif font-semibold text-lg md:text-xl text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Enhanced Pricing - Same logic as ProductPage */}
          <div className="space-y-2">
            {/* Compare-at Price (Original Price) */}
            {selectedVariant?.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(selectedVariant.compareAtPrice.amount, selectedVariant.compareAtPrice.currencyCode)}
                </span>
              </div>
            )}

            {/* Current Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(currentPrice.toString(), currencyCode)}
              </span>
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
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
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-3" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="flex gap-1 mt-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-10" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;