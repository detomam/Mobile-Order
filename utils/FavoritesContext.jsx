import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [favoritesItems, setFavoritesItems] = useState([]);

  const loadFavoritesCount = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      const parsedFavorites = favorites ? JSON.parse(favorites) : [];
      setFavoritesItems(parsedFavorites);
      setFavoritesCount(parsedFavorites.length);
    } catch (error) {
      console.error("Error loading favorites from storage:", error);
    }
  };

  useEffect(() => {
    loadFavoritesCount();
  }, []);

  const updateFavoritesCount = (newFavoritesArray) => {
    setFavoritesItems(newFavoritesArray);
    setFavoritesCount(newFavoritesArray.length);
  };

  return (
    <FavoritesContext.Provider value={{ favoritesCount, setFavoritesCount, updateFavoritesCount, loadFavoritesCount }}>
      {children}
    </FavoritesContext.Provider>
  );
};
