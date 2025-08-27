import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import LazyImage from '@/components/LazyImage';

interface CartProps {
  children?: React.ReactNode;
}

const Cart: React.FC<CartProps> = ({ children }) => {
  const { cart, updateCartLine, removeFromCart, getCartItemCount, checkout, isLoading } = useCart();
  const [open, setOpen] = useState(false);

  const itemCount = getCartItemCount();
  const cartLines = cart?.lines?.edges?.map(({ node }) => node) || [];
  const subtotal = cart?.cost?.subtotalAmount;

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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
      
      <SheetContent className="w-full sm:max-w-md">
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

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6">
            {cartLines.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Button onClick={() => setOpen(false)} variant="outline">
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

          {/* Cart Footer */}
          {cartLines.length > 0 && (
            <div className="border-t pt-6 space-y-4">
              {/* Subtotal */}
              {subtotal && (
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Subtotal:</span>
                  <span>
                    {subtotal.currencyCode === 'USD' ? '$' : subtotal.currencyCode}
                    {parseFloat(subtotal.amount).toFixed(2)}
                  </span>
                </div>
              )}
              
              <p className="text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              
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
            </div>
          )}
        </div>
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
    <div className="flex gap-4 py-4 border-b">
      {/* Product Image */}
      <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded border">
        {image ? (
          <LazyImage
            src={image.url}
            alt={image.altText || product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{product.title}</h4>
        {variant.title !== 'Default Title' && (
          <p className="text-sm text-gray-500">{variant.title}</p>
        )}
        <p className="text-sm font-medium text-gray-900">
          {variant.price.currencyCode === 'USD' ? '$' : variant.price.currencyCode}
          {parseFloat(variant.price.amount).toFixed(2)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
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
            <SelectTrigger className="w-16 h-8">
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
            className="h-8 w-8"
            onClick={() => onQuantityChange(line.id, line.quantity + 1)}
            disabled={isLoading}
          >
            <Plus className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
            onClick={onRemove}
            disabled={isLoading}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
