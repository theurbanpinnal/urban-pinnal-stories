import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useMutation, useQuery } from 'urql';
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

interface CartState {
  cart: ShopifyCart | null;
  isLoading: boolean;
  error: string | null;
}

interface CartContextType extends CartState {
  addToCart: (variantId: string, quantity: number) => Promise<boolean>;
  updateCartLine: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  getCartItemCount: () => number;
  checkout: () => void;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: ShopifyCart | null }
  | { type: 'SET_ERROR'; payload: string | null };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Get cart ID from localStorage
  const getStoredCartId = (): string | null => {
    try {
      return localStorage.getItem('shopify_cart_id');
    } catch {
      return null;
    }
  };

  // Store cart ID in localStorage
  const storeCartId = (cartId: string) => {
    try {
      localStorage.setItem('shopify_cart_id', cartId);
    } catch (error) {
      console.warn('Failed to store cart ID in localStorage:', error);
    }
  };

  // Mutations
  const [, createCartMutation] = useMutation(CREATE_CART);
  const [, addToCartMutation] = useMutation(ADD_TO_CART);
  const [, updateCartLinesMutation] = useMutation(UPDATE_CART_LINES);
  const [, removeFromCartMutation] = useMutation(REMOVE_FROM_CART);

  // Query to get existing cart
  const storedCartId = getStoredCartId();
  const [cartQueryResult] = useQuery({
    query: GET_CART,
    variables: { cartId: storedCartId },
    pause: !storedCartId,
  });

  // Load cart on component mount if cartId exists
  useEffect(() => {
    if (cartQueryResult.data?.cart) {
      // Validate cart data before setting it
      const cart = cartQueryResult.data.cart;
      if (cart.lines && cart.lines.edges) {
        // Filter out any invalid or ghost cart lines
        const validLines = cart.lines.edges.filter(edge =>
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

        dispatch({ type: 'SET_CART', payload: cleanedCart });
      } else {
        dispatch({ type: 'SET_CART', payload: cart });
      }
    } else if (cartQueryResult.error && storedCartId) {
      // If cart query fails, clear the stored cart ID
      console.warn('Failed to load cart from Shopify:', cartQueryResult.error);
      localStorage.removeItem('shopify_cart_id');
      dispatch({ type: 'SET_CART', payload: null });
    }
  }, [cartQueryResult.data, cartQueryResult.error, storedCartId]);

  const createCart = async (variantId: string, quantity: number): Promise<ShopifyCart | null> => {
    const result = await createCartMutation({
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
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    }

    const cart = result.data?.cartCreate?.cart;
    if (cart) {
      storeCartId(cart.id);
      dispatch({ type: 'SET_CART', payload: cart });
      return cart;
    }

    return null;
  };

  const addToCart = async (variantId: string, quantity: number): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      let currentCart = state.cart;

      // If no cart exists, create one
      if (!currentCart) {
        currentCart = await createCart(variantId, quantity);
        if (!currentCart) return false;
      } else {
        // Add to existing cart
        const result = await addToCartMutation({
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
          dispatch({ type: 'SET_ERROR', payload: errorMessage });
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
          return false;
        }

        const updatedCart = result.data?.cartLinesAdd?.cart;
        if (updatedCart) {
          dispatch({ type: 'SET_CART', payload: updatedCart });
        }
      }

      toast({
        title: 'Added to Cart',
        description: 'Item has been added to your cart successfully.',
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateCartLine = async (lineId: string, quantity: number): Promise<void> => {
    if (!state.cart) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const result = await updateCartLinesMutation({
        cartId: state.cart.id,
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
            const refreshResult = await fetch(`/api/shopify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: GET_CART,
                variables: { cartId: state.cart.id },
              }),
            });
            
            const refreshData = await refreshResult.json();
            if (refreshData.data?.cart) {
              dispatch({ type: 'SET_CART', payload: refreshData.data.cart });
              toast({
                title: 'Cart Updated',
                description: 'Cart has been refreshed.',
              });
            } else {
              // If refresh fails, clear the cart
              localStorage.removeItem('shopify_cart_id');
              dispatch({ type: 'SET_CART', payload: null });
              toast({
                title: 'Cart Cleared',
                description: 'Cart has been cleared due to synchronization issues.',
              });
            }
          } catch (refreshError) {
            // If refresh also fails, clear the cart
            localStorage.removeItem('shopify_cart_id');
            dispatch({ type: 'SET_CART', payload: null });
            toast({
              title: 'Cart Cleared',
              description: 'Cart has been cleared due to synchronization issues.',
            });
          }
          return;
        }
        
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
        return;
      }

      const updatedCart = result.data?.cartLinesUpdate?.cart;
      if (updatedCart) {
        dispatch({ type: 'SET_CART', payload: updatedCart });
      }

      toast({
        title: 'Cart Updated',
        description: 'Cart has been updated successfully.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeFromCart = async (lineId: string): Promise<void> => {
    if (!state.cart) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const result = await removeFromCartMutation({
        cartId: state.cart.id,
        lineIds: [lineId],
      });

      if (result.error || result.data?.cartLinesRemove?.userErrors?.length > 0) {
        const errorMessage = result.error?.message || result.data?.cartLinesRemove?.userErrors?.[0]?.message || 'Failed to remove item from cart';
        
        // Check if the error is about the merchandise line not existing
        if (errorMessage.includes('does not exist') || errorMessage.includes('merchandise line')) {
          // Refresh the cart state from Shopify to sync with current state
          try {
            const refreshResult = await fetch(`/api/shopify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: GET_CART,
                variables: { cartId: state.cart.id },
              }),
            });
            
            const refreshData = await refreshResult.json();
            if (refreshData.data?.cart) {
              dispatch({ type: 'SET_CART', payload: refreshData.data.cart });
              toast({
                title: 'Cart Updated',
                description: 'Cart has been refreshed.',
              });
            } else {
              // If refresh fails, clear the cart
              localStorage.removeItem('shopify_cart_id');
              dispatch({ type: 'SET_CART', payload: null });
              toast({
                title: 'Cart Cleared',
                description: 'Cart has been cleared due to synchronization issues.',
              });
            }
          } catch (refreshError) {
            // If refresh also fails, clear the cart
            localStorage.removeItem('shopify_cart_id');
            dispatch({ type: 'SET_CART', payload: null });
            toast({
              title: 'Cart Cleared',
              description: 'Cart has been cleared due to synchronization issues.',
            });
          }
          return;
        }
        
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
        return;
      }

      const updatedCart = result.data?.cartLinesRemove?.cart;
      if (updatedCart) {
        dispatch({ type: 'SET_CART', payload: updatedCart });
      }

      toast({
        title: 'Item Removed',
        description: 'Item has been removed from your cart.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove item from cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getCartItemCount = (): number => {
    if (!state.cart) return 0;
    return state.cart.lines.edges.reduce((total, { node }) => total + node.quantity, 0);
  };

  const checkout = (): void => {
    if (state.cart?.checkoutUrl) {
      try {
        // Validate checkout URL before redirecting
        const url = new URL(state.cart.checkoutUrl);
        // Allow both Shopify domains and your custom domain
        if (url.protocol === 'https:' && 
            (url.hostname.includes('shopify') || 
             url.hostname.includes('theurbanpinnal') ||
             url.hostname.includes('myshopify'))) {
          window.location.href = state.cart.checkoutUrl;
        } else {
          throw new Error('Invalid checkout URL');
        }
      } catch (error) {
        console.error('Invalid checkout URL:', state.cart.checkoutUrl);
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
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    updateCartLine,
    removeFromCart,
    getCartItemCount,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
