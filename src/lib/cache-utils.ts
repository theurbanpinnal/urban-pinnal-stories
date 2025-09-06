// urql Cache Invalidation Utilities
// NOTE: These functions are ONLY for urql GraphQL queries, NOT for React Query CMS data
import { client } from '../main';

/**
 * Proper urql cache invalidation functions
 * These work with urql's cache system, not React Query
 * 
 * IMPORTANT: This is ONLY for GraphQL queries (Shopify data)
 * For CMS data (Sanity), use React Query's invalidateQueries instead
 */

/**
 * Invalidate all product-related GraphQL queries
 * This will force urql to refetch product data on next request
 * 
 * NOTE: This does NOT affect React Query CMS data (journal posts, etc.)
 */
export const invalidateProductCache = () => {
  // In urql, we invalidate by re-executing queries or clearing specific cache entries
  // The most effective way is to use client.reexecuteQuery for specific queries
  
  // Clear all cached queries that match product patterns
  // This forces a fresh fetch on next request
  client.reexecuteQuery({
    query: true, // This will re-execute all active queries
  });
};

/**
 * Invalidate specific GraphQL queries by operation
 * @param operation - The GraphQL operation to invalidate
 */
export const invalidateQuery = (operation: string) => {
  // For specific operations, we can target them more precisely
  client.reexecuteQuery({
    query: (query) => {
      // Check if the query contains the operation we want to invalidate
      return query.query.includes(operation);
    },
  });
};

/**
 * Invalidate product list GraphQL queries
 */
export const invalidateProductsQuery = () => {
  invalidateQuery('getProducts');
  invalidateQuery('searchProducts');
};

/**
 * Invalidate collection GraphQL queries
 */
export const invalidateCollectionsQuery = () => {
  invalidateQuery('getCollections');
  invalidateQuery('getCollectionByHandle');
};

/**
 * Force refresh collections data - useful for production cache issues
 * This completely bypasses cache and fetches fresh data
 */
export const refreshCollectionsData = () => {
  // Clear collections from cache and refetch
  client.reexecuteQuery({
    query: (query) => query.query.includes('getCollections'),
    requestPolicy: 'network-only'
  });
};

/**
 * Invalidate specific product GraphQL query by handle
 * @param handle - Product handle to invalidate
 */
export const invalidateProductByHandle = (handle: string) => {
  invalidateQuery(`productByHandle(handle: "${handle}")`);
};

/**
 * Clear all urql GraphQL cache
 * Use sparingly as this will refetch all GraphQL data
 * 
 * NOTE: This does NOT affect React Query CMS data
 */
export const clearAllCache = () => {
  client.reexecuteQuery({
    query: true,
  });
};

/**
 * Force refresh of all active GraphQL queries
 * This is useful when you want to ensure fresh GraphQL data
 * 
 * NOTE: This does NOT affect React Query CMS data
 */
export const refreshAllQueries = () => {
  client.reexecuteQuery({
    query: true,
  });
};

/**
 * urql Request Policy Options for stale time control
 * Use these with useQuery hook to control GraphQL caching behavior
 */
export const REQUEST_POLICIES = {
  // Always fetch fresh data (bypasses cache)
  CACHE_FIRST: 'cache-first' as const,
  // Use cache if available, otherwise fetch
  CACHE_AND_NETWORK: 'cache-and-network' as const,
  // Always fetch from network
  NETWORK_ONLY: 'network-only' as const,
  // Use cache only, don't fetch
  CACHE_ONLY: 'cache-only' as const,
} as const;

/**
 * Helper to create useQuery options with 2-minute stale time behavior
 * In urql, we achieve this by using cache-and-network policy
 * which will use cache but also fetch fresh data in background
 * 
 * NOTE: This is ONLY for GraphQL queries, not CMS data
 */
export const createStaleTimeOptions = (staleTimeMs: number = 2 * 60 * 1000) => ({
  requestPolicy: REQUEST_POLICIES.CACHE_AND_NETWORK,
  // urql doesn't have direct staleTime, but we can use requestPolicy
  // to achieve similar behavior
});
