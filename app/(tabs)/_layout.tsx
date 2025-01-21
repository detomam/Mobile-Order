import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeHeaderLogo from '@/components/ui/HomeHeaderLogo';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#ffffff'},
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
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({focused}) => <Ionicons name={focused ? "settings" : "settings-outline"} size={28} color={'white'} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: HomeHeaderLogo,
          tabBarIcon: ({focused}) => <Ionicons size={28} name={focused ? "home" : "home-outline"} color={'white'} />,
        }}
      />
      <Tabs.Screen
        name="shoppingBag"
        options={{
          title: 'Bag',
          tabBarIcon: ({focused}) => <Ionicons name={focused ? "bag" : "bag-outline"} size={28} color={'white'} />,
        }}
      />
    </Tabs>
  );
}
