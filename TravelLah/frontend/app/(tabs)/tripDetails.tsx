import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card } from "react-native-paper";

interface ActivityContent {
  specificLocation?: string;
  address?: string;
  latitude?: number | string;
  longitude?: number | string;
  startTime?: string;
  endTime?: string;
  activityType?: string;
  notes?: string;
}

interface TripFlow {
  date?: string;
  activityContent?: ActivityContent[];
}

interface Trip {
  id: string;
  userId?: string;
  tripSerialNo?: string;
  travelLocation?: string;
  latitude?: number | string;
  longitude?: number | string;
  startDate?: string;
  endDate?: string;
  tripFlow?: TripFlow[];
}

const TripDetails: React.FC = () => {
  const params = useLocalSearchParams();
  const trip: Trip | null = params.trip ? JSON.parse(params.trip as string) : null;
  const [expandedDays, setExpandedDays] = useState<{ [key: number]: boolean }>({});
  console.log("trip: ", trip);

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No trip details available.</Text>
      </View>
    );
  }

  // Toggle expand/collapse for each day
  const toggleExpand = (index: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  console.log()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{trip.travelLocation || "Unknown Location"}</Text>
      <Text style={styles.subtitle}>Trip Serial No: {trip.tripSerialNo || "N/A"}</Text>
      <Text style={styles.subtitle}>
        Dates: {trip["startDate"] || "??"} - {trip["endDate"] || "??"}
      </Text>

      {/* If there's no tripFlow or empty array, show a warning */}
      {(!trip.tripFlow || trip.tripFlow.length === 0) ? (
        <Text style={styles.warningText}>No trip itinerary found.</Text>
      ) : (
        <FlatList
          data={trip.tripFlow}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.dayContainer}>
              <TouchableOpacity onPress={() => toggleExpand(index)}>
                <Card style={styles.dayCard}>
                  <Card.Content>
                    <Text style={styles.date}>{item.date || "Unknown Date"}</Text>
                    <Text style={styles.activityCount}>
                      {item.activityContent?.length ?? 0} activities
                    </Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>

              {expandedDays[index] && (

                <FlatList
                  data={item.activityContent}
                  keyExtractor={(_, i2) => i2.toString()}
                  renderItem={({ item: activity }) => (
                    <Card style={styles.activityCard}>
                      <Card.Content>
                        <Text style={styles.activityTitle}>
                          {activity.specificLocation || "Unknown Place"}
                        </Text>
                        <Text style={styles.activityText}>
                          {activity.address || "No address available"}
                        </Text>
                        <Text style={styles.activityText}>
                          {activity.startTime || "??"} - {activity.endTime || "??"}
                        </Text>
                        <Text style={styles.activityText}>
                          Type: {activity.activityType || "N/A"}
                        </Text>
                        <Text style={styles.notes}>{activity.notes || "No details provided"}</Text>
                      </Card.Content>
                    </Card>
                  )}
                />
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

// Example styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 4, color: "#333" },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 8 },
  errorText: { fontSize: 16, color: "red", textAlign: "center", marginTop: 20 },
  warningText: { fontSize: 14, color: "orange", textAlign: "center", marginTop: 10 },
  dayContainer: { marginBottom: 12 },
  dayCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  date: { fontSize: 18, fontWeight: "bold", color: "#333" },
  activityCount: { fontSize: 14, color: "#666" },
  activityCard: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4, color: "#333" },
  activityText: { fontSize: 14, color: "#555", marginBottom: 2 },
  notes: { fontSize: 12, color: "#777", marginTop: 4 },
});

export default TripDetails;
