import auth from "@react-native-firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LOGO_IMG = require("@/assets/images/icon.png");

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = auth().currentUser;

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      router.replace("/(auth)/login");
    } catch (err) {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3b82f6", "#2563eb", "#1d4ed8"]}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Image source={LOGO_IMG} style={styles.logo} resizeMode="contain" />
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>
                {user?.displayName || "Employee"} 👋
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Company Forms</Text>

        <View style={styles.grid}>
          {/* 🟢 1. CMS Form Button (Working!) */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push("/cms/form")}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#eff6ff" }]}
            >
              <Text style={styles.icon}>💻</Text>
            </View>
            <Text style={styles.cardTitle}>IT Support (CMS)</Text>
            <Text style={styles.cardSubtitle}>Hardware & Network Issues</Text>
          </TouchableOpacity>

          {/* 🟡 2. Mobile Recharge (Coming Soon) */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push("/mob-recharge/form")}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#f0fdf4" }]}
            >
              <Text style={styles.icon}>📱</Text>
            </View>
            <Text style={styles.cardTitle}>Mob Recharge</Text>
            <Text style={styles.cardSubtitle}>Request balance top-up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push("/stationery-req/form")}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#fef2f2" }]}
            >
              <Text style={styles.icon}>✏️</Text>
            </View>
            <Text style={styles.cardTitle}>Stationery Req</Text>
            <Text style={styles.cardSubtitle}>Pens, paper, supplies</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push("/daily-report/form")}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#fffbeb" }]}
            >
              <Text style={styles.icon}>📊</Text>
            </View>
            <Text style={styles.cardTitle}>Daily Report</Text>
            <Text style={styles.cardSubtitle}>Submit EOD updates</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: "#1d4ed8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 45, height: 45, borderRadius: 10, backgroundColor: "#fff" },
  greeting: { color: "#dbeafe", fontSize: 14, fontWeight: "500" },
  userName: { color: "#ffffff", fontSize: 20, fontWeight: "800" },
  signOutBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  signOutText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 16,
    marginTop: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    width: "48%", // 2 columns
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: { fontSize: 22 },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    lineHeight: 16,
  },
});
