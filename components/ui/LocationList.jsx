import { StyleSheet, Appearance, SafeAreaView, FlatList, ScrollView, Platform, View, Text, Pressable,} from "react-native";
import {Colors} from '@/constants/Colors';
import {LOCATION_DATA} from "@/constants/LocationData"
import { setStatusBarHidden } from "expo-status-bar";
import { Link } from 'expo-router';

export default function LocationList() {
    const colorScheme = Appearance.getColorScheme();
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
    const styles = createStyles(theme, colorScheme)

    const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

    return (
        <Container style={styles.container}>
            <FlatList 
                data={LOCATION_DATA} 
                keyExtractor = {(item) => item.id.toString()}
                showsVerticalScrollIndicator = {false}
                contentContainerStyle = {styles.contentContainer}
                ListEmptyComponent = {<Text>No locations available</Text>}
                renderItem = {({ item }) => (
                    <Link 
                        href={{ pathname: "/menu", params: { title: item.title, location: item.location} }} 
                        asChild
                        style={[styles.row, item.openStatus ? styles.rowActive : styles.rowInactive]}
                    >
                        <Pressable
                            disabled={!item.openStatus}
                            style={({ pressed }) => [
                                styles.row,
                                item.openStatus ? styles.rowActive : styles.rowInactive,
                                pressed && styles.rowPressed,
                            ]}
                        >
                            <View style={styles.textRow}>
                                <Text style={[styles.itemTitle, item.openStatus ? styles.itemTextActive : styles.itemTextInactive]}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.itemText, item.openStatus ? styles.itemTextActive : styles.itemTextInactive]}>
                                    {item.location}
                                </Text>
                            </View>
                            <View>
                                <Text style={[styles.itemText, item.openStatus ? styles.itemTextActive : styles.itemTextInactive]}>
                                    {item.openStatus ? item.hours : 'Closed'}
                                </Text>
                            </View>
                        </Pressable>
                    </Link>
            )}/>

        </Container>
    )
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        contentContainer : {
            paddingTop: 10,
            paddingBottom: 50,
            width: '100%',
            backgroundColor: theme.background,
        },
        row: {
            flexDirection: 'row',
            width: '100%',
            height: 75,
            borderStyle: 'solid',
            borderColor: colorScheme === 'dark' ? 'white' : '#a2aaad',
            borderWidth: 0.5,
            overflow: 'hidden',
            marginHorizontal: 'auto',
            paddingHorizontal: 10,
            alignItems: 'center',
        },
        rowPressed: {
            backgroundColor: "#D9D9D9",
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
        itemTextActive: {
            color: theme.text,
        },
        itemTextInactive: {
            color: colorScheme === 'dark' ? '#a9a9a9' : '#7C7C7C',
        },
    })
}