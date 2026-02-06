// import { useSignIn } from "@clerk/clerk-expo";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const LOGO_IMG = require("@/assets/images/icon.png");

// export default function LoginScreen() {
//   const { isLoaded, signIn, setActive } = useSignIn();
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   //  const onLoginPress = async () => {
//   //     if (!isLoaded || loading) return;
//   //     try {
//   //       setLoading(true);

//   //       // 1. Clear any existing partial sign-ins to prevent "Session already exists" errors
//   //       const result = await signIn.create({
//   //         identifier: email.trim().toLowerCase(),
//   //         password,
//   //       });

//   //       // 2. Handle 2FA or Verification if needed
//   //       if (result.status === "needs_first_factor") {
//   //         router.push("/(auth)/verify");
//   //         return;
//   //       }

//   //       // 3. FIX: Handle "complete" status or presence of createdSessionId
//   //       if (result.status === "complete" || result.createdSessionId) {
//   //         await setActive({ session: result.createdSessionId || result.createdSessionId });
//   //         // Use replace to clear the navigation stack
//   //         router.replace("/(tabs)/form");
//   //       } else {
//   //         // Log status if it's something unexpected (like "needs_second_factor")
//   //         console.log("Unexpected login status:", result.status);
//   //         Alert.alert("Login Error", "Something went wrong with the session.");
//   //       }

//   //     } catch (err: any) {
//   //       console.error("Login error details:", JSON.stringify(err, null, 2));
//   //       Alert.alert("Login failed", err.errors?.[0]?.message || "Check your email/password");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   const onLoginPress = async () => {
//     if (!isLoaded || loading) return;
//     try {
//       setLoading(true);

//       // 🟢 DEBUGGING: Log exactly what is being sent
//       const cleanEmail = email.trim().toLowerCase();
//       console.log("Attempting login with:", cleanEmail);

//       const result = await signIn.create({
//         identifier: cleanEmail,
//         password,
//       });

//       if (result.status === "needs_first_factor") {
//         router.push("/(auth)/verify");
//       } else if (result.status === "complete") {
//         await setActive({ session: result.createdSessionId });
//         router.replace("/(tabs)/form");
//       } else {
//         console.log("Login status not complete:", result.status);
//         Alert.alert("Login Status", `Status is: ${result.status}`);
//       }
//     } catch (err: any) {
//       // 🟢 DEBUGGING: Log the full error to see the code
//       console.error("FULL LOGIN ERROR:", JSON.stringify(err, null, 2));

//       const errorCode = err.errors?.[0]?.code;
//       const errorMessage = err.errors?.[0]?.message;

//       if (errorCode === "form_identifier_not_found") {
//         Alert.alert(
//           "Account Not Found",
//           "No account exists with this email. Please check for typos or Sign Up again.",
//         );
//       } else if (errorCode === "form_password_incorrect") {
//         Alert.alert("Incorrect Password", "The password you entered is wrong.");
//       } else {
//         Alert.alert(
//           "Login Failed",
//           errorMessage || "An unknown error occurred.",
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isLoaded) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <ScrollView
//         contentContainerStyle={styles.scrollContainer}
//         keyboardShouldPersistTaps="handled"
//       >
//         <View style={styles.card}>
//           <Image source={LOGO_IMG} style={styles.logo} resizeMode="contain" />
//           <Text style={styles.title}>Login</Text>

//           <TextInput
//             placeholder="Email"
//             placeholderTextColor="#9ca3af" // Fix: Ensures placeholder is visible
//             value={email}
//             onChangeText={setEmail}
//             autoCapitalize="none"
//             keyboardType="email-address"
//             style={styles.input}
//           />

//           <TextInput
//             placeholder="Password"
//             placeholderTextColor="#9ca3af" // Fix: Ensures placeholder is visible
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//             style={styles.input}
//           />

//           <TouchableOpacity
//             onPress={onLoginPress}
//             disabled={loading}
//             style={styles.button}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.buttonText}>Login</Text>
//             )}
//           </TouchableOpacity>

//           <View style={styles.footer}>
//             <Text>Don’t have an account? </Text>
//             <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
//               <Text style={styles.link}>Sign up</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f3f4f6",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//     paddingHorizontal: 24,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 24,
//     elevation: 5,
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     alignSelf: "center",
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 24,
//     color: "#1f2937",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     borderRadius: 12,
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     marginBottom: 16,
//     color: "#111827", // Fix: Ensures text entered is visible
//   },
//   button: {
//     backgroundColor: "#2563eb",
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 20,
//   },
//   link: {
//     color: "#2563eb",
//     fontWeight: "600",
//   },
// });

import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// This helps the browser close correctly after login on Android
export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const LOGO_IMG = require("@/assets/images/icon.png"); // Make sure this path is correct
const GOOGLE_ICON = "https://img.icons8.com/color/48/000000/google-logo.png"; // External Google icon

export default function LoginScreen() {
  useWarmUpBrowser();
  const router = useRouter();

  // 1. Setup OAuth Strategy
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const [loading, setLoading] = React.useState(false);

  const onGoogleSignIn = async () => {
    try {
      setLoading(true);

      // 2. Start the flow
      const { createdSessionId, setActive, signUp } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(tabs)/form", {
          scheme: "cmsemployee",
        }), // Match your app.json scheme
      });

      // 3. If login successful, set active session
      if (createdSessionId) {
        if (setActive) {
          await setActive({ session: createdSessionId });
          router.replace("/(tabs)/form");
        }
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Logo Section */}
        <Image source={LOGO_IMG} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to access the CMS Portal</Text>

        {/* Google Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={onGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Image source={{ uri: GOOGLE_ICON }} style={styles.googleIcon} />
              <Text style={styles.googleText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          By continuing, you agree to our Terms & Conditions.
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
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    elevation: 8, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 32,
    textAlign: "center",
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
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  footerText: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
});
