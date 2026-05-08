import { API_BASE_URL } from "@/constants/Config";
import { getAuth, getIdToken } from "@react-native-firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Complaint = {
  id: number;
  department: string;
  complain_detail: string;
  complain_location?: string;
  assets?: any[];
  priority: string;
  status: string;
  created_at: string;
  to_whom?: string;
  submitter_name?: string;
  admin_remarks?: string;
};

export default function ComplaintDetailsScreen() {
  const router = useRouter();
  const { id, department, complain_detail, status } = useLocalSearchParams();

  const [complaint, setComplaint] = useState<Complaint | null>({
    id: Number(id),
    department: department as string,
    complain_detail: complain_detail as string,
    status: status as string,
    priority: "",
    created_at: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadDetails();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadDetails = async () => {
    try {
      setLoading(true);

      // 🟢 NEW WAY: Initialize auth and get the current user
      const firebaseAuth = getAuth();
      const user = firebaseAuth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }
      // const token = await user.getIdToken();
      const token = await getIdToken(user); // 🟢 NEW WAY: Using getIdToken from Modular API

      const res = await fetch(`${API_BASE_URL}/api/employee/complaints/${id}`, {
        // i need to change this routes to the new backend routes
        headers: {
          Authorization: `Bearer ${token}`, // 🟢 Sending the Firebase Token
        },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      if (data && data.complaint) {
        setComplaint(data.complaint);
      } else {
        setComplaint(null);
      }
    } catch (err) {
      console.error("Failed to load complaint details", err);
      // Keep old data if fetch fails but we have params
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "in progress":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (!complaint) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>Complaint not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Gradient Header */}
      <LinearGradient
        colors={["#3b82f6", "#2563eb", "#1d4ed8"]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonHeaderText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaint Details</Text>
        <Text style={styles.headerSubtitle}>ID #{complaint.id}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainCard}>
          {/* Department Badge */}
          <View style={styles.departmentContainer}>
            <View style={styles.departmentBadge}>
              <Text style={styles.departmentIcon}>🏢</Text>
              <Text style={styles.departmentText}>{complaint.department}</Text>
            </View>
          </View>

          {/* Status & Priority Row */}
          <View style={styles.statusRow}>
            <View style={styles.statusContainer}>
              <Text style={styles.sectionLabel}>Status</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(complaint.status)}20` },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(complaint.status) },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(complaint.status) },
                  ]}
                >
                  {complaint.status}
                </Text>
              </View>
            </View>

            <View style={styles.priorityContainer}>
              <Text style={styles.sectionLabel}>Priority</Text>
              <View
                style={[
                  styles.priorityBadge,
                  {
                    backgroundColor: `${getPriorityColor(complaint.priority)}20`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    { color: getPriorityColor(complaint.priority) },
                  ]}
                >
                  {complaint.priority || "Medium"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Admin Remarks Section */}
          {complaint.admin_remarks && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>💬</Text>
                <Text style={styles.sectionTitle}>Admin Remarks</Text>
              </View>
              <View style={styles.remarksBox}>
                <Text style={styles.remarksText}>
                  {complaint.admin_remarks}
                </Text>
              </View>
            </View>
          )}

          {/* Complaint Description */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📝</Text>
              <Text style={styles.sectionTitle}>Complaint Details</Text>
            </View>
            <View style={styles.detailsBox}>
              <Text style={styles.detailsText}>
                {complaint.complain_detail}
              </Text>
            </View>
          </View>

          {/* Location */}
          {complaint.complain_location && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>📍</Text>
                <Text style={styles.sectionTitle}>Location</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  {complaint.complain_location}
                </Text>
              </View>
            </View>
          )}

          {/* Assigned To */}
          {complaint.to_whom && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>👷</Text>
                <Text style={styles.sectionTitle}>Assigned To</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>{complaint.to_whom}</Text>
              </View>
            </View>
          )}

          {/* Submitter */}
          {complaint.submitter_name && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>👤</Text>
                <Text style={styles.sectionTitle}>Submitted By</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>{complaint.submitter_name}</Text>
              </View>
            </View>
          )}

          {/* Assets */}
          {complaint.assets && complaint.assets.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>🔧</Text>
                <Text style={styles.sectionTitle}>Related Gadgets</Text>
              </View>
              <View style={styles.assetsContainer}>
                {complaint.assets.map((asset, index) => (
                  <View key={index} style={styles.assetChip}>
                    <Text style={styles.assetChipText}>{asset}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* Timestamp */}
          <View style={styles.timestampContainer}>
            <Text style={styles.timestampIcon}>🕐</Text>
            <View style={styles.timestampTextContainer}>
              <Text style={styles.timestampLabel}>Submitted on</Text>
              <Text style={styles.timestampText}>
                {formatDate(complaint.created_at)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButtonHeader: { marginBottom: 16 },
  backButtonHeaderText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: { fontSize: 14, color: "#dbeafe", fontWeight: "500" },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  mainCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },
  departmentContainer: { marginBottom: 20 },
  departmentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  departmentIcon: { fontSize: 20, marginRight: 8 },
  departmentText: { fontSize: 18, fontWeight: "700", color: "#2563eb" },
  statusRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statusContainer: { flex: 1 },
  priorityContainer: { flex: 1 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 14, fontWeight: "700" },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  priorityText: { fontSize: 14, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "#e2e8f0", marginVertical: 20 },
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: { fontSize: 20, marginRight: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1e293b" },
  detailsBox: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  detailsText: { fontSize: 15, color: "#334155", lineHeight: 24 },

  // 🟢 NEW: Remarks Styles
  remarksBox: {
    backgroundColor: "#fff7ed",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  remarksText: {
    fontSize: 15,
    color: "#92400e",
    lineHeight: 22,
    fontWeight: "500",
  },

  infoBox: { backgroundColor: "#f8fafc", padding: 14, borderRadius: 10 },
  infoText: { fontSize: 15, color: "#475569" },
  assetsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  assetChip: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  assetChipText: { fontSize: 13, color: "#475569", fontWeight: "500" },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 14,
    borderRadius: 12,
  },
  timestampIcon: { fontSize: 24, marginRight: 12 },
  timestampTextContainer: { flex: 1 },
  timestampLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
    fontWeight: "500",
  },
  timestampText: { fontSize: 14, color: "#334155", fontWeight: "600" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  errorIcon: { fontSize: 64, marginBottom: 16 },
  errorText: {
    fontSize: 18,
    color: "#dc2626",
    fontWeight: "600",
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
});
