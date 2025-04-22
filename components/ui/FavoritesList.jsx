import { StyleSheet, Appearance, SafeAreaView, SectionList, Platform, View, Text, Pressable,} from "react-native";
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useContext } from 'react';
import {router} from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';


export default function FavoritesList() {
const [favoritesData, setFavorites] = useState([]);

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
    <View style={styles.container}>
      <View style={styles.contentContainer}>
      <SectionList
        sections={favoriteSections}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item, index }) => (
          <View key={index} style={styles.favoritesRow}>
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
          </View>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer : {
      paddingTop: 10,
      paddingBottom: 10,
      width: '100%',
      backgroundColor: 'white',
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