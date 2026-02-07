import auth from "@react-native-firebase/auth"; // 🟢 CHANGED: Firebase Import
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  // 🟢 Custom loading state since Firebase auth is async
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth().currentUser);

  useEffect(() => {
    // 🟢 Listen for auth state changes
    const unsubscribe = auth().onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // 🟢 Redirect based on Firebase user state
  if (user) {
    return <Redirect href="/(tabs)/form" />;
  }

  return <Redirect href="/(auth)/login" />;
}
