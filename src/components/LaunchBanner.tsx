import { Link } from "react-router-dom";
import { X, Sparkles } from "lucide-react";
import { useState } from "react";

const LaunchBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <>
      {/* Custom CSS for scrolling animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative bg-gradient-to-r from-craft-terracotta via-craft-clay to-craft-terracotta text-craft-ivory overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-craft-ivory/10 to-transparent animate-pulse"></div>
      
      {/* Running text container */}
      <div className="relative py-2 px-4">
        {/* Desktop: Centered static text */}
        <div className="hidden md:flex items-center justify-center gap-2 animate-pulse">
          <Sparkles className="w-4 h-4 text-craft-ivory animate-spin" />
          <Link 
            to="/store" 
            className="block text-center hover:text-craft-gold transition-colors duration-300"
          >
            <div className="flex items-center justify-center gap-4 text-base font-medium">
              <span>🎉 LAUNCH SPECIAL: UPTO 20% OFF Everything!</span>
              <span>•</span>
              <span>Free Shipping on Orders ₹1999+</span>
              <span>•</span>
              <span>Shop Now!</span>
            </div>
          </Link>
          <Sparkles className="w-4 h-4 text-craft-ivory animate-spin" />
        </div>

        {/* Mobile: Rolling/scrolling text */}
        <div className="md:hidden relative overflow-hidden">
          <div className="flex items-center gap-4 text-sm font-medium animate-scroll">
            <Link 
              to="/store" 
              className="block hover:text-craft-gold transition-colors duration-300 whitespace-nowrap"
            >
              <span>🎉 LAUNCH SPECIAL: UPTO 20% OFF Everything!</span>
            </Link>
            <span className="text-craft-gold">•</span>
            <Link 
              to="/store" 
              className="block hover:text-craft-gold transition-colors duration-300 whitespace-nowrap"
            >
              <span>Free Shipping on Orders ₹1999+</span>
            </Link>
            <span className="text-craft-gold">•</span>
            <Link 
              to="/store" 
              className="block hover:text-craft-gold transition-colors duration-300 whitespace-nowrap"
            >
              <span>Shop Now!</span>
            </Link>
            {/* Duplicate content for seamless loop */}
            <Link 
              to="/store" 
              className="block hover:text-craft-gold transition-colors duration-300 whitespace-nowrap"
            >
              <span>🎉 LAUNCH SPECIAL: UPTO 20% OFF Everything!</span>
            </Link>
            <span className="text-craft-gold">•</span>
            <Link 
              to="/store" 
              className="block hover:text-craft-gold transition-colors duration-300 whitespace-nowrap"
            >
              <span>Free Shipping on Orders ₹1999+</span>
            </Link>
            <span className="text-craft-gold">•</span>
            <Link 
              to="/store" 
              className="block hover:text-craft-gold transition-colors duration-300 whitespace-nowrap"
            >
              <span>Shop Now!</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-craft-ivory/70 hover:text-craft-ivory transition-colors p-1"
        aria-label="Close banner"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Animated border */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-craft-gold to-transparent animate-pulse"></div>
    </div>
    </>
  );
};

export default LaunchBanner;
