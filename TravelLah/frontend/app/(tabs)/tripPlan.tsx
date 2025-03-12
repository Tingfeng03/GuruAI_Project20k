import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Card, Text } from "react-native-paper";
import { useRouter } from "expo-router";

interface Trip {
    id: string;
    itinerary: {
        tripSerialNo: string;
        travelLocation: string;
        latitude: number;
        longitude: number;
        tripFlow: { date: string; activityContent: any[] }[];
    };
}

const getMapImageURL = (lat: number, long: number) => {
    return `https://static-maps.yandex.ru/1.x/?ll=${long},${lat}&z=15&l=map&size=600,300`;
};

const TripPlan: React.FC = () => {
    const [itineraries, setItineraries] = useState<Trip[]>([]);
    const router = useRouter(); // ✅ Use expo-router for navigation

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/itineraries"); // Change to your API URL
                const data: Trip[] = await response.json();
                setItineraries(data);
            } catch (error) {
                console.error("Error fetching itinerary:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
<<<<<<< Updated upstream
            <Text style={styles.title}>Your Upcoming Trips</Text>

            {itineraries.length === 0 ? (
                <Text style={styles.noTrips}>No trips found</Text>
            ) : (
                <FlatList
                    data={itineraries}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: "/tripDetails",
                                    params: { trip: JSON.stringify(item) }, // ✅ Pass trip as JSON string
                                })
                            }
                        >
                            <Card style={styles.card}>
                                <Card.Cover
                                    source={{
                                        uri: getMapImageURL(
                                            item.itinerary.latitude,
                                            item.itinerary.longitude
                                        ),
                                    }}
                                />
                                <Card.Content>
                                    <Text style={styles.address}>
                                        📍 {item.itinerary.travelLocation}
                                    </Text>
                                    <Text>
                                        📅 {item.itinerary.tripFlow[0]?.date} -{" "}
                                        {item.itinerary.tripFlow[item.itinerary.tripFlow.length - 1]
                                            ?.date || "Unknown"}
                                    </Text>
                                </Card.Content>
                            </Card>
                        </TouchableOpacity>
                    )}
                />
            )}
=======
            <Text style={styles.title}>Your Upcoming Trip</Text>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                { 
                    data.map((card: CardProps, index) => {
                        const itinerary = card.itinerary;
                        return (
                            <TouchableOpacity onPress={() => dispatch(navigateToTripFlow(itinerary.tripSerialNo))}>
                                <Card key={`${index}`} style={styles.card}>
                                    <Card.Cover source={{uri: getMapImageURL(itinerary.travelLocation.lat, itinerary.travelLocation.long)}} />
                                    <Card.Content>
                                        <Text style={styles.address}>{itinerary.locationName}</Text>
                                        <Text>{itinerary.duration.startDate.toDateString()} - {itinerary.duration.endDate.toDateString()}</Text>
                                    </Card.Content>
                                </Card>
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>
>>>>>>> Stashed changes
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        padding: 16,
    },
    card: {
        marginBottom: 16,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
    },
    address: {
        fontSize: 16,
        color: "#444",
        fontWeight: "bold",
    },
    noTrips: {
        fontSize: 16,
        color: "gray",
        textAlign: "center",
        marginTop: 20,
    },
});

export default TripPlan;
