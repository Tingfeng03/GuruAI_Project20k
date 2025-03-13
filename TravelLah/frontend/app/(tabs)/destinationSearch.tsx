import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, List, ActivityIndicator, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setTripData } from "../../redux/slices/tripSlice";

export default function DestinationSearchPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (text.length >= 3) {
        setLoading(true);
        try {
          const response = await fetch(
            `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${text}`,
            {
              method: "GET",
              headers: {
                "X-RapidAPI-Key": process.env.EXPO_PUBLIC_RAPIDAPI_KEY || "",
                "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
              },
            }
          );
          const data = await response.json();
          if (data && data.data) {
            setSuggestions(data.data);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 500);
  };

  const handleSelect = (city: string) => {
    dispatch(setTripData({ destination: city }));
    router.push("/(tabs)/searchPage");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Destination</Text>
      <TextInput label="Type a city or region" mode="outlined" value={query} onChangeText={handleChange} style={styles.input} />
      {loading ? (
        <ActivityIndicator animating={true} size="small" style={styles.loadingIndicator} color="#000" />
      ) : (
        suggestions.map((item, index) => (
          <List.Item
            key={index}
            title={item.city}
            description={`${item.region}, ${item.countryCode}`}
            onPress={() => handleSelect(item.city)}
            titleStyle={styles.listItemTitle}
            descriptionStyle={styles.listItemDescription}
          />
        ))
      )}
      <Button mode="outlined" onPress={() => router.push("/(tabs)/searchPage")} style={styles.cancelButton}>
        Cancel
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, marginBottom: 12, fontWeight: "bold" },
  input: { marginBottom: 12 },
  loadingIndicator: { marginVertical: 10 },
  cancelButton: { marginTop: 20 },
  listItemTitle: { fontSize: 16, fontWeight: "600" },
  listItemDescription: { fontSize: 14 },
});
