import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart, Package, Loader2 } from 'lucide-react';
import OptimizedLazyImage from '@/components/OptimizedLazyImage';
import CartActions from '@/components/CartActions';
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
                <CartActions 
                  key={line.id} 
                  line={line}
                  onQuantityChange={handleQuantityChange}
                  onRemove={removeFromCart}
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

export default Cart;
