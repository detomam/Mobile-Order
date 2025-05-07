import { StyleSheet, Appearance, SafeAreaView, FlatList, ScrollView, Platform, View, Text, Pressable,} from "react-native";
import {Colors} from '@/constants/Colors';
import {LOCATION_DATA} from "@/constants/LocationData"
import { Link } from 'expo-router';
import { fetchLocations } from '@/utils/api';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { ActivityIndicator } from "react-native";

export default function LocationList() {
    const colorScheme = Appearance.getColorScheme();
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
    const styles = createStyles(theme, colorScheme)
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dayOfWeekNumber = moment().day();

    const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

    useEffect(() => {
        const getLocations = async () => {
            try {
              const now = moment();
              const dayOfWeek = now.isoWeekday(); // 1 = Monday, 7 = Sunday
              const currentTime = now.format('HH:mm');
        
              const data = await fetchLocations();
              const processed = data.map(location => {
                let openTime, closeTime;
        
                if (dayOfWeek >= 6) {
                  openTime = location.open_time_weekends;
                  closeTime = location.close_time_weekends;
                } else {
                  openTime = location.open_time_weekdays;
                  closeTime = location.close_time_weekdays;
                }
        
                const isOpen =
                  openTime &&
                  closeTime &&
                  moment(currentTime, 'HH:mm').isBetween(
                    moment(openTime, 'hh:mm A'),
                    moment(closeTime, 'hh:mm A'),
                    null,
                    '[)'
                  );
        
                return {
                  ...location,
                  open_status: !!isOpen,
                  hours: openTime && closeTime ? `${openTime} - ${closeTime}` : 'Closed Today',
                };
              });
        
              setLocations(processed);
            } catch (err) {
              console.error('Error fetching locations:', err);
              setError('Failed to load locations.');
            } finally {
              setLoading(false);
            }
          };
    
        getLocations();
      }, []);

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#881c1c" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    return (
        <Container style={styles.container}>
            <FlatList 
                data={locations} 
                keyExtractor={(item) => item.location_number.toString()}
                showsVerticalScrollIndicator = {false}
                contentContainerStyle = {styles.contentContainer}
                ListEmptyComponent = {<Text>No locations available</Text>}
                renderItem = {({ item }) => (
                    <Link 
                        href={{ pathname: "/menu", params: { title: item.location_name, location: item.located_in} }} 
                        asChild
                        style={[styles.row, item.open_status ? styles.rowActive : styles.rowInactive]}
                    >
                        <Pressable
                            disabled={!item.open_status}
                            style={({ pressed }) => [
                                styles.row,
                                item.open_status ? styles.rowActive : styles.rowInactive,
                                pressed && styles.rowPressed,
                            ]}
                        >
                            <View style={styles.textRow}>
                                <Text style={[styles.itemTitle, item.open_status ? styles.itemTextActive : styles.itemTextInactive]}>
                                    {item.location_name}
                                </Text>
                                <Text style={[styles.itemText, item.open_status ? styles.itemTextActive : styles.itemTextInactive]}>
                                    {item.located_in}
                                </Text>
                            </View>
                            <View>
                                <Text style={[styles.itemText, item.open_status ? styles.itemTextActive : styles.itemTextInactive]}>
                                    {item.open_status ? item.hours : 'Closed'}
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

        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.background,
          },
          loadingText: {
            fontSize: 16,
            fontFamily: 'OpenSans_400Regular',
            color: theme.text,
          },
    })
}