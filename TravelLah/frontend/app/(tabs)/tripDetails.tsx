import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Linking } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card } from "react-native-paper";
<<<<<<< Updated upstream
=======
import dayjs from "dayjs";
import { weather } from "../../config/weather";
>>>>>>> Stashed changes

const openGoogleMaps = (lat?: number, long?: number) => {
  if (!lat || !long) return;
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
  Linking.openURL(url);
};

const TripDetails: React.FC = () => {
  const params = useLocalSearchParams();
  const trip = params.trip ? JSON.parse(params.trip as string) : null;
  const [expandedDays, setExpandedDays] = useState<{ [key: number]: boolean }>({});
  const [activityColors, setActivityColors] = useState<{ [key: string]: string }>({});

  if (!trip || !trip.itinerary) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No trip details available.</Text>
      </View>
    );
  }

  const fetchWeather = async (latitude: number, longitude: number) => {
    try {
      const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=weather_code&current_weather=true&forecast_days=1`;
      const response = await fetch(weatherURL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
<<<<<<< Updated upstream
      console.log("Fetched Weather:", data);
      // dispatch(setWeather(data));
=======

      const weatherDict: { [key: string]: number } = {};
      data.hourly.time.forEach((time: string, index: number) => {
        const formattedTime = dayjs(time).format("HH:mm");
        weatherDict[formattedTime] = data.hourly.weather_code[index];
      });

      return weatherDict;
>>>>>>> Stashed changes
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

<<<<<<< Updated upstream
  // have a forEach loop for activities
  // scan if activities time falls in the fetchWeather... highlight the card with the color
  // weather.json
=======
  const getCardColor = (weatherDict: { [key: string]: number } | null, startTime: string, endTime: string) => {
    if (!weatherDict) return "#FFFFFF"; 

    const times = Object.keys(weatherDict);
    const validTimes = times.filter((time) => time >= startTime && time <= endTime);
    const selectedTime = validTimes.length > 0 ? validTimes[0] : times.find((time) => time >= startTime) || startTime;

    const weatherCode = weatherDict[selectedTime]?.toString();
    const mappingEntry = weather[0][weatherCode as keyof typeof weather[0]];
    return mappingEntry?.style.color || "#FFFFFF";
  };

  useEffect(() => {
    const updateActivityColors = async () => {
      const colors: { [key: string]: string } = {};

      for (const day of trip.itinerary.tripFlow) {
        for (const activity of day.activityContent) {
          const weatherDict = await fetchWeather(activity.latitude, activity.longitude);
          const color = getCardColor(weatherDict, activity.start_time, activity.end_time);
          colors[activity.specific_location] = color;
        }
      }

      setActivityColors(colors);
    };

    updateActivityColors();
  }, [trip]);
>>>>>>> Stashed changes

  const { itinerary } = trip;
  const { travelLocation, tripSerialNo, tripFlow } = itinerary;

  const toggleExpand = (index: number) => {
    setExpandedDays((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{travelLocation || "Unknown Location"}</Text>
      <Text style={styles.subtitle}>Trip Serial No: {tripSerialNo || "N/A"}</Text>
      <View style={styles.divider} />

      {tripFlow.length > 0 ? (
        <FlatList
          data={tripFlow}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.dayContainer}>
              <TouchableOpacity onPress={() => toggleExpand(index)}>
                <Card style={styles.dayCard}>
                  <Card.Content>
                    <Text style={styles.date}>{item.date}</Text>
                    <Text style={styles.activityCount}>{item.activityContent.length || 0} activities</Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>

              {expandedDays[index] && (
                <FlatList
                  data={item.activityContent}
                  keyExtractor={(activity, idx) => idx.toString()}
                  renderItem={({ item: activity }) => (
<<<<<<< Updated upstream
                    <Card style={styles.activityCard}>
=======
                    <Card style={[styles.activityCard, { backgroundColor: activityColors[activity.specific_location] || "#FFFFFF" }]}>
>>>>>>> Stashed changes
                      <Card.Content>
                        <Text style={styles.activityTitle}>{activity.specific_location || "Unknown Place"}</Text>
                        <Text style={styles.activityText}>{activity.address || "No address available"}</Text>
                        <Text style={styles.activityText}>{activity.start_time} - {activity.end_time}</Text>
                        <Text style={styles.activityText}>Type: {activity.activity_type || "N/A"}</Text>
                        <Text style={styles.notes}>{activity.notes || "No details provided"}</Text>

                        {activity.latitude && activity.longitude && (
                          <TouchableOpacity style={styles.mapButton} onPress={() => openGoogleMaps(activity.latitude, activity.longitude)}>
                            <Text style={styles.mapButtonText}>View on Map</Text>
                          </TouchableOpacity>
                        )}
                      </Card.Content>
                    </Card>
                  )}
                />
              )}
            </View>
          )}
        />
      ) : (
        <Text style={styles.warningText}>No trip itinerary found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 12 },
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
  errorText: { fontSize: 16, color: "red", textAlign: "center", marginTop: 20 },
  warningText: { fontSize: 14, color: "orange", textAlign: "center", marginTop: 10 },
  mapButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  mapButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});

export default TripDetails;
