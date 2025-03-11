import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, Dimensions, ScrollView } from "react-native";
import {Appbar, Searchbar, Text} from 'react-native-paper';
import CarouselItem from "../../components/CarouselItem";

export default function HomeScreen() {
// export default function App(): JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = (query: string) => setSearchQuery(query);
  const [message, setMessage] = useState<string>("");
  console.log(process.env.EXPO_PUBLIC_LOCAL_FRONTEND_IP);
  const handleSendMessage = async () => {
    console.log(process.env.EXPO_PUBLIC_LOCAL_FRONTEND_IP);
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message.");
      return;
    }
  
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_LOCAL_FRONTEND_IP}:8080/api/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: message }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
    const renderCarouselItem = ({item}: {item: {title: string; url: string} }) => {
      return <CarouselItem title={item.title} url={item.url} />;
    }
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}> 
                <Searchbar 
                    placeholder='Where would you like to go?'
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={styles.searchbar}
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    searchbar: {
      marginBottom: 16,
    },
});

