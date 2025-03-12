import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setTripData } from "../../redux/slices/tripSlice";

export default function SearchPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const tripData = useSelector((state: RootState) => state.trip);

  const formatDate = (isoString: string) => {
    return isoString ? new Date(isoString).toLocaleDateString() : "";
  };

  const travelDurationDisplay =
    tripData.checkIn && tripData.checkOut
      ? `${formatDate(tripData.checkIn)} - ${formatDate(tripData.checkOut)}`
      : "";

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
                value={`Adults: ${tripData.guestsAndRooms.adults} Children: ${tripData.guestsAndRooms.children} Rooms: ${tripData.guestsAndRooms.rooms}`}
                right={<TextInput.Icon icon="account-multiple" />}
              />
            </TouchableOpacity>

            <TextInput
              label="Budget"
              mode="outlined"
              value={tripData.budget}
              onChangeText={(text) => dispatch(setTripData({ budget: text }))}
              right={<TextInput.Icon icon="currency-usd" />}
            />

            <TextInput
              label="Activities"
              mode="outlined"
              value={tripData.activities}
              onChangeText={(text) => dispatch(setTripData({ activities: text }))}
              right={<TextInput.Icon icon="run" />}
            />

            <TextInput
              label="Food"
              mode="outlined"
              value={tripData.food}
              onChangeText={(text) => dispatch(setTripData({ food: text }))}
              right={<TextInput.Icon icon="food" />}
            />

            <TextInput
              label="Pace"
              mode="outlined"
              value={tripData.pace}
              onChangeText={(text) => dispatch(setTripData({ pace: text }))}
              right={<TextInput.Icon icon="walk" />}
            />

            <TextInput
              label="Additional Notes"
              mode="outlined"
              value={tripData.additionalNotes}
              onChangeText={(text) => dispatch(setTripData({ additionalNotes: text }))}
              right={<TextInput.Icon icon="note" />}
            />

            <Button mode="contained" style={styles.searchButton} onPress={() => console.log("Searching with trip data:", tripData)}>
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
});
