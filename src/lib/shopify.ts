// Shopify GraphQL queries and mutations

export const GET_PRODUCTS = `
  query getProducts($first: Int!, $sortKey: ProductSortKeys) {
    products(first: $first, sortKey: $sortKey) {
      edges {
        node {
          id
          title
          handle
          description
          productType
          vendor
          tags
          createdAt
          updatedAt
          publishedAt
          totalInventory
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 3) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                quantityAvailable
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          collections(first: 10) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_COLLECTIONS = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE = `
  query getCollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      description
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            vendor
            tags
            createdAt
            updatedAt
            publishedAt
            totalInventory
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 3) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  availableForSale
                  quantityAvailable
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SHOP_INFO = `
  query {
    shop {
      name
      description
      primaryDomain {
        url
      }
    }
  }
`;

export const GET_PRODUCTS_SIMPLE = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          vendor
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS_COUNT = `
  query getProductsCount($query: String) {
    products(first: 250, query: $query) {
      edges {
        node {
          id
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = `
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      vendor
      tags
      productType
      createdAt
      updatedAt
      publishedAt
      totalInventory
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            quantityAvailable
            selectedOptions {
              name
              value
            }
            sku
            weight
            weightUnit
          }
        }
      }
      options {
        id
        name
        values
      }
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  }
`;

export const CREATE_CART = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        createdAt
        updatedAt
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                    vendor
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const ADD_TO_CART = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        createdAt
        updatedAt
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                    vendor
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const UPDATE_CART_LINES = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        createdAt
        updatedAt
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                    vendor
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const REMOVE_FROM_CART = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        createdAt
        updatedAt
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                    vendor
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const GET_CART = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      createdAt
      updatedAt
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                product {
                  title
                  handle
                  vendor
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
      checkoutUrl
    }
  }
`;

// TypeScript interfaces for better type safety
export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  productType?: string;
  vendor?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  totalInventory?: number;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        id?: string;
        url: string;
        altText?: string;
        width?: number;
        height?: number;
      };
    }>;
  };
  collections?: {
    edges: Array<{
      node: ShopifyCollection;
    }>;
  };
  options?: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  variants?: {
    edges: Array<{
      node: {
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
        availableForSale: boolean;
        quantityAvailable?: number;
        selectedOptions?: Array<{
          name: string;
          value: string;
        }>;
        sku?: string;
        weight?: number;
        weightUnit?: string;
      };
    }>;
  };
}

export interface CartLine {
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

export interface ShopifyCart {
  id: string;
  createdAt: string;
  updatedAt: string;
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  checkoutUrl: string;
}

// Utility functions for working with product data
export const getProductBadges = (product: ShopifyProduct): string[] => {
  const badges: string[] = [];
  
  // Check for sale pricing from variants
  const hasVariantSale = product.variants?.edges?.some(({ node: variant }) => 
    variant.compareAtPrice && 
    parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount)
  );
  
  if (hasVariantSale) {
    badges.push('Sale');
  }
  
  if (product.totalInventory && product.totalInventory <= 5) {
    badges.push('Low Stock');
  }
  
  if (product.tags?.includes('new')) {
    badges.push('New');
  }
  
  if (product.tags?.includes('featured')) {
    badges.push('Featured');
  }
  
  return badges;
};

export const formatDateRelative = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
};

export const getPrimaryMedia = (product: ShopifyProduct): string | null => {
  // Get first image
  if (product.images?.edges?.[0]?.node?.url) {
    return product.images.edges[0].node.url;
  }
  
  return null;
};

export const hasMultipleVariants = (product: ShopifyProduct): boolean => {
  return (product.variants?.edges?.length || 0) > 1;
};

export const getLowestPrice = (product: ShopifyProduct): number => {
  if (!product.variants?.edges?.length) {
    return parseFloat(product.priceRange.minVariantPrice.amount);
  }
  
  const prices = product.variants.edges.map(({ node: variant }) => 
    parseFloat(variant.price.amount)
  );
  
  return Math.min(...prices);
};

export const getHighestCompareAtPrice = (product: ShopifyProduct): number | null => {
  if (!product.variants?.edges?.length) {
    return null;
  }
  
  const compareAtPrices = product.variants.edges
    .map(({ node: variant }) => variant.compareAtPrice?.amount)
    .filter(Boolean)
    .map(price => parseFloat(price!));
  
  return compareAtPrices.length > 0 ? Math.max(...compareAtPrices) : null;
};

export const calculateDiscountPercentage = (product: ShopifyProduct): number => {
  const currentPrice = getLowestPrice(product);
  const originalPrice = getHighestCompareAtPrice(product);
  
  if (!originalPrice || originalPrice <= currentPrice) {
    return 0;
  }
  
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const isProductOnSale = (product: ShopifyProduct): boolean => {
  return product.variants?.edges?.some(({ node: variant }) => 
    variant.compareAtPrice && 
    parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount)
  ) || false;
};

export const isLowStock = (product: ShopifyProduct): boolean => {
  return product.totalInventory !== undefined && product.totalInventory <= 10 && product.totalInventory > 0;
};

export const isOutOfStock = (product: ShopifyProduct): boolean => {
  return product.totalInventory === 0 || 
    (product.variants?.edges?.every(({ node: variant }) => !variant.availableForSale) || false);
};

export const isNewProduct = (product: ShopifyProduct): boolean => {
  if (!product.createdAt) return false;
  
  const createdDate = new Date(product.createdAt);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return createdDate > thirtyDaysAgo;
};