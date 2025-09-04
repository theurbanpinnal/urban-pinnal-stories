import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'urql';
import {
  GET_PRODUCT_BY_HANDLE,
  ShopifyProduct,
  getProductBadges,
  hasMultipleVariants,
  isProductOnSale,
  isLowStock,
  isOutOfStock,
  isNewProduct,
  calculateDiscountPercentage
} from '@/lib/shopify';
import { useCartStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Loader2, 
  Plus, 
  Minus, 
  Zap, 
  Star,
  Package,
  Truck,
  Shield,
  Clock,
  Tag,
  Calendar,
  Weight,
  Ruler,
  BarChart3,
  Info
} from 'lucide-react';
import OptimizedLazyImage from '@/components/OptimizedLazyImage';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ShareButton from '@/components/ShareButton';
import { formatCurrency } from '@/lib/utils';

// Action status type for UI locking
type ActionStatus = 'idle' | 'adding' | 'buying';

const ProductPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { addToCart, checkout, isLoading: cartLoading } = useCartStore();
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  
  // New state-driven UI locking system
  const [actionStatus, setActionStatus] = useState<ActionStatus>('idle');

  const [result] = useQuery({
    query: GET_PRODUCT_BY_HANDLE,
    variables: { handle: handle || '' },
    pause: !handle,
  });

  const { data, fetching, error } = result;

  // Computed property to check if any action is processing
  const isProcessing = actionStatus !== 'idle';


  // Set page title for SEO
  useEffect(() => {
    if (data?.productByHandle) {
      const product = data.productByHandle;
      document.title = `${product.title} | The Urban Pinnal`;
      
      // Set meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && product.description) {
        metaDescription.setAttribute('content', product.description.substring(0, 160));
      }
    }
  }, [data]);

  // Set default variant and auto-select single options
  useEffect(() => {
    if (data?.productByHandle?.variants?.edges && data?.productByHandle?.options) {
      const variants = data.productByHandle.variants.edges.map(({ node }) => node);
      const options = data.productByHandle.options;
      
      if (variants.length > 0) {
        // Auto-select the first variant if there's only one
        if (variants.length === 1) {
          setSelectedVariantId(variants[0].id);
          // Also set the selected options for single variant products
          if (variants[0].selectedOptions) {
            const optionsMap: Record<string, string> = {};
            variants[0].selectedOptions.forEach(option => {
              optionsMap[option.name] = option.value;
            });
            setSelectedOptions(optionsMap);
          }
        } else {
          // For multiple variants, auto-select options that have only one value
          const newSelectedOptions: Record<string, string> = { ...selectedOptions };
          let hasChanges = false;
          
          options.forEach(option => {
            // If this option has only one value, auto-select it
            if (option.values.length === 1 && !selectedOptions[option.name]) {
              newSelectedOptions[option.name] = option.values[0];
              hasChanges = true;
            }
          });
          
          if (hasChanges) {
            setSelectedOptions(newSelectedOptions);
            
            // Find the matching variant based on the auto-selected options
            const matchingVariant = variants.find(variant => {
              return variant.selectedOptions?.every(option => 
                newSelectedOptions[option.name] === option.value
              );
            });
            
            if (matchingVariant) {
              setSelectedVariantId(matchingVariant.id);
            }
          }
        }
      }
    }
  }, [data]);

  if (fetching) return <ProductPageSkeleton />;
  
  if (error || !data?.productByHandle) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-6">Product Not Found</h1>
          <p className="font-sans text-lg text-muted-foreground mb-8 max-w-md mx-auto">The product you're looking for doesn't exist or has been moved.</p>
          <Button onClick={() => navigate('/store')} variant="outline" className="font-sans text-base px-6 py-3">
            <ArrowLeft className="mr-3 h-5 w-5" />
            Back to Store
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const product: ShopifyProduct = data.productByHandle;
  const variants = product.variants?.edges?.map(({ node }) => node) || [];
  const images = product.images?.edges?.map(({ node }) => node) || [];
  const options = product.options || [];
  const badges = getProductBadges(product);

  // Find variant based on selected options
  const findVariantByOptions = () => {
    return variants.find(variant => {
      return variant.selectedOptions?.every(option => 
        selectedOptions[option.name] === option.value
      );
    });
  };

  const selectedVariant = selectedVariantId 
    ? variants.find(variant => variant.id === selectedVariantId)
    : findVariantByOptions() || variants[0];

  const currentImage = images[selectedImageIndex];

  // Handle option change
  const handleOptionChange = (optionName: string, value: string) => {
    const newSelectedOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newSelectedOptions);
    
    // Find matching variant
    const matchingVariant = variants.find(variant => {
      return variant.selectedOptions?.every(option => 
        newSelectedOptions[option.name] === option.value
      );
    });
    
    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.id);
    }
  };

  // Quantity handlers with stock limit
  const maxQuantity = Math.min(10, selectedVariant?.quantityAvailable || 10);
  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, maxQuantity));
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) {
      toast({
        title: 'Selection Required',
        description: 'Please select a product variant before proceeding.',
        variant: 'destructive',
      });
      return;
    }
    
    setActionStatus('adding');
    try {
      const success = await addToCart(selectedVariant.id, quantity);
      if (success) {
        toast({
          title: 'Added to Cart',
          description: 'Item has been added to your cart successfully.',
        });
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionStatus('idle');
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant?.id) {
      toast({
        title: 'Selection Required',
        description: 'Please select a product variant before proceeding.',
        variant: 'destructive',
      });
      return;
    }

    setActionStatus('buying');

    try {
      const success = await addToCart(selectedVariant.id, quantity);
      if (success !== false) {
        // Add a small delay to ensure cart state is updated
        setTimeout(() => {
          checkout();
          setActionStatus('idle');
        }, 800);
      } else {
        setActionStatus('idle');
      }
    } catch (error) {
      console.error('Failed to buy now:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
      setActionStatus('idle');
    }
  };

  // Check stock status
  const lowStock = isLowStock(product);
  const outOfStock = isOutOfStock(product) || !selectedVariant?.availableForSale;
  const onSale = isProductOnSale(product);
  const discountPercentage = calculateDiscountPercentage(product);
  const isNew = isNewProduct(product);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/store')}
            className="font-sans text-base text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <ArrowLeft className="mr-3 h-5 w-5" />
            Back to Store
          </Button>
          

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="overflow-hidden rounded-lg bg-white border">
              {currentImage ? (
                <OptimizedLazyImage
                  src={currentImage.url}
                  alt={currentImage.altText || product.title}
                  context="product-main"
                  className="w-full h-auto max-w-full object-contain"
                  productTitle={product.title}
                  productType={product.productType}
                  productTags={product.tags}
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-100">
                  <span className="text-muted-foreground">No Image Available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={image.url}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`overflow-hidden rounded border-2 transition-all bg-white ${
                      selectedImageIndex === index 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <OptimizedLazyImage
                      src={image.url}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      context="product-thumbnail"
                      className="w-full h-auto max-h-24 object-contain"
                      productTitle={product.title}
                      productType={product.productType}
                      productTags={product.tags}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Product Information */}
          <div className="space-y-6">
            {/* Vendor & Collections */}
            <div className="flex items-center justify-between">
              <div className="font-sans text-sm text-muted-foreground uppercase tracking-wider font-medium">
                The Urban Pinnal
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight">
                {product.title}
              </h1>
              
              {/* Enhanced Pricing */}
              {selectedVariant && (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 mb-4">
                    {selectedVariant.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) && (
                      <>
                        <span className="font-sans text-xl text-muted-foreground line-through">
                          {formatCurrency(selectedVariant.compareAtPrice.amount, selectedVariant.compareAtPrice.currencyCode)}
                        </span>
                        <Badge variant="destructive" className="font-sans text-sm px-3 py-1">
                          {discountPercentage > 0 ? `${discountPercentage}% OFF` : 'SALE'}
                        </Badge>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-2xl md:text-3xl font-bold text-foreground">
                      {formatCurrency(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Stock Status */}
            {selectedVariant && (
              <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span className="font-sans text-sm font-medium">
                    {outOfStock ? 'Out of Stock' : 
                     lowStock ? `Low Stock` : 
                     'In Stock'}
                  </span>
                </div>
                {selectedVariant.quantityAvailable !== undefined && (
                  <Badge variant="outline" className="text-xs">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    {selectedVariant.quantityAvailable} available
                  </Badge>
                )}
              </div>
            )}


            {/* Options Selection */}
            {options.map((option) => (
              <div key={option.id} className="space-y-4">
                <label className="block font-sans text-base font-semibold text-foreground">
                  {option.name}
                </label>
                <div className="flex flex-wrap gap-3">
                  {option.values.length === 1 ? (
                    // Single option value - show as selected
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 rounded-md font-sans px-6 py-3 text-base border-2 bg-foreground text-background">
                      {option.values[0]}
                    </button>
                  ) : (
                    // Multiple option values - show as selectable buttons
                    option.values.map((value) => {
                      const isSelected = selectedOptions[option.name] === value;
                      return (
                        <Button
                          key={value}
                          variant={isSelected ? "default" : "outline"}
                          size="lg"
                          onClick={() => handleOptionChange(option.name, value)}
                          className={`font-sans px-6 py-3 text-base ${
                            isSelected 
                              ? "bg-foreground text-background" 
                              : "border-2 hover:border-foreground"
                          }`}
                        >
                          {value}
                        </Button>
                      );
                    })
                  )}
                </div>
              </div>
            ))}

            {/* Quantity Selection */}
            <div className="space-y-4">
              <label className="block font-sans text-base font-semibold text-foreground">
                Quantity
              </label>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-12 w-12 rounded-full border-2"
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <span className="font-sans text-xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= maxQuantity}
                    className="h-12 w-12 rounded-full border-2"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                {selectedVariant?.quantityAvailable && (
                  <span className="text-sm text-muted-foreground">
                    Max: {Math.min(maxQuantity, selectedVariant.quantityAvailable)}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              <Button
                onClick={handleAddToCart}
                disabled={outOfStock || cartLoading || (variants.length > 1 && !selectedVariantId) || isProcessing}
                className="w-full font-sans text-lg font-semibold py-4 h-14 bg-background text-foreground border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                variant="outline"
              >
                {actionStatus === 'adding' ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-3 h-6 w-6" />
                    {outOfStock ? 'Out of Stock' : 
                     variants.length > 1 && !selectedVariantId ? 'Select Variant' : 
                     'Add to cart'}
                  </>
                )}
              </Button>

              <Button
                onClick={handleBuyNow}
                disabled={outOfStock || cartLoading || isProcessing || (variants.length > 1 && !selectedVariantId)}
                className="w-full font-sans text-lg font-semibold py-4 h-14 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
              >
                {actionStatus === 'buying' ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-3 h-6 w-6" />
                    {outOfStock ? 'Out of Stock' : 
                     variants.length > 1 && !selectedVariantId ? 'Select Variant' : 
                     'Buy it now'}
                  </>
                )}
              </Button>

              {/* Share Button */}
              <div className="flex justify-center pt-2">
                <ShareButton
                  productTitle={product.title}
                  productUrl={window.location.href}
                  productImage={currentImage?.url}
                  className="w-full"
                />
              </div>
            </div>

            {/* Product Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="font-sans text-sm font-medium text-muted-foreground">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-6 mt-6"></div>

            {/* Enhanced Product Description */}
            {product.description && (
              <div>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                  Product Details
                </h2>
                <div className="prose prose-lg max-w-none font-sans text-base leading-relaxed text-muted-foreground">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: product.descriptionHtml || product.description 
                    }} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const ProductPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between">
          <Skeleton className="h-10 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="w-full h-96 rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-24 rounded" />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div>
              <Skeleton className="h-16 w-3/4 mb-6" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
            <Skeleton className="h-16 w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-32" />
            <div className="space-y-4 pt-6">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;