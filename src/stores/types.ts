import { ShopifyCart, CartLine } from '@/lib/shopify';

// Filter and Sort Types
export interface FilterOptions {
  categories: string[];
  priceRange: { min: number; max: number };
  availability: 'all' | 'in-stock';
}

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'alphabetical'
  | 'price-low'
  | 'price-high'
  | 'best-selling';

// Cart Store Types
export interface CartState {
  cart: ShopifyCart | null;
  isLoading: boolean;
  error: string | null;
  cartId: string | null;
}

export interface CartStore extends CartState {
  // Actions
  addToCart: (variantId: string, quantity: number) => Promise<boolean>;
  updateCartLine: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  getCartItemCount: () => number;
  checkout: () => void;
  clearCart: () => void;
  loadCart: () => Promise<void>;
  debugCart: () => CartState;
}

// Filter Store Types
export interface FilterState {
  filters: FilterOptions;
  sortBy: SortOption;
  searchQuery: string;
}

export interface FilterStore extends FilterState {
  // Actions
  updateFilters: (filters: Partial<FilterOptions>) => void;
  setSortBy: (sortBy: SortOption) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  syncWithURL: () => void;
  updateURL: () => void;
}

// Search Store Types
export interface SearchState {
  searchQuery: string;
  searchHistory: string[];
  searchResults: any[];
  isLoading: boolean;
}

export interface SearchStore extends SearchState {
  // Actions
  setSearchQuery: (query: string) => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  search: (query: string) => Promise<void>;
}

// UI Store Types
export interface UIState {
  // Modal states
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isFilterOpen: boolean;

  // Loading states
  isPageLoading: boolean;
}

export interface UIStore extends UIState {
  // Actions
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setFilterOpen: (open: boolean) => void;
  setPageLoading: (loading: boolean) => void;
}
