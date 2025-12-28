import { API_BASE_URL } from "@/constants/Config";
import {
  ClerkLoaded,
  ClerkLoading,
  ClerkProvider,
  useAuth,
} from "@clerk/clerk-expo";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () =>
    ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }) as Notifications.NotificationBehavior,
});

/* ================= TOKEN CACHE ================= */
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch {
      return;
    }
  },
};

/* ================= INNER LAYOUT (Child Component) ================= */
// 🟢 We moved all logic here so it sits INSIDE ClerkProvider
function AppLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const registerRef = useRef(false);

  // 🔔 REACTIVATE PUSH REGISTRATION
   
  useEffect(() => {
  if (!isLoaded || !isSignedIn) return;

  (async () => {
    try {
      console.log("🔔 Push registration started");

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.log("❌ Missing projectId");
        return;
      }

      const perm = await Notifications.getPermissionsAsync();
      if (perm.status !== "granted") {
        const req = await Notifications.requestPermissionsAsync();
        if (req.status !== "granted") return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
      const expoPushToken = tokenData.data;

      console.log("📱 Expo token:", expoPushToken);

      const clerkToken = await getToken({ template: "backend" });
      console.log("🔐 Clerk token:", clerkToken ? "OK" : "NULL");

      if (!clerkToken) return;

      const res = await fetch(`${API_BASE_URL}/api/devices/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${clerkToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expoPushToken }),
      });

      const data = await res.json();
      console.log("✅ Register response:", data);
    } catch (e) {
      console.error("❌ Push error", e);
    }
  })();
}, [isLoaded, isSignedIn]);




  useEffect(() => {
    if( !isLoaded ) return;

    const isAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && isAuthGroup) {
      // 🟢 If logged in but on login/signup screen, go to form
      router.replace("/(tabs)/form");
    } else if (!isSignedIn && !isAuthGroup) {
      // 🟢 If NOT logged in but trying to see tabs, go to login
      router.replace("/(auth)/login");
    }
  }, [isSignedIn, isLoaded, segments])


  // 🔔 NOTIFICATION TAP HANDLER
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        if (data?.screen === "complaint-details" && data?.complaintId) {
          router.push({
            pathname: "/Complain-details",
            params: { id: String(data.complaintId) },
          });
        }

        if (data?.screen === "history") {
          router.push("/(tabs)/history");
        }
      }
    );
    return () => sub.remove();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

/* ================= ROOT LAYOUT (Parent) ================= */
// export default function RootLayout() {
//   const publishableKey =
//     (Constants.expoConfig &&
//       (Constants.expoConfig.extra as any)?.CLERK_PUBLISHABLE_KEY) ||
//     process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
//     "";

//   if (!publishableKey) {
//     throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env");
//   }

//   return (
//     <SafeAreaProvider>
//       <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
//         {/* 🟢 1. SHOW THIS WHILE LOADING */}
//         <ClerkLoading>
//           <View
//             style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//           >
//             {/* This prevents the white screen while Clerk starts up */}
//           </View>
//         </ClerkLoading>

//         {/* 🟢 2. SHOW THIS WHEN LOADED */}
//         <ClerkLoaded>
//           {/* Remove 'fallback' prop here */}
//           <AppLayout />
//         </ClerkLoaded>
//       </ClerkProvider>
//     </SafeAreaProvider>
//   );
// }

export default function RootLayout() {
  // 🟢 Use Constants.expoConfig as primary source for APK stability
  const publishableKey = 
    Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY || 
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    // 🟢 Don't throw a raw error; it crashes APKs. Return a simple view.
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Configuration Error. Please check your Clerk Key.</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoading>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#f3f4f6' }}>
             <ActivityIndicator size="large" color="#2563eb" /> 
             {/* 🟢 Added indicator so user knows it's loading, not stuck on black screen */}
          </View>
        </ClerkLoading>

        <ClerkLoaded>
          <AppLayout />
        </ClerkLoaded>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}