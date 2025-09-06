import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Trash2, Loader2, Package } from 'lucide-react';
import { formatCurrency, capitalizeWords, titleToHandle } from '@/lib/utils';
import { CartLine } from '@/lib/shopify';
import { useCartStore } from '@/stores';
import OptimizedLazyImage from '@/components/OptimizedLazyImage';

// Action status type for cart operations
type CartActionStatus = 'idle' | 'updating' | 'removing' | 'success';

interface CartLineItemProps {
  line: CartLine;
  index?: number;
  compact?: boolean; // For cart drawer vs page differences
  showLink?: boolean; // For navigation in cart page vs drawer
}

const CartLineItem: React.FC<CartLineItemProps> = ({
  line,
  index = 0,
  compact = true,
  showLink = false
}) => {
  const [actionStatus, setActionStatus] = useState<CartActionStatus>('idle');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Get cart store functions and state
  const { updateCartLine, removeFromCart, isLoading } = useCartStore();

  // Computed property to check if any action is processing
  const isProcessing = actionStatus !== 'idle' || isLoading;

  // Entrance animation with staggered timing
  useEffect(() => {
    const delay = index * 100; // 100ms delay between each item
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [index]);

  const handleQuantityChange = async (lineId: string, newQuantity: number) => {
    if (isProcessing || newQuantity < 1) return; // Extra safeguard

    setActionStatus('updating');
    try {
      await updateCartLine(lineId, newQuantity);
      // Show success state briefly
      setActionStatus('success');
      setTimeout(() => setActionStatus('idle'), 500);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      setActionStatus('idle');
    }
  };

  const handleRemove = async (lineId: string) => {
    if (isProcessing) return; // Extra safeguard

    setActionStatus('removing');
    try {
      await removeFromCart(lineId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setActionStatus('idle');
    }
  };

  const handleProductClick = () => {
    navigate(`/store/products/${titleToHandle(product.title)}`);
  };

  const product = line.merchandise.product;
  const variant = line.merchandise;
  const image = product.images.edges[0]?.node;

  const gapClass = compact ? 'gap-1.5 sm:gap-2' : 'gap-3 sm:gap-4';
  const paddingClass = compact ? 'py-1.5 sm:py-2' : 'py-3 sm:py-4';
  const marginClass = compact ? 'mt-1.5 sm:mt-0' : 'mt-3 sm:mt-0';
  const spacerHeight = compact ? 'h-2' : 'h-4';

  const ProductInfo = () => (
    <div
      className={`min-w-0 col-span-2 sm:col-span-1 cursor-pointer rounded-sm ${compact ? 'p-0.5' : 'p-1'} transition-all duration-200 group`}
      onClick={handleProductClick}
    >
      <h4 className="font-medium text-sm sm:text-base text-foreground truncate group-hover:text-primary group-hover:font-semibold transition-all duration-200">
        {capitalizeWords(product.title)}
      </h4>
      {variant.title !== 'Default Title' && (
        <p className={`text-gray-500 group-hover:text-muted-foreground transition-colors duration-200 ${compact ? 'text-sm' : 'text-sm sm:text-base'}`}>
          {capitalizeWords(variant.title)}
        </p>
      )}
    </div>
  );

  return (
    <div
      className={`grid grid-cols-4 sm:grid-cols-4 ${gapClass} ${paddingClass} border-b cart-item-compact items-center transition-all duration-300 ease-in-out ${
        actionStatus === 'removing'
          ? 'opacity-0 transform -translate-y-2 scale-95 pointer-events-none'
          : actionStatus === 'success'
            ? 'bg-green-50/50 border-green-200/50'
            : isVisible
              ? 'opacity-100 transform translate-y-0 scale-100'
              : 'opacity-0 transform translate-y-1 scale-98'
      }`}
    >
      {/* Column 1: Product Image */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 cart-item-image">
        {image ? (
          showLink ? (
            <OptimizedLazyImage
              src={image.url}
              alt={image.altText || product.title}
              context="cart-item"
              className="w-full h-full object-cover transition-transform duration-300"
              placeholderClassName="w-full h-full"
              productTitle={product.title}
            />
          ) : (
            <img
              src={image.url}
              alt={image.altText || product.title}
              className="w-full h-full object-cover transition-transform duration-300"
            />
          )
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-sm">
            <Package className={`text-gray-400 ${compact ? 'w-4 h-4' : 'w-6 h-6'}`} />
          </div>
        )}
      </div>

      {/* Column 2: Product Name and Variant Info */}
      {showLink ? (
        <Link to={`/store/products/${titleToHandle(product.title)}`} className="min-w-0 col-span-2 sm:col-span-1 hover:opacity-80 transition-opacity">
          <h4 className="font-medium text-sm sm:text-base text-foreground truncate">{product.title}</h4>
          {variant.title !== 'Default Title' && (
            <p className="text-xs sm:text-sm text-gray-500">{variant.title}</p>
          )}
        </Link>
      ) : (
        <ProductInfo />
      )}

      {/* Column 3: Compare at Price and Price */}
      <div className="text-center col-span-1 sm:col-span-1">
        <div className={`text-xs sm:text-sm ${compact ? '' : 'sm:text-base'}`}>
          {variant.compareAtPrice && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount) ? (
            <p className="text-muted-foreground line-through">
              {formatCurrency(variant.compareAtPrice.amount, variant.compareAtPrice.currencyCode)}
            </p>
          ) : (
            <div className={spacerHeight}></div>
          )}
          <p className="font-semibold text-foreground">
            {formatCurrency(variant.price.amount, variant.price.currencyCode)}
          </p>
        </div>
      </div>

      {/* Column 4: Quantity Controls with State-Driven UI Locking */}
      <div className={`col-span-4 sm:col-span-1 flex items-center ${compact ? 'gap-0.5 sm:gap-1' : 'gap-1 sm:gap-2'} cart-quantity-controls justify-center sm:justify-center ${marginClass}`}>
        <Button
          variant="outline"
          size="icon"
          className={`h-7 w-7 sm:h-8 sm:w-8 transition-all duration-200 ${
            actionStatus === 'success'
              ? 'scale-110 bg-green-100 border-green-300 text-green-700'
              : isProcessing
                ? 'scale-95 opacity-75'
                : 'scale-100 opacity-100 hover:scale-105 hover:shadow-sm'
          }`}
          onClick={() => handleQuantityChange(line.id, line.quantity - 1)}
          disabled={isProcessing}
        >
          {actionStatus === 'updating' ? (
            <Loader2 className={`animate-spin ${compact ? 'h-3 w-3' : 'h-3 w-3'}`} />
          ) : actionStatus === 'success' ? (
            <Minus className={`text-green-700 ${compact ? 'h-3 w-3' : 'h-3 w-3'}`} />
          ) : (
            <Minus className={` ${compact ? 'h-3 w-3' : 'h-3 w-3'}`} />
          )}
        </Button>

        <Select
          value={line.quantity.toString()}
          onValueChange={(value) => handleQuantityChange(line.id, parseInt(value))}
          disabled={isProcessing}
        >
          <SelectTrigger className={`w-14 sm:w-16 h-7 sm:h-8 ${compact ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm'}`}>
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

        <Button
          variant="outline"
          size="icon"
          className={`h-7 w-7 sm:h-8 sm:w-8 transition-all duration-200 ${
            actionStatus === 'success'
              ? 'scale-110 bg-green-100 border-green-300 text-green-700'
              : isProcessing
                ? 'scale-95 opacity-75'
                : 'scale-100 opacity-100 hover:scale-105 hover:shadow-sm'
          }`}
          onClick={() => handleQuantityChange(line.id, line.quantity + 1)}
          disabled={isProcessing}
        >
          {actionStatus === 'updating' ? (
            <Loader2 className={`animate-spin ${compact ? 'h-3 w-3' : 'h-3 w-3'}`} />
          ) : actionStatus === 'success' ? (
            <Plus className={`text-green-700 ${compact ? 'h-3 w-3' : 'h-3 w-3'}`} />
          ) : (
            <Plus className={` ${compact ? 'h-3 w-3' : 'h-3 w-3'}`} />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-700 hover:bg-red-50 ${compact ? 'ml-1 sm:ml-2' : 'ml-1 sm:ml-2'} transition-all duration-200 ${
            actionStatus === 'removing' ? 'scale-90 opacity-75' : 'scale-100 opacity-100 hover:scale-105'
          }`}
          onClick={() => handleRemove(line.id)}
          disabled={isProcessing}
        >
          {actionStatus === 'removing' ? (
            <Loader2 className={`animate-spin text-red-600 ${compact ? 'h-3 w-3' : 'h-3 w-3'}`} />
          ) : (
            <Trash2 className={` ${compact ? 'h-3 w-3' : 'h-3 w-3'}`} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default CartLineItem;
