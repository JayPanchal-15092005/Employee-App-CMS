import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Use a Google Logo from a CDN or your local assets
const GOOGLE_ICON = "https://img.icons8.com/color/48/000000/google-logo.png";
const LOGO_IMG = require("@/assets/images/icon.png"); // Ensure you have this or remove it

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "122080548968-2nhb4ajonr1mg8to9ro5frdus44sesjs.apps.googleusercontent.com",
    });
  }, []);

  async function onGoogleButtonPress() {
    // 🛑 Fix #3: Prevent double clicks causing crashes
    if (loading) return;

    try {
      setLoading(true);

      // 🛑 Fix #4: Force "Choose Account" prompt
      // We sign out of the native Google layer first.
      // This makes the app forget the "last used" account and ask again.
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // Ignore error if user wasn't signed in to Google layer
      }

      // 1. Check for Play Services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // 2. Get the User's ID Token
      const signInResult = await GoogleSignin.signIn();

      // 🛑 Fix #3: Crash protection checks
      if (!signInResult || !signInResult.data) {
        throw new Error("Sign in cancelled or failed");
      }

      const idToken = signInResult.data.idToken;
      if (!idToken) {
        throw new Error("No ID token found");
      }

      // 3. Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // 4. Sign-in the user with the credential
      // (This automatically triggers the _layout.tsx listener to redirect you)
      await auth().signInWithCredential(googleCredential);

      // 🛑 Fix #2: The _layout.tsx listener will handle the redirect to /(tabs)/form
      // But we can also manually replace to be sure.
      // router.replace("/(tabs)/form");
    } catch (error: any) {
      // 🛑 Fix #3: Handle "User Cancelled" gracefully so app doesn't crash
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the login flow");
        // Do nothing, just stay on login screen
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign in is already in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Error", "Google Play Services not available or outdated");
      } else {
        console.error("Login Error:", error);
        Alert.alert(
          "Login Failed",
          error.message || "An unknown error occurred",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image source={LOGO_IMG} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>CMS Portal</Text>
          <Text style={styles.subtitle}>Employee Login</Text>
        </View>

        {/* 🟢 Fix #1: Custom TouchableOpacity Button */}
        <TouchableOpacity
          style={[styles.googleButton, loading && styles.googleButtonDisabled]}
          onPress={onGoogleButtonPress}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Image source={{ uri: GOOGLE_ICON }} style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Secure access for Gujarat Infotech employees only.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: "100%",
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  googleButtonDisabled: {
    opacity: 0.7,
    backgroundColor: "#f9fafb",
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  footerText: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 18,
  },
});
