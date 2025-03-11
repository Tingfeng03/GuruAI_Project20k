import { useRouter } from "expo-router";
import { View, Text, Button } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to the Home Screen</Text>
      {/* Login Button */}
      <Button title="Login" onPress={() => router.push("/login")} />
      {/* Register Button */}
      <Button title="Register" onPress={() => router.push("/register")} />
      // I don't understand why Register needs to be uppercase R
    </View>
  );
}
