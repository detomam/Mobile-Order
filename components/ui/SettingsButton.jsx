import { View, StyleSheet, Pressable, Text} from 'react-native'
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';

export default function SettingsButton(){
  const router = useRouter();

  return (    
    <View style={styles.buttonContainer}>
      <Pressable style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        ]}
      >
        <Ionicons
            name='settings'
            color="white"
            size={50}
        />
      </Pressable>
      <Text style={styles.buttonLabel}>Settings</Text>
    </View>
)}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#881c1c',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    width: 100,
    height: 100,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },

  buttonLabel: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 18,
    marginTop: 10,
  },

  buttonContainer: {
    alignItems: 'center'
  },

})

