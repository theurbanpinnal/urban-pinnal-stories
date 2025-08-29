import { createRoot } from 'react-dom/client';
import { Provider, createClient, cacheExchange, fetchExchange, createRequest } from 'urql';
import App from './App.tsx';
import './index.css';

// Shopify configuration is now handled by the serverless proxy
// No need to expose tokens in the frontend

const client = createClient({
  url: `/shopify/api/2024-01/graphql.json`,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => ({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  // Force POST requests and prevent query in URL
  requestPolicy: 'cache-and-network',
});

createRoot(document.getElementById("root")!).render(
  <Provider value={client}>
    <App />
  </Provider>
);