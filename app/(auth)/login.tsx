import { useAuth, useSignIn } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("❌ Notification permission not granted");
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  });

  return token.data;
}

export default function LoginScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth()

  
const onLoginPress = async () => {
  if (!isLoaded || loading) return;
  console.log("🚀 Login started for:", email); // Log 1

  try {
    setLoading(true);
    const result = await signIn.create({
      identifier: email.trim().toLowerCase(),
      password,
    });
    console.log("✅ Clerk Result Status:", result.status); // Log 2

    if (result.status === "needs_first_factor") {
       // ... verification logic ...
       router.push("/(auth)/verify");
       return;
    }

    if (result.createdSessionId) {
      console.log("🔑 Session created, activating..."); // Log 3
      await setActive({ session: result.createdSessionId });
      router.replace("/(tabs)/form");
    }
  } catch (err: any) {
    // 🟢 IMPROVED LOGGING: Don't use JSON.stringify for network errors
    console.error("❌ FULL ERROR OBJECT:", err);
    console.error("❌ ERROR MESSAGE:", err.message);

    Alert.alert(
      "Login failed",
      // 🟢 Show the actual network error message if available
      err.message || err?.errors?.[0]?.message || "Network Error. Check internet connection."
    );
  } finally {
    setLoading(false);
    console.log("🏁 Loading finished"); // Added log to confirm this runs
  }
};

  if (!isLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          onPress={onLoginPress}
          disabled={loading}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text style={styles.link}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    color: "#1f2937",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    color: "#111827",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  link: {
    color: "#2563eb",
    fontWeight: "600",
  },
});
