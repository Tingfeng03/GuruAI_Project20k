import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { TripContext } from '../../Provider/TripContext';

export default function SearchPage() {
    const router = useRouter();
    const { tripData, setTripData } = useContext(TripContext);

    const formatDate = (isoString: string) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleDateString();
    };

    const travelDurationDisplay =
        tripData.checkIn && tripData.checkOut
            ? `${formatDate(tripData.checkIn)} - ${formatDate(tripData.checkOut)}`
            : '';

    const budgetOnChange = (text: string) => {
        setTripData({ budget: text });
    };

    const handleSearch = () => {
        console.log('Searching with trip data:', tripData);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.description}>
                    Our AI will help you generate the most related Trip Plan
                </Text>
                <Card style={styles.card}>
                    <Card.Content>
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/destinationSearch')}
                            activeOpacity={0.8}
                            style={styles.touchableContainer}
                        >
                            <TextInput
                                label="Destination / Hotel Name"
                                mode="outlined"
                                value={tripData.destination}
                                editable={false}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/selectDate')}
                            activeOpacity={0.8}
                            style={styles.touchableContainer}
                        >
                            <TextInput
                                label="Travel Duration"
                                mode="outlined"
                                value={travelDurationDisplay}
                                editable={false}
                                right={<TextInput.Icon icon="calendar" />}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/guestAndRoom')}
                            activeOpacity={0.8}
                            style={styles.touchableContainer}
                        >
                            <TextInput
                                label="Guests and Rooms"
                                mode="outlined"
                                value={
                                    "Adults: " +
                                    tripData.guestsAndRooms.adults +
                                    " Children: " +
                                    tripData.guestsAndRooms.children +
                                    " Rooms: " +
                                    tripData.guestsAndRooms.rooms
                                }
                                onChangeText={() => { }}
                                right={<TextInput.Icon icon="account-multiple" />}
                            />
                        </TouchableOpacity>

                        <TextInput
                            label="Budget"
                            mode="outlined"
                            value={tripData.budget}
                            onChangeText={budgetOnChange}
                            right={<TextInput.Icon icon="currency-usd" />}
                        />

                        <Button mode="contained" style={styles.searchButton} onPress={handleSearch}>
                            Search
                        </Button>
                    </Card.Content>
                </Card>

                {/* <Card style={styles.dashboardCard}>
                    <Card.Title title="Trip Dashboard" />
                    <Card.Content>
                        <Text>Overview of your trips will go here.</Text>
                    </Card.Content>
                </Card> */}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1,  },
    scrollContent: { padding: 16 },
    description: { marginVertical: 8, fontSize: 16 },
    card: { marginTop: 8, paddingBottom: 16, },
    touchableContainer: { marginVertical: 8 },
    searchButton: { marginTop: 16 },
    dashboardCard: { marginTop: 16 },
});
