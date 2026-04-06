import { API_BASE_URL } from "@/constants/Config";
import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
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
  // 🟢 REMOVED: const { getToken } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      // 🟢 UPDATED: Get Token from Firebase
      const user = auth().currentUser;

      if (!user) {
        console.log("No user logged in");
        setLoading(false);
        return;
      }

      const token = await user.getIdToken();

      const res = await fetch(`${API_BASE_URL}/api/employee/complaints`, {
        headers: {
          Authorization: `Bearer ${token}`, // 🟢 Send Firebase Token
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
    setSearchQuery("");
    loadHistory();
  };

  // This instantly filters the complaints array based on what the user types
  const filteredComplaints = complaints.filter((item) => {
    // i need to fix this issues
    const searchLower = searchQuery.toLowerCase();
    const matchDept = item.department.toLowerCase().includes(searchLower);
    const matchDetail = item.complain_detail
      .toLowerCase()
      .includes(searchLower);

    return matchDept || matchDetail; // Returns true if it matches either department or detail
  });

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

      {/* 🟢 NEW: Search Bar UI */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#9CA3AF"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search department or details..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing" // Adds an 'x' button on iOS
        />
        {/* Adds a custom 'x' button for Android when typing */}
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearIcon}
          >
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        contentContainerStyle={styles.container}
        data={complaints}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563eb"]}
          />
        }
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
                  pathname: "/complain-details",
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

  // 🟢 NEW: Search Bar Styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: "#1F2937",
  },
  clearIcon: {
    padding: 4,
  },

  container: {
    flexGrow: 1,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
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
