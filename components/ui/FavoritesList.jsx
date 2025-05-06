import { StyleSheet, Appearance, SafeAreaView, SectionList, Platform, View, Text, Pressable,} from "react-native";
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useContext } from 'react';
import {router} from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { CartContext } from "@/utils/CartContext";
import { Alert } from "react-native";
import CartButton from "./CartButton";

export default function FavoritesList() {
const [favoritesData, setFavorites] = useState([]);
const [selectedItem, setSelectedItem] = useState(null);
const {cartCount, updateCartCount } = useContext(CartContext);
const [showCart, setShowCart] = useState(null)

    const getData = async (key) => {
        try {
          const value = await AsyncStorage.getItem(key);
          return value != null ? JSON.parse(value) : null;
        } catch (error) {
          console.error('Error retrieving data:', error);
        }
      };
      
    const removeItem = async (targetItem) => {
        try {
          const favorites = await getData('favorites');
          const updatedFavorites = favorites.filter(fav =>
            !(
              fav.name === targetItem.name &&
              fav.price === targetItem.price &&
              fav.restaurant === targetItem.restaurant &&
              JSON.stringify(fav.customizations) === JSON.stringify(targetItem.customizations)
            )
          );
          await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
          setFavorites(updatedFavorites);
        } catch (error) {
          console.error('Error removing item from favorites:', error);
        }
      };

      const addToOrder = async (item) => {
        try {
          const newItem = {
            name: item.name,
            customizations: item.customizations,
            price: item.price,
            restaurant: item.restaurant,
            restaurant_location: item.restaurant_location
          };
    
          const existingCart = await AsyncStorage.getItem('cart');
          const storedRestaurantName = await AsyncStorage.getItem('restaurantName');
          const cart = existingCart ? JSON.parse(existingCart) : [];
    
          console.log('stored restaurant name: ', storedRestaurantName)
          const restaurantName = item.restaurant;
          const restaurantLocation = item.restaurant_location || '';
    
          if (storedRestaurantName && storedRestaurantName !== restaurantName && cart.length !== 0) {
            Alert.alert("Order Already in Progress", "You already have an order in progress. Would you like to clear the cart?",
              [      
                {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              
                {
                  text: "Clear Cart",
                  onPress: () => handleCartReset(newItem, restaurantName, restaurantLocation)(),
                }]
            );
          }
    
          else {
            cart.push(newItem)
            await AsyncStorage.setItem('cart', JSON.stringify(cart));
            await AsyncStorage.setItem('restaurantName', restaurantName)
            await AsyncStorage.setItem('restaurantLocation', restaurantLocation)
            console.log("Added to cart:", newItem);
            
            setShowCart([])
            setSelectedItem(null);
            updateCartCount(cart);
          }
    
        } catch (error) {
          console.error('Failed to add item to cart:', error);
        }
      };

      const handleCartReset = (newItem, restaurantName, restaurantLocation) => async () => {
        console.log("handling cart reset");
        try {
          await AsyncStorage.setItem('restaurantName', restaurantName);
          await AsyncStorage.setItem('restaurantLocation', restaurantLocation);
    
          const newCart = [newItem];
    
          await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    
          const cart = await AsyncStorage.getItem('cart');
    
          console.log('Item added to cart:', newItem);
          console.log("Updated Cart Count:", cartCount);
          
          setSelectedItem(null);
          updateCartCount(cart);
        
        } catch (error) {
          console.error('Failed to add item to cart:', error);
        }
      }

    useFocusEffect(
        React.useCallback(() => {
            const loadFavorites = async () => {
                const favorites = await getData('favorites');
                setFavorites(favorites || []);
            };
    
            loadFavorites();
        }, [])
    );

    const groupedFavorites = favoritesData.reduce((acc, item) => {
      const restaurant = item.restaurant || 'Unknown';
      if (!acc[restaurant]) {
        acc[restaurant] = [];
      }
      acc[restaurant].push(item);
      return acc;
    }, {});
    
    const favoriteSections = Object.entries(groupedFavorites).map(
      ([restaurant, items]) => ({
        title: restaurant,
        data: items,
      })
    );
    
    const emptyFavoritesMessage = "Looks like you haven't added anything to your favorites yet. Don't worry, there's lots of delicious options to choose from. Head to the home page to find some great items to love!"

  return (
    <View style={styles.contentContainer}>
      <SectionList
        sections={favoriteSections}
        style={styles.favoritesList}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item, index }) => (
          <Pressable 
            onPress={() => {
              setSelectedItem(selectedItem === item ? null : item);
            }}            
            style={[styles.favoritesRow, selectedItem === item && styles.favoritesRowPressed,]}
            key={index}
            >
            <View style={styles.favoritesItem}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              {item.customizations && Object.keys(item.customizations).length > 0 && (
                <View style={{ marginTop: 5 }}>
                  {Object.entries(item.customizations).map(([category, value], i) => {
                    const isEmpty =
                      value == null ||
                      (Array.isArray(value) && value.length === 0) ||
                      (typeof value === 'string' && value.trim() === '');
                    if (isEmpty) return null;
                    return (
                      <Text key={i} style={styles.itemText}>
                        {category}: {Array.isArray(value) ? value.join(', ') : value}
                      </Text>
                    );
                  })}
                </View>
              )}
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.itemPrice}>$ {parseFloat(item.price).toFixed(2)}</Text>
            </View>
            <Pressable onPress={() => removeItem(item)}>
              <Ionicons name="close-outline" size={20} />
            </Pressable>
          </Pressable>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListEmptyComponent={
          <View>
            <Text style={styles.emptyFavoritesMessage}>{emptyFavoritesMessage}</Text>
            <View style={styles.homeButtonContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.homeButton,
                  pressed && styles.homeButtonPressed,
                ]}
                onPress={() => router.push('/')}>
                <Text style={styles.homeButtonText}>Home Page</Text>
              </Pressable>
            </View>
          </View>
        }
        />
      {selectedItem && (
      <View style={styles.floatingButtonContainer}>
        <Pressable
          style={({ pressed }) => [styles.homeButton, pressed && styles.homeButtonPressed]}
          onPress={() => addToOrder(selectedItem)}
        >
          <Text style={styles.homeButtonText}>Add to Order</Text>
        </Pressable>
      </View>
      )}
      {showCart && (
        <View style={styles.cartButtonContainer}>
          <CartButton></CartButton>
        </View>
      )}
      </View>
  );
}

const styles = StyleSheet.create({
    contentContainer : {
      width: '100%',
    },

    favoritesList: {
      height: '100%',
    },

    textRow : {
        width: '50%',
        paddingTop: 10,
        flexGrow: 1,
    },
    itemTitle: {
        fontSize: 18,
        fontFamily: 'OpenSans_400Regular',
    },
    itemText : {
        color: 'black',
        fontFamily: 'OpenSans_400Regular',
    },

    emptyCartTitle: {
        fontFamily: 'OpenSans_400Regular',
        fontSize: 26,
    },
    
      emptyFavoritesMessage: {
        fontFamily: 'OpenSans_400Regular',
        fontSize: 15,
        paddingHorizontal: 15,
    },
      homeButton: {
        backgroundColor: '#881c1c',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 25,
        width: '55%',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    
      homeButtonPressed: {
        transform: [{ scale: 0.95 }],
    },
    
    homeButtonContainer: {
      marginTop: 60,
      width: '100%',
      alignItems: 'center',
      zIndex: 10,
      elevation: 10,
      pointerEvents: 'auto',
  },
    
      homeButtonText: {
        fontFamily: 'OpenSans_400Regular',
        fontSize: 16,
        color: 'white',
    },

    floatingButtonContainer: {
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'center',
      zIndex: 999,
      bottom: 10,
      width: '100%',
      alignItems: 'center',
    },

    cartButtonContainer: {
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      zIndex: 999,
      bottom: 10,
      width: '100%',
      alignItems: 'center',
    },

    favoritesRow: {
        flex: 1,
        flexGrow: 1,
        flexDirection: 'row',
        width: '100%',
        minHeight: 75,
        height: 'auto',
        borderStyle: 'solid',
        borderColor: '#a2aaad',
        borderWidth: 0.5,
        overflow: 'hidden',
        marginHorizontal: 'auto',
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    favoritesRowPressed: {
      backgroundColor: '#F3DCDC',
      borderColor: '#881C1C',
      borderWidth: 2,
    },

    favoritesItem : {
        width: '50%',
        flexGrow: 1,
    },

    itemPrice : {
      color: 'black',
      fontSize: 18,
      fontFamily: 'OpenSans_400Regular',
    },

    priceContainer : {
      marginHorizontal: 10,
    },

    sectionHeader: {
      backgroundColor: '#f2f2f2',
      paddingHorizontal: 15,
      paddingVertical: 8,
      fontSize: 20,
      fontFamily: 'OpenSans_400Regular',
      color: 'black',
    },

})