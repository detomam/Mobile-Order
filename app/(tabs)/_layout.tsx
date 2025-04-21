import { Tabs } from 'expo-router';
import { Platform, Pressable, } from 'react-native';
import { Link } from 'expo-router'
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeHeaderLogo from '@/components/ui/HomeHeaderLogo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withBadge } from 'react-native-elements';
import React, { useContext, useCallback, useEffect, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { CartContext } from '@/utils/CartContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { cartCount, setCartCount } = useContext(CartContext);

  const loadCartCount = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      const cartItems = cart ? JSON.parse(cart) : [];
      setCartCount(cartItems.length);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };


  useFocusEffect(
    useCallback(() => {
      loadCartCount();
      console.log(cartCount)
    }, [])
  );

  useEffect(() => {
    loadCartCount();
  }, []);

  const badgeStyle = {
    backgroundColor: 'white',
  };

  const textStyle = {
    color: 'black'
  };

  const BadgedIcon = useMemo(() => {
    return cartCount > 0 
      ? withBadge(cartCount, { badgeStyle, textStyle })(Ionicons) 
      : Ionicons;
  }, [cartCount]);

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
            <Link href="./info" style={{ marginHorizontal: 'auto' }} asChild>
              <Pressable
                style={{
                  marginRight: 10,
                  marginBottom: 10,
                }}
              >
              <Ionicons name="menu-outline" size={30} color="#881c1c" />
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
          tabBarIcon: ({focused}) => <BadgedIcon name={focused ? "cart" : "cart-outline"} size={28} color={'white'} />
          ,
        }}
      />
      <Tabs.Screen
        name="confirmation"
        options={{
          title: 'Order Confirmation',
          href: null,
          tabBarIcon: ({focused}) => <Ionicons name={focused ? "cart" : "cart-outline"} size={28} color={'white'} />,
        }}
      />
    </Tabs>
  );
}
