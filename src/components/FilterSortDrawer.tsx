import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getBrowserCapabilities, showInstagramBrowserWarning } from '@/lib/instagram-browser-detection';
import CustomScroll from '@/components/CustomScroll';

export type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'alphabetical' | 'best-selling';

export interface FilterOptions {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  availability: 'all' | 'in-stock';
}

interface FilterSortDrawerProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCategories: string[];
  productCount?: number;
  onClearAllFilters?: () => void;
  searchQuery?: string;
  onClearSearch?: () => void;
  className?: string;
}

const FilterSortDrawer: React.FC<FilterSortDrawerProps> = ({
  sortBy,
  onSortChange,
  filters,
  onFiltersChange,
  availableCategories,
  productCount,
  onClearAllFilters,
  searchQuery,
  onClearSearch,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [browserCapabilities, setBrowserCapabilities] = useState(() => getBrowserCapabilities());
  const [useFallbackUI, setUseFallbackUI] = useState(false);

  // Detect browser capabilities and show warning if needed
  useEffect(() => {
    const capabilities = getBrowserCapabilities();
    setBrowserCapabilities(capabilities);
    
    if (capabilities.isInstagram) {
      setUseFallbackUI(true);
      showInstagramBrowserWarning();
    }
  }, []);

  // Memoize static options to prevent unnecessary re-renders
  const sortOptions = useMemo(() => [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'best-selling', label: 'Best Selling' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'alphabetical', label: 'Alphabetical' },
  ], []);

  const availabilityOptions = useMemo(() => [
    { value: 'all', label: 'All Products' },
    { value: 'in-stock', label: 'In Stock' },
  ], []);

  // Enhanced touch event handling for Instagram browser compatibility
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (browserCapabilities.isInstagram) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [browserCapabilities.isInstagram]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (browserCapabilities.isInstagram) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [browserCapabilities.isInstagram]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleCategoryChange = useCallback((category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      categories: newCategories,
    });
  }, [filters, onFiltersChange]);

  const handlePriceRangeChange = useCallback((field: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value) || 0;
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [field]: numValue,
      },
    });
  }, [filters, onFiltersChange]);

  const clearFilters = useCallback(() => {
    onFiltersChange({
      categories: [],
      priceRange: { min: 0, max: 10000 },
      availability: 'all',
    });
    // Also clear collection filters if the function is provided
    if (onClearAllFilters) {
      onClearAllFilters();
    }
  }, [onFiltersChange, onClearAllFilters]);

  // Memoize active filters count calculation
  const activeFiltersCount = useMemo(() => 
    filters.categories.length + 
    (filters.availability !== 'all' ? 1 : 0) +
    (filters.priceRange.min > 0 || filters.priceRange.max < 10000 ? 1 : 0),
    [filters]
  );

  return (
    <div className={className}>
      {/* Desktop Filter Controls */}
      <div className="hidden md:flex items-center gap-4 mb-6">
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="z-[100000]">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter & Sort
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh] z-[99999]">
            <DrawerHeader>
              <div className="flex items-center justify-between">
                <DrawerTitle>Filter & Sort Products</DrawerTitle>
                <DrawerClose asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-12 w-12 touch-manipulation"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Sort Section */}
              <div>
                <h3 className="font-semibold mb-3">Sort By</h3>
                <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100000]">
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {availableCategories.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No categories available</p>
                  ) : (
                    availableCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2 py-2">
                      <Checkbox
                        id={category}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(category, checked as boolean)
                        }
                        className="h-5 w-5 touch-manipulation"
                      />
                      <Label htmlFor={category} className="capitalize text-base cursor-pointer touch-manipulation">
                        {category}
                      </Label>
                    </div>
                    ))
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                    className="w-20 px-2 py-1 border rounded text-sm"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                    className="w-20 px-2 py-1 border rounded text-sm"
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="font-semibold mb-3">Availability</h3>
                <Select 
                  value={filters.availability} 
                  onValueChange={(value) => 
                    onFiltersChange({
                      ...filters,
                      availability: value as FilterOptions['availability'],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100000]">
                    {availabilityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters} 
                  className="w-full h-12 text-base touch-manipulation"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </DrawerContent>
        </Drawer>
        
        {productCount !== undefined && (
          <div className="text-sm text-muted-foreground">
            <span>{productCount} product{productCount !== 1 ? 's' : ''}</span>
          </div>
        )}
        
        {/* Clear Search Button - shown when there's a search query */}
        {searchQuery && searchQuery.trim() && onClearSearch && (
          <Button 
            variant="ghost" 
            onClick={onClearSearch} 
            className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground h-12 px-4 touch-manipulation"
          >
            <X className="h-4 w-4" />
            Clear Search
          </Button>
        )}
        
        {/* Clear Filters Button - shown when filters are active */}
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            onClick={clearFilters} 
            className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground h-12 px-4 touch-manipulation"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Mobile Filter/Sort Button */}
      <div className="md:hidden mb-6">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{
                minHeight: browserCapabilities.isInstagram ? '48px' : 'auto',
                fontSize: browserCapabilities.isInstagram ? '16px' : '14px',
                touchAction: browserCapabilities.isInstagram ? 'manipulation' : 'auto'
              }}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filter & Sort
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[90vh] z-[99999]">
            <DrawerHeader>
              <div className="flex items-center justify-between">
                <DrawerTitle>Filter & Sort</DrawerTitle>
                <DrawerClose asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-12 w-12 touch-manipulation"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>
            <CustomScroll 
              className="p-6 space-y-6"
              smooth={true}
              momentum={!browserCapabilities.isInstagram}
              scrollbarStyle="thin"
              enableTouch={true}
              enableWheel={true}
            >
              {/* Sort Section */}
              <div>
                <h3 className="font-semibold mb-3">Sort By</h3>
                <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100000]">
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {availableCategories.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No categories available</p>
                  ) : (
                    availableCategories.map((category) => (
                      <div 
                        key={category} 
                        className="flex items-center space-x-2 py-2"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        style={{
                          minHeight: browserCapabilities.isInstagram ? '48px' : 'auto',
                          padding: browserCapabilities.isInstagram ? '12px 0' : '8px 0'
                        }}
                      >
                        <Checkbox
                          id={`mobile-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={(checked) => 
                            handleCategoryChange(category, checked as boolean)
                          }
                          className="h-5 w-5 touch-manipulation"
                          style={{
                            minHeight: browserCapabilities.isInstagram ? '24px' : '20px',
                            minWidth: browserCapabilities.isInstagram ? '24px' : '20px',
                            fontSize: browserCapabilities.isInstagram ? '16px' : '14px'
                          }}
                        />
                        <Label 
                          htmlFor={`mobile-${category}`} 
                          className="capitalize text-base cursor-pointer touch-manipulation"
                          style={{
                            fontSize: browserCapabilities.isInstagram ? '16px' : '14px',
                            lineHeight: browserCapabilities.isInstagram ? '24px' : '20px'
                          }}
                        >
                          {category}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                    className="w-20 px-2 py-1 border rounded text-sm"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    style={{
                      minHeight: browserCapabilities.isInstagram ? '48px' : 'auto',
                      fontSize: browserCapabilities.isInstagram ? '16px' : '14px',
                      padding: browserCapabilities.isInstagram ? '12px 8px' : '8px',
                      touchAction: browserCapabilities.isInstagram ? 'manipulation' : 'auto'
                    }}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                    className="w-20 px-2 py-1 border rounded text-sm"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    style={{
                      minHeight: browserCapabilities.isInstagram ? '48px' : 'auto',
                      fontSize: browserCapabilities.isInstagram ? '16px' : '14px',
                      padding: browserCapabilities.isInstagram ? '12px 8px' : '8px',
                      touchAction: browserCapabilities.isInstagram ? 'manipulation' : 'auto'
                    }}
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="font-semibold mb-3">Availability</h3>
                <Select 
                  value={filters.availability} 
                  onValueChange={(value) => 
                    onFiltersChange({
                      ...filters,
                      availability: value as FilterOptions['availability'],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100000]">
                    {availabilityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Search */}
              {searchQuery && searchQuery.trim() && onClearSearch && (
                <Button 
                  variant="outline" 
                  onClick={onClearSearch} 
                  className="w-full h-12 text-base touch-manipulation"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    minHeight: browserCapabilities.isInstagram ? '48px' : '48px',
                    fontSize: browserCapabilities.isInstagram ? '16px' : '16px',
                    touchAction: browserCapabilities.isInstagram ? 'manipulation' : 'auto'
                  }}
                >
                  Clear Search
                </Button>
              )}

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters} 
                  className="w-full h-12 text-base touch-manipulation"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    minHeight: browserCapabilities.isInstagram ? '48px' : '48px',
                    fontSize: browserCapabilities.isInstagram ? '16px' : '16px',
                    touchAction: browserCapabilities.isInstagram ? 'manipulation' : 'auto'
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </CustomScroll>
          </DrawerContent>
        </Drawer>
        
        {productCount !== undefined && (
          <div className="mt-3 text-sm text-muted-foreground text-center">
            <span>{productCount} product{productCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSortDrawer;
