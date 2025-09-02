import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Minus, Plus, Trash2, Loader2, Package } from 'lucide-react';
import OptimizedLazyImage from '@/components/OptimizedLazyImage';
import { formatCurrency } from '@/lib/utils';
import { getSmartObjectPosition } from '@/lib/image-utils';

interface CartProps {
  children?: React.ReactNode;
}

const Cart: React.FC<CartProps> = ({ children }) => {
  const { cart, updateCartLine, removeFromCart, getCartItemCount, checkout, isLoading } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const itemCount = getCartItemCount();
  const cartLines = cart?.lines?.edges?.map(({ node }) => node) || [];
  const subtotal = cart?.cost?.subtotalAmount;

  // Calculate discount information
  const calculateDiscountInfo = () => {
    let subtotalCompareAtPrice = 0;
    let subtotalActualPrice = 0;
    let totalDiscount = 0;
    let currencyCode = 'INR';

    cartLines.forEach((line) => {
      const variant = line.merchandise;
      const quantity = line.quantity;
      const actualPrice = parseFloat(variant.price.amount);
      const compareAtPrice = variant.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : actualPrice;
      
      subtotalCompareAtPrice += compareAtPrice * quantity;
      subtotalActualPrice += actualPrice * quantity;
      currencyCode = variant.price.currencyCode;
    });

    totalDiscount = subtotalCompareAtPrice - subtotalActualPrice;

    return {
      subtotalCompareAtPrice,
      subtotalActualPrice,
      totalDiscount,
      currencyCode
    };
  };

  const discountInfo = calculateDiscountInfo();

  // Don't open sheet if we're on the cart page
  const isOnCartPage = location.pathname === '/cart';

  const handleQuantityChange = async (lineId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeFromCart(lineId);
    } else {
      await updateCartLine(lineId, newQuantity);
    }
  };

  const handleCheckout = () => {
    checkout();
    setOpen(false);
  };

  const handleViewCart = () => {
    navigate('/cart');
    setOpen(false);
  };

  return (
    <Sheet open={open && !isOnCartPage} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {itemCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md flex flex-col h-[100dvh] max-h-[100dvh] p-0 cart-drawer-content">
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0 border-b bg-background p-4 sm:p-6">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart
            </SheetTitle>
            <SheetDescription>
              {itemCount === 0 
                ? "Your cart is empty" 
                : `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`
              }
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Cart Items - Scrollable area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
          {cartLines.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button
                onClick={() => {
                  if (!location.pathname.startsWith('/store')) {
                    navigate('/store');
                  }
                  setOpen(false);
                }}
                variant="outline"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartLines.map((line) => (
                <CartLineItem 
                  key={line.id} 
                  line={line}
                  onQuantityChange={handleQuantityChange}
                  onRemove={() => removeFromCart(line.id)}
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer - Fixed at bottom */}
        {cartLines.length > 0 && (
          <div className="flex-shrink-0 border-t bg-background p-4 sm:p-6 space-y-4 cart-footer">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Subtotal:</span>
              <span>
                {formatCurrency(discountInfo.subtotalCompareAtPrice.toString(), discountInfo.currencyCode)}
              </span>
            </div>
            
            {/* Discount */}
            {discountInfo.totalDiscount > 0 && (
              <div className="flex justify-between items-center text-base">
                <span className="text-muted-foreground">Discount:</span>
                <span className="text-green-600 font-semibold">
                  -{formatCurrency(discountInfo.totalDiscount.toString(), discountInfo.currencyCode)}
                </span>
              </div>
            )}
            
            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>
                {formatCurrency(discountInfo.subtotalActualPrice.toString(), discountInfo.currencyCode)}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Checkout Button */}
              <Button 
                onClick={handleCheckout}
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </Button>

              {/* View Cart Button */}
              <Button 
                onClick={handleViewCart}
                variant="outline"
                className="w-full"
                size="lg"
              >
                View Cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

interface CartLineItemProps {
  line: any;
  onQuantityChange: (lineId: string, quantity: number) => void;
  onRemove: () => void;
  isLoading: boolean;
}

const CartLineItem: React.FC<CartLineItemProps> = ({ 
  line, 
  onQuantityChange, 
  onRemove, 
  isLoading 
}) => {
  const product = line.merchandise.product;
  const variant = line.merchandise;
  const image = product.images.edges[0]?.node;

  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 sm:gap-4 py-3 sm:py-4 border-b cart-item-compact items-center">
      {/* Column 1: Product Image */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 cart-item-image">
        {image ? (
          <OptimizedLazyImage
            src={image.url}
            alt={image.altText || product.title}
            context="cart-item"
            className="w-full h-full object-cover transition-transform duration-300"
            placeholderClassName="w-full h-full"
            productTitle={product.title}
            productType={product.productType}
            productTags={product.tags}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-sm">
            <Package className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>

      {/* Column 2: Product Name and Variant Info */}
      <div className="min-w-0 col-span-2 sm:col-span-1">
        <h4 className="font-medium text-sm sm:text-base text-foreground truncate">{product.title}</h4>
        {variant.title !== 'Default Title' && (
          <p className="text-sm text-gray-500">{variant.title}</p>
        )}
      </div>

      {/* Column 3: Compare at Price and Price */}
      <div className="text-center col-span-1 sm:col-span-1">
        <div className="text-xs sm:text-sm">
          {variant.compareAtPrice && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount) ? (
            <p className="text-muted-foreground line-through">
              {formatCurrency(variant.compareAtPrice.amount, variant.compareAtPrice.currencyCode)}
            </p>
          ) : (
            <div className="h-4"></div>
          )}
          <p className="font-semibold text-foreground">
            {formatCurrency(variant.price.amount, variant.price.currencyCode)}
          </p>
        </div>
      </div>

      {/* Column 4: Quantity Controls - Full width on mobile, normal on desktop */}
      <div className="col-span-4 sm:col-span-1 flex items-center gap-1 sm:gap-2 cart-quantity-controls justify-center sm:justify-center mt-3 sm:mt-0">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8"
          onClick={() => onQuantityChange(line.id, line.quantity - 1)}
          disabled={isLoading}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <Select
          value={line.quantity.toString()}
          onValueChange={(value) => onQuantityChange(line.id, parseInt(value))}
          disabled={isLoading}
        >
          <SelectTrigger className="w-14 sm:w-16 h-7 sm:h-8 text-xs sm:text-sm">
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
          className="h-7 w-7 sm:h-8 sm:w-8"
          onClick={() => onQuantityChange(line.id, line.quantity + 1)}
          disabled={isLoading}
        >
          <Plus className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-700 hover:bg-red-50 ml-1 sm:ml-2"
          onClick={onRemove}
          disabled={isLoading}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default Cart;
