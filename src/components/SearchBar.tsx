import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "urql";
import { GET_PRODUCTS } from "@/lib/shopify";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onClose?: () => void;
}

const SearchBar = ({ 
  className = "", 
  placeholder = "Search products...",
  onClose 
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      first: 6,
      query: debouncedTerm.length > 2 ? `title:*${debouncedTerm}* OR tag:*${debouncedTerm}*` : ""
    },
    pause: debouncedTerm.length <= 2
  });

  const { data: searchData, fetching: searchLoading } = searchResult;
  const searchResults = searchData?.products?.edges || [];

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (term: string) => {
    if (term.trim()) {
      navigate(`/store?search=${encodeURIComponent(term.trim())}`);
      setIsOpen(false);
      setSearchTerm("");
      onClose?.();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleProductClick = (handle: string) => {
    navigate(`/store/products/${handle}`);
    setIsOpen(false);
    setSearchTerm("");
    onClose?.();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 bg-background/50 border-border focus:bg-background"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setIsOpen(false);
            }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && searchTerm.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {searchLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Searching...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="p-2 border-b border-border">
                <p className="text-xs text-muted-foreground">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </p>
              </div>
              {searchResults.map(({ node: product }) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.handle)}
                  className="w-full p-3 text-left hover:bg-muted/50 border-b border-border/50 last:border-b-0 flex items-center gap-3"
                >
                  {product.images?.edges?.[0]?.node?.url && (
                    <img
                      src={product.images.edges[0].node.url}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.priceRange?.minVariantPrice?.amount && 
                        `₹${parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString('en-IN')}`
                      }
                    </p>
                  </div>
                </button>
              ))}
              <button
                onClick={() => handleSearch(searchTerm)}
                className="w-full p-3 text-center text-sm text-craft-terracotta hover:bg-muted/50 border-t border-border"
              >
                View all results for "{searchTerm}"
              </button>
            </>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No products found for "{searchTerm}"
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate('/store')}
                className="text-craft-terracotta p-0 h-auto"
              >
                Browse all products
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
