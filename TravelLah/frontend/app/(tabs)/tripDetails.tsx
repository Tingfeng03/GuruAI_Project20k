import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card } from "react-native-paper";
import { weather as weatherMapping } from "../../config/weather";
import { weatherIcons } from "../../config/weatherIcons";

// Updated interface: add activityId so it will be included in the JSON
interface ActivityContent {
  _id?: string; // to store the mongoDB ID if needed
  activityId?: string;
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
  const [expandedDays, setExpandedDays] = useState<{ [dayIndex: number]: boolean }>({});
  const [weatherData, setWeatherData] = useState<{ [dayIndex: number]: { [activityIndex: number]: any } }>({});

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No trip details available.</Text>
      </View>
    );
  }

  // Open Google Maps for given lat/lng
  const openInGoogleMaps = (latitude?: string | number, longitude?: string | number) => {
    if (!latitude || !longitude) return;
    const latStr = String(latitude);
    const lngStr = String(longitude);
    const url = `https://www.google.com/maps/search/?api=1&query=${latStr},${lngStr}`;
    Linking.openURL(url);
  };

  // Fetch weather for a single activity, matching time in "YYYY-MM-DDTHH:MM" format.
  const fetchActivityWeather = async (
    latitude: string | number,
    longitude: string | number,
    date: string,
    startTime?: string
  ) => {
    try {
      const latStr = String(latitude);
      const lonStr = String(longitude);
      const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latStr}&longitude=${lonStr}&start_date=${date}&end_date=${date}&hourly=weather_code,temperature_2m,windspeed_10m&timezone=auto`;

      const response = await fetch(weatherURL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      let chosenIndex = 0;
      if (startTime) {
        // Build target time string in "YYYY-MM-DDTHH:MM" format.
        let target = `${date}T${startTime}`;
        if (!target.match(/:\d{2}$/)) {
          target = target + ":00";
        }
        const normalizedTarget = target.slice(0, 16);
        const idx = data.hourly.time.findIndex((timeStr: string) => {
          return timeStr.slice(0, 16) === normalizedTarget;
        });
        if (idx >= 0) {
          chosenIndex = idx;
        }
      }

      const weathercode = data.hourly.weather_code?.[chosenIndex];
      const temperature = data.hourly.temperature_2m?.[chosenIndex];
      const windspeed = data.hourly.windspeed_10m?.[chosenIndex];

      return { weathercode, temperature, windspeed };
    } catch (error) {
      console.error("Error fetching weather:", error);
      return null;
    }
  };

  const toggleExpand = async (dayIndex: number, dayItem: TripFlow) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayIndex]: !prev[dayIndex],
    }));

    if (!expandedDays[dayIndex] && dayItem.activityContent) {
      try {
        const dayWeathers: { [activityIndex: number]: any } = {};
        const promises = dayItem.activityContent.map(async (activity, aIndex) => {
          const { latitude, longitude, startTime } = activity;
          if (!latitude || !longitude || !dayItem.date) return null;
          const w = await fetchActivityWeather(latitude, longitude, dayItem.date, startTime);
          dayWeathers[aIndex] = w;
          return w;
        });
        await Promise.all(promises);
        setWeatherData((prev) => ({
          ...prev,
          [dayIndex]: dayWeathers,
        }));
      } catch (err) {
        console.error("Error fetching weather for day:", err);
      }
    }
  };

  // Recalibrate button handler:
  // Now includes trip id and the date from the trip flow.
  const handleRecalibrate = async (
    tripId: string,
    date: string,
    activity: ActivityContent,
    dayIndex: number,
    activityIndex: number
  ) => {
    try {
      const payload = {
        tripId: tripId,
        date: date,
        // activityId: activity.activityId,
        ...activity,
      };
      console.log("Sending activity for recalibration:", payload);

      const recalibrateURL = "http://localhost:8000/updateActivity";
      const response = await fetch(recalibrateURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Recalibration error: ${response.statusText}`);
      }
      const updatedActivity = await response.json();
      console.log("Recalibrated activity:", updatedActivity);
    } catch (error) {
      console.error("Error recalibrating activity:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{trip.travelLocation || "Unknown Location"}</Text>
      <Text style={styles.subtitle}>Trip Serial No: {trip.tripSerialNo || "N/A"}</Text>
      <Text style={styles.subtitle}>
        Dates: {trip.startDate || "??"} - {trip.endDate || "??"}
      </Text>
      {(!trip.tripFlow || trip.tripFlow.length === 0) ? (
        <Text style={styles.warningText}>No trip itinerary found.</Text>
      ) : (
        <FlatList
          data={trip.tripFlow}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item: dayItem, index: dayIndex }) => (
            <View style={styles.dayContainer}>
              <TouchableOpacity onPress={() => toggleExpand(dayIndex, dayItem)}>
                <Card style={styles.dayCard}>
                  <Card.Content>
                    <Text style={styles.date}>{dayItem.date || "Unknown Date"}</Text>
                    <Text style={styles.activityCount}>
                      {dayItem.activityContent?.length ?? 0} activities
                    </Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
              {expandedDays[dayIndex] && (
                <FlatList
                  data={dayItem.activityContent}
                  keyExtractor={(_, i2) => i2.toString()}
                  renderItem={({ item: activity, index: aIndex }) => {
                    const wData = weatherData[dayIndex]?.[aIndex];
                    const code = wData?.weathercode;
                    const codeStr = code !== undefined ? String(code) : "";
                    const mapping =
                      codeStr in weatherMapping
                        ? weatherMapping[codeStr as keyof typeof weatherMapping]
                        : null;
                    const weatherDesc = mapping?.description || "Unknown";
                    const weatherColor = mapping?.style?.color || "#000";
                    const icon = weatherIcons[codeStr] || "❓";

                    return (
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
                          <Text style={styles.notes}>
                            {activity.notes || "No details provided"}
                          </Text>
                          {wData && (
                            <View style={{ marginTop: 8 }}>
                              <Text style={[styles.weatherRow, { color: weatherColor }]}>
                                {icon}  {weatherDesc}
                              </Text>
                              <Text>Temperature: {wData.temperature}°C</Text>
                              <Text>Windspeed: {wData.windspeed} m/s</Text>
                            </View>
                          )}
                          <TouchableOpacity
                            style={styles.mapButton}
                            onPress={() => openInGoogleMaps(activity.latitude, activity.longitude)}
                          >
                            <Text style={styles.mapButtonText}>Open in Google Maps</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.recalibrateButton}
                            onPress={() => handleRecalibrate(trip.id, dayItem.date || "", activity, dayIndex, aIndex)}
                          >
                            <Text style={styles.recalibrateButtonText}>Recalibrate Activity</Text>
                          </TouchableOpacity>
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
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 4, color: "#333" },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 8 },
  errorText: { fontSize: 16, color: "red", textAlign: "center", marginTop: 20 },
  warningText: { fontSize: 14, color: "orange", textAlign: "center", marginTop: 10 },
  dayContainer: { marginBottom: 12 },
  dayCard: { backgroundColor: "#f8f8f8", borderRadius: 8, padding: 12, marginBottom: 8 },
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
  weatherRow: { fontSize: 16, fontWeight: "bold" },
  mapButton: {
    marginTop: 10,
    backgroundColor: "#4285F4",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  mapButtonText: { color: "#fff", fontWeight: "bold" },
  recalibrateButton: {
    marginTop: 10,
    backgroundColor: "#FF8C00",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  recalibrateButtonText: { color: "#fff", fontWeight: "bold" },
});

export default TripDetails;
