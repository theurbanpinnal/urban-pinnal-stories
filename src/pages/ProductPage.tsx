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
import { ArrowLeft, ShoppingCart, Loader2 } from 'lucide-react';
import LazyImage from '@/components/LazyImage';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { formatCurrency } from '@/lib/utils';

const ProductPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { addToCart, isLoading: cartLoading } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const [result] = useQuery({
    query: GET_PRODUCT_BY_HANDLE,
    variables: { handle: handle || '' },
    pause: !handle,
  });

  const { data, fetching, error } = result;

  if (fetching) return <ProductPageSkeleton />;
  
  if (error || !data?.productByHandle) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been moved.</p>
          <Button onClick={() => navigate('/store')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
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
  
  // Set default variant if none selected
  if (!selectedVariantId && variants.length > 0) {
    setSelectedVariantId(variants[0].id);
  }

  const selectedVariant = variants.find(variant => variant.id === selectedVariantId);
  const currentImage = images[selectedImageIndex];

  const handleAddToCart = async () => {
    if (!selectedVariantId) {
      alert('Please select a variant');
      return;
    }
    
    await addToCart(selectedVariantId, quantity);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/store')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Store
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              {currentImage ? (
                <LazyImage
                  src={currentImage.url}
                  alt={currentImage.altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No Image Available</span>
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
                    className={`aspect-square overflow-hidden rounded border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <LazyImage
                      src={image.url}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              
              {selectedVariant && (
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="secondary" className="text-xl font-bold px-4 py-2">
                    {formatCurrency(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
                  </Badge>
                  {!selectedVariant.availableForSale && (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
              )}
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="prose prose-gray max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: product.descriptionHtml || product.description 
                  }} 
                />
              </div>
            )}

            {/* Variant Selection */}
            {variants.length > 1 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Variant
                </label>
                <Select value={selectedVariantId} onValueChange={setSelectedVariantId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {variants.map((variant) => (
                      <SelectItem 
                        key={variant.id} 
                        value={variant.id}
                        disabled={!variant.availableForSale}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span>{variant.title}</span>
                          <span className="ml-2 font-medium">
                            {formatCurrency(variant.price.amount, variant.price.currencyCode)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <Select 
                value={quantity.toString()} 
                onValueChange={(value) => setQuantity(parseInt(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add to Cart Button */}
            <Card>
              <CardContent className="p-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.availableForSale || cartLoading}
                  className="w-full text-lg py-3"
                  size="lg"
                >
                  {cartLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const ProductPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square" />
              ))}
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-24" />
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;
