import { View, Text, StyleSheet, Image, SectionList, SafeAreaView, FlatList, Pressable} from 'react-native'
import React, { useState, useRef, useEffect } from 'react';
import UMassAmherstImg from '@/assets/images/UMassAmherst_horiz.png'
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import CartButton from '@/components/ui/CartButton';
import { fetchMenu } from '@/utils/api';


export default function Menu() {
  const [selectedOption, setSelectedOption] = useState('Entrees');
  const sectionListRef = useRef(null);
  const router = useRouter();
  const { title, location, location_number } = useLocalSearchParams();
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionOptions = ['Entrees', 'Cold Drinks', 'Hot Drinks'];

  useEffect(() => {
    const getMenu = async () => {
      try {
        const menu = await fetchMenu(location_number);
        setMenuData(menu);
        console.log(menuData)
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };
  
    getMenu();
  }, [location_number]);

  return (
      <View style={styles.container}>
          <View style={styles.decorativeBar}>
            <Text style={styles.restaurantTitle}>{title}</Text>
            <Text style={styles.restaurantLocation}>{location}</Text>
          </View>
          <SafeAreaProvider>
            <SafeAreaView style= {styles.sectionListContainer}>
              <SectionList
              sections = {menuData}
              stickySectionHeadersEnabled = {false}
              ref={sectionListRef}
              showsVerticalScrollIndicator = {false}
              keyExtractor={(item, index) => item + index}
              renderItem={({item}) => (
                <Link href={{pathname: "/customization", params: { name: item.name, attributes: JSON.stringify(item.attributes), price: item.price, restaurantName: title, restaurantLocation: location },}} asChild>                  
                  <Pressable style={styles.itemButton}>
                    <View style={styles.itemButtonContent}>
                      <View style={styles.itemTextContainer}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <Text style = {styles.itemPrice}>${parseFloat(item.price).toFixed(2)}</Text>
                      </View>
                      {item.description && (
                        <Text style={styles.itemDescription}>{item.description}</Text>
                      )}
                    </View>
                  </Pressable>
                </Link>
              )}
              renderSectionHeader={({section: {title}}) => (
                <Text style={styles.sectionHeader}>{title}</Text>
              )}
              >
              </SectionList>
            </SafeAreaView>
          </SafeAreaProvider>

          <View style={styles.fixedButtonContainer}>
              <CartButton></CartButton>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
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
    fontSize: 18,
    flex: 1,
  },

  itemDescription: {
    marginTop: 5,
    fontSize: 13,
    fontFamily: 'OpenSans_400Regular',
  },

  itemButtonContent: {
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: 15, 
  },

  itemTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  itemPrice: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 18,
  },

  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  sectionListContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },

  itemButton: {
    backgroundColor: '#F5F5F5',
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

  sectionHeader: {
    fontWeight: 'bold',
    paddingLeft: 15,
    marginTop: 15,
    paddingBottom: 5,
    fontSize: 24,
    fontFamily: 'OpenSans_400Regular',
    backgroundColor: 'white',
  },

  decorativeBar: {
    height: 55,
    backgroundColor: '#881c1c',
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  restaurantTitle: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 20,
    color: 'white',
  },

  restaurantLocation: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 15,
    color: 'white',
  },

  fixedButtonContainer: {
    position: 'fixed',
    bottom: 35,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
})
