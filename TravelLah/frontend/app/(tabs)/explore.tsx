import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { BookCard } from '../../components/BookCard';

const RoomBookingScreen: React.FC = () => {
  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for rooms...');
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