import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: email.trim().toLowerCase(),
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert(
        "Sign up failed",
        err?.errors?.[0]?.message || "Something went wrong"
      );
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      // 🔑 Activate session
      await setActive({ session: result.createdSessionId });

      router.replace("/(tabs)/form");
    } catch (err: any) {
      Alert.alert(
        "Verification failed",
        err?.errors?.[0]?.message || "Invalid code"
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {!pendingVerification ? (
          <>
            <Text style={styles.title}>Sign Up</Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input, { color: "#111827" }]}
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={[styles.input, { color: "#111827" }]}
            />

            <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Verification</Text>

            <TextInput
              placeholder="Verification Code"
              placeholderTextColor="#94a3b8"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
             style={[styles.input, { textAlign: "center", color: "#111827" }]}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#16a34a" }]}
              onPress={onVerifyPress}
            >
              <Text style={styles.buttonText}>Verify & Sign Up</Text>
            </TouchableOpacity>
          </>
        )}
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
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
