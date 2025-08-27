import { useQuery } from 'urql';
import { Link } from 'react-router-dom';
import { GET_PRODUCTS, ShopifyProduct } from '@/lib/shopify';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import LazyImage from '@/components/LazyImage';
import { formatCurrency } from '@/lib/utils';

interface ProductListProps {
  limit?: number;
}

const ProductList: React.FC<ProductListProps> = ({ limit = 20 }) => {
  const [result] = useQuery({
    query: GET_PRODUCTS,
    variables: { first: limit },
  });

  const { data, fetching, error } = result;

  if (fetching) return <ProductListSkeleton />;
  
  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to Load Products
        </h3>
        <p className="text-gray-600">
          Please check your internet connection and try again.
        </p>
      </div>
    );
  }

  const products = data?.products?.edges?.map(({ node }: { node: ShopifyProduct }) => node) || [];

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Products Available
        </h3>
        <p className="text-gray-600">
          Please check back later for new arrivals.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

interface ProductCardProps {
  product: ShopifyProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const primaryImage = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;

  return (
    <Link to={`/store/products/${product.handle}`} className="group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        <div className="aspect-square overflow-hidden">
          {primaryImage ? (
            <LazyImage
              src={primaryImage.url}
              alt={primaryImage.altText || product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          {product.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-lg font-bold">
              {formatCurrency(price.amount, price.currencyCode)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const ProductListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <CardContent className="p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-3" />
            <Skeleton className="h-6 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;
