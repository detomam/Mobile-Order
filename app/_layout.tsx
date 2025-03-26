import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Appearance } from 'react-native';
import {Colors} from '@/constants/Colors';
import { OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { useFonts } from '@expo-google-fonts/open-sans';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [loaded] = useFonts({
    OpenSans_400Regular,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <Stack screenOptions={ {headerStyle: {backgroundColor: theme.headerBackground}, headerTintColor: theme.text, headerShadowVisible: false, headerBackTitle: 'Back'}}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen name="index" options={{ headerShown: false, title: "Home"}} />
        <Stack.Screen name="cart" options={{ headerShown: true, title: "Cart"}} />
        <Stack.Screen name="customization" options={{ headerShown: true, title: "Customize"}} />
        <Stack.Screen name="menu" options={{ headerShown: true, title: "Build Your Order"}} />
        <Stack.Screen name="settings" options={{ headerShown: true, title: "Settings"}} />
        <Stack.Screen name="+not-found" options={{headerShown: false}}/>
        {/* <Stack.Screen name="index" options={{title: 'Home', headerShown: false, headerStyle: {backgroundColor: '881c1c'}}}></Stack.Screen> */}
        {/* <Stack.Screen name="shoppingBag" options={{title: 'Shopping Bag', headerStyle: {backgroundColor: '881c1c'}}}></Stack.Screen> */}

      </Stack>
      // <StatusBar style="auto" />
  );
}
