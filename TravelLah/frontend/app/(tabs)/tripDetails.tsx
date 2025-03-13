import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card } from "react-native-paper";
import { weather as weatherMapping } from "../../config/weather";      // existing mapping for color/desc
import { weatherIcons } from "../../config/weatherIcons";             // new emoji icons

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

  // Which days are expanded
  const [expandedDays, setExpandedDays] = useState<{ [dayIndex: number]: boolean }>({});

  // Weather data: { dayIndex: { activityIndex: <data> } }
  const [weatherData, setWeatherData] = useState<{
    [dayIndex: number]: { [activityIndex: number]: any };
  }>({});

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No trip details available.</Text>
      </View>
    );
  }

  // Fetch weather from Open-Meteo
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

      // Determine which hour's weather to use
      let chosenIndex = 0;
      if (startTime) {
        // e.g. "2025-01-01T10:00"
        const target = `${date}T${startTime}`;
        const idx = data.hourly.time.indexOf(target);
        if (idx >= 0) chosenIndex = idx;
      }

      const weathercode = data.hourly.weather_code?.[chosenIndex];
      const temperature = data.hourly.temperature_2m?.[chosenIndex];
      const windspeed = data.hourly.windspeed_10m?.[chosenIndex];

      return {
        weathercode,
        temperature,
        windspeed,
      };
    } catch (error) {
      console.error("Error fetching weather:", error);
      return null;
    }
  };

  // Expand/collapse day
  const toggleExpand = async (dayIndex: number, dayItem: TripFlow) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayIndex]: !prev[dayIndex],
    }));

    // If newly expanded, fetch weather
    if (!expandedDays[dayIndex] && dayItem.activityContent) {
      try {
        const dayWeathers: { [activityIndex: number]: any } = {};

        const promises = dayItem.activityContent.map(async (activity, aIndex) => {
          const { latitude, longitude, startTime } = activity;
          if (!latitude || !longitude || !dayItem.date) {
            return null;
          }
          // fetch for this activity
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
                    // Convert code to string
                    const codeStr = code !== undefined ? String(code) : "";
                    // The text-based details from weatherMapping
                    const mapping =
                      codeStr in weatherMapping
                        ? weatherMapping[codeStr as keyof typeof weatherMapping]
                        : null;

                    const weatherDesc = mapping?.description || "Unknown";
                    const weatherColor = mapping?.style?.color || "#000";

                    // The emoji icon from weatherIcons
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

                          {/* Show weather details if any */}
                          {wData && (
                            <View style={{ marginTop: 8 }}>
                              {/* Weather icon + description */}
                              <Text style={[styles.weatherRow, { color: weatherColor }]}>
                                {icon}  {weatherDesc}
                              </Text>
                              <Text>Temperature: {wData.temperature}°C</Text>
                              <Text>Windspeed: {wData.windspeed} m/s</Text>
                            </View>
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
  weatherRow: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TripDetails;
