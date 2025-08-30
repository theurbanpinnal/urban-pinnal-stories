import { createRoot } from 'react-dom/client';
import { Provider, createClient, cacheExchange, fetchExchange, createRequest } from 'urql';
import App from './App.tsx';
import './index.css';

const storeDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN;

// Check if we're in development or production
const isDevelopment = import.meta.env.DEV;

const client = createClient({
  url: `/shopify/api/2024-01/graphql.json`,  // Use proxy URL for both dev and prod
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => ({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      
      // Include token in development (Vite proxy handles it)
      ...(isDevelopment && storefrontToken && {
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      }),
    },
  }),
  requestPolicy: 'cache-and-network',
  suspense: false,
});

createRoot(document.getElementById("root")!).render(
  <Provider value={client}>
    <App />
  </Provider>
);
