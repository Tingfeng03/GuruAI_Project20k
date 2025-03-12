import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { Text, TextInput, Button, Card, Provider, Portal } from "react-native-paper";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setTripData } from "../../redux/slices/tripSlice";

export default function SearchPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const tripData = useSelector((state: RootState) => state.trip);

  // Add state variables for loading and completion status
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
    
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

  const handleSearch = async() => {
    console.log("Searching with trip data:", JSON.stringify(tripData));
  
    setIsLoading(true);

    try {
      const respone = await fetch("http://localhost:8000/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
    });

    if (!respone.ok) {
      throw new Error(`HTTP error! Status: ${respone.status}`);
    } 

    const data = await respone.json();
    console.log("Response data:", data);
    
    setIsLoading(false);
    setIsComplete(true);

    setTimeout(() => {
      setIsComplete(false);
      // add navigation here if want
    }, 3000);
    } catch (error) {
      console.error("Error searching:", error);
      setIsLoading(false);
    }
  };
  
  return (
    <Provider>
      <View style={styles.container}>
        {/* Small Loading Popup */}
        <Portal>
          <Modal visible={isLoading} dismissable={false} contentContainerStyle={styles.smallModalContainer}>
            <View style={styles.popupContent}>
              <ActivityIndicator size="small" color="#0000ff" style={styles.spinner} />
              <Text style={styles.smallModalText}>Generating itinerary...</Text>
            </View>
          </Modal>
        </Portal>
        
        {/* Small Completion Popup */}
        <Portal>
          <Modal visible={isComplete} dismissable={true} onDismiss={() => setIsComplete(false)} contentContainerStyle={styles.smallModalContainer}>
            <View style={styles.popupContent}>
              <Text style={styles.smallModalText}>Itinerary ready!</Text>
              <Button mode="text" compact onPress={() => setIsComplete(false)}>
                OK
              </Button>
            </View>
          </Modal>
        </Portal>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.description}>Our AI will help you generate the most related Trip Plan</Text>
          <Card style={styles.card}>
            <Card.Content>
              <TouchableOpacity onPress={() => router.push("/(tabs)/destinationSearch")} activeOpacity={0.8} style={styles.touchableContainer}>
                <TextInput label="Destination / Hotel Name" mode="outlined" value={tripData.destination} editable={false} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/(tabs)/selectDate")} activeOpacity={0.8} style={styles.touchableContainer}>
                <TextInput label="Travel Duration" mode="outlined" value={travelDurationDisplay} editable={false} right={<TextInput.Icon icon="calendar" />} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/(tabs)/guestAndRoom")} activeOpacity={0.8} style={styles.touchableContainer}>
                <TextInput
                  label="Guests and Rooms"
                  mode="outlined"
                  value={`Adults: ${tripData.guestsAndRooms.adults} Children: ${tripData.guestsAndRooms.children} Rooms: ${tripData.guestsAndRooms.rooms}`}
                  editable={false}
                  right={<TextInput.Icon icon="account-multiple" />}
                />
              </TouchableOpacity>

              <TextInput label="Budget" mode="outlined" value={tripData.budget} onChangeText={(text) => handleInputChange("budget", text)} right={<TextInput.Icon icon="currency-usd" />} />
              <TextInput label="Activities" mode="outlined" value={tripData.activities} onChangeText={(text) => handleInputChange("activities", text)} right={<TextInput.Icon icon="run" />} />
              <TextInput label="Food" mode="outlined" value={tripData.food} onChangeText={(text) => handleInputChange("food", text)} right={<TextInput.Icon icon="food" />} />
              <TextInput label="Pace" mode="outlined" value={tripData.pace} onChangeText={(text) => handleInputChange("pace", text)} right={<TextInput.Icon icon="walk" />} />
              <TextInput label="Additional Notes" mode="outlined" value={tripData.additionalNotes} onChangeText={(text) => handleInputChange("additionalNotes", text)} right={<TextInput.Icon icon="note" />} />

              <Button mode="contained" style={styles.searchButton} onPress={handleSearch}>
                Search
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  description: { marginVertical: 8, fontSize: 16 },
  card: { marginTop: 8, paddingBottom: 16 },
  touchableContainer: { marginVertical: 8 },
  searchButton: { marginTop: 16 },
  // Small compact popup styling
  smallModalContainer: {
    backgroundColor: 'white',
    padding: 15,
    margin: 40,
    marginHorizontal: 60,
    borderRadius: 8,
    alignSelf: 'center',
    position: 'absolute',
    top: '40%', // Position in the middle of the screen
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  popupContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  spinner: {
    marginRight: 10,
  },
  smallModalText: {
    fontSize: 14,
    fontWeight: '500',
  },
});