import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable, } from 'react-native';
import { Link } from 'expo-router'


import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeHeaderLogo from '@/components/ui/HomeHeaderLogo';
import { OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { useFonts } from '@expo-google-fonts/open-sans';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#ffffff'},
        headerTitleStyle: {
          fontFamily: 'OpenSans_700Bold',
        },
        headerTintColor: 'black',
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: '#881c1c',
          position: Platform.select({
            ios: 'absolute',
            android: 'relative',
          }),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: HomeHeaderLogo,
          headerRight: () => (
            <Link href="/settings" style={{ marginHorizontal: 'auto' }} asChild>
              <Pressable
                // onPress={() => alert('Button pressed!')}
                style={{
                  marginRight: 10,
                  marginBottom: 10,
                }}
              >
              <Ionicons name="settings-sharp" size={28} color="#881c1c" />
              </Pressable>
            </Link>
          ),
          tabBarIcon: ({focused}) => <Ionicons size={28} name={focused ? "home" : "home-outline"} color={'white'} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Your Cart',
          tabBarIcon: ({focused}) => <Ionicons name={focused ? "cart" : "cart-outline"} size={28} color={'white'} />,
        }}
      />
      <Tabs.Screen
        name="confirmation"
        options={{
          title: 'Order Confirmation',
          // href: null
          tabBarIcon: ({focused}) => <Ionicons name={focused ? "cart" : "cart-outline"} size={28} color={'white'} />,
        }}
      />
    </Tabs>
  );
}
