import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Card, Text } from "react-native-paper";
import { useRouter } from "expo-router";

interface Trip {
  id: string;
  userId?: string;
  tripSerialNo?: string;
  travelLocation?: string;
  latitude?: number;
  longitude?: number;
  "startDate"?: string;
  "endDate"?: string;
  tripFlow?: { date: string; activityContent: any[] }[];
}

const getMapImageURL = (lat?: number, lng?: number) => {
  if (lat == null || lng == null) return null;
  return `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&z=15&l=map&size=600,300`;
};

const TripPlan: React.FC = () => {
  const [itineraries, setItineraries] = useState<Trip[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/tripplans");
        const data: Trip[] = await response.json();
        setItineraries(data);

        console.log("DATTAAAAA:", data);
      } catch (error) {
        console.error("Error fetching itinerary:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Upcoming Trips</Text>

      {itineraries.length === 0 ? (
        <Text style={styles.noTrips}>No trips found</Text>
      ) : (
        <FlatList
          data={itineraries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const mapURL = getMapImageURL(item.latitude, item.longitude);
            return (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/tripDetails",
                    params: { trip: JSON.stringify(item) },
                  })
                }
              >
                <Card style={styles.card}>
                  {mapURL ? (
                    <Card.Cover source={{ uri: mapURL }} />
                  ) : (
                    <View style={styles.noImage}>
                      <Text style={styles.noImageText}>No Map Available</Text>
                    </View>
                  )}
                  <Card.Content>
                    <Text style={styles.address}>
                      📍 {item.travelLocation || "Unknown Location"}
                    </Text>
                    <Text>
                      {/* If you store start/end date in top-level fields */}
                      📅 {item["startDate"] || "??"} - {item["endDate"] || "??"}
                    </Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            );
          }}
        />
      )}
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
  noImage: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
  },
  noImageText: {
    color: "#777",
  },
});

export default TripPlan;
