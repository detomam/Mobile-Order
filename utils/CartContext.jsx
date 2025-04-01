import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const loadCartCount = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      const cartItems = cart ? JSON.parse(cart) : [];
      setCartCount(cartItems.length);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  useEffect(() => {
    loadCartCount();
  }, []);

  const updateCartCount = async () => {
    try {
      const existingCart = await AsyncStorage.getItem('cart');
      const cart = existingCart ? JSON.parse(existingCart) : [];
      setCartCount(cart.length);
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, updateCartCount, loadCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
