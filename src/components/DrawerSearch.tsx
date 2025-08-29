import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "urql";
import { GET_PRODUCTS } from "@/lib/shopify";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DrawerSearchProps {
  className?: string;
}

const DrawerSearch = ({ className = "" }: DrawerSearchProps) => {
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

  // Search products when debounced term changes with enhanced search
  const [searchResult] = useQuery({
    query: GET_PRODUCTS,
    variables: { 
      first: 10,
      query: debouncedTerm.length > 2 ? `title:*${debouncedTerm}* OR tag:*${debouncedTerm}* OR vendor:*${debouncedTerm}* OR product_type:*${debouncedTerm}*` : "",
      sortKey: 'RELEVANCE'
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

  // Auto-focus input when drawer opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure the drawer animation has started
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("relative", className)}
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 tracking-wide">
              SEARCH
            </h2>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
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
          <div className="flex-1 overflow-y-auto">
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
                                  {product.productType && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      {product.productType}
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
        </SheetContent>
      </Sheet>
    </>
  );
};

export default DrawerSearch;
