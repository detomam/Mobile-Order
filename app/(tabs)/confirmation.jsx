import { View, Text, StyleSheet, Image} from 'react-native'
import React from 'react'
import { Pressable } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartList from '@/components/ui/CartList'

const confirmation = () => {
  const orderLocation = "People's Organic Coffee, Campus Center"
  return (
    <View style={styles.container}>
      <View style={styles.decorativeBar}/>
      <View style={styles.textContainer}>
        <Text style={styles.confirmationTitle}>Your Order</Text>
        <Text style={styles.confirmationLocation}>{orderLocation}</Text>
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

  confirmationTitle: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 26,
  },

  confirmationLocation: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 15,
  },

  textContainer: {
    margin: 15,
  },
})


export default confirmation