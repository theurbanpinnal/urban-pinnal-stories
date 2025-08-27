import { createRoot } from 'react-dom/client'
import { Provider } from 'urql'
import { createClient } from 'urql'
import App from './App.tsx'
import './index.css'

// Configure URQL client for Shopify Storefront API
const client = createClient({
  url: `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
  fetchOptions: () => {
    return {
      headers: {
        'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN,
      },
    };
  },
});

createRoot(document.getElementById("root")!).render(
  <Provider value={client}>
    <App />
  </Provider>
);
