import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Minus, Plus, Trash2, Loader2, ArrowLeft, Package, Truck, Shield, AlertTriangle, Edit3, Check } from 'lucide-react';
import OptimizedLazyImage from '@/components/OptimizedLazyImage';
import CartLineItem from '@/components/CartLineItem';
import { useCartCalculations } from '@/hooks/use-cart-calculations';
import { formatCurrency } from '@/lib/utils';
import { getSmartObjectPosition } from '@/lib/image-utils';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const CartPage: React.FC = () => {
  const { cart, updateCartLine, removeFromCart, getCartItemCount, checkout, isLoading } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [selectedUrgencyMessage, setSelectedUrgencyMessage] = useState<number | null>(null);
  const hasInitializedMessage = useRef(false);

  const itemCount = getCartItemCount();
  const { subtotalCompareAtPrice, subtotalActualPrice, totalDiscount, currencyCode, cartLines } = useCartCalculations(cart);

  // Rotating urgency messages
  const urgencyMessages = [
    {
      icon: "🏺",
      text: "This artisan piece carries the stories of generations",
      time: "10 minutes"
    },
    {
      icon: "🌿",
      text: "A unique creation from skilled Tamil Nadu craftswomen awaits",
      time: "10 minutes"
    },
    {
      icon: "💫",
      text: "Support rural artisans - this handcrafted treasure is ready for you",
      time: "10 minutes"
    },
    {
      icon: "🎨",
      text: "Your cart holds a piece of Tamil Nadu's rich heritage",
      time: "10 minutes"
    },
    {
      icon: "✨",
      text: "This carefully crafted item reflects the skill of master artisans",
      time: "10 minutes"
    }
  ];

  // Empty cart messages
  const emptyCartMessages = [
    "Discover handcrafted treasures from Tamil Nadu artisans",
    "Explore authentic craftsmanship from rural villages",
    "Find meaningful pieces crafted by skilled women artisans",
    "Each piece tells a story of tradition and craftsmanship",
    "Support local artisans with every purchase",
    "Explore sustainable luxury handmade with care",
    "Every item is unique - just like you",
    "Quality craftsmanship meets contemporary design",
    "From our artisans to your home",
    "Celebrate Indian heritage through modern design"
  ];

  // Trust indicator messages
  const trustMessages = [
    "Authentic Tamil Nadu Craftsmanship",
    "Fair Wages for Rural Artisans",
    "Sustainable Heritage Preservation",
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
                  {cartLines.map((line, index) => (
                    <CartLineItem
                      key={line.id}
                      line={line}
                      index={index}
                      compact={false}
                      showLink={true}
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
                          {formatCurrency(subtotalCompareAtPrice.toString(), currencyCode)}
                        </span>
                      </div>
                    </div>

                    {/* Discount */}
                    {totalDiscount > 0 && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center font-sans text-lg">
                          <span className="text-muted-foreground">Discount:</span>
                          <span className="font-semibold text-green-600">
                            -{formatCurrency(totalDiscount.toString(), currencyCode)}
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
                        <span>{formatCurrency(subtotalActualPrice.toString(), currencyCode)}</span>
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


export default CartPage;
