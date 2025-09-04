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

// Helper functions for localStorage
const getStoredCartId = (): string | null => {
  try {
    return localStorage.getItem('shopify_cart_id');
  } catch {
    return null;
  }
};

const storeCartId = (cartId: string) => {
  try {
    localStorage.setItem('shopify_cart_id', cartId);
  } catch (error) {
    console.warn('Failed to store cart ID in localStorage:', error);
  }
};

const clearStoredCartId = () => {
  try {
    localStorage.removeItem('shopify_cart_id');
  } catch (error) {
    console.warn('Failed to clear cart ID from localStorage:', error);
  }
};

// Helper function to perform GraphQL mutations using fetch (since we can't use hooks in stores)
const performMutation = async (query: string, variables: any) => {
  try {
    const response = await fetch('/shopify/api/2024-01/graphql.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN || '',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('GraphQL mutation error:', error);
    throw error;
  }
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
          toast({
            title: 'Error',
            description: errorMessage,
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

      // Debug method to inspect current cart state
      debugCart: () => {
        const state = get();
        console.log('🛒 Cart Debug Info:', {
          cartId: state.cartId,
          hasCart: !!state.cart,
          itemCount: state.cart ? state.cart.lines.edges.reduce((total, { node }) => total + node.quantity, 0) : 0,
          items: state.cart?.lines.edges.map(({ node }) => ({
            title: node.merchandise.product.title,
            quantity: node.quantity,
            variant: node.merchandise.title
          })) || []
        });
        return state;
      },

      loadCart: async (): Promise<void> => {
        const storedCartId = getStoredCartId();
        if (!storedCartId) return;

        try {
          const result = await fetch('/shopify/api/2024-01/graphql.json', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN || '',
            },
            body: JSON.stringify({
              query: GET_CART,
              variables: { cartId: storedCartId },
            }),
          });

          const data = await result.json();
          if (data.data?.cart) {
            // Validate cart data before setting it
            const cart = data.data.cart;
            if (cart.lines && cart.lines.edges) {
              // Filter out any invalid or ghost cart lines
              const validLines = cart.lines.edges.filter((edge: any) =>
                edge.node &&
                edge.node.merchandise &&
                edge.node.merchandise.id &&
                edge.node.quantity > 0
              );

              const cleanedCart = {
                ...cart,
                lines: {
                  ...cart.lines,
                  edges: validLines
                }
              };

              set({ cart: cleanedCart, cartId: storedCartId });
            } else {
              set({ cart: cart, cartId: storedCartId });
            }
          } else {
            // If cart query fails, clear the stored cart ID
            console.warn('Failed to load cart from Shopify');
            clearStoredCartId();
            set({ cart: null, cartId: null });
          }
        } catch (error) {
          console.warn('Failed to load cart:', error);
          clearStoredCartId();
          set({ cart: null, cartId: null });
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
