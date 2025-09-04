import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FilterStore, FilterOptions, SortOption } from './types';

const DEFAULT_FILTERS: FilterOptions = {
  categories: [],
  priceRange: { min: 0, max: 10000 },
  availability: 'all',
};

const DEFAULT_SORT: SortOption = 'newest';

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => ({
      // Initial state
      filters: DEFAULT_FILTERS,
      sortBy: DEFAULT_SORT,
      searchQuery: '',

      // Actions
      updateFilters: (newFilters: Partial<FilterOptions>) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        }));
      },

      setSortBy: (sortBy: SortOption) => {
        set({ sortBy });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      clearFilters: () => {
        set({
          filters: DEFAULT_FILTERS,
          sortBy: DEFAULT_SORT,
          searchQuery: '',
        });
      },

      syncWithURL: () => {
        if (typeof window === 'undefined') return;

        const urlParams = new URLSearchParams(window.location.search);

        // Sync collection parameter
        const collectionParam = urlParams.get('collection');
        if (collectionParam) {
          set((state) => ({
            filters: {
              ...state.filters,
              categories: [collectionParam]
            }
          }));
        } else {
          set((state) => ({
            filters: {
              ...state.filters,
              categories: []
            }
          }));
        }

        // Sync search parameter
        const searchParam = urlParams.get('search');
        if (searchParam) {
          set({ searchQuery: searchParam });
        } else {
          set({ searchQuery: '' });
        }
      },

      updateURL: () => {
        if (typeof window === 'undefined') return;

        const { filters, searchQuery } = get();
        const urlParams = new URLSearchParams(window.location.search);

        // Update collection parameter
        if (filters.categories.length > 0) {
          urlParams.set('collection', filters.categories[0]);
        } else {
          urlParams.delete('collection');
        }

        // Update search parameter
        if (searchQuery.trim()) {
          urlParams.set('search', searchQuery.trim());
        } else {
          urlParams.delete('search');
        }

        // Update URL without triggering navigation
        const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
        window.history.replaceState({}, '', newUrl);
      },
    }),
    {
      name: 'filter-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        filters: state.filters,
        sortBy: state.sortBy,
      }),
    }
  )
);
