import React from 'react';
import ReactDOM from 'react-dom/client';
import { createClient, Provider, fetchExchange } from 'urql';
import { CartProvider } from './contexts/CartContext.tsx';
import App from './App.tsx';
import './index.css';

// Client-side Shopify configuration
const shopifyUrl = `/shopify/api/2024-01/graphql.json`;

const client = createClient({
  url: shopifyUrl,
  exchanges: [
    fetchExchange // Use the fetchExchange to customize fetch behavior
  ],
  fetchOptions: () => {
    return {
      // This ensures that all requests, including queries, are sent as POST
      preferGetMethod: false,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN || '',
      }
    };
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider value={client}>
      <CartProvider>
        <App />
      </CartProvider>
    </Provider>
  </React.StrictMode>
);
