import { StyleSheet, Appearance, SafeAreaView, FlatList, ScrollView, Platform, View, Text, Pressable,} from "react-native";
import {Colors} from '@/constants/Colors';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {router} from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';



const colorScheme = Appearance.getColorScheme();
const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

export default function CartList() {
const [cartData, setCartData] = useState([]);
    const getData = async (key) => {
        try {
          const value = await AsyncStorage.getItem(key);
          return value != null ? JSON.parse(value) : null;
        } catch (error) {
          console.error('Error retrieving data:', error);
        }
      };
    
    const clearCart = async (key) => {
        try {
          AsyncStorage.clear();
        } catch (error) {
          console.error('Error clearing cart:', error);
        }
      };
      
    const removeItem = async (itemIndex) => {
        try {
            const cart = await getData('cart');
            const updatedCart = cart.filter((_, index) => index !== itemIndex);
            await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
            setCartData(updatedCart);
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
    
    const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;
    const emptyCartMessage = "Looks like you haven't added anything to your cart yet. Don't worry, there's lots of delicious options to choose from. Head to the home page to start an order!"
    
    return (
        <Container style={styles.container}>
            <FlatList 
                data={cartData} 
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} 
                showsVerticalScrollIndicator = {false}
                contentContainerStyle = {styles.contentContainer}
                ListEmptyComponent = {
                <><Text style={styles.emptyCartMessage}>{emptyCartMessage}</Text>
                <View style={styles.homeButtonContainer}>
                    <Pressable style={({ pressed }) => [
                        styles.homeButton,
                        pressed && styles.homeButtonPressed,
                    ]}
                        onPress={() => router.push('/')}>
                        <Text style={styles.homeButtonText}>Home Page</Text>
                    </Pressable>
                </View></>
                }
                renderItem={({ item, index }) => (
                    <View style = {styles.cartRow}>
                        <View style={styles.cartItem}>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                            {item.quantity && (
                                <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
                            )}
                            {item.customizations && Object.keys(item.customizations).length > 0 && (
                                <Text style={styles.customizations}>
                                    {Object.entries(item.customizations).map(([key, value]) => `${value}`).join(', ')}
                                </Text>
                            )}
                        </View>
                        <Pressable onPress={() => removeItem(index)}>
                            <Ionicons name="close-outline" size={20} style={{}}></Ionicons>
                        </Pressable>     
                    </View>
                    
                    
                )}
            />

        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer : {
        paddingTop: 10,
        paddingBottom: 50,
        width: '100%',
        backgroundColor: theme.background,
    },

    rowPressed: {
        backgroundColor: "#D9D9D9",
        // opacity: 50,
    },
    rowActive: {
        backgroundColor: theme.cardBackground,
    },
    rowInactive: {
        backgroundColor: colorScheme === 'dark' ? '#4d4d4d' : '#D9D9D9',
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
        top: 60,
        width: '100%',
        alignItems: 'center',
        display: 'flex',
    },
    
      homeButtonText: {
        fontFamily: 'OpenSans_400Regular',
        fontSize: 16,
        color: 'white',
    },

    cartRow: {
        flexDirection: 'row',
        width: '100%',
        height: 75,
        borderStyle: 'solid',
        borderColor: colorScheme === 'dark' ? 'white' : '#a2aaad',
        borderWidth: 0.5,
        overflow: 'hidden',
        marginHorizontal: 'auto',
        paddingHorizontal: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    cartItem : {
        width: '50%',
        paddingTop: 10,
        flexGrow: 1,
    },
})