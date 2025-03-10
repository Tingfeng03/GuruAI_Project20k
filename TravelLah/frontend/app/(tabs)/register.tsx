import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Card, Title } from "react-native-paper";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import customAlert from "../../config/alert"; // Adjust the path as needed

export default function RegisterScreen(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const { colors } = useTheme();

  const validateInputs = (): boolean => {
    console.log("Validating inputs...", { email, username, phone, password });
    if (!email || !username || !phone || !password) {
      customAlert("Validation Error", "Please fill in all fields.");
      return false;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      customAlert("Validation Error", "Please enter a valid email address.");
      return false;
    }
    if (username.trim().length < 3) {
      customAlert("Validation Error", "Username must be at least 3 characters long.");
      return false;
    }
    const phoneRegex = /^\+?\d{7,}$/;
    if (!phoneRegex.test(phone)) {
      customAlert(
        "Validation Error",
        "Please enter a valid phone number (digits only, minimum 7 digits)."
      );
      return false;
    }
    if (password.length < 6) {
      customAlert("Validation Error", "Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const registerCall = async (): Promise<void> => {
    if (!validateInputs()) {
      console.log("Input validation failed.");
      return;
    }
    const payload = {
      email,
      username,
      phone,
      passwordHash: password,
    };

    try {
      console.log("Registration payload:", payload);
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_LOCAL_FRONTEND_IP}:8080/api/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Registration failed");
      }

      customAlert("Registration Successful", "You have successfully registered.");
      router.push("/login");
    } catch (error: unknown) {
      console.error("Registration failed:", error);
      let errorMessage = "Registration failed";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      customAlert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Register</Title>
          <Button onPress={() => customAlert("Test", "Alert is working!")}>
            Test Alert
          </Button>
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
            onPress={registerCall}
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
    backgroundColor: "#f0f0f0",
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
