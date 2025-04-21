import { View, Text, StyleSheet, Image, SectionList, SafeAreaView, FlatList, Pressable, Animated} from 'react-native'
import React, { useState, useRef, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartButton from '@/components/ui/CartButton';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { CartContext } from '@/utils/CartContext';
import { Alert } from 'react-native';
import MultiSelect from 'react-native-multiple-select';

export default function Customization() {
  const sectionListRef = useRef(null);
  const { name, attributes, price, restaurantName, restaurantLocation } = useLocalSearchParams();
  const parsedAttributes = attributes ? JSON.parse(attributes) : [];
  const [selectedOptions, setSelectedOptions] = useState({});
  const {cartCount, updateCartCount } = useContext(CartContext);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleOptionSelect = (category, value) => {
    console.log(`Selected ${category}: ${value}`);
    setSelectedOptions((prev) => {
      const updatedOptions = {
        ...prev,
        [category]: value,
      };
      console.log('Updated options:', updatedOptions);
      return updatedOptions;
    });
  };

  const handleMultiSelectChange = (category, value) => {
    let finalValue = value;
  
    if (typeof value === 'function') {
      try {
        finalValue = value();
      } catch (err) {
        console.warn(`[handleMultiSelectChange] function could not be executed for ${category}`);
        finalValue = [];
      }
    }
  
    // Handle if value is null or undefined
    if (!finalValue) {
      console.warn(`[handleMultiSelectChange] value is null or undefined for ${category}`);
      finalValue = [];
    }
  
    console.log(`[handleMultiSelectChange] category: ${category}, value:`, finalValue);
  
    setSelectedOptions((prev) => {
      const updatedOptions = {
        ...prev,
        [category]: Array.isArray(finalValue) ? [...finalValue] : [finalValue],
      };
      console.log('Updated options:', updatedOptions);
      return updatedOptions;
    });
  };

  const handleCartReset = (newItem) => async () => {
    console.log("handling cart reset");
    try {
      await AsyncStorage.setItem('restaurantName', restaurantName);
      await AsyncStorage.setItem('restaurantLocation', restaurantLocation);

      const newCart = [newItem];

      await AsyncStorage.setItem('cart', JSON.stringify(newCart));

      const cart = await AsyncStorage.getItem('cart');

      console.log('Item added to cart:', newItem);
      console.log("Updated Cart Count:", cartCount);

      updateCartCount(cart);
    
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  }

  const addToOrder = async () => {
    try {
      const newItem = {
        name,
        customizations: selectedOptions,
        price,
      };

      const existingCart = await AsyncStorage.getItem('cart');
      const storedRestaurantName = await AsyncStorage.getItem('restaurantName');
      const cart = existingCart ? JSON.parse(existingCart) : [];

      console.log('stored restaurant name: ', storedRestaurantName)
      console.log('new restaurant name: ', restaurantName)

      if (storedRestaurantName && storedRestaurantName !== restaurantName && cart.length !== 0) {
        Alert.alert("Order Already in Progress", "You already have an order in progress. Would you like to clear the cart?",
          [      
            {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          
            {
              text: "Clear Cart",
              onPress: () => handleCartReset(newItem)(),
            }]
        );
      }

      else {
        cart.push(newItem)
        await AsyncStorage.setItem('cart', JSON.stringify(cart));
        await AsyncStorage.setItem('restaurantName', restaurantName)
        await AsyncStorage.setItem('restaurantLocation', restaurantLocation)
        console.log("Added to cart:", newItem);
        updateCartCount(cart);
      }

    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const existingFavorites = await AsyncStorage.getItem('favorites');
      const favorites = existingFavorites ? JSON.parse(existingFavorites) : [];
  
      const currentItem = {
        name,
        customizations: selectedOptions,
        price,
      };
  
      const matchIndex = favorites.findIndex(fav =>
        fav.name === currentItem.name &&
        fav.price === currentItem.price &&
        JSON.stringify(fav.customizations) === JSON.stringify(currentItem.customizations)
      );
  
      if (matchIndex > -1) {
        favorites.splice(matchIndex, 1);
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        setIsFavorited(false);
        console.log("Removed from favorites:", currentItem);
      } else {
        favorites.push(currentItem);
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        setIsFavorited(true);
        console.log("Added to favorites:", currentItem);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  

  return (
      <View style={styles.container}>
            <View style={styles.decorativeBar}>
                <Text style={styles.itemNameText}>{name}</Text>
            </View>
            <SafeAreaProvider>
            <SafeAreaView style= {styles.sectionListContainer}>
            <SectionList
              sections={parsedAttributes.map(attr => ({ title: attr.key, data: [attr] }))}
              ref={sectionListRef}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => `${item.key}-${index}`}
              renderItem={({ item, section }) => (
                <View>
                  {section.title === "Ingredients" || section.title === "Allergens" ? (
                      <Text style={styles.ingredientText}>
                        {item.value.map((entry) => entry.value).join(", ")}
                      </Text> 
                  ) : section.title === "Size" ? (
                    <View style={styles.sizeButtonsContainer}>
                      {item.value.map(([sizeLabel, sizeValue], index) => (
                        <Pressable
                        key={index} 
                        style={styles.sizeButton} 
                        onPress={() => handleOptionSelect('Size', sizeLabel)}>
                          <Text style={styles.sizeButtonText}>{sizeLabel}</Text>
                          <Text style={styles.sizeButtonText}>{sizeValue}</Text>
                        </Pressable>
                      ))}
                    </View> 
                  ) : (
                  <DropdownMultipleSelect 
                  options={item.value} 
                  category={section.title}
                  onSelect={handleMultiSelectChange}
                  />
                  // <SelectList 
                  // data={item.value} 
                  // category={section.title} 
                  // setSelected={setSelectedOptions}
                  // boxStyles={styles.dropdownBox}
                  // dropdownStyles={styles.dropdown}/>
                  )}
                </View>
              )}
              renderSectionHeader={({ section: { title } }) => (
                <View style={styles.sectionHeaderContainer}>
                  <Text style={styles.sectionHeader}>{title}</Text>
                </View>
              )}
            />
            </SafeAreaView>
          </SafeAreaProvider>


          <View style={styles.fixedButtonContainer}>

            <FavoriteButton   
              onPress={toggleFavorite}
              isFavorited={isFavorited}>
            </FavoriteButton>

            <Pressable style={({ pressed }) => [
              styles.addToOrderButton,
              pressed && styles.addToOrderButtonPressed,]}
              onPress={addToOrder}>
              <Text style={styles.addToOrderText}>Add to Order</Text>
            </Pressable>

            <CartButton></CartButton>

          </View>

      </View>
  );
}

function DropdownSelect({ options, onSelect, category }) {
  const [selectedValue, setSelectedValue] = useState("");

  const dropdownData = options.map((option, index) => ({
    key: option,
    value: option,
  }));

  const handleSelect = (selected) => {
    setSelectedValue(selected);
    onSelect(category, selected);
  };

  return (
    <SelectList
      setSelected={handleSelect}
      data={dropdownData}
      save="value"
      search={false}
      placeholder="None"
      boxStyles={styles.dropdownBox}
      dropdownStyles={styles.dropdown}
      placeholderStyles={styles.itemText}
      fontFamily='OpenSans_400Regular'
    />
  );
}

function DropdownMultipleSelect({ options, onSelect, category }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropdownAnim] = useState(new Animated.Value(0));
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  const dropdownData = options.map((option) => ({
    id: option.key,
    name: option.value,
  }));

  const slideDown = () => {
    setDropdownVisible(true);
    Animated.timing(dropdownAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  
  const slideUp = () => {
    Animated.timing(dropdownAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setDropdownVisible(false);
    });
  };

  const dropdownTranslateY = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });
  
  const dropdownOpacity = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleSelectionChange = (selectedIds) => {
    setSelectedItems(selectedIds);
    console.log(`[DropdownMultipleSelect] ${category} selected:`, selectedIds);
    onSelect(category, selectedIds);
  };

  const selectedNames = dropdownData
    .filter((item) => selectedItems.includes(item.id))
    .map((item) => item.name)
    .join(", ");

  const customSelectText =
    selectedItems.length > 0
      ? `${selectedNames}`
      : `Select ${category}`;

  return (
    <View style={{marginVertical: 10 }}>
      <MultiSelect
        items={dropdownData}
        uniqueKey="id"
        onSelectedItemsChange={handleSelectionChange}
        selectedItems={selectedItems}
        selectText={customSelectText}
        displayKey="name"
        searchInputPlaceholderText="Search..."
        hideSubmitButton={true}
        hideDropdown={true}
        hideTags={true}
        selectedItemTextColor="#881c1c"
        selectedItemIconColor="#881c1c"
        itemTextColor="#000"
        searchInputStyle={{height: 0, display: 'none', flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}
        styleTextDropdown={styles.itemText}
        searchIcon={false}
        styleTextDropdownSelected={styles.itemText}
        fontFamily='OpenSans_400Regular'
        styleInputGroup={{
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}
        styleDropdownMenuSubsection={styles.multiDropdownBox}
        styleItemsContainer={styles.multiDropdown}
        styleRowText={{
          fontFamily: 'OpenSans_400Regular',
          fontSize: 16,
          color: '#000',
        }}

      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingBottom: 90,
  },
  horizontalListContainer : {
    flexDirection: 'row',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    marginTop: 5,
  },

  horizontalListButton: {
    padding: 5,
    marginHorizontal: 2,
  },

  horizontalListButtonPressed: {
    borderBottomWidth: 2,
    borderColor: 'black',
    borderStyle: 'solid',
  },

  horizontalListText: {
    color: '#040404',
    fontSize: 18,
    fontFamily: 'OpenSans_400Regular',
  },

  horizontalListTextPressed: {
    textDecorationLine: 'underline',
  },

  itemText: {
    fontFamily: 'OpenSans_400Regular',
    color: 'black',
    fontSize: 18,
    marginHorizontal: 10,
  },

  ingredientText: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 14,
    marginLeft: 15,
  },

  itemNameText: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 20,
    color: 'white',
  },

  sectionListContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'none',
    width: '100%',
  },

  itemButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
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

  sectionHeader: {
    fontWeight: 'bold',
    paddingLeft: 15,
    paddingBottom: 5,
    marginTop: 15,
    marginBottom: 5,
    fontSize: 24,
    fontFamily: 'OpenSans_400Regular',
    backgroundColor: 'white',
  },

  multiDropdownBox: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: 15,
    marginTop: 5,
    borderRadius: 15,
    borderColor: '#D9D9D9',
    elevation: 3,
    shadowColor: '#040404',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    height: 60,
    alignItems: 'center',
  },

  multiDropdown: {
    backgroundColor: 'white',
    borderColor: "#D9D9D9",
    borderRadius: 25,
    borderWidth: 1,
    marginHorizontal: 15,
    paddingVertical: 5,
  },

  decorativeBar: {
    height: 55,
    backgroundColor: '#881c1c',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sizeButtonsContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },

  sizeButton: {
    backgroundColor: '#F5F5F5',
    height: 90,
    width: 90,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 15,
    borderColor: '#D9D9D9',
    elevation: 3,
    shadowColor: '#040404',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },

  sizeButtonText: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 16,
  },

  addToOrderButton: {
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

  addToOrderButtonPressed: {
    transform: [{ scale: 0.95 }],
  },

  fixedButtonContainer: {
    position: 'absolute',
    bottom: 35,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'none',
  },

  addToOrderText: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 16,
    color: 'white',
  },
})
