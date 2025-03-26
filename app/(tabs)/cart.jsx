import { View, Text, StyleSheet, Image, Pressable} from 'react-native'
import { Link } from 'expo-router';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartList from '@/components/ui/CartList';


const cart = () => {
  const emptyCartMessage = "Looks like you haven’t added anything to your cart yet. Don’t worry, there’s lots of delicious options to choose from. Head to the home page to start an order!"
  return (
    <View style={styles.container}>
      <View style={styles.decorativeBar}/>
      <View style={styles.textContainer}>
        <Text style={styles.cartTitle}>Your Cart</Text>
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

})


export default cart