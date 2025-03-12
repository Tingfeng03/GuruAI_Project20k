import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Card, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchItineraries } from "../../redux/slices/itinerarySlice";

const getMapImageURL = (lat: number, long: number) => 
    `https://static-maps.yandex.ru/1.x/?ll=${long},${lat}&z=15&l=map&size=600,300`;

const TripPlan: React.FC = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const itineraries = useAppSelector((state) => state.itinerary.itineraries);
    const loading = useAppSelector((state) => state.itinerary.loading);
    const error = useAppSelector((state) => state.itinerary.error);

    useEffect(() => {
        dispatch(fetchItineraries());
    }, [dispatch]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Upcoming Trips</Text>

            {loading && <Text style={styles.statusText}>Loading trips...</Text>}
            {error && <Text style={styles.statusText}>Error: {error}</Text>}
            {!loading && itineraries.length === 0 && <Text style={styles.statusText}>No trips found</Text>}

            <FlatList
                data={itineraries}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: "/tripDetails",
                                params: { trip: JSON.stringify(item) }
                            })
                        }
                    >
                        <Card style={styles.card}>
                            <Card.Cover
                                source={{ uri: getMapImageURL(item.itinerary.latitude, item.itinerary.longitude) }}
                            />
                            <Card.Content>
                                <Text style={styles.address}>{item.itinerary.travelLocation}</Text>
                                <Text>
                                    {item.itinerary.tripFlow[0]?.date} - {item.itinerary.tripFlow.at(-1)?.date || "Unknown"}
                                </Text>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                )}
            />
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
    statusText: {
        fontSize: 16,
        color: "gray",
        textAlign: "center",
        marginTop: 20,
    },
});

export default TripPlan;
