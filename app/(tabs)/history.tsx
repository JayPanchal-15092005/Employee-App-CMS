import { API_BASE_URL } from "@/constants/Config";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Complaint = {
  id: number;
  department: string;
  complain_detail: string;
  status: "Pending" | "Resolved";
};

export default function HistoryScreen() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/employee/complaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error("History load failed", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  // 🟢 INITIAL LOADING SPINNER
  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      <FlatList
        contentContainerStyle={styles.container}
        data={complaints}
        keyExtractor={(item) => item.id.toString()}
        // 🟢 This makes "Pull to Refresh" work
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563eb"]}
          />
        }
        // 🟢 This allows refreshing even when the list is empty
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No complaints found</Text>
            <Text style={styles.emptySubText}>
              Pull down to refresh or check back later.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.department}>{item.department}</Text>
              <View
                style={[
                  styles.statusBadge,
                  item.status === "Resolved"
                    ? styles.statusResolved
                    : styles.statusPending,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.status === "Resolved"
                      ? styles.textResolved
                      : styles.textPending,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            <Text style={styles.detail} numberOfLines={2}>
              {item.complain_detail}
            </Text>

            <TouchableOpacity
              style={styles.viewBtn}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/Complain-details",
                  params: {
                    id: item.id,
                    department: item.department,
                    complain_detail: item.complain_detail,
                    status: item.status,
                  },
                })
              }
            >
              <Text style={styles.viewText}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4B5563",
    fontWeight: "500",
  },
  container: {
    flexGrow: 1, // 🟢 Important for ListEmptyComponent centering
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  department: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  detail: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 22,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusPending: {
    backgroundColor: "#FFF7ED",
  },
  statusResolved: {
    backgroundColor: "#ECFDF5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  textPending: {
    color: "#C2410C",
  },
  textResolved: {
    color: "#047857",
  },
  viewBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  viewText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  // 🟢 Updated styles for empty state
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100, // Centers it roughly in the middle
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});
