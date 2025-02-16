import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { BASE_URL } from "@env";

export default function App(): JSX.Element {
  const [message, setMessage] = useState<string>("");

  const handleSendMessage = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message.");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/messages`, {
        // const response = await fetch("http://192.168.0.102:8080/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();

      // Handle both JSON and plain text responses
      Alert.alert("Success", data);
      setMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      Alert.alert("Error", error.message || "Failed to send message.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Message to Backend</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send Message" onPress={handleSendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});
