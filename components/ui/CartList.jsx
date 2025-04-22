import { StyleSheet, Appearance, SafeAreaView, FlatList, ScrollView, Platform, View, Text, Pressable,} from "react-native";
import {Colors} from '@/constants/Colors';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useContext } from 'react';
import {router} from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { CartContext } from "@/utils/CartContext";


const colorScheme = Appearance.getColorScheme();
const theme = colorScheme === "dark" ? Colors.dark : Colors.light;


export default function CartList() {
const [cartData, setCartData] = useState([]);
const { cartCount, loadCartCount, cartItems, updateCartCount} = useContext(CartContext);

    const getData = async (key) => {
        try {
          const value = await AsyncStorage.getItem(key);
          return value != null ? JSON.parse(value) : null;
        } catch (error) {
          console.error('Error retrieving data:', error);
        }
      };
      
    const removeItem = async (itemIndex) => {
      try {
        const cart = await getData('cart');
        const updatedCart = cart.filter((_, index) => index !== itemIndex);
        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartData(updatedCart);
        updateCartCount(updatedCart);
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    };

    useFocusEffect(
        React.useCallback(() => {
            const loadCart = async () => {
                const cart = await getData('cart');
                setCartData(cart || []);
            };
    
            loadCart();
        }, [])
    );
    
    const emptyCartMessage = "Looks like you haven't added anything to your cart yet. Don't worry, there's lots of delicious options to choose from. Head to the home page to start an order!"

    const orderTotal = cartData.reduce((sum, item) => {
      const price = parseFloat(item.price);
      const quantity = item.quantity ? parseInt(item.quantity) : 1;
      console.log(`Item price: ${price}, quantity: ${quantity}`);
      return !isNaN(price) && !isNaN(quantity) ? sum + price * quantity : sum;
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {cartData.length === 0 ? (
          <>
            <Text style={styles.emptyCartMessage}>{emptyCartMessage}</Text>
            <View style={styles.homeButtonContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.homeButton,
                  pressed && styles.homeButtonPressed,
                ]}
                onPress={() => router.push('/')}>
                <Text style={styles.homeButtonText}>Home Page</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            {cartData.map((item, index) => (
              <View key={index} style={styles.cartRow}>
                <View style={styles.cartItem}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  {item.quantity && (
                    <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
                  )}
                  {item.customizations && Object.keys(item.customizations).length > 0 && (
                    <View style={{ marginTop: 5 }}>
                      {Object.entries(item.customizations).map(([category, value], i) => {
                        const isEmpty =
                          value == null ||
                          (Array.isArray(value) && value.length === 0) ||
                          (typeof value === 'string' && value.trim() === '');

                        if (isEmpty) return null;

                        return (
                          <Text key={i} style={styles.itemText}>
                            {category}: {Array.isArray(value) ? value.join(', ') : value}
                          </Text>
                        );
                      })}
                    </View>
                  )}
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.itemPrice}>$ {parseFloat(item.price).toFixed(2)}</Text>
                </View>
                <Pressable onPress={() => removeItem(index)}>
                  <Ionicons name="close-outline" size={20} />
                </Pressable>
              </View>
            ))}
            <View style={styles.orderTotalContainer}>
              <Text style={styles.orderTotal}>Total: $ {(orderTotal).toFixed(2)}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer : {
        paddingTop: 10,
        paddingBottom: 10,
        width: '100%',
        backgroundColor: theme.background,
    },

    textRow : {
        width: '50%',
        paddingTop: 10,
        flexGrow: 1,
    },
    itemTitle: {
        fontSize: 18,
        fontFamily: 'OpenSans_400Regular',
    },
    itemText : {
        color: theme.text,
        fontFamily: 'OpenSans_400Regular',
    },

    emptyCartTitle: {
        fontFamily: 'OpenSans_400Regular',
        fontSize: 26,
    },
    
      emptyCartMessage: {
        fontFamily: 'OpenSans_400Regular',
        fontSize: 15,
        paddingHorizontal: 15,
    },
      homeButton: {
        backgroundColor: '#881c1c',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 25,
        width: '55%',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    
      homeButtonPressed: {
        transform: [{ scale: 0.95 }],
    },
    
      homeButtonContainer: {
        marginTop: 60,
        width: '100%',
        alignItems: 'center',
        zIndex: 10,
        elevation: 10,
        pointerEvents: 'auto',
    },
    
      homeButtonText: {
        fontFamily: 'OpenSans_400Regular',
        fontSize: 16,
        color: 'white',
    },

    cartRow: {
      flex: 1,
      flexGrow: 1,
      flexDirection: 'row',
      width: '100%',
      minHeight: 75,
      height: 'auto',
      borderStyle: 'solid',
      borderColor: '#a2aaad',
      borderWidth: 0.5,
      overflow: 'hidden',
      marginHorizontal: 'auto',
      paddingHorizontal: 15,
      paddingVertical: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },

    cartItem : {
        width: '50%',
        flexGrow: 1,
    },

    itemPrice : {
      color: 'black',
      fontSize: 18,
      fontFamily: 'OpenSans_400Regular',
    },

    priceContainer : {
      marginHorizontal: 10,
    },

    orderTotalContainer: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginRight: 45,
    },

    orderTotal: {
      color: 'black',
      fontSize: 18,
      fontFamily: 'OpenSans_400Regular',
    },

})