import { useFonts } from '@expo-google-fonts/open-sans';
import { OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { View, Text, StyleSheet, Image, Pressable} from 'react-native'
import React, {useState} from 'react'
import {Link} from 'expo-router'
import { TextInput } from 'react-native-gesture-handler'
import SearchBar from '@/components/ui/SearchBar'
import ListView from '@/components/ui/ListView'

const app = () => {
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.decorativeBar}/>
      <SearchBar></SearchBar> 
      <ListView></ListView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    // marginHorizontal: "auto",
  },

  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  title: {
    color: 'black',
    fontSize: 42,
    fontWeight: 'bold',    
    textAlign: 'center',
    marginBottom: 120
  },

  link: {
    color: 'black',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
    padding: 4
  },

  button: {
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 6,
    justifyContent: 'center'
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 4
  },

  decorativeBar: {
    height: 55,
    backgroundColor: '#881c1c',
    width: '100%',
  },

  searchBarContainer: {
    width: '100%',
    padding: 10,
    justifyContent: 'center',
  },

  searchBarInput: {
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
})

export default app