import { useQuery } from 'urql';
import { GET_SHOP_INFO, GET_PRODUCTS_SIMPLE } from '@/lib/shopify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const ShopifyDebug: React.FC = () => {
  const [shopResult] = useQuery({
    query: GET_SHOP_INFO,
  });

  const [productsResult] = useQuery({
    query: GET_PRODUCTS_SIMPLE,
    variables: { first: 1 },
  });

  const { data: shopData, fetching: shopFetching, error: shopError } = shopResult;
  const { data: productsData, fetching: productsFetching, error: productsError } = productsResult;
  
  const fetching = shopFetching || productsFetching;
  const error = shopError || productsError;
  const data = shopData || productsData;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Shopify API Test
          {fetching && <Loader2 className="w-4 h-4 animate-spin" />}
          {error && <XCircle className="w-4 h-4 text-red-500" />}
          {data && !error && <CheckCircle className="w-4 h-4 text-green-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fetching && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Testing Shopify API connection...</p>
          </div>
        )}
        
        {error && (
          <div className="space-y-2">
            <Badge variant="destructive">Connection Failed</Badge>
            <p className="text-sm text-red-600">{error.message}</p>
            <details className="text-xs">
              <summary className="cursor-pointer">Technical Details</summary>
              <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shopData && !shopError && (
            <div className="space-y-2">
              <Badge variant="default" className="bg-green-500">Shop Info Loaded</Badge>
              <div className="text-sm">
                <p><strong>Store Name:</strong> {shopData.shop?.name}</p>
                <p><strong>Domain:</strong> {shopData.shop?.primaryDomain?.url}</p>
                <p><strong>Description:</strong> {shopData.shop?.description || 'No description available'}</p>
              </div>
            </div>
          )}
          
          {productsData && !productsError && (
            <div className="space-y-2">
              <Badge variant="default" className="bg-green-500">Products API Working</Badge>
              <div className="text-sm">
                <p><strong>Products Available:</strong> {productsData.products?.edges?.length || 0}</p>
                {productsData.products?.edges?.[0]?.node && (
                  <p><strong>Sample Product:</strong> {productsData.products.edges[0].node.title}</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p><strong>API URL:</strong> /shopify/api/2024-01/graphql.json</p>
          <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
          <p><strong>Has Token:</strong> {import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN ? 'Yes' : 'No'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopifyDebug;
