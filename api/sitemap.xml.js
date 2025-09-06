// Helper function to convert title to URL-friendly handle
function titleToHandle(title) {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

export default async function handler(req, res) {
  try {
    const shopifyDomain = process.env.VITE_SHOPIFY_STORE_DOMAIN;
    const storefrontApiToken = process.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN;

    if (!shopifyDomain || !storefrontApiToken) {
      return res.status(500).json({ error: 'Missing environment variables' });
    }

    const shopifyApiUrl = `https://${shopifyDomain}/api/2024-01/graphql.json`;

    // GraphQL queries for sitemap data
    const GET_PRODUCTS_FOR_SITEMAP = `
      query getProductsForSitemap($first: Int!) {
        products(first: $first) {
          edges {
            node {
              title
              handle
              updatedAt
            }
          }
        }
      }
    `;

    const GET_COLLECTIONS_FOR_SITEMAP = `
      query getCollectionsForSitemap($first: Int!) {
        collections(first: $first) {
          edges {
            node {
              handle
              updatedAt
            }
          }
        }
      }
    `;

    // Fetch products and collections
    const [productsResponse, collectionsResponse] = await Promise.all([
      fetch(shopifyApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontApiToken,
        },
        body: JSON.stringify({
          query: GET_PRODUCTS_FOR_SITEMAP,
          variables: { first: 250 }
        }),
      }),
      fetch(shopifyApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontApiToken,
        },
        body: JSON.stringify({
          query: GET_COLLECTIONS_FOR_SITEMAP,
          variables: { first: 50 }
        }),
      }),
    ]);

    const productsData = await productsResponse.json();
    const collectionsData = await collectionsResponse.json();

    const products = productsData.data?.products?.edges?.map(({ node }) => node) || [];
    const collections = collectionsData.data?.collections?.edges?.map(({ node }) => node) || [];

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/store', priority: '0.9', changefreq: 'daily' },
      { url: '/our-story', priority: '0.8', changefreq: 'monthly' },
      { url: '/craft', priority: '0.8', changefreq: 'monthly' },
      { url: '/artisans', priority: '0.8', changefreq: 'monthly' },
      { url: '/journal', priority: '0.7', changefreq: 'weekly' },
      { url: '/contact', priority: '0.6', changefreq: 'monthly' },
      { url: '/faq', priority: '0.6', changefreq: 'monthly' },
      { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
      { url: '/terms', priority: '0.3', changefreq: 'yearly' },
      { url: '/shipping', priority: '0.5', changefreq: 'monthly' },
    ];

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>https://theurbanpinnal.com${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  
  ${products.map(product => `
  <url>
    <loc>https://theurbanpinnal.com/store/products/${titleToHandle(product.title)}</loc>
    <lastmod>${new Date(product.updatedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  
  ${collections.map(collection => `
  <url>
    <loc>https://theurbanpinnal.com/store?collection=${encodeURIComponent(collection.handle)}</loc>
    <lastmod>${new Date(collection.updatedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.status(200).send(sitemap);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}
