import { useMemo } from 'react';

interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    compareAtPrice?: {
      amount: string;
      currencyCode: string;
    };
    product: {
      title: string;
      handle: string;
      vendor?: string;
      images: {
        edges: Array<{
          node: {
            url: string;
            altText?: string;
          };
        }>;
      };
    };
  };
}

interface Cart {
  lines?: {
    edges: Array<{
      node: CartLine;
    }>;
  };
}

export const useCartCalculations = (cart: Cart | null) => {
  return useMemo(() => {
    const cartLines = cart?.lines?.edges?.map(({ node }) => node) || [];

    let subtotalCompareAtPrice = 0;
    let subtotalActualPrice = 0;
    let totalDiscount = 0;
    let currencyCode = 'INR';

    cartLines.forEach((line) => {
      const variant = line.merchandise;
      const quantity = line.quantity;
      const actualPrice = parseFloat(variant.price.amount);
      const compareAtPrice = variant.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : actualPrice;

      subtotalCompareAtPrice += compareAtPrice * quantity;
      subtotalActualPrice += actualPrice * quantity;
      currencyCode = variant.price.currencyCode;
    });

    totalDiscount = subtotalCompareAtPrice - subtotalActualPrice;

    return {
      subtotalCompareAtPrice,
      subtotalActualPrice,
      totalDiscount,
      currencyCode,
      cartLines
    };
  }, [cart]);
};
