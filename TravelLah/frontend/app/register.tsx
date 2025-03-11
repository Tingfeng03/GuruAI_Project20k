import { View, StyleSheet } from "react-native";
import { TextInput, Button, Card, Title } from "react-native-paper";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Add router for navigation

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Register</Title>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={() => console.log("Register clicked")}
            style={styles.button}
          >
            Register
          </Button>

          {/* Navigation buttons */}
          <Button mode="text" onPress={() => router.push("/login")}>
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
