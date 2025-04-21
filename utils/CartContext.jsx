import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const loadCartCount = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      const parsedCart = cart ? JSON.parse(cart) : [];
      setCartItems(parsedCart);
      setCartCount(parsedCart.length);
    } catch (error) {
      console.error("Error loading cart from storage:", error);
    }
  };

  useEffect(() => {
    loadCartCount();
  }, []);

  const updateCartCount = (newCartArray) => {
    setCartItems(newCartArray);
    setCartCount(newCartArray.length);
  };

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, updateCartCount, loadCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
