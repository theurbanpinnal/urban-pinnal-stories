import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "urql";
import { GET_PRODUCTS } from "@/lib/shopify";
import { cn } from "@/lib/utils";

interface HamburgerSearchProps {
  className?: string;
}

const HamburgerSearch = ({ className = "" }: HamburgerSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search products when debounced term changes
  const [searchResult] = useQuery({
    query: GET_PRODUCTS,
    variables: { 
      first: 8,
      query: debouncedTerm.length > 2 ? `title:*${debouncedTerm}* OR tag:*${debouncedTerm}*` : ""
    },
    pause: debouncedTerm.length <= 2
  });

  const { data: searchData, fetching: searchLoading } = searchResult;
  const searchResults = searchData?.products?.edges || [];

  // Focus input when menu opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm("");
    setDebouncedTerm("");
  };

  const handleSearch = (term: string) => {
    if (term.trim()) {
      navigate(`/store?search=${encodeURIComponent(term.trim())}`);
      handleClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  const handleProductClick = (handle: string) => {
    navigate(`/store/products/${handle}`);
    handleClose();
  };

  return (
    <>
      {/* Search Icon Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className={cn("relative", className)}
        aria-label="Open search"
      >
        <Search className="w-5 h-5" />
      </Button>

      {/* Full Screen Search Overlay */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-white"
          onClick={(e) => {
            if (e.target === overlayRef.current) {
              handleClose();
            }
          }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 tracking-wide">
                SEARCH
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Search Input */}
            <div className="p-6">
              <div className="relative max-w-md mx-auto">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full h-12 px-4 text-base border border-gray-300 rounded-full focus:border-gray-400 focus:ring-0 bg-gray-50"
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto px-6">
              <div className="max-w-2xl mx-auto">
                {searchTerm.length > 2 ? (
                  <>
                    {searchLoading ? (
                      <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-6 h-6 animate-spin mr-3 text-gray-400" />
                        <span className="text-gray-500">Searching...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        <div className="mb-6">
                          <p className="text-sm text-gray-500">
                            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          {searchResults.map(({ node: product }) => (
                            <button
                              key={product.id}
                              onClick={() => handleProductClick(product.handle)}
                              className="w-full p-4 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-all duration-200 text-left"
                            >
                              <div className="flex gap-4">
                                {product.images?.edges?.[0]?.node?.url && (
                                  <img
                                    src={product.images.edges[0].node.url}
                                    alt={product.title}
                                    className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">
                                    {product.title}
                                  </h3>
                                  {product.priceRange?.minVariantPrice?.amount && (
                                    <p className="text-sm font-semibold text-gray-700">
                                      ₹{parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString('en-IN')}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="text-center mt-8">
                          <Button
                            onClick={() => handleSearch(searchTerm)}
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            View all results
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-16">
                        <p className="text-gray-500 mb-4">
                          No results found for "{searchTerm}"
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => navigate('/store')}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Browse all products
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-gray-400">
                      Start typing to search for products...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HamburgerSearch;
