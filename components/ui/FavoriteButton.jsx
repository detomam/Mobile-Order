import { View, StyleSheet, Pressable} from 'react-native'
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CartContext } from '@/utils/CartContext';
import React, { useState, useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavoriteButton({onPress, isFavorited}){
  const router = useRouter();
  const {cartCount, setCartCount} = useContext(CartContext);

  const getFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      const favoriteItems = favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  return (    
    <Pressable style={({ pressed }) => [
      styles.favoriteButton,
      pressed && styles.favoriteButtonPressed,]}
      onPress={onPress}
      >
      <Ionicons
        name={isFavorited ? 'heart' : 'heart-outline'}
        color="white"
        size={30}
      />
    </Pressable>
)}

const styles = StyleSheet.create({
  favoriteButton: {
    backgroundColor: '#881c1c',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35,
    marginHorizontal: 15,
    width: 50,
    height: 50,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  
  favoriteButtonPressed: {
    transform: [{ scale: 0.95 }],
  },

})

