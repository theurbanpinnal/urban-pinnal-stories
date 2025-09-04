// Export all stores
export { useCartStore } from './cart-store';
export { useFilterStore } from './filter-store';
export { useSearchStore } from './search-store';
export { useUIStore } from './ui-store';

// Export types
export type {
  CartState,
  CartStore,
  FilterState,
  FilterStore,
  SearchState,
  SearchStore,
  UIState,
  UIStore,
  FilterOptions,
  SortOption,
} from './types';

// Debug helpers for browser console
if (typeof window !== 'undefined') {
  // Simple localStorage helpers
  (window as any).clearCartStorage = () => {
    localStorage.removeItem('shopify_cart_id');
    localStorage.removeItem('zustand-cart-storage');
    console.log('🗑️ Cart storage cleared! Refresh the page to see changes.');
  };

  (window as any).inspectCartStorage = () => {
    const cartId = localStorage.getItem('shopify_cart_id');
    const cartData = localStorage.getItem('zustand-cart-storage');
    console.log('🛒 Cart Storage:', { cartId, cartData: cartData ? JSON.parse(cartData) : null });
  };
}
