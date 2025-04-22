import { Stack } from 'expo-router';
import { View } from 'react-native'
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Appearance } from 'react-native';
import {Colors} from '@/constants/Colors';
import { OpenSans_400Regular } from '@expo-google-fonts/open-sans';
import { useFonts } from '@expo-google-fonts/open-sans';
import { CartProvider } from '@/utils/CartContext';
import HomeHeaderLogo from '@/components/ui/HomeHeaderLogo';
import { FavoritesProvider } from '@/utils/FavoritesContext';

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
    <FavoritesProvider>
    <CartProvider>
      <Stack screenOptions={ {headerStyle: {backgroundColor: theme.headerBackground}, headerTintColor: theme.text, headerShadowVisible: false, headerBackTitle: 'Back'}}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen name="index" options={{ headerShown: false, title: "Home"}} />
        <Stack.Screen name="cart" options={{ headerShown: true, title: "Cart"}} />
        <Stack.Screen name="customization" options={{ headerShown: true, title: "Customize"}} />
        <Stack.Screen name="menu" options={{ headerShown: true, title: "Build Your Order"}} />
        <Stack.Screen name="favorites" options={{ headerShown: true, title: "Favorites"}} />
        <Stack.Screen name="info" options={{ headerShown: true, headerTitle: () => (
          <View style={{ paddingBottom: 10 }}>
            <HomeHeaderLogo />
          </View>
        ),
        }} 
        />
        <Stack.Screen name="+not-found" options={{headerShown: false}}/>

      </Stack>
    </CartProvider>
    </FavoritesProvider>
  );
}
