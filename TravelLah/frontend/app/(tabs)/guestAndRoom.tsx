import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { BookCard } from '../../components/BookCard';
import { TripContext } from '../../Provider/TripContext';

const RoomBookingScreen: React.FC = () => {
  const router = useRouter();
  const { setTripData } = useContext(TripContext);

  const handleSearch = (guestsData: { adults: number; children: number; rooms: number }) => {
    setTripData({
      guestsAndRooms: guestsData,
    });
    router.push('/(tabs)/searchPage');
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
    backgroundColor: '#f5f5f5',
  },
});

export default RoomBookingScreen;
