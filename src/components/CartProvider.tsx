import React, { useEffect } from 'react';
import { useCartStore } from '@/stores';

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const loadCart = useCartStore((state) => state.loadCart);

  // Load cart on component mount
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return <>{children}</>;
};
