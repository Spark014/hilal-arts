'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

// Validate cart item structure — prevents forged localStorage data
function isValidCartItem(item) {
  return (
    item &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.slug === 'string' &&
    typeof item.price === 'number' &&
    item.price >= 0 &&
    Number.isFinite(item.price) &&
    typeof item.quantity === 'number' &&
    item.quantity > 0 &&
    Number.isInteger(item.quantity) &&
    typeof item.image === 'string'
  );
}

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('hilal-cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.every(isValidCartItem)) {
          setItems(parsed);
        } else {
          console.warn('Invalid cart data in localStorage — cleared');
          localStorage.removeItem('hilal-cart');
        }
      } catch (e) {
        console.error('Failed to parse cart data:', e);
        localStorage.removeItem('hilal-cart');
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('hilal-cart', JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addToCart = (product, quantity = 1) => {
    // Validate product structure before adding
    if (!isValidCartItem({ ...product, quantity })) {
      console.error('Invalid product data — not added to cart');
      return;
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        toggleCart,
        isMounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
