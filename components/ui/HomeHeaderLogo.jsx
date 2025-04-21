import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import UMassAmherstLogo from '@/assets/images/UMassAmherst_horiz.png'

export default function HomeHeaderLogo() {
  return (
    <View style={styles.container}>
      <Image
        source={UMassAmherstLogo}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 55,                
    justifyContent: 'flex-end',
    paddingBottom: 15,          
  },
  logo: {
    width: 160,
    height: 30,
  },
});