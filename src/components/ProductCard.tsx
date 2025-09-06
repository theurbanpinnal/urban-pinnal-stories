import React, { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShopifyProduct,
  getProductBadges,
  getPrimaryMedia,
  hasMultipleVariants,
  isProductOnSale,
  isLowStock,
  isOutOfStock,
  isNewProduct,
  calculateDiscountPercentage,
  getLowestPrice,
} from '@/lib/shopify';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OptimizedLazyImage from '@/components/OptimizedLazyImage';
import { formatCurrency, capitalizeWords } from '@/lib/utils';
import { Clock, Package, Star, Zap } from 'lucide-react';

interface ProductCardProps {
  product: ShopifyProduct;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
  // Memoize expensive calculations
  const productCalculations = useMemo(() => {
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

    return {
      primaryImageUrl,
      primaryImage,
      selectedVariant,
      currentPrice,
      currencyCode,
      originalPrice,
      compareAtCurrency,
      badges,
      onSale,
      discountPercentage,
      lowStock,
      outOfStock,
      isNew
    };
  }, [product]);

  const {
    primaryImageUrl,
    primaryImage,
    selectedVariant,
    currentPrice,
    currencyCode,
    originalPrice,
    compareAtCurrency,
    badges,
    onSale,
    discountPercentage,
    lowStock,
    outOfStock,
    isNew
  } = productCalculations;

  return (
    <Link to={`/store/products/${product.handle}`} className="group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-card text-card-foreground relative">
        <div className="aspect-square overflow-hidden relative bg-gray-50">
          {primaryImageUrl ? (
            <OptimizedLazyImage
              src={primaryImageUrl}
              alt={primaryImage?.altText || product.title}
              context="product-card"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              placeholderClassName="w-full h-full"
              productTitle={product.title}
              productType={product.productType}
              productTags={product.tags}
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
            {capitalizeWords(product.title)}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Enhanced Pricing - Reserve space for consistent alignment */}
          <div className="space-y-2">
            {/* Compare-at Price (Original Price) - Always reserve space */}
            <div className="h-5 flex items-center">
              {selectedVariant?.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) ? (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(selectedVariant.compareAtPrice.amount, selectedVariant.compareAtPrice.currencyCode)}
                </span>
              ) : (
                <div className="h-5"></div>
              )}
            </div>

            {/* Current Price - Always at the same level */}
            <div className="flex items-center">
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
                  {capitalizeWords(tag)}
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
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
