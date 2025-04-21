import { View, Text, StyleSheet, Image, Pressable} from 'react-native'
import React from 'react'
import SettingsButton from '@/components/ui/SettingsButton'
import UserInfoButton from '@/components/ui/UserInfoButton'
import PaymentInfoButton from '@/components/ui/PaymentInfoButton'
import FavoritesInfoButton from '@/components/ui/FavoritesInfoButton'

const info = () => {
  return (
    <View style={{flex: 1}}>
      <View style={styles.decorativeBar}/>
      <View style={styles.container}>
        <View style={styles.buttonRow}>
          <SettingsButton></SettingsButton>
          <UserInfoButton></UserInfoButton>
        </View>
        <View style={styles.buttonRow}>
          <PaymentInfoButton></PaymentInfoButton>
          <FavoritesInfoButton></FavoritesInfoButton>
        </View>
      </View>
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

  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 60,
  },
})


export default info