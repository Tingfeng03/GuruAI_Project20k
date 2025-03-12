import React from "react";
import { View, StyleSheet } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { BookCard } from "../../components/BookCard";
import { useDispatch } from "react-redux";
import { setTripData } from "../../redux/slices/tripSlice";

const RoomBookingScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSearch = (guestsData: { adults: number; children: number; rooms: number }) => {
    dispatch(setTripData({ guestsAndRooms: guestsData }));
    router.push("/(tabs)/searchPage");
  };

  return (
    <PaperProvider>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BookCard onSearch={handleSearch} />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
});

export default RoomBookingScreen;
