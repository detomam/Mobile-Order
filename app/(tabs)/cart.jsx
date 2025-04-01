import { View, Text, StyleSheet, Image, Pressable} from 'react-native'
import { Link } from 'expo-router';
import React, {useContext, useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartList from '@/components/ui/CartList';
import { CartContext } from '@/utils/CartContext';
import { useFocusEffect } from '@react-navigation/native';


const cart = () => {
  const { cartCount, loadCartCount, cartItems} = useContext(CartContext);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantLocation, setRestaurantLocation] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadCartCount();
    }, [])
  );

  useEffect(() => {
    const loadLocation = async () => {
      try {
        loadCartCount();
        if (cartCount > 0) {
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
  }, [cartCount]);

  useEffect(() => {
    const clearLocation = async () => {
      loadCartCount();
      if (cartCount === 0) {
        setRestaurantName('');
        setRestaurantLocation('');
        await AsyncStorage.removeItem('restaurantName');
        await AsyncStorage.removeItem('restaurantLocation');
      }
    };

    clearLocation();
  }, [cartCount]);

  const emptyCartMessage = "Looks like you haven’t added anything to your cart yet. Don’t worry, there’s lots of delicious options to choose from. Head to the home page to start an order!"
  return (
    <View style={styles.container}>
      <View style={styles.decorativeBar}/>
      <View style={styles.textContainer}>
        <Text style={styles.cartTitle}>Your Cart</Text>
        {cartCount > 0 && (
          <>
            <Text style={styles.restaurantName}>{restaurantName}</Text>
            <Text style={styles.restaurantLocation}>{restaurantLocation}</Text>
          </>
        )}
      </View>
      <CartList></CartList>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },

  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  text: {
    color: 'black',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  decorativeBar: {
    height: 55,
    backgroundColor: '#881c1c',
    width: '100%',
  },

  textContainer: {
    margin: 15,
  },

  cartTitle: {
    fontFamily: 'OpenSans_400Regular',
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

})


export default cart