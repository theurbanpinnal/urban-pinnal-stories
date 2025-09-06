import React, { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface EnhancedLoadingProps {
  type?: 'product-card' | 'product-grid' | 'hero' | 'collection';
  count?: number;
  showProgress?: boolean;
}

const ProductCardSkeleton: React.FC = memo(() => (
  <Card className="overflow-hidden animate-pulse">
    <div className="aspect-square overflow-hidden relative bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
    <CardContent className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16 bg-green-100 rounded-full" />
        <Skeleton className="h-4 w-20 bg-orange-100 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4 bg-gray-200" />
      <Skeleton className="h-4 w-full bg-gray-200" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-7 w-24 bg-gray-300" />
        <Skeleton className="h-4 w-16 bg-gray-200" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-5 w-12 bg-gray-200 rounded-full" />
        <Skeleton className="h-5 w-16 bg-gray-200 rounded-full" />
        <Skeleton className="h-5 w-10 bg-gray-200 rounded-full" />
      </div>
    </CardContent>
  </Card>
));

const HeroSkeleton: React.FC = memo(() => (
  <div className="relative h-[60vh] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
    <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center text-white max-w-4xl px-6 space-y-6">
        <Skeleton className="h-12 w-3/4 mx-auto bg-white/20" />
        <Skeleton className="h-6 w-full mx-auto bg-white/20" />
        <Skeleton className="h-6 w-2/3 mx-auto bg-white/20" />
        <div className="flex gap-4 justify-center">
          <Skeleton className="h-12 w-40 bg-white/30 rounded-md" />
        </div>
      </div>
    </div>
  </div>
));

const CollectionSkeleton: React.FC = memo(() => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <Skeleton className="h-6 w-3/4 mb-3" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    <Skeleton className="h-8 w-24" />
  </div>
));

const EnhancedLoading: React.FC<EnhancedLoadingProps> = memo(({
  type = 'product-card',
  count = 1,
  showProgress = false
}) => {
  const renderSkeletons = () => {
    switch (type) {
      case 'hero':
        return <HeroSkeleton />;

      case 'collection':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: count }).map((_, index) => (
              <CollectionSkeleton key={index} />
            ))}
          </div>
        );

      case 'product-grid':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        );

      case 'product-card':
      default:
        return <ProductCardSkeleton />;
    }
  };

  return (
    <div className="relative">
      {renderSkeletons()}

      {showProgress && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
});

EnhancedLoading.displayName = 'EnhancedLoading';

export default EnhancedLoading;
