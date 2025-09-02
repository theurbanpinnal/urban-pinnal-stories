import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Minus, Plus, Trash2, Loader2, ArrowLeft, Package, Truck, Shield, AlertTriangle, Edit3, Check } from 'lucide-react';
import OptimizedLazyImage from '@/components/OptimizedLazyImage';
import { formatCurrency } from '@/lib/utils';
import { getSmartObjectPosition } from '@/lib/image-utils';
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
  const [selectedUrgencyMessage, setSelectedUrgencyMessage] = useState<number | null>(null);
  const hasInitializedMessage = useRef(false);

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

  // Initialize urgency message on first load (randomize once)
  useEffect(() => {
    if (!hasInitializedMessage.current && cartLines.length > 0) {
      // Check if we have a stored message
      const storedMessageIndex = localStorage.getItem('cart_urgency_message_index');
      
      if (storedMessageIndex !== null) {
        // Use stored message
        setSelectedUrgencyMessage(parseInt(storedMessageIndex));
      } else {
        // Randomize and store new message
        const randomIndex = Math.floor(Math.random() * urgencyMessages.length);
        setSelectedUrgencyMessage(randomIndex);
        localStorage.setItem('cart_urgency_message_index', randomIndex.toString());
      }
      
      hasInitializedMessage.current = true;
    }
    
    // Clear stored message when cart becomes empty
    if (cartLines.length === 0) {
      localStorage.removeItem('cart_urgency_message_index');
      setSelectedUrgencyMessage(null);
      hasInitializedMessage.current = false;
    }
  }, [cartLines.length, urgencyMessages.length]);

  // Rotate messages every 30 seconds (only for empty cart and trust messages)
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

  // Use selected urgency message or fallback to rotating message
  const urgencyMessage = selectedUrgencyMessage !== null 
    ? urgencyMessages[selectedUrgencyMessage] 
    : urgencyMessages[currentMessageIndex];

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
              <span className="text-2xl">{urgencyMessage.icon}</span>
              <div className="flex-1">
                <p className="font-sans text-sm font-medium text-yellow-800">
                  {urgencyMessage.text} We'll keep it for you for <span className="font-bold">{formatTime(timeLeft)}</span> minutes.
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

                {/* Trust Indicators */}
                <div className="space-y-3">
                  {/* Large screens: Show all trust indicators */}
                  <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4">
                    {trustMessages.map((message, index) => (
                      <div key={index} className="flex items-center gap-3 font-sans text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{message}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Small screens: Show rotating trust indicator */}
                  <div className="lg:hidden flex items-center gap-3 font-sans text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>{currentTrustMessage}</span>
                  </div>
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
                    
                    {/* Subtotal (Compare at Price) */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center font-sans text-lg">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-semibold">
                          {formatCurrency(discountInfo.subtotalCompareAtPrice.toString(), discountInfo.currencyCode)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Discount */}
                    {discountInfo.totalDiscount > 0 && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center font-sans text-lg">
                          <span className="text-muted-foreground">Discount:</span>
                          <span className="font-semibold text-green-600">
                            -{formatCurrency(discountInfo.totalDiscount.toString(), discountInfo.currencyCode)}
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
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center font-sans text-xl font-bold">
                        <span>TOTAL:</span>
                        <span>{formatCurrency(discountInfo.subtotalActualPrice.toString(), discountInfo.currencyCode)}</span>
                      </div>
                      <p className="font-sans text-xs text-muted-foreground mt-1">
                        Tax included and shipping calculated at checkout
                      </p>
                    </div>
                    
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
          <p className="text-xs sm:text-sm text-gray-500">{variant.title}</p>
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

export default CartPage;
