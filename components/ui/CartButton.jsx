import { View, StyleSheet, Pressable} from 'react-native'
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Badge, Icon, withBadge} from 'react-native-elements'
import { CartContext } from '@/utils/CartContext';
import React, { useState, useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartButton(){
  const router = useRouter();
  const {cartCount, setCartCount} = useContext(CartContext);

  const loadCartCount = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      const cartItems = cart ? JSON.parse(cart) : [];
      setCartCount(cartItems.length);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCartCount();
    }, [])
  );

  const badgeStyle = {
    backgroundColor: 'white',
  }

  const BadgedIcon = cartCount > 0 ? withBadge(cartCount, {badgeStyle, textStyle: {color: 'black'}})(Ionicons) : Ionicons;


  return (    
    <Pressable style={({ pressed }) => [
      styles.cartButton,
      pressed && styles.cartButtonPressed,]}
      onPress={() => router.push('/(tabs)/cart')}>
      <BadgedIcon
        type="ionicon"
        name="cart"
        color="white"
        size={30}
      />
    </Pressable>
)}

const styles = StyleSheet.create({
  cartButton: {
    backgroundColor: '#881c1c',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35,
    marginHorizontal: 15,
    width: 70,
    height: 70,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  
  cartButtonPressed: {
    transform: [{ scale: 0.95 }],
  },

})

