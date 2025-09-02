import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Minus, Plus, Trash2, Loader2, ArrowLeft, Package, Truck, Shield, AlertTriangle, Edit3, Check } from 'lucide-react';
import LazyImage from '@/components/LazyImage';
import { formatCurrency } from '@/lib/utils';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const CartPage: React.FC = () => {
  const { cart, updateCartLine, removeFromCart, getCartItemCount, checkout, isLoading } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const itemCount = getCartItemCount();
  const cartLines = cart?.lines?.edges?.map(({ node }) => node) || [];
  const subtotal = cart?.cost?.subtotalAmount;

  // Rotating urgency messages
  const urgencyMessages = [
    {
      icon: "🔥",
      text: "Hot item alert! Someone just added this to their cart. Secure yours now!",
      time: "10 minutes"
    },
    {
      icon: "⚡",
      text: "Quick! Another customer is viewing this item. Don't miss out!",
      time: "10 minutes"
    },
    {
      icon: "🎯",
      text: "Limited stock alert! This item is in high demand. Reserve yours!",
      time: "10 minutes"
    },
    {
      icon: "💎",
      text: "Exclusive offer! This handmade piece won't last long. Grab it now!",
      time: "10 minutes"
    },
    {
      icon: "🌟",
      text: "Popular choice! This artisan creation is flying off the shelves!",
      time: "10 minutes"
    },
    {
      icon: "🏆",
      text: "Best seller alert! Everyone loves this piece. Get yours before it's gone!",
      time: "10 minutes"
    },
    {
      icon: "✨",
      text: "Handcrafted beauty! This unique piece deserves a home. Make it yours!",
      time: "10 minutes"
    },
    {
      icon: "🎨",
      text: "Artisan masterpiece! This one-of-a-kind creation is waiting for you!",
      time: "10 minutes"
    },
    {
      icon: "💫",
      text: "Trending now! This piece is getting lots of attention. Don't wait!",
      time: "10 minutes"
    },
    {
      icon: "🎁",
      text: "Perfect gift alert! Someone else might gift this first. Secure it!",
      time: "10 minutes"
    },
    {
      icon: "🌿",
      text: "Sustainable luxury! This eco-friendly piece is in demand. Act fast!",
      time: "10 minutes"
    },
    {
      icon: "🏺",
      text: "Heritage craft! This traditional piece is disappearing fast!",
      time: "10 minutes"
    },
    {
      icon: "🎪",
      text: "Showstopper alert! This piece is stealing the show. Claim it!",
      time: "10 minutes"
    },
    {
      icon: "💎",
      text: "Premium quality! This artisan piece is worth every penny. Get it!",
      time: "10 minutes"
    },
    {
      icon: "🌟",
      text: "Customer favorite! This piece has glowing reviews. Join the fans!",
      time: "10 minutes"
    }
  ];

  // Empty cart messages
  const emptyCartMessages = [
    "Discover our handcrafted collection of artisan treasures",
    "Each piece tells a story of tradition and craftsmanship",
    "Support local artisans with every purchase",
    "Find the perfect gift for someone special",
    "Explore sustainable luxury handmade with care",
    "Join thousands of happy customers worldwide",
    "Every item is unique - just like you",
    "Quality craftsmanship meets contemporary design",
    "From our artisans to your home",
    "Celebrate Indian heritage through modern design"
  ];

  // Trust indicator messages
  const trustMessages = [
    "Secure Shopping Guarantee",
    "100% Handmade by Artisans",
    "Free Shipping on Orders Over ₹2000",
    "30-Day Return Policy",
    "Ethically Sourced Materials",
    "Supporting Local Communities",
    "Eco-Friendly Packaging",
    "Fair Trade Practices",
    "Quality Assured",
    "Made with Love"
  ];

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Rotate messages every 30 seconds
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % urgencyMessages.length);
    }, 30000); // 30 seconds

    return () => clearInterval(messageTimer);
  }, [urgencyMessages.length]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentMessage = urgencyMessages[currentMessageIndex];
  const currentEmptyMessage = emptyCartMessages[currentMessageIndex % emptyCartMessages.length];
  const currentTrustMessage = trustMessages[currentMessageIndex % trustMessages.length];

  const handleQuantityChange = async (lineId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeFromCart(lineId);
    } else {
      await updateCartLine(lineId, newQuantity);
    }
  };

  const handleCheckout = () => {
    checkout();
  };

  const handleContinueShopping = () => {
    navigate('/store');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/store')}
            className="font-sans text-base text-muted-foreground hover:text-foreground transition-colors duration-300 mb-4"
          >
            <ArrowLeft className="mr-3 h-5 w-5" />
            Back to Store
          </Button>
          
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-foreground" />
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
              YOUR CART
            </h1>
            {itemCount > 0 && (
              <Badge variant="outline" className="text-lg px-3 py-1">
                {itemCount} item{itemCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>

        {/* Urgency Banner */}
        {cartLines.length > 0 && timeLeft > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentMessage.icon}</span>
              <div className="flex-1">
                <p className="font-sans text-sm font-medium text-yellow-800">
                  {currentMessage.text} We'll keep it for you for <span className="font-bold">{formatTime(timeLeft)}</span> minutes.
                </p>
              </div>
            </div>
          </div>
        )}

        {cartLines.length === 0 ? (
          // Empty cart - full width centered layout
          <div className="flex justify-center items-center min-h-[60vh] w-full">
            <div className="text-center py-16 bg-muted/20 rounded-lg w-full max-w-2xl mx-4">
              <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Your cart is empty
              </h2>
              <p className="font-sans text-muted-foreground max-w-2xl mx-auto mb-6">
                {currentEmptyMessage}
              </p>
              <Button
                onClick={handleContinueShopping}
                className="font-sans text-lg px-8 py-3"
                size="lg"
              >
                Start Shopping
              </Button>
            </div>
          </div>
        ) : (
          // Cart with items - grid layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
                  Cart Items
                </h2>
                {/* Cart Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 py-3 border-b font-sans font-medium text-sm text-muted-foreground">
                  <div className="col-span-4">PRODUCT</div>
                  <div className="col-span-2 text-center">PRICE</div>
                  <div className="col-span-2 text-center">QUANTITY</div>
                  <div className="col-span-2 text-center">TOTAL</div>
                  <div className="col-span-2"></div>
                </div>

                {/* Cart Items */}
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

                {/* Additional Comments */}
                <div className="bg-muted/20 rounded-lg p-6">
                  <label className="block font-sans text-base font-semibold text-foreground mb-3">
                    Additional Comments
                  </label>
                  <Textarea
                    placeholder="Special instruction for seller..."
                    value={additionalComments}
                    onChange={(e) => setAdditionalComments(e.target.value)}
                    className="min-h-[100px] resize-none font-sans"
                  />
                </div>

                {/* Secure Shopping Guarantee */}
                <div className="flex items-center gap-3 font-sans text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>{currentTrustMessage}</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            {cartLines.length > 0 && (
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <div className="bg-muted/20 rounded-lg p-6 space-y-6">
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                      ORDER SUMMARY
                    </h2>
                    
                    {/* Subtotal */}
                    {subtotal && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center font-sans text-lg">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span className="font-semibold">
                            {formatCurrency(subtotal.amount, subtotal.currencyCode)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Coupon Code */}
                    <div className="space-y-2">
                      <label className="block font-sans text-sm font-medium text-foreground">
                        Coupon Code
                      </label>
                      <Input
                        placeholder="Enter Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full font-sans"
                      />
                      <p className="font-sans text-xs text-muted-foreground">
                        Coupon code will be applied on the checkout page
                      </p>
                    </div>
                    
                    {/* Total */}
                    {subtotal && (
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center font-sans text-xl font-bold">
                          <span>TOTAL:</span>
                          <span>{formatCurrency(subtotal.amount, subtotal.currencyCode)}</span>
                        </div>
                        <p className="font-sans text-xs text-muted-foreground mt-1">
                          Tax included and shipping calculated at checkout
                        </p>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button 
                        onClick={handleCheckout}
                        className="w-full font-sans text-lg py-4 h-14 bg-foreground text-background hover:bg-foreground/90"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'PROCEED TO CHECKOUT'
                        )}
                      </Button>
                      
                      <Button 
                        onClick={handleContinueShopping}
                        variant="outline"
                        className="w-full font-sans text-base py-3 border-2"
                      >
                        CONTINUE SHOPPING
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
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
    <div className="grid grid-cols-12 gap-4 py-4 border-b items-center">
      {/* Product */}
      <div className="col-span-4 md:col-span-4 flex gap-4">
        <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded border">
          {image ? (
            <LazyImage
              src={image.url}
              alt={image.altText || product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-xs">No Image</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-sans font-medium text-base text-foreground truncate">{product.title}</h3>
          {variant.title !== 'Default Title' && (
            <div className="flex items-center gap-2 mt-1">
              <p className="font-sans text-sm text-muted-foreground">{variant.title}</p>
              <Edit3 className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="col-span-2 text-center">
        <div className="font-sans text-sm">
          <p className="text-muted-foreground line-through">
            {formatCurrency((parseFloat(variant.price.amount) * 1.17).toString(), variant.price.currencyCode)}
          </p>
          <p className="font-semibold text-foreground">
            {formatCurrency(variant.price.amount, variant.price.currencyCode)}
          </p>
        </div>
      </div>

      {/* Quantity */}
      <div className="col-span-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onQuantityChange(line.id, line.quantity - 1)}
            disabled={isLoading}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <span className="w-8 text-center font-sans font-medium">{line.quantity}</span>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onQuantityChange(line.id, line.quantity + 1)}
            disabled={isLoading}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Total */}
      <div className="col-span-2 text-center">
        <p className="font-sans font-semibold text-foreground">
          {formatCurrency(
            (parseFloat(variant.price.amount) * line.quantity).toString(),
            variant.price.currencyCode
          )}
        </p>
      </div>

      {/* Remove */}
      <div className="col-span-2 text-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
