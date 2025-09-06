import React from 'react';
import ReactDOM from 'react-dom/client';
import { createClient, Provider, fetchExchange, cacheExchange } from 'urql';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './components/CartProvider';
import App from './App.tsx';
import './index.css';

// Client-side Shopify configuration
const shopifyUrl = `/shopify/api/2024-01/graphql.json`;

const client = createClient({
  url: shopifyUrl,
  exchanges: [
    cacheExchange, // urql's default cache exchange
    fetchExchange // Use the fetchExchange to customize fetch behavior
  ],
  fetchOptions: () => {
    return {
      // This ensures that all requests, including queries, are sent as POST
      preferGetMethod: false,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN || '',
        // Add cache-busting for collection queries
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    };
  },
});

// React Query configuration for enhanced caching and perceived performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      // Refetch data in background every 5 minutes
      refetchInterval: 5 * 60 * 1000,
      // Enable background refetching when window regains focus
      refetchOnWindowFocus: true,
      // Keep previous data while fetching new data (stale-while-revalidate)
      keepPreviousData: true,
      // Retry failed requests
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
    },
    mutations: {
      // Optimistic updates
      onError: (error, variables, context) => {
        // Handle optimistic update errors
        console.error('Mutation error:', error);
      },
    },
  },
});

// Export client for cache invalidation
export { client };

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider value={client}>
        <CartProvider>
          <App />
        </CartProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
