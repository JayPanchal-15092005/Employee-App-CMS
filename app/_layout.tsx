// import { API_BASE_URL } from "@/constants/Config";
// import auth from "@react-native-firebase/auth";
// import Constants from "expo-constants";
// import * as Notifications from "expo-notifications";
// import { Stack, useRouter, useSegments } from "expo-router";
// import { useEffect, useRef, useState } from "react";
// import { ActivityIndicator, View } from "react-native";
// import { SafeAreaProvider } from "react-native-safe-area-context";

// Notifications.setNotificationHandler({
//   handleNotification: async () =>
//     ({
//       shouldShowAlert: true,
//       shouldPlaySound: true,
//       shouldSetBadge: false,
//     }) as Notifications.NotificationBehavior,
// });

// function AppLayout() {
//   const router = useRouter();
//   const segments = useSegments();

//   // 🟢 TRACK AUTH STATE
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState(auth().currentUser);
//   const registerRef = useRef(false); // Prevent duplicate registration

//   // 🟢 1. Handle Auth State Changes
//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged((u) => {
//       setUser(u);
//       if (initializing) setInitializing(false);
//     });
//     return subscriber;
//   }, []);

//   // 🟢 2. Register Device Token (Auto-runs when user logs in)
//   useEffect(() => {
//     if (initializing || !user) return; // Wait for login

//     const registerDevice = async () => {
//       if (registerRef.current) return; // Already registered in this session

//       try {
//         const projectId = Constants.expoConfig?.extra?.eas?.projectId;
//         if (!projectId) return;

//         const { status } = await Notifications.requestPermissionsAsync();
//         if (status !== "granted") return;

//         const tokenData = await Notifications.getExpoPushTokenAsync({
//           projectId,
//         });
//         const expoPushToken = tokenData.data;

//         // 🟢 Get Firebase Token
//         const authToken = await user.getIdToken();

//         console.log("📤 Registering Token:", expoPushToken);

//         const response = await fetch(
//           `${API_BASE_URL}/api/employee/devices/register`,
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${authToken}`, // 🟢 Send Firebase Token
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               expoPushToken,
//               email: user.email, // Optional: Send email for debugging
//             }),
//           },
//         );

//         if (response.ok) {
//           console.log("✅ Device registered successfully");
//           registerRef.current = true;
//         } else {
//           console.error("❌ Registration failed:", await response.text());
//         }
//       } catch (err: any) {
//         console.error("Push registration error:", err.message);
//       }
//     };

//     registerDevice();
//   }, [user, initializing]);

//   // 🟢 3. Protection Logic (Redirects)
//   useEffect(() => {
//     if (initializing) return;

//     const isAuthGroup = segments[0] === "(auth)";

//     if (user && isAuthGroup) {
//       // If logged in, go to home
//       router.replace("/(home)");
//     } else if (!user && !isAuthGroup) {
//       // If NOT logged in, go to login
//       router.replace("/(auth)/login");
//     }
//   }, [user, initializing, segments]);

//   // 🟢 4. Notification Tap Handler
//   useEffect(() => {
//     const sub = Notifications.addNotificationResponseReceivedListener(
//       (response) => {
//         const data = response.notification.request.content.data;

//         if (data?.screen === "complaint-details" && data?.complaintId) {
//           router.push({
//             pathname: "/complain-details",
//             params: { id: String(data.complaintId) },
//           });
//         }

//         if (data?.screen === "history") {
//           router.push("/cms/history");
//         }
//       },
//     );
//     return () => sub.remove();
//   }, []);

//   // Show loading spinner while checking auth status
//   if (initializing) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color="#2563eb" />
//       </View>
//     );
//   }

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" />
//       <Stack.Screen name="(auth)" />

//       {/* 🟢 Our New Hub and Modules (Replaces "tabs") */}
//       <Stack.Screen name="(home)/index" />
//       <Stack.Screen name="cms" />
//       <Stack.Screen name="daily-report" />
//       <Stack.Screen name="stationery-req" />
//       <Stack.Screen name="mob-recharge" />

//       {/* Make sure the complain-details screen is registered too! */}
//       <Stack.Screen name="complain-details" />
//     </Stack>
//   );
// }

// export default function RootLayout() {
//   return (
//     <SafeAreaProvider>
//       <AppLayout />
//     </SafeAreaProvider>
//   );
// }

import { API_BASE_URL } from "@/constants/Config";
// 🟢 NEW WAY: Import getAuth and onAuthStateChanged from Firebase Modular API
import {
  getAuth,
  getIdToken,
  onAuthStateChanged,
} from "@react-native-firebase/auth";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () =>
    ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }) as Notifications.NotificationBehavior,
});

function AppLayout() {
  const router = useRouter();
  const segments = useSegments();

  // 🟢 NEW WAY: Initialize auth
  const firebaseAuth = getAuth();

  // 🟢 TRACK AUTH STATE
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(firebaseAuth.currentUser);
  const registerRef = useRef(false); // Prevent duplicate registration

  // 🟢 1. Handle Auth State Changes
  useEffect(() => {
    // 🟢 NEW WAY: Pass firebaseAuth into onAuthStateChanged
    const subscriber = onAuthStateChanged(firebaseAuth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, []);

  // 🟢 2. Register Device Token (Auto-runs when user logs in)
  useEffect(() => {
    if (initializing || !user) return; // Wait for login

    const registerDevice = async () => {
      if (registerRef.current) return; // Already registered in this session

      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        if (!projectId) return;

        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") return;

        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId,
        });
        const expoPushToken = tokenData.data;

        // 🟢 Get Firebase Token
        // const authToken = await user.getIdToken();

        const authToken = await getIdToken(user);

        console.log("📤 Registering Token:", expoPushToken);

        const response = await fetch(
          `${API_BASE_URL}/api/employee/devices/register`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`, // 🟢 Send Firebase Token
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              expoPushToken,
              email: user.email, // Optional: Send email for debugging
            }),
          },
        );

        if (response.ok) {
          console.log("✅ Device registered successfully");
          registerRef.current = true;
        } else {
          console.error("❌ Registration failed:", await response.text());
        }
      } catch (err: any) {
        console.error("Push registration error:", err.message);
      }
    };

    registerDevice();
  }, [user, initializing]);

  // 🟢 3. Protection Logic (Redirects)
  useEffect(() => {
    if (initializing) return;

    const isAuthGroup = segments[0] === "(auth)";

    if (user && isAuthGroup) {
      // If logged in, go to home
      router.replace("/(home)");
    } else if (!user && !isAuthGroup) {
      // If NOT logged in, go to login
      router.replace("/(auth)/login");
    }
  }, [user, initializing, segments]);

  // 🟢 4. Notification Tap Handler
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        if (data?.screen === "complaint-details" && data?.complaintId) {
          router.push({
            pathname: "/complain-details",
            params: { id: String(data.complaintId) },
          });
        }

        if (data?.screen === "history") {
          router.push("/cms/history");
        }
      },
    );
    return () => sub.remove();
  }, []);

  // Show loading spinner while checking auth status
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />

      {/* 🟢 Our New Hub and Modules (Replaces "tabs") */}
      <Stack.Screen name="(home)/index" />
      <Stack.Screen name="cms" />
      <Stack.Screen name="daily-report" />
      <Stack.Screen name="stationery-req" />
      <Stack.Screen name="mob-recharge" />

      {/* Make sure the complain-details screen is registered too! */}
      <Stack.Screen name="complain-details" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppLayout />
    </SafeAreaProvider>
  );
}
