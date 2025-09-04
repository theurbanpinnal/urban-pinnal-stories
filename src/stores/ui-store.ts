import { create } from 'zustand';
import type { UIStore } from './types';

export const useUIStore = create<UIStore>()((set) => ({
  // Initial state
  isCartOpen: false,
  isSearchOpen: false,
  isFilterOpen: false,
  isPageLoading: false,

  // Actions
  setCartOpen: (open: boolean) => {
    set({ isCartOpen: open });
  },

  setSearchOpen: (open: boolean) => {
    set({ isSearchOpen: open });
  },

  setFilterOpen: (open: boolean) => {
    set({ isFilterOpen: open });
  },

  setPageLoading: (loading: boolean) => {
    set({ isPageLoading: loading });
  },
}));
