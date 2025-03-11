import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import Animated from 'react-native-reanimated';

interface CardProps {
    trip: {
        datetime: Date;
        specificNameOfLocation: string;
        Address: string;
        goingWhere: {
            lat: number;
            long: number;
        };
        WhatToDo: string;
    }
}

interface TripFlow {
    cards: CardProps[];
}

const getMapImageURL = (lat: number, long: number) => {
    return `https://static-maps.yandex.ru/1.x/?ll=${long},${lat}&z=15&l=map&size=600,300`;
};

const TripFlow: React.FC = () => {
    const [data, setdata] = React.useState<TripFlow[]>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                //FIXME
                const response = await fetch("https://your-backend-api.com/location");
                const data: TripFlow[] = await response.json();
                setdata(data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, []); // this empty array ensures useEffect only run once, since we provide empty dependency

    return (
        // consider using FlatList if more than 20 items
        <View style={styles.container}>
            <Animated.ScrollView contentContainerStyle={styles.scrollContent}>
                {data.map((tripflow: TripFlow, index) =>
                    tripflow.cards.map((card: CardProps, cardIndex) => {
                        const trip = card.trip;
                        return (
                            <Card key={`${index}-${cardIndex}`} style={styles.card}>
                                <Card.Cover source={{ uri: getMapImageURL(trip.goingWhere.lat, trip.goingWhere.long) }} />
                                <Card.Content>
                                    <Text style={styles.title}>{trip.specificNameOfLocation}</Text>
                                    <Text style={styles.address}>{trip.Address}</Text>
                                    <Text style={styles.details}>{trip.WhatToDo}</Text>
                                    <Text style={styles.datetime}>{new Date(trip.datetime).toLocaleString()}</Text>
                                </Card.Content>
                            </Card>
                        )
                    })
                )}
            </Animated.ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    scrollContent: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        borderRadius: 8,
        overflow: "hidden",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 8,
    },
    address: {
        fontSize: 14,
        color: "gray",
        marginBottom: 4,
    },
    details: {
        fontSize: 16,
        marginBottom: 4,
    },
    datetime: {
        fontSize: 12,
        color: "#555",
    },
});

export default TripFlow;
