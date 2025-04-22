import { View, Text, StyleSheet, ScrollView, FlatList, Pressable} from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list';
import React, {useContext, useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FavoritesList from '@/components/ui/FavoritesList';
import { useFocusEffect } from '@react-navigation/native';
import { LOCATION_DATA } from '@/constants/LocationData';
import { PAYMENT_METHODS } from '@/constants/PaymentMethods';
import { useRouter } from 'expo-router';
import { FavoritesContext } from '@/utils/FavoritesContext';

const favorites = () => {
  const {favoritesCount, loadFavoritesCount, favoriteItems} = useContext(FavoritesContext);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantLocation, setRestaurantLocation] = useState('');
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadFavoritesCount();
    }, [])
  );


  useEffect(() => {
    const loadLocation = async () => {
      try {
        loadFavoritesCount();
        if (favoritesCount > 0) {
          const savedRestaurant = await AsyncStorage.getItem('restaurantName');
          const savedLocation = await AsyncStorage.getItem('restaurantLocation');

          if (savedRestaurant) setRestaurantName(savedRestaurant);
          if (savedLocation) setRestaurantLocation(savedLocation);
  
        }
      } catch (error) {
        console.error('Error retrieving location:', error);
      }
    };

    loadLocation();
  }, [favoritesCount]);

  useEffect(() => {
    const clearLocation = async () => {
      loadFavoritesCount();
      if (favoritesCount === 0) {
        setRestaurantName('');
        setRestaurantLocation('');
        await AsyncStorage.removeItem('restaurantName');
        await AsyncStorage.removeItem('restaurantLocation');
      }
    };

    clearLocation();
  }, [favoritesCount]);

  
  return (
    <View style={{ flex: 1, backgroundColor: 'white'}}>
      <View style = {styles.container}>
        <View style={styles.decorativeBar}/>
        <View style={styles.titleContainer}>
          <Text style={styles.favoriteTitle}>Your Favorites</Text>
        </View>
        <FavoritesList></FavoritesList>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingBottom: 160,
  },

  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },


  decorativeBar: {
    height: 55,
    backgroundColor: '#881c1c',
    width: '100%',
  },

  titleContainer: {
    margin: 15,
  },

  favoriteTitle: {
    fontFamily: 'OpenSans_400Regular',
    marginBottom: 5,
    fontSize: 26,
  },

  restaurantName: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 15,
  },

  restaurantLocation: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 15,
  },

  disabledItems: {
    color: '#7C7C7C'
  },

  fixedButtonContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

})

export default favorites