import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "urql";
import { SEARCH_PRODUCTS } from "@/lib/shopify";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import OptimizedLazyImage from "@/components/OptimizedLazyImage";
import { formatCurrency } from "@/lib/utils";

interface DrawerSearchProps {
  className?: string;
}

const DrawerSearch = ({ className = "" }: DrawerSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search products when debounced term changes with enhanced search
  const [searchResult] = useQuery({
    query: SEARCH_PRODUCTS,
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
      
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col h-[100dvh] max-h-[100dvh] p-0 cart-drawer-content">
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0 border-b bg-background p-4 sm:p-6">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Products
            </SheetTitle>
            <SheetDescription>
              Find exactly what you're looking for
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Search Input - Fixed below header */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b bg-background">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full h-12 pl-10 pr-4 text-base border-border focus:border-primary focus:ring-0 bg-background"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search Results - Scrollable area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
          {searchTerm.length > 2 ? (
            <>
              {searchLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin mr-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {searchResults.map(({ node: product }) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.handle)}
                        className="w-full p-4 bg-background border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-all duration-200 text-left group"
                      >
                        <div className="flex gap-4">
                          {product.images?.edges?.[0]?.node?.url ? (
                            <div className="w-14 h-14 flex-shrink-0 cart-item-image">
                              <OptimizedLazyImage
                                src={product.images.edges[0].node.url}
                                alt={product.title}
                                context="search-result"
                                className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                                placeholderClassName="w-full h-full rounded-lg"
                                productTitle={product.title}
                                productType={product.productType}
                                productTags={product.tags}
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              <Search className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                              {product.title}
                            </h3>
                            {product.priceRange?.minVariantPrice?.amount && (
                              <p className="text-sm font-semibold text-foreground">
                                {formatCurrency(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                              </p>
                            )}
                            {product.productType && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {product.productType}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No results found for "{searchTerm}"
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/store')}
                    className="border-border text-foreground hover:bg-muted"
                  >
                    Browse all products
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Start typing to search for products...
              </p>
            </div>
          )}
        </div>

        {/* Footer - Fixed at bottom (only show when there are results) */}
        {searchTerm.length > 2 && searchResults.length > 0 && (
          <div className="flex-shrink-0 border-t bg-background p-4 sm:p-6 cart-footer">
            <Button
              onClick={() => handleSearch(searchTerm)}
              className="w-full"
              size="lg"
            >
              View all results ({searchResults.length})
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default DrawerSearch;
