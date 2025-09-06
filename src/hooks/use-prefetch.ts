import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export interface PrefetchOptions {
  enabled?: boolean;
  staleTime?: number;
}

export const usePrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchCollections = useCallback((options: PrefetchOptions = {}) => {
    const { enabled = true, staleTime = 5 * 60 * 1000 } = options;

    if (!enabled) return;

    queryClient.prefetchQuery({
      queryKey: ['collections', { first: 10 }],
      queryFn: async () => {
        // This will be handled by urql, but we set up the cache structure
        return null;
      },
      staleTime,
    });
  }, [queryClient]);

  const prefetchProducts = useCallback((
    filters: any,
    searchQuery: string,
    options: PrefetchOptions = {}
  ) => {
    const { enabled = true, staleTime = 2 * 60 * 1000 } = options;

    if (!enabled) return;

    const queryKey = ['products', {
      first: 24,
      sortKey: 'CREATED_AT',
      filters,
      searchQuery
    }];

    queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        // This will be handled by urql, but we set up the cache structure
        return null;
      },
      staleTime,
    });
  }, [queryClient]);

  const prefetchProduct = useCallback((
    handle: string,
    options: PrefetchOptions = {}
  ) => {
    const { enabled = true, staleTime = 10 * 60 * 1000 } = options;

    if (!enabled) return;

    queryClient.prefetchQuery({
      queryKey: ['product', handle],
      queryFn: async () => {
        // This will be handled by urql
        return null;
      },
      staleTime,
    });
  }, [queryClient]);

  const invalidateCollections = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['collections'] });
  }, [queryClient]);

  const invalidateProducts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }, [queryClient]);

  return {
    prefetchCollections,
    prefetchProducts,
    prefetchProduct,
    invalidateCollections,
    invalidateProducts,
  };
};
