import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  CREATE_CART,
  ADD_TO_CART,
  UPDATE_CART_LINES,
  REMOVE_FROM_CART,
  GET_CART,
  ShopifyCart,
  CartLine,
} from '@/lib/shopify';
import { toast } from '@/hooks/use-toast';
import type { CartStore } from './types';

// Robust localStorage helpers with fallback and validation
const getStoredCartId = (): string | null => {
  try {
    // Check if localStorage is available
    if (typeof Storage === 'undefined' || !window.localStorage) {
      console.warn('[Cart Sync] localStorage not available');
      return null;
    }

    const cartId = localStorage.getItem('shopify_cart_id');

    // Validate cart ID format (Shopify cart IDs are typically long strings)
    if (cartId && typeof cartId === 'string' && cartId.length > 10) {
      return cartId;
    }

    return null;
  } catch (error) {
    console.warn('[Cart Sync] Failed to read cart ID from localStorage:', error);
    return null;
  }
};

const storeCartId = (cartId: string) => {
  try {
    if (typeof Storage === 'undefined' || !window.localStorage) {
      console.warn('[Cart Sync] localStorage not available');
      return;
    }

    if (!cartId || typeof cartId !== 'string') {
      console.warn('[Cart Sync] Invalid cart ID provided');
      return;
    }

    localStorage.setItem('shopify_cart_id', cartId);
    console.log('[Cart Sync] Cart ID stored successfully');
  } catch (error) {
    console.error('[Cart Sync] Failed to store cart ID in localStorage:', error);

    // Try alternative storage methods
    try {
      sessionStorage.setItem('shopify_cart_id', cartId);
      console.log('[Cart Sync] Cart ID stored in sessionStorage as fallback');
    } catch (fallbackError) {
      console.error('[Cart Sync] Fallback storage also failed:', fallbackError);
    }
  }
};

const clearStoredCartId = () => {
  try {
    if (typeof Storage === 'undefined') {
      return;
    }

    localStorage.removeItem('shopify_cart_id');
    sessionStorage.removeItem('shopify_cart_id');
    console.log('[Cart Sync] Cart ID cleared from storage');
  } catch (error) {
    console.warn('[Cart Sync] Failed to clear cart ID from storage:', error);
  }
};


// Helper function to perform GraphQL mutations with retry logic
const performMutation = async (query: string, variables: any, maxRetries = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const apiToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN;
      if (!apiToken) {
        throw new Error('Missing Shopify API token');
      }

      const response = await fetch('/shopify/api/2024-01/graphql.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': apiToken,
          'Accept': 'application/json',
          'User-Agent': 'UrbanPinnal/1.0',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        const errorText = await response.text();

        // Don't retry on client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`Client error: ${response.status} ${errorText}`);
        }

        // Retry on server errors (5xx) or network issues
        lastError = new Error(`Server error: ${response.status} ${errorText}`);
        continue;
      }

      const data = await response.json();

      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      // Check for GraphQL errors
      if (data.errors && data.errors.length > 0) {
        throw new Error(`GraphQL error: ${data.errors[0].message}`);
      }

      return data;

    } catch (error) {
      lastError = error;

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Wait before retry (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Network request failed');
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      cart: null,
      isLoading: false,
      error: null,
      cartId: getStoredCartId(),

      // Actions
      addToCart: async (variantId: string, quantity: number): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const { cart } = get();
          let currentCart = cart;

          // If no cart exists, create one
          if (!currentCart) {
            const result = await performMutation(CREATE_CART, {
              input: {
                lines: [
                  {
                    merchandiseId: variantId,
                    quantity,
                  },
                ],
              },
            });

            if (result.error || result.data?.cartCreate?.userErrors?.length > 0) {
              const errorMessage = result.error?.message || result.data?.cartCreate?.userErrors?.[0]?.message || 'Failed to create cart';
              set({ error: errorMessage });
              toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
              });
              return false;
            }

            currentCart = result.data?.cartCreate?.cart;
            if (currentCart) {
              storeCartId(currentCart.id);
              set({ cart: currentCart, cartId: currentCart.id });
            } else {
              return false;
            }
          } else {
            // Add to existing cart
            const result = await performMutation(ADD_TO_CART, {
              cartId: currentCart.id,
              lines: [
                {
                  merchandiseId: variantId,
                  quantity,
                },
              ],
            });

            if (result.error || result.data?.cartLinesAdd?.userErrors?.length > 0) {
              const errorMessage = result.error?.message || result.data?.cartLinesAdd?.userErrors?.[0]?.message || 'Failed to add item to cart';
              set({ error: errorMessage });
              toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
              });
              return false;
            }

            const updatedCart = result.data?.cartLinesAdd?.cart;
            if (updatedCart) {
              set({ cart: updatedCart });
            }
          }

          toast({
            title: 'Added to Cart',
            description: 'Item has been added to your cart successfully.',
          });
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
          set({ error: errorMessage });

          // Show user-friendly error messages
          const userFriendlyMessage = errorMessage.includes('Network') || errorMessage.includes('timeout')
            ? 'Network error. Please check your connection and try again.'
            : errorMessage.includes('Missing Shopify API token')
            ? 'Service temporarily unavailable. Please try again later.'
            : 'Unable to add item to cart. Please try again.';

          toast({
            title: 'Error',
            description: userFriendlyMessage,
            variant: 'destructive',
          });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      updateCartLine: async (lineId: string, quantity: number): Promise<void> => {
        const { cart } = get();
        if (!cart) return;

        set({ isLoading: true, error: null });

        try {
          const result = await performMutation(UPDATE_CART_LINES, {
            cartId: cart.id,
            lines: [
              {
                id: lineId,
                quantity,
              },
            ],
          });

          if (result.error || result.data?.cartLinesUpdate?.userErrors?.length > 0) {
            const errorMessage = result.error?.message || result.data?.cartLinesUpdate?.userErrors?.[0]?.message || 'Failed to update cart';

            // Check if the error is about the merchandise line not existing
            if (errorMessage.includes('does not exist') || errorMessage.includes('merchandise line')) {
              // Refresh the cart state from Shopify to sync with current state
              try {
                const refreshResult = await fetch('/shopify/api/2024-01/graphql.json', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN || '',
                  },
                  body: JSON.stringify({
                    query: GET_CART,
                    variables: { cartId: cart.id },
                  }),
                });

                const refreshData = await refreshResult.json();
                if (refreshData.data?.cart) {
                  set({ cart: refreshData.data.cart });
                  toast({
                    title: 'Cart Updated',
                    description: 'Cart has been refreshed.',
                  });
                } else {
                  // If refresh fails, clear the cart
                  clearStoredCartId();
                  set({ cart: null });
                  toast({
                    title: 'Cart Cleared',
                    description: 'Cart has been cleared due to synchronization issues.',
                  });
                }
              } catch (refreshError) {
                // If refresh also fails, clear the cart
                clearStoredCartId();
                set({ cart: null });
                toast({
                  title: 'Cart Cleared',
                  description: 'Cart has been cleared due to synchronization issues.',
                });
              }
              return;
            }

            set({ error: errorMessage });
            toast({
              title: 'Error',
              description: errorMessage,
              variant: 'destructive',
            });
            return;
          }

          const updatedCart = result.data?.cartLinesUpdate?.cart;
          if (updatedCart) {
            set({ cart: updatedCart });
          }

          toast({
            title: 'Cart Updated',
            description: 'Cart has been updated successfully.',
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update cart';
          set({ error: errorMessage });
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        } finally {
          set({ isLoading: false });
        }
      },

      removeFromCart: async (lineId: string): Promise<void> => {
        const { cart } = get();
        if (!cart) return;

        set({ isLoading: true, error: null });

        try {
          const result = await performMutation(REMOVE_FROM_CART, {
            cartId: cart.id,
            lineIds: [lineId],
          });

          if (result.error || result.data?.cartLinesRemove?.userErrors?.length > 0) {
            const errorMessage = result.error?.message || result.data?.cartLinesRemove?.userErrors?.[0]?.message || 'Failed to remove item from cart';

            // Check if the error is about the merchandise line not existing
            if (errorMessage.includes('does not exist') || errorMessage.includes('merchandise line')) {
              // Refresh the cart state from Shopify to sync with current state
              try {
                const refreshResult = await fetch('/shopify/api/2024-01/graphql.json', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN || '',
                  },
                  body: JSON.stringify({
                    query: GET_CART,
                    variables: { cartId: cart.id },
                  }),
                });

                const refreshData = await refreshResult.json();
                if (refreshData.data?.cart) {
                  set({ cart: refreshData.data.cart });
                  toast({
                    title: 'Cart Updated',
                    description: 'Cart has been refreshed.',
                  });
                } else {
                  // If refresh fails, clear the cart
                  clearStoredCartId();
                  set({ cart: null });
                  toast({
                    title: 'Cart Cleared',
                    description: 'Cart has been cleared due to synchronization issues.',
                  });
                }
              } catch (refreshError) {
                // If refresh also fails, clear the cart
                clearStoredCartId();
                set({ cart: null });
                toast({
                  title: 'Cart Cleared',
                  description: 'Cart has been cleared due to synchronization issues.',
                });
              }
              return;
            }

            set({ error: errorMessage });
            toast({
              title: 'Error',
              description: errorMessage,
              variant: 'destructive',
            });
            return;
          }

          const updatedCart = result.data?.cartLinesRemove?.cart;
          if (updatedCart) {
            set({ cart: updatedCart });
          }

          toast({
            title: 'Item Removed',
            description: 'Item has been removed from your cart.',
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to remove item from cart';
          set({ error: errorMessage });
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        } finally {
          set({ isLoading: false });
        }
      },

      getCartItemCount: (): number => {
        const { cart } = get();
        if (!cart) return 0;
        return cart.lines.edges.reduce((total, { node }) => total + node.quantity, 0);
      },

      checkout: (): void => {
        const { cart } = get();
        if (cart?.checkoutUrl) {
          try {
            // Validate checkout URL before redirecting
            const url = new URL(cart.checkoutUrl);
            // Allow both Shopify domains and your custom domain
            if (url.protocol === 'https:' &&
                (url.hostname.includes('shopify') ||
                 url.hostname.includes('theurbanpinnal') ||
                 url.hostname.includes('myshopify'))) {
              window.location.href = cart.checkoutUrl;
            } else {
              throw new Error('Invalid checkout URL');
            }
          } catch (error) {
            console.error('Invalid checkout URL:', cart.checkoutUrl);
            toast({
              title: 'Error',
              description: 'Unable to proceed to checkout. Please try again.',
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Error',
            description: 'Unable to proceed to checkout. Please try again.',
            variant: 'destructive',
          });
        }
      },

      clearCart: (): void => {
        clearStoredCartId();
        set({ cart: null, cartId: null });
      },


      loadCart: async (): Promise<void> => {
        const storedCartId = getStoredCartId();
        if (!storedCartId) return;

        set({ isLoading: true, error: null });

        try {
          const data = await performMutation(GET_CART, { cartId: storedCartId });

          if (data.data?.cart) {
            const cart = data.data.cart;

            if (cart.lines && cart.lines.edges) {
              // Filter out any invalid or ghost cart lines
              const validLines = cart.lines.edges.filter((edge: any) => {
                return edge.node &&
                  edge.node.merchandise &&
                  edge.node.merchandise.id &&
                  edge.node.quantity > 0;
              });

              const cleanedCart = {
                ...cart,
                lines: {
                  ...cart.lines,
                  edges: validLines
                }
              };

              set({ cart: cleanedCart, cartId: storedCartId, isLoading: false });
            } else {
              set({ cart: cart, cartId: storedCartId, isLoading: false });
            }
          } else {
            clearStoredCartId();
            set({ cart: null, cartId: null, isLoading: false });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load cart';

          // Don't clear cart ID on network errors - might be temporary
          if (errorMessage.includes('Network') || errorMessage.includes('timeout')) {
            set({ error: 'Network error - cart may not be fully synced', isLoading: false });
          } else {
            // Clear cart ID for authentication or data errors
            clearStoredCartId();
            set({ cart: null, cartId: null, isLoading: false });
          }

          // Show user-friendly error
          toast({
            title: 'Cart Sync Issue',
            description: 'Unable to load your cart. Please refresh the page.',
            variant: 'destructive',
          });
        }
      },

    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cartId: state.cartId,
      }),
    }
  )
);
