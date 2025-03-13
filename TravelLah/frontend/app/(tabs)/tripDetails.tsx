import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Linking } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card } from "react-native-paper";

import { weather } from "../../config/weather";
import dayjs from "dayjs";

// code compile ok, seems to render correct result also, havent tested with dummy data
const openGoogleMaps = (lat?: number, long?: number) => {
  if (!lat || !long) return;
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
  Linking.openURL(url);
};

const TripDetails: React.FC = () => {
  const params = useLocalSearchParams();
  const trip = params.trip ? JSON.parse(params.trip as string) : null;
  const [expandedDays, setExpandedDays] = useState<{ [key: number]: boolean }>({});

  const [cardColors, setCardColors] = useState<{ [key: string]: string }>({});  

  if (!trip || !trip.itinerary) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No trip details available.</Text>
      </View>
    );
  }

  

  const fetchWeather = async (latitude: string, longtitude: string) => {
    try {
      // const latitude = process.env.EXPO_PUBLIC_LATITUDE || "52.52";
      // const longitude = process.env.EXPO_PUBLIC_LONGITUDE || "13.41";
      const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longtitude}&hourly=weather_code&current_weather=true&forecast_days=1`;

      const response = await fetch(weatherURL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      
      // dictionary of time and corresponding weather code
      const weatherDict: {[key: string]: number} = {};
      data.hourly.time.forEach((time: string, index: number) => {
        const dayjsTime = dayjs(time).format("HH:mm");
        weatherDict[dayjsTime] = data.hourly.weather_code[index];
      })

      console.log("Fetched Weather:", weatherDict);
      return weatherDict;
    } catch (error) {
      console.error("Error fetching weather:", error);
      return null;
    }
  };

  const getCardColor = async (
    date: any,
    lat: any,
    long: any,
    start_time: any,
    end_time: any
  ): Promise<string> => {
    const today = dayjs().format("YYYY-MM-DD");
    if (date !== today) {
      return "#FFFFFF"; // Return default color if the date is not today
    }
    
    // I realise we still need to call this for every card beacuse each trip flow is different lat and long
    const weatherDict = await fetchWeather(lat, long);
    if (!weatherDict) return "#FFFFFF"; // Return default color if weatherDict is null

    const times = Object.keys(weatherDict);
    const validTimes = times.filter((time) => time >= start_time && time <= end_time);

    // use the first valid time
    let selectedTime: string;
    if (validTimes.length > 0) {
      selectedTime = validTimes[0];
    } else {
      selectedTime = times.find((time) => time >= start_time) || start_time;
    }

    const weatherCode = weatherDict[selectedTime].toString();
    const mappingEntry = weather[weatherCode as keyof typeof weather];
    return mappingEntry.style.color;
  };

  const { itinerary } = trip;
  const { travelLocation, tripSerialNo, tripFlow } = itinerary;

  const toggleExpand = (index: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // useEffect to compute and update cardColors once the tripFlow data is available
  useEffect(() => {
    if (tripFlow && tripFlow.length > 0) {
      const promises: Promise<{ key: string; color: string }>[] = [];

      tripFlow.forEach((day: any, dayIndex: number) => {
        if (day.activityContent && day.activityContent.length > 0) {
          day.activityContent.forEach((activity: any, actIndex: number) => {
            const key = `${dayIndex}-${actIndex}`;
            const promise = getCardColor(
              activity.date,
              activity.latitude,
              activity.longitude,
              activity.start_time,
              activity.end_time
            ).then((color) => ({ key, color }));
            promises.push(promise);
          });
        }
      });
      
      // not really sure about this
      Promise.all(promises).then((results) => {
        const newCardColors: { [key: string]: string } = {};
        results.forEach(({ key, color }) => {
          newCardColors[key] = color;
        });
        setCardColors(newCardColors);
      });
    }
  }, [tripFlow]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{travelLocation || "Unknown Location"}</Text>
      <Text style={styles.subtitle}>Trip Serial No: {tripSerialNo || "N/A"}</Text>
      <View style={styles.divider} />

      {tripFlow && tripFlow.length > 0 ? (
        <FlatList
          data={tripFlow}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.dayContainer}>
              <TouchableOpacity onPress={() => toggleExpand(index)}>
                <Card style={styles.dayCard}>
                  <Card.Content>
                    <Text style={styles.date}>{item.date}</Text>
                    <Text style={styles.activityCount}>
                      {item.activityContent?.length || 0} activities
                    </Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>

              {expandedDays[index] && item.activityContent && (
                <FlatList
                  data={item.activityContent}
                  // not really sure about this also
                  keyExtractor={(activity, idx) => idx.toString()}
                  renderItem={({ item: activity, index: actIndex }) => {
                    const cardKey = `${index}-${actIndex}`;
                    const bgColor = cardColors[cardKey] || "#fff"; 
                    return (
                    <Card style={[styles.activityCard, {backgroundColor: bgColor}]}>
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

                        {/* Open Google Maps Button inside Activity Card */}
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

                        <TouchableOpacity
                          // style={styles.mapButton}
                          // onPress={() =>
                          //   // Implement your logic here
                          //   // Open a modal, for 'user preference'
                          //   // after finished await() 
                          //   // update the State of this page, do a page refresh to update frontend (might not need a refresh)
                          // }
                        >
                          <Text style={styles.mapButtonText}>Regenerate Activities</Text>
                        </TouchableOpacity>
                      </Card.Content>
                    </Card>
                  )}}
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
