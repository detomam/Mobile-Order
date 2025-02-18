import { View, Text, StyleSheet, Image, SectionList, SafeAreaView, FlatList, Pressable} from 'react-native'
import React, { useState, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { SelectList } from 'react-native-dropdown-select-list';



export default function Customization() {
  const sectionListRef = useRef(null);
  const { name, attributes } = useLocalSearchParams();
  const parsedAttributes = attributes ? JSON.parse(attributes) : [];
  
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
                    <Text style={styles.ingredientText}>{item.value.join(", ")}</Text> 
                  ) : section.title === "Size" ? (
                    <View style={styles.sizeButtonsContainer}>
                      {item.value.map(([sizeLabel, sizeValue], index) => (
                        <Pressable key={index} style={styles.sizeButton} onPress={() => console.log(`Selected size: ${sizeLabel} - ${sizeValue}`)}>
                          <Text style={styles.sizeButtonText}>{sizeLabel}</Text>
                          <Text style={styles.sizeButtonText}>{sizeValue}</Text>
                        </Pressable>
                      ))}
                    </View> 
                  ) : (
                  <DropdownSelect options={item.value}/>
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
      </View>
  );
}

function DropdownSelect({ options }) {
  const [selectedValue, setSelectedValue] = useState("");

  const dropdownData = options.map((option, index) => ({
    key: index.toString(),
    value: option,
  }));

  return (
    <SelectList
      setSelected={setSelectedValue}
      data={dropdownData}
      save="value"
      search={false}
      placeholder="None"
      boxStyles={styles.dropdownBox}
      dropdownStyles={styles.dropdown}
      placeholderStyles={styles.itemText}
    />
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
    marginLeft: 10,
  },

  ingredientText: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 14,
    marginLeft: 15,
  },

  itemNameText: {
    fontFamily: 'OpenSans_800ExtraBold',
    fontSize: 24,
    color: 'white',
  },

  sectionListContainer: {
    flex: 1,
    flexDirection: 'column',
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
    fontSize: 24,
    fontFamily: 'OpenSans_400Regular',
    backgroundColor: 'white',
  },

  dropdownBox: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: 15,
    marginBottom: 5,
    borderRadius: 15,
    borderColor: '#D9D9D9',
    elevation: 3,
    shadowColor: '#040404',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    height: 60,
    alignItems: 'center',
    fontFamily: 'OpenSans_400Regular',

  },
  dropdown: {
    backgroundColor: "white",
    borderColor: "white",
    marginBottom: 10,
    marginHorizontal: 15,
    fontFamily: 'OpenSans_400Regular',

  },

  decorativeBar: {
    height: 60,
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
})
