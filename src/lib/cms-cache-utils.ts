// CMS Cache Invalidation Utilities
// NOTE: These functions are ONLY for React Query CMS data, NOT for urql GraphQL queries
import { useQueryClient } from '@tanstack/react-query';

/**
 * CMS Cache Invalidation Utilities
 * These work with React Query's cache system for CMS data (Sanity)
 * 
 * IMPORTANT: This is ONLY for CMS data (Sanity)
 * For GraphQL data (Shopify), use urql cache utilities from '@/lib/cache-utils'
 */

/**
 * Hook to get CMS cache invalidation functions
 * Use this in components that need to invalidate CMS data
 */
export const useCMSCache = () => {
  const queryClient = useQueryClient();

  return {
    /**
     * Invalidate all journal posts
     */
    invalidateJournalPosts: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-posts'] });
    },

    /**
     * Invalidate journal preview
     */
    invalidateJournalPreview: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-preview'] });
    },

    /**
     * Invalidate specific journal post by slug
     */
    invalidateJournalPost: (slug: string) => {
      queryClient.invalidateQueries({ queryKey: ['journal-post', slug] });
    },

    /**
     * Invalidate all CMS data
     */
    invalidateAllCMS: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-posts'] });
      queryClient.invalidateQueries({ queryKey: ['journal-preview'] });
    },

    /**
     * Force refresh all CMS data
     */
    refreshAllCMS: () => {
      queryClient.refetchQueries({ queryKey: ['journal-posts'] });
      queryClient.refetchQueries({ queryKey: ['journal-preview'] });
    },
  };
};

/**
 * Direct CMS cache invalidation functions
 * Use these when you don't have access to the hook
 */
export const createCMSCacheInvalidator = (queryClient: any) => ({
  invalidateJournalPosts: () => {
    queryClient.invalidateQueries({ queryKey: ['journal-posts'] });
  },
  invalidateJournalPreview: () => {
    queryClient.invalidateQueries({ queryKey: ['journal-preview'] });
  },
  invalidateJournalPost: (slug: string) => {
    queryClient.invalidateQueries({ queryKey: ['journal-post', slug] });
  },
  invalidateAllCMS: () => {
    queryClient.invalidateQueries({ queryKey: ['journal-posts'] });
    queryClient.invalidateQueries({ queryKey: ['journal-preview'] });
  },
});
