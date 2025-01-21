import { StyleSheet, Appearance, SafeAreaView, FlatList, ScrollView, Platform, View, Text, Image } from "react-native";
import {Colors} from '@/constants/Colors';
import {LOCATION_DATA} from "@/constants/LocationData"
import { setStatusBarHidden } from "expo-status-bar";

export default function ListView() {
    const colorScheme = Appearance.getColorScheme();
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
    const styles = createStyles(theme, colorScheme)

    const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

    return (
        <Container>
            <FlatList 
                data={LOCATION_DATA} 
                keyExtractor = {(item) => item.id.toString()}
                showsVerticalScrollIndicator = {false}
                contentContainerStyle = {styles.contentContainer}
                ListEmptyComponent = {<Text>No locations available</Text>}
                renderItem = {({ item }) => (
                    <View style = {styles.row}>
                        <View style = {styles.textRow}>
                            <Text style={[styles.itemTitle, styles.itemText]}>{item.title}</Text>
                            <Text style = {styles.itemText}>{item.location}</Text>
                        </View>
                        <View>
                            <Text>{item.hours}</Text>
                        </View>
                    </View>
            )}/>

        </Container>
    )
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        contentContainer : {
            paddingTop: 10,
            paddingBottom: 20,
            // paddingHorizontal: 12,
            backgroundColor: theme.background,
        },

        separator: {
            height: 1,
            backgroundColor: colorScheme === 'dark' ? 'white' : "black",
            width: '100%',
            // maxWidth: 500,
            marginHorizontal: 'auto',
            // marginBottom: 10,
        },
        row: {
            flexDirection: 'row',
            width: '100%',
            height: 75,
            // marginBottom: 10,
            borderStyle: 'solid',
            borderColor: colorScheme === 'dark' ? 'white' : '#a2aaad',
            borderWidth: 1,
            overflow: 'hidden',
            marginHorizontal: 'auto',
            alignItems: 'center'
        },
        textRow : {
            width: '75%',
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10,
            // marginRight: 10,
            flexGrow: 1,
        },
        itemTitle: {
            fontSize: 18,            
        },
        itemText : {
            color: theme.text,

        }
    })
}