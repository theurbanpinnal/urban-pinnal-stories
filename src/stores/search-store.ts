import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SearchStore } from './types';

const MAX_HISTORY_ITEMS = 10;

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      // Initial state
      searchQuery: '',
      searchHistory: [],
      searchResults: [],
      isLoading: false,

      // Actions
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      addToHistory: (query: string) => {
        if (!query.trim()) return;

        set((state) => {
          const filteredHistory = state.searchHistory.filter(item => item !== query);
          const newHistory = [query, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
          return { searchHistory: newHistory };
        });
      },

      clearHistory: () => {
        set({ searchHistory: [] });
      },

      search: async (query: string) => {
        if (!query.trim()) {
          set({ searchResults: [], isLoading: false });
          return;
        }

        set({ isLoading: true });

        try {
          // Add to history immediately
          get().addToHistory(query);

          // Perform search (this would typically call your search API)
          // For now, we'll just simulate a delay
          await new Promise(resolve => setTimeout(resolve, 500));

          // In a real implementation, you would:
          // 1. Call your search API endpoint
          // 2. Update searchResults with the response
          // 3. Handle any errors

          // Placeholder: set empty results for now
          set({ searchResults: [], isLoading: false });
        } catch (error) {
          console.error('Search error:', error);
          set({ searchResults: [], isLoading: false });
        }
      },
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        searchHistory: state.searchHistory,
      }),
    }
  )
);
