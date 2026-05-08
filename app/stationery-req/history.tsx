import { API_BASE_URL } from "@/constants/Config";
import { getAuth, getIdToken } from "@react-native-firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Structure for an item inside a request
type StationeryItem = {
  name: string;
  quantity: number;
};

type StationeryRequestHistory = {
  id: number;
  created_at: string;
  status: string;
  items: StationeryItem[]; // 🟢 An array of requested gadgets
};

export default function StationeryHistory() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // 🟢 NEW WAY: Initialize auth
  const firebaseAuth = getAuth();

  const [requests, setRequests] = useState<StationeryRequestHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🟢 Automatically refreshes every time the user looks at the history screen
  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, []),
  );

  const fetchRequests = async () => {
    try {
      // 🟢 NEW WAY: Use firebaseAuth to get the current user
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) return;
      // const token = await currentUser.getIdToken();
      const token = await getIdToken(currentUser);

      const res = await fetch(
        `${API_BASE_URL}/api/employee/stationery-requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Fetch history error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const formatDate = (dateString: string) => {
    // 🟢 IST Timezone Fix applied here as well!
    const safeDateString = dateString.endsWith("Z")
      ? dateString
      : `${dateString}Z`;
    const date = new Date(safeDateString);

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "#10b981"; // Primary Green
      case "pending":
        return "#f59e0b"; // Primary Amber
      default:
        return "#6b7280"; // Slate-500
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["#3b82f6", "#2563eb"]}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <TouchableOpacity
          onPress={() => router.replace("/(home)")}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GIL My Reqs</Text>
        <View style={{ width: 60 }} />
      </LinearGradient>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}> reader-outline </Text>{" "}
            {/* Re-use Ionicons (Chameleon doesn't know fonts) */}
            <Text style={styles.emptyTitle}>No requests form found.</Text>
            <Text style={styles.emptySubtitle}>
              {" "}
              GIL My Stationery Requests appear here.{" "}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.dateInfo}>
                <Text style={styles.dateIcon}>📅</Text>
                <Text style={styles.dateText}>
                  {formatDate(item.created_at)}
                </Text>
              </View>
              <Text style={styles.idText}>GIL-REQ #{item.id}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.itemSummaryContainer}>
              {item.items.map((stationery, index) => (
                <Text key={index} style={styles.itemSummaryText}>
                  • {stationery.name} x {stationery.quantity} GIL Total QTY
                </Text>
              ))}
            </View>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${getStatusColor(item.status)}15` },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },
  backBtnText: { color: "#fff", fontWeight: "700" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#ffffff" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { padding: 16, paddingBottom: 32 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16, color: "#cbd5e1" }, // Gray-300
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  emptySubtitle: { fontSize: 14, color: "#64748b", textAlign: "center" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dateInfo: { flexDirection: "row", alignItems: "center" },
  dateIcon: { fontSize: 13, marginRight: 6 },
  dateText: { fontSize: 14, fontWeight: "700", color: "#1e293b" },
  idText: { fontSize: 12, color: "#fbbf24", fontWeight: "800" },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginBottom: 10 },
  itemSummaryContainer: { gap: 4, marginBottom: 16 },
  itemSummaryText: { fontSize: 15, color: "#334155", lineHeight: 22 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-end", // Chameleon doesn't know sides
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
