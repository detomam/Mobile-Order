import { View, Text, StyleSheet, Image} from 'react-native'
import React from 'react'
import UMassAmherstImg from '@/assets/images/UMassAmherst_horiz.png'


const cart = () => {
  return (
    <View style={styles.container}>
      <View style={styles.navBar}/>
      <Image source={UMassAmherstImg}></Image>
      <Text>Your Cart</Text>
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

  navBar: {
    height: 60,
    backgroundColor: '#881c1c',
    width: '100%',
  },
})


export default cart