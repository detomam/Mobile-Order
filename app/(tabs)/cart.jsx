import { View, Text, StyleSheet, ScrollView, FlatList, Pressable} from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list';
import React, {useContext, useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartList from '@/components/ui/CartList';
import { CartContext } from '@/utils/CartContext';
import { useFocusEffect } from '@react-navigation/native';
import { LOCATION_DATA } from '@/constants/LocationData';
import { PAYMENT_METHODS } from '@/constants/PaymentMethods';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

const cart = () => {
  const { cartCount, loadCartCount, cartItems} = useContext(CartContext);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantLocation, setRestaurantLocation] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadCartCount();
    }, [])
  );

  const placeOrder = async () => {

    if (!selectedOptions.pickupTime || !selectedOptions.paymentMethod) {
      Alert.alert("Could not place order", "Select a pickup time and payment method to continue.",   
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
      );
      return;
    }
  
    try {
      const existingCart = await AsyncStorage.getItem('cart');
      const storedRestaurantName = await AsyncStorage.getItem('restaurantName');
      const cart = existingCart ? JSON.parse(existingCart) : [];
      console.log(storedRestaurantName)

      const order = {
        items: cart.map((item, index) => ({
          name: item.name,
          quantity: 1,
          customizations: item.customizations || {},
        })),
        customerName: 'Michaela DeToma',
        restaurantName: storedRestaurantName || "",
        pickupTime: selectedOptions.pickupTime || "Not selected",
        orderNumber: `ORD-${Date.now()}`
      };

      const formattedOrder = JSON.stringify(order, null, 2);

      await AsyncStorage.setItem('order', formattedOrder);
      console.log('cart items added to order')
      console.log(formattedOrder)

    } catch (error) {
      console.error('Failed to place order:', error);
    }
    // router.push('/confirmation')

  };

  useEffect(() => {
    const loadLocation = async () => {
      try {
        loadCartCount();
        if (cartCount > 0) {
          const savedRestaurant = await AsyncStorage.getItem('restaurantName');
          const savedLocation = await AsyncStorage.getItem('restaurantLocation');

          if (savedRestaurant) setRestaurantName(savedRestaurant);
          if (savedLocation) setRestaurantLocation(savedLocation);

          const matchingLocation = LOCATION_DATA.find(
            (location) => location.title === savedRestaurant
          );
  
          if (matchingLocation) {
            setAvailableTimes(matchingLocation.availableTimes || []);
          }
        }
      } catch (error) {
        console.error('Error retrieving location:', error);
      }
    };

    loadLocation();
  }, [cartCount]);

  useEffect(() => {
    const clearLocation = async () => {
      loadCartCount();
      if (cartCount === 0) {
        setRestaurantName('');
        setRestaurantLocation('');
        await AsyncStorage.removeItem('restaurantName');
        await AsyncStorage.removeItem('restaurantLocation');
      }
    };

    clearLocation();
  }, [cartCount]);

  const emptyCartMessage = "Looks like you haven’t added anything to your cart yet. Don’t worry, there’s lots of delicious options to choose from. Head to the home page to start an order!"
  
  return (
    <View style={{ flex: 1, backgroundColor: 'white'}}>
    <ScrollView>
      <View style = {styles.container}>
        <View style={styles.decorativeBar}/>
        <View style={styles.titleContainer}>
          <Text style={styles.cartTitle}>Your Cart</Text>
          {cartCount > 0 && (
            <>
              <Text style={styles.restaurantName}>{restaurantName}</Text>
              <Text style={styles.restaurantLocation}>{restaurantLocation}</Text>
            </>
          )}
        </View>
        <CartList></CartList>
      {cartCount > 0 && (
      <View style={[styles.orderDetails, cartCount === 0 && { display: 'none' }]}>
        <View style={styles.pickupTitleContainer}>
          <Text style={styles.cartTitle}>Select Pickup Time</Text>
        </View>
        <View >
          <DropdownSelect 
            category="pickupTime"
            options={availableTimes}
            onSelect={(category, value) => {
              setSelectedOptions(prev => ({ ...prev, [category]: value }));
            }} 
          />
        </View>

        <View style={styles.paymentTitleContainer}>
          <Text style={styles.cartTitle}>Payment Method</Text>
        </View>
          <View>
            <DropdownSelect 
              category="paymentMethod"
              options={PAYMENT_METHODS.map(method => method.title)}
              onSelect={(category, value) => {
                setSelectedOptions(prev => ({ ...prev, [category]: value }));
              }} 
            />
          </View>
      </View>
      )}
      </View>
    </ScrollView>
    {cartCount > 0 && (
    <View style={styles.fixedButtonContainer}>
      <Pressable style={({ pressed }) => [
        styles.placeOrderButton,
        pressed && styles.placeOrderButtonPressed,]}
        onPress={placeOrder}>
        <Text style={styles.placeOrderText}>Place Order</Text>
      </Pressable>
    </View>
    )}
    </View>
  )
}

function DropdownSelect({ options, onSelect, category }) {
  const [selectedValue, setSelectedValue] = useState("");

  const dropdownData = options.map((option, index) => ({
    key: option,
    value: option,
  }));

  const handleSelect = (value) => {
    const selectedOption = options.find(option => option === value);
    console.log(`Dropdown selected for ${category}: ${selectedOption}`);
    setSelectedValue(selectedOption);
    onSelect(category, selectedOption);
  };

  return (
    <SelectList
      setSelected={handleSelect}
      data={dropdownData}
      save="value"
      search={false}
      placeholder="Select"
      boxStyles={styles.dropdown}
      dropdownStyles={styles.dropdownItems}
      disabledItemStyles={styles.disabledItems}
      placeholderStyles={styles.pickupText}
      inputStyles={styles.pickupText}
      fontFamily='OpenSans_400Regular'
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingBottom: 160,
  },

  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  pickupText: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 18,
  },

  decorativeBar: {
    height: 55,
    backgroundColor: '#881c1c',
    width: '100%',
  },

  titleContainer: {
    margin: 15,
  },

  pickupTitleContainer: {
    marginBottom: 5,
    marginHorizontal: 15,
  },

  paymentTitleContainer: {
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: 15,
  },

  cartTitle: {
    fontFamily: 'OpenSans_400Regular',
    marginBottom: 5,
    fontSize: 26,
  },

  restaurantName: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 15,
  },

  restaurantLocation: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 15,
  },

  dropdown: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    paddingVertical: 20,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 15,
    borderColor: '#D9D9D9',
    elevation: 3,
    shadowColor: '#040404',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },

  dropdownItems: {
    borderColor: '#a2aaad',
    marginHorizontal: 15,
  },

  disabledItems: {
    color: '#7C7C7C'
  },

  orderDetails: {
    paddingBottom: 0,
    marginBottom: 0,
  },

  placeOrderButton: {
    backgroundColor: '#881c1c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '55%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  placeOrderButtonPressed: {
    transform: [{ scale: 0.95 }],
  },

  fixedButtonContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  placeOrderText: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 16,
    color: 'white',
  },

})

export default cart