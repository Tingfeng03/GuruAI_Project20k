import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList, Linking } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card, Text } from "react-native-paper";
import dayjs from "dayjs";
import { weather } from "../../config/weather";

const openGoogleMaps = (lat?: number, lng?: number) => {
  if (lat == null || lng == null) return;
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  Linking.openURL(url);
};

interface ActivityContent {
  specific_location?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  start_time?: string;
  end_time?: string;
  activity_type?: string;
  notes?: string;
}

interface TripFlow {
  date: string;
  activityContent: ActivityContent[];
}

interface Trip {
  id: string;
  userId?: string;
  tripSerialNo?: string;
  TravelLocation?: string;
  latitude?: number;
  longitude?: number;
  ["start-date"]?: string;
  ["end-date"]?: string;
  tripFlow?: TripFlow[];
}

const TripDetails: React.FC = () => {
  const params = useLocalSearchParams();
  const trip: Trip | null = params.trip ? JSON.parse(params.trip as string) : null;
  const [expandedDays, setExpandedDays] = useState<{ [key: number]: boolean }>({});
  const [activityColors, setActivityColors] = useState<{ [key: string]: string }>({});

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No trip details available.</Text>
      </View>
    );
  }

  const today = dayjs().format("YYYY-MM-DD");

  const fetchWeather = async (lat: number, lng: number) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=weather_code&current_weather=true&forecast_days=1`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      const weatherDict: { [time: string]: number } = {};
      data.hourly.time.forEach((timeStr: string, index: number) => {
        const timeHHmm = dayjs(timeStr).format("HH:mm");
        weatherDict[timeHHmm] = data.hourly.weather_code[index];
      });
      return weatherDict;
    } catch (error) {
      console.error("Error fetching weather:", error);
      return null;
    }
  };

  const getCardColor = (
    date: string,
    weatherDict: { [time: string]: number } | null,
    startTime?: string,
    endTime?: string
  ) => {
    if (date !== today) return "#FFFFFF";
    if (!weatherDict || !startTime || !endTime) return "#FFFFFF";

    const times = Object.keys(weatherDict);
    const validTimes = times.filter((t) => t >= startTime && t <= endTime);
    const selectedTime = validTimes.length > 0 ? validTimes[0] : times.find((t) => t >= startTime) || startTime;

    const weatherCode = weatherDict[selectedTime]?.toString();
    const mappingEntry = (weather as any)[weatherCode];
    if (typeof mappingEntry === "string") return "#FFFFFF";
    return mappingEntry?.style?.color || "#FFFFFF";
  };

  useEffect(() => {
    const updateActivityColors = async () => {
      const colors: { [key: string]: string } = {};

      if (!trip.tripFlow) return; 

      for (const day of trip.tripFlow) {
        for (const activity of day.activityContent) {
          if (day.date === today && activity.latitude && activity.longitude) {
            const wDict = await fetchWeather(activity.latitude, activity.longitude);
            const color = getCardColor(day.date, wDict, activity.start_time, activity.end_time);
            colors[activity.specific_location || ""] = color;
          } else {
            colors[activity.specific_location || ""] = "#FFFFFF";
          }
        }
      }
      setActivityColors(colors);
    };
    updateActivityColors();
  }, [trip]);

  const toggleExpand = (index: number) => {
    setExpandedDays((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{trip.TravelLocation || "Unknown Location"}</Text>
      <Text style={styles.subtitle}>Trip Serial No: {trip.tripSerialNo || "N/A"}</Text>
      <Text style={styles.subtitle}>
        Dates: {trip["start-date"] || "??"} - {trip["end-date"] || "??"}
      </Text>
      <View style={styles.divider} />

      {!trip.tripFlow || trip.tripFlow.length === 0 ? (
        <Text style={styles.warningText}>No trip itinerary found.</Text>
      ) : (
        <FlatList
          data={trip.tripFlow}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.dayContainer}>
              <TouchableOpacity onPress={() => toggleExpand(index)}>
                <Card style={styles.dayCard}>
                  <Card.Content>
                    <Text style={styles.date}>{item.date}</Text>
                    <Text style={styles.activityCount}>{item.activityContent.length} activities</Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>

              {expandedDays[index] && (
                <FlatList
                  data={item.activityContent}
                  keyExtractor={(act, idx) => idx.toString()}
                  renderItem={({ item: activity }) => {
                    const bgColor =
                      activityColors[activity.specific_location || ""] || "#FFFFFF";

                    return (
                      <Card style={[styles.activityCard, { backgroundColor: bgColor }]}>
                        <Card.Content>
                          <Text style={styles.activityTitle}>
                            {activity.specific_location || "Unknown Place"}
                          </Text>
                          <Text style={styles.activityText}>
                            {activity.address || "No address available"}
                          </Text>
                          <Text style={styles.activityText}>
                            {activity.start_time} - {activity.end_time}
                          </Text>
                          <Text style={styles.activityText}>
                            Type: {activity.activity_type || "N/A"}
                          </Text>
                          <Text style={styles.notes}>{activity.notes || "No details provided"}</Text>

                          {activity.latitude && activity.longitude && (
                            <TouchableOpacity
                              style={styles.mapButton}
                              onPress={() =>
                                openGoogleMaps(activity.latitude, activity.longitude)
                              }
                            >
                              <Text style={styles.mapButtonText}>View on Map</Text>
                            </TouchableOpacity>
                          )}
                        </Card.Content>
                      </Card>
                    );
                  }}
                />
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 8 },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 12 },
  date: { fontSize: 18, fontWeight: "bold", color: "#333" },
  activityCount: { fontSize: 14, color: "#666" },
  dayContainer: { marginBottom: 12 },
  dayCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
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
  activityTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  activityText: { fontSize: 14, color: "#555" },
  notes: { fontSize: 12, color: "#777", marginTop: 4 },
  warningText: { fontSize: 14, color: "orange", textAlign: "center", marginTop: 10 },
  dayText: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  mapButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  mapButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  errorText: { fontSize: 16, color: "red", textAlign: "center", marginTop: 20 },
});

export default TripDetails;
