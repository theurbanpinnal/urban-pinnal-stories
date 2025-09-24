import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '@/stores';
import { useCartCalculations } from '@/hooks/use-cart-calculations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart, Loader2 } from 'lucide-react';
import OptimizedLazyImage from '@/components/OptimizedLazyImage';
import CartLineItem from '@/components/CartLineItem';
import CustomScroll from '@/components/CustomScroll';
import { formatCurrency } from '@/lib/utils';

interface CartProps {
  children?: React.ReactNode;
}

const Cart: React.FC<CartProps> = ({ children }) => {
  const { cart, updateCartLine, removeFromCart, getCartItemCount, checkout, isLoading } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const itemCount = getCartItemCount();
  const { subtotalCompareAtPrice, subtotalActualPrice, totalDiscount, currencyCode, cartLines } = useCartCalculations(cart);

  // Don't open sheet if we're on the cart page
  const isOnCartPage = location.pathname === '/cart';


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
      
      <SheetContent className="w-full sm:max-w-xl lg:max-w-2xl flex flex-col h-[100dvh] max-h-[100dvh] p-0 cart-drawer-content">
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0 border-b bg-background p-2 sm:p-3">
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
        <CustomScroll 
          className="flex-1 p-2 sm:p-3"
          smooth={true}
          momentum={true}
          scrollbarStyle="thin"
          enableTouch={true}
          enableWheel={true}
        >
          {cartLines.length === 0 ? (
            <div className="text-center py-4 sm:py-6">
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
                            <div className="space-y-2">
                  {cartLines.map((line, index) => (
                    <div
                      key={line.id}
                      className="transition-all duration-300 ease-out"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'slideInFromBottom 0.4s ease-out forwards'
                      }}
                    >
                      <CartLineItem
                        line={line}
                        index={index}
                        compact={true}
                        showLink={false}
                      />
                    </div>
                  ))}
                </div>
          )}
        </CustomScroll>

        {/* Cart Footer - Fixed at bottom */}
        {cartLines.length > 0 && (
          <div className="flex-shrink-0 border-t bg-background p-2 sm:p-3 space-y-2 cart-footer">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Subtotal:</span>
              <span>
                {formatCurrency(subtotalCompareAtPrice.toString(), currencyCode)}
              </span>
            </div>
            
            {/* Discount */}
            {totalDiscount > 0 && (
              <div className="flex justify-between items-center text-base">
                <span className="text-muted-foreground">Discount:</span>
                <span className="text-green-600 font-semibold">
                  -{formatCurrency(totalDiscount.toString(), currencyCode)}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>
                {formatCurrency(subtotalActualPrice.toString(), currencyCode)}
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
