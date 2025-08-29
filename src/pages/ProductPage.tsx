import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'urql';
import { GET_PRODUCT_BY_HANDLE, ShopifyProduct } from '@/lib/shopify';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ShoppingCart, Loader2, Plus, Minus, Zap } from 'lucide-react';
import LazyImage from '@/components/LazyImage';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { formatCurrency } from '@/lib/utils';

const ProductPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { addToCart, checkout, isLoading: cartLoading } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isBuyingNow, setIsBuyingNow] = useState<boolean>(false);

  const [result] = useQuery({
    query: GET_PRODUCT_BY_HANDLE,
    variables: { handle: handle || '' },
    pause: !handle,
  });

  const { data, fetching, error } = result;

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
  
  // Set default variant if none selected
  if (!selectedVariantId && variants.length > 0) {
    setSelectedVariantId(variants[0].id);
  }

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

  // Quantity handlers
  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) {
      alert('Please select a variant');
      return;
    }
    
    await addToCart(selectedVariant.id, quantity);
  };

  const handleBuyNow = async () => {
    if (!selectedVariant?.id) {
      alert('Please select a variant');
      return;
    }
    
    setIsBuyingNow(true);
    
    try {
      // Add item to cart first
      await addToCart(selectedVariant.id, quantity);
      
      // Small delay to ensure cart is updated, then redirect to checkout
      setTimeout(() => {
        checkout(); // This will redirect to Shopify checkout
        setIsBuyingNow(false);
      }, 500);
    } catch (error) {
      console.error('Failed to buy now:', error);
      setIsBuyingNow(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
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
                <LazyImage
                  src={currentImage.url}
                  alt={currentImage.altText || product.title}
                  className="w-full h-auto max-w-full object-contain"
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
                    <LazyImage
                      src={image.url}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      className="w-full h-auto max-h-24 object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Store Badge */}
            <div className="font-sans text-sm text-muted-foreground uppercase tracking-wider font-medium">
              MY STORE
            </div>

            {/* Product Title */}
            <div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight">
                {product.title}
              </h1>
              
              {/* Pricing */}
              {selectedVariant && (
                <div className="flex items-center gap-4 mb-8">
                  {selectedVariant.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) && (
                    <>
                      <span className="font-sans text-xl text-muted-foreground line-through">
                        Rs. {parseFloat(selectedVariant.compareAtPrice.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <Badge variant="destructive" className="font-sans text-sm px-3 py-1">
                        sale
                      </Badge>
                    </>
                  )}
                  <span className="font-sans text-2xl md:text-3xl font-bold text-foreground">
                    Rs. {parseFloat(selectedVariant.price.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>

            {/* Options Selection (Size, etc.) */}
            {options.map((option) => (
              <div key={option.id} className="space-y-4">
                <label className="block font-sans text-base font-semibold text-foreground">
                  {option.name}
                </label>
                <div className="flex flex-wrap gap-3">
                  {option.values.map((value) => {
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
                  })}
                </div>
              </div>
            ))}

            {/* Quantity Selection */}
            <div className="space-y-4">
              <label className="block font-sans text-base font-semibold text-foreground">
                Quantity
              </label>
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
                  disabled={quantity >= 10}
                  className="h-12 w-12 rounded-full border-2"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale || cartLoading}
                className="w-full font-sans text-lg font-semibold py-4 h-14 bg-background text-foreground border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                variant="outline"
              >
                {cartLoading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-3 h-6 w-6" />
                    {selectedVariant?.availableForSale ? 'Add to cart' : 'Out of Stock'}
                  </>
                )}
              </Button>

              <Button
                onClick={handleBuyNow}
                disabled={!selectedVariant?.availableForSale || cartLoading || isBuyingNow}
                className="w-full font-sans text-lg font-semibold py-4 h-14 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
              >
                {isBuyingNow ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-3 h-6 w-6" />
                    Buy it now
                  </>
                )}
              </Button>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="pt-8 border-t">
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
        <div className="mb-8">
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <Skeleton className="w-full h-96 rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-24 rounded" />
              ))}
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-16 w-3/4 mb-6" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
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
