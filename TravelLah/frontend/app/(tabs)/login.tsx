import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Card, Title } from "react-native-paper";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Card style={[styles.card]}>
        <Card.Content>
          <Title>Login</Title>
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
            onPress={() => console.log("Login clicked")}
            style={styles.button}
            textColor ={colors.text}
          >
            Login
          </Button>
          <Button
            mode="text"
            onPress={() => router.push("/register")}
            labelStyle={{ color: colors.primary }}
          >
            Don't have an account? Register
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
