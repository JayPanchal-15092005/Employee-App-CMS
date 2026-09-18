import { API_BASE_URL } from "@/constants/Config";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
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

  // 🟢 TRACK AUTH STATE
  const [initializing, setInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const registerRef = useRef(false); // Prevent duplicate registration

  // 🟢 1. Handle Auth State Changes with JWT
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwtToken");
        setIsAuthenticated(!!token);
      } catch (e) {
        console.error("Auth check error:", e);
      } finally {
        setInitializing(false);
      }
    };
    checkAuth();
  }, []);

  // 🟢 2. Register Device Token
  useEffect(() => {
    if (initializing || !isAuthenticated) return;

    const registerDevice = async () => {
      if (registerRef.current) return;

      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        if (!projectId) return;

        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") return;

        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId,
        });
        const expoPushToken = tokenData.data;

        // 🟢 Get JWT Token
        const authToken = await SecureStore.getItemAsync("jwtToken");
        const email = await SecureStore.getItemAsync("userEmail");

        console.log("📤 Registering Token:", expoPushToken);

        const response = await fetch(
          `${API_BASE_URL}/api/employee/devices/register`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`, // 🟢 Send JWT Token
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              expoPushToken,
              email: email || "",
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
  }, [isAuthenticated, initializing]);

  // 🟢 3. Protection Logic (Redirects)
  useEffect(() => {
    if (initializing) return;

    const isAuthGroup = segments[0] === "(auth)";

    if (isAuthenticated && isAuthGroup) {
      router.replace("/(home)");
    } else if (!isAuthenticated && !isAuthGroup) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, initializing, segments]);

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

      <Stack.Screen name="(home)/index" />
      <Stack.Screen name="cms" />
      <Stack.Screen name="daily-report" />
      <Stack.Screen name="stationery-req" />
      <Stack.Screen name="mob-recharge" />

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
