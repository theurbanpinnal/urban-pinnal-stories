import { createRoot } from 'react-dom/client';
import { Provider, createClient, cacheExchange, fetchExchange } from 'urql';
import App from './App.tsx';
import './index.css';

const storeDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN;

if (!storeDomain || !storefrontToken) {
  throw new Error("Shopify environment variables are missing.");
}

const client = createClient({
  url: `/shopify/api/2024-01/graphql.json`,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: {
    headers: {
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <Provider value={client}>
    <App />
  </Provider>
);