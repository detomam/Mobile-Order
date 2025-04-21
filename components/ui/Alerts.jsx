import React from 'react';
import {StyleSheet, Button, Alert} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Alert() {

  const createTwoButtonAlert = () =>
    Alert.alert('Alert Title', 'My Alert Msg', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

    const createOneButtonAlert = () =>
      Alert.alert('Alert Title', 'My Alert Msg', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);


    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Button title={'2-Button Alert'} onPress={createTwoButtonAlert} />
          <Button title={'1-Button Alert'} onPress={createOneButtonAlert} />
        </SafeAreaView>
      </SafeAreaProvider>
    );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});