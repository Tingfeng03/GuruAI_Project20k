import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Card, Title } from "react-native-paper";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Card style={[styles.card]}>
        <Card.Content>
          <Title>Register</Title>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
            theme={{ colors: { text: colors.text, primary: colors.primary } }}
          />
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { text: colors.text, primary: colors.primary } }}
          />
          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            theme={{ colors: { text: colors.text, primary: colors.primary } }}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            theme={{ colors: { text: colors.text, primary: colors.primary } }}
          />
          <Button
            mode="contained"
            onPress={() => console.log("Register clicked")}
            style={styles.button}
            textColor={colors.text}
          >
            Register
          </Button>
          <Button
            mode="text"
            onPress={() => router.push("/login")}
            labelStyle={{ color: colors.primary }}
          >
            Already have an account? Login
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  card: {
    padding: 20,
  },
  input: {
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
  },
});
