import { View, Text, StyleSheet, ScrollView, Pressable} from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useCallback } from 'react';
import { CartContext } from '@/utils/CartContext';
import {router} from 'expo-router';

const confirmation = () => {
  const { items, orderNumber, restaurantName, pickupTime, orderTotal } = useLocalSearchParams();
  const parsedItems = items ? JSON.parse(items) : [];
  const parsedOrderTotal = orderTotal ? parseFloat(orderTotal) : 0;
  const { updateCartCount } = useContext(CartContext);

  useFocusEffect(
    useCallback(() => {
      updateCartCount([]);
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.decorativeBar}/>
      <View style={styles.textContainer}>
        <Text style={styles.confirmationTitle}>Your Order is Confirmed!</Text>
      </View>
      <ScrollView>
      {parsedItems.map((item, index) => (
        <React.Fragment key={index}>
        
        <View style={styles.row}>
          <View style={styles.cartItem}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            {item.customizations && Object.keys(item.customizations).length > 0 && (
              <View style={{ marginTop: 5 }}>
                {Object.entries(item.customizations).map(([category, value], i) => {
                  const isEmpty = value == null ||
                    (Array.isArray(value) && value.length === 0) ||
                    (typeof value === 'string' && value.trim() === '');

                  if (isEmpty) return null;

                  return (
                    <Text key={i} style={styles.itemText}>
                      {category}:
                        {Array.isArray(value)
                          ? value.map((entry, idx) => (
                              <Text key={idx} style={styles.itemText}>
                                {" " + entry.name}
                                {idx < value.length - 1 ? ',' : ''}
                              </Text>
                            ))
                          : (
                              <Text style={styles.itemText}>
                                {value.name}
                              </Text>
                        )}
                    </Text>
                  );
                })}
              </View>
            )}
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.itemPrice}>$ {parseFloat(item.price).toFixed(2)}</Text>
          </View>
        </View>
        </React.Fragment>
      ))}
      <View style={styles.orderTotalContainer}>
          <Text style={styles.orderTotal}>Total: $ {parsedOrderTotal.toFixed(2)}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Order Number: {orderNumber}</Text>
        <Text style={styles.text}>Restaurant: {restaurantName}</Text>
        <Text style={styles.text}>Pickup Time: {pickupTime}</Text>   
      </View>
        <View style={styles.homeButtonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.homeButton,
              pressed && styles.homeButtonPressed,
            ]}
            onPress={() => router.push('/')}>
            <Text style={styles.homeButtonText}>Start a New Order</Text>
          </Pressable>
        </View>
      </ScrollView>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },

  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  decorativeBar: {
    height: 55,
    backgroundColor: '#881c1c',
    width: '100%',
  },

  confirmationTitle: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 26,
  },

  text: {
    marginBottom: 5,
    fontFamily: 'OpenSans_400Regular',
    fontSize: 18,
  },

  textContainer: {
    margin: 15,
  },

  row: {
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

  itemTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans_400Regular',
  },
  
  itemText : {
    color: 'black',
    fontFamily: 'OpenSans_400Regular',
  },

  itemPrice : {
    color: 'black',
    fontSize: 18,
    fontFamily: 'OpenSans_400Regular',
  },

  orderTotalContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 15,
  },

  orderTotal: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'OpenSans_400Regular',
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
    marginTop: 30,
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
})


export default confirmation