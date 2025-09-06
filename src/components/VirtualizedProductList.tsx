import React, { useMemo, useCallback, memo, useState, useEffect, useRef } from 'react';
import { ShopifyProduct } from '@/lib/shopify';
import ProductCard from './ProductCard';

interface VirtualizedProductListProps {
  products: ShopifyProduct[];
  containerWidth?: number;
  containerHeight?: number;
  itemWidth?: number;
  itemHeight?: number;
  gap?: number;
}

const VirtualizedProductList: React.FC<VirtualizedProductListProps> = ({
  products,
  containerWidth = 1200,
  containerHeight = 800,
  itemWidth = 300,
  itemHeight = 400,
  gap = 24,
}) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 12 });
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate responsive columns based on container width
  const columnsPerRow = useMemo(() => {
    if (containerWidth < 640) return 1; // sm
    if (containerWidth < 1024) return 2; // lg
    if (containerWidth < 1280) return 3; // xl
    return 4; // 2xl+
  }, [containerWidth, itemWidth, gap]);

  // Calculate total rows needed
  const totalRows = useMemo(() => 
    Math.ceil(products.length / columnsPerRow),
    [products.length, columnsPerRow]
  );

  // Calculate actual item dimensions including gap
  const actualItemWidth = useMemo(() => 
    (containerWidth - gap * (columnsPerRow - 1)) / columnsPerRow,
    [containerWidth, columnsPerRow, gap]
  );

  const actualItemHeight = useMemo(() => 
    itemHeight + gap,
    [itemHeight, gap]
  );

  // Calculate visible range based on scroll position
  const calculateVisibleRange = useCallback((scrollTop: number) => {
    const startRow = Math.floor(scrollTop / actualItemHeight);
    const endRow = Math.min(
      startRow + Math.ceil(containerHeight / actualItemHeight) + 2, // +2 for buffer
      totalRows
    );
    
    const start = Math.max(0, startRow * columnsPerRow);
    const end = Math.min(products.length, endRow * columnsPerRow);
    
    return { start, end };
  }, [actualItemHeight, containerHeight, totalRows, columnsPerRow, products.length]);

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    setVisibleRange(calculateVisibleRange(newScrollTop));
  }, [calculateVisibleRange]);

  // Update visible range when dependencies change
  useEffect(() => {
    setVisibleRange(calculateVisibleRange(scrollTop));
  }, [calculateVisibleRange, scrollTop]);

  // Only render virtualized grid if we have enough products to benefit from virtualization
  if (products.length <= 12) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  // Calculate total height for scrollbar
  const totalHeight = totalRows * actualItemHeight;

  // Get visible products
  const visibleProducts = products.slice(visibleRange.start, visibleRange.end);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: containerWidth, 
        height: containerHeight,
        overflow: 'auto',
        position: 'relative'
      }}
      onScroll={handleScroll}
    >
      {/* Virtual spacer for total height */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Visible products container */}
        <div
          style={{
            position: 'absolute',
            top: Math.floor(visibleRange.start / columnsPerRow) * actualItemHeight,
            left: 0,
            right: 0,
            display: 'grid',
            gridTemplateColumns: `repeat(${columnsPerRow}, 1fr)`,
            gap: gap,
            padding: gap / 2,
          }}
        >
          {visibleProducts.map((product, index) => (
            <div
              key={product.id}
              style={{
                width: actualItemWidth,
                height: itemHeight,
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

VirtualizedProductList.displayName = 'VirtualizedProductList';

export default VirtualizedProductList;
