import { useNavigation } from "@react-navigation/native";
import React from "react";
import {View, StyleSheet,  TouchableOpacity} from "react-native";
import {Card, Text} from "react-native-paper";
import { ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import { navigateToTripFlow } from "./actions/navigationActions";

interface CardProps {
    itinerary : {
        tripSerialNo: number;
        travelLocation : {
            lat: number;
            long: number;
        };
        duration : {
            startDate : Date;
            endDate : Date;
        }
        locationName : string;
    }
}


const getMapImageURL = (lat: number, long: number) => {
    return `https://static-maps.yandex.ru/1.x/?ll=${long},${lat}&z=15&l=map&size=600,300`;
};


const TripPlan: React.FC = () => {
    const [data, setdata] = React.useState<CardProps[]>([]);
    const dispatch = useDispatch();

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // TODO: replace with actual backend API
                const response = await fetch(`https://${process.env.EXPO_PUBLIC_LOCAL_FRONTEND_IP}:8080/api/TripPlan`);
                const data: CardProps[] = await response.json();
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        padding: 16,
    },
    scrollContent: {
        paddingBottom: 16,
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
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    address: {
        fontSize: 14,
        color: "gray",
        marginBottom: 4,
    },
})

export default TripPlan;