import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, Card, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setTripData } from "../../redux/slices/tripSlice";
import { addItinerary } from "../../redux/slices/itinerarySlice";

export default function SearchPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const tripData = useSelector((state: RootState) => state.trip);

  const [loading, setLoading] = useState(false);

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString();
  };

  const travelDurationDisplay =
    tripData.checkIn && tripData.checkOut
      ? `${formatDate(tripData.checkIn)} - ${formatDate(tripData.checkOut)}`
      : "";

  const handleInputChange = (field: string, value: string) => {
    dispatch(setTripData({ [field]: value }));
  };

  const handleSearch = async () => {
    console.log("Searching with trip data:", tripData);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });
      if (!response.ok) {
        throw new Error(`Server error (POST): ${response.statusText}`);
      }

      const newTrip = await response.json();
      console.log("POST result (Python backend):", newTrip);

      dispatch(addItinerary(newTrip));

      dispatch(
        setTripData({
          itinerary: null, // or {}
          destination: "",
          checkIn: "",
          checkOut: "",
          guestsAndRooms: { adults: 0, children: 0, rooms: 0 },
          budget: "",
          activities: "",
          food: "",
          pace: "",
          additionalNotes: "",
        })
      );

      router.push("/(tabs)/tripPlan");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Generating your Trip Plan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.description}>
          Our AI will help you generate the most related Trip Plan
        </Text>
        <Card style={styles.card}>
          <Card.Content>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/destinationSearch")}
              activeOpacity={0.8}
              style={styles.touchableContainer}
            >
              <TextInput
                label="Destination / Hotel Name"
                mode="outlined"
                value={tripData.destination}
                editable={false}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/selectDate")}
              activeOpacity={0.8}
              style={styles.touchableContainer}
            >
              <TextInput
                label="Travel Duration"
                mode="outlined"
                value={travelDurationDisplay}
                editable={false}
                right={<TextInput.Icon icon="calendar" />}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/guestAndRoom")}
              activeOpacity={0.8}
              style={styles.touchableContainer}
            >
              <TextInput
                label="Guests and Rooms"
                mode="outlined"
                value={`Adults: ${tripData.guestsAndRooms.adults}  Children: ${tripData.guestsAndRooms.children}  Rooms: ${tripData.guestsAndRooms.rooms}`}
                editable={false}
                right={<TextInput.Icon icon="account-multiple" />}
              />
            </TouchableOpacity>

            <TextInput
              label="Budget"
              mode="outlined"
              value={tripData.budget}
              onChangeText={(text) => handleInputChange("budget", text)}
              right={<TextInput.Icon icon="currency-usd" />}
            />

            <TextInput
              label="Activities"
              mode="outlined"
              value={tripData.activities}
              onChangeText={(text) => handleInputChange("activities", text)}
              right={<TextInput.Icon icon="run" />}
            />

            <TextInput
              label="Food"
              mode="outlined"
              value={tripData.food}
              onChangeText={(text) => handleInputChange("food", text)}
              right={<TextInput.Icon icon="food" />}
            />

            <TextInput
              label="Pace"
              mode="outlined"
              value={tripData.pace}
              onChangeText={(text) => handleInputChange("pace", text)}
              right={<TextInput.Icon icon="walk" />}
            />

            <TextInput
              label="Additional Notes"
              mode="outlined"
              value={tripData.additionalNotes}
              onChangeText={(text) => handleInputChange("additionalNotes", text)}
              right={<TextInput.Icon icon="note" />}
            />

            <Button mode="contained" style={styles.searchButton} onPress={handleSearch}>
              Search
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  description: { marginVertical: 8, fontSize: 16 },
  card: { marginTop: 8, paddingBottom: 16 },
  touchableContainer: { marginVertical: 8 },
  searchButton: { marginTop: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
