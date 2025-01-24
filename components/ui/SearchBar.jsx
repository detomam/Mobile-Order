import { View, TextInput, StyleSheet, Image, Pressable} from 'react-native'
import React, {useState} from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';

export default function SearchBar(){
    return(
        <View style={styles.main}>
            <AntDesign name="search1" size={20} color="#a2aaad" style={styles.icon}/>
            <TextInput 
            placeholder= 'Search locations and menus...'
            selectionColor="#881c1c"
            keyboardType="default"
            returnKeyType="search"
            style={styles.input}></TextInput>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        borderColor: '#a2aaad',
        borderWidth: 1,
        height: 35,
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 15,
        justifyContent: 'flex-start',
        shadowColor: '#373a36',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4, 
        elevation: 4,
    },

    input: {
        color: '#7C7C7C',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 2,
        marginBottom: 2,
    },
    
    icon: {
        marginRight: 8,
        marginLeft: 8,
    },
})