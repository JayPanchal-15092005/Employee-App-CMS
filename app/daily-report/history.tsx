// import { API_BASE_URL } from "@/constants/Config";
// import auth from "@react-native-firebase/auth";
// import { LinearGradient } from "expo-linear-gradient";
// import { useFocusEffect, useRouter } from "expo-router"; // 🟢 Added useFocusEffect
// import React, { useCallback, useState } from "react"; // 🟢 Added useCallback
// import {
//     ActivityIndicator,
//     FlatList,
//     RefreshControl,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// type DailyReport = {
//   id: string;
//   work_details: string;
//   created_at: string;
// };

// export default function DailyReportHistory() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
//   const [reports, setReports] = useState<DailyReport[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // 🟢 FIX: Replaced useEffect with useFocusEffect so it refreshes every time you open the tab!
//   useFocusEffect(
//     useCallback(() => {
//       fetchReports();
//     }, []),
//   );

//   const fetchReports = async () => {
//     try {
//       const currentUser = auth().currentUser;
//       if (!currentUser) return;
//       const token = await currentUser.getIdToken();

//       const res = await fetch(`${API_BASE_URL}/api/employee/daily-reports`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setReports(data.reports || []);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchReports();
//   };

//   const formatDate = (dateString: string) => {
//     // 🟢 FIX: Force JavaScript to treat the database time as UTC
//     // If the database string doesn't end with 'Z' (which stands for Zulu/UTC), we add it.
//     // This makes your phone automatically convert the time to Indian Standard Time (IST)!
//     const safeDateString = dateString.endsWith("Z")
//       ? dateString
//       : `${dateString}Z`;
//     const date = new Date(safeDateString);

//     return date.toLocaleDateString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#2563eb" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.wrapper}>
//       <LinearGradient
//         colors={["#3b82f6", "#2563eb"]}
//         style={[styles.header, { paddingTop: insets.top + 10 }]}
//       >
//         <TouchableOpacity
//           onPress={() => router.replace("/(home)")}
//           style={styles.backBtn}
//         >
//           <Text style={styles.backBtnText}>← Home</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>My Reports</Text>
//         <View style={{ width: 60 }} />
//       </LinearGradient>

//       <FlatList
//         data={reports}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.listContent}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyIcon}>📊</Text>
//             <Text style={styles.emptyTitle}>No reports yet</Text>
//             <Text style={styles.emptySubtitle}>
//               Your daily work updates will appear here.
//             </Text>
//           </View>
//         }
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <View style={styles.cardHeader}>
//               <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
//               <Text style={styles.idText}>ID #{item.id}</Text>
//             </View>
//             <View style={styles.divider} />
//             <Text style={styles.detailsText}>{item.work_details}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

import { API_BASE_URL } from "@/constants/Config";
// 🟢 NEW WAY: Import getAuth from Firebase Modular API
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

type DailyReport = {
  id: string;
  work_details: string;
  created_at: string;
};

export default function DailyReportHistory() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // 🟢 NEW WAY: Initialize auth
  const firebaseAuth = getAuth();

  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🟢 FIX: Replaced useEffect with useFocusEffect so it refreshes every time you open the tab!
  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, []),
  );

  const fetchReports = async () => {
    try {
      // 🟢 NEW WAY: Use firebaseAuth to get the current user
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) return;
      // const token = await currentUser.getIdToken();
      const token = await getIdToken(currentUser);

      const res = await fetch(`${API_BASE_URL}/api/employee/daily-reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const formatDate = (dateString: string) => {
    // 🟢 FIX: Force JavaScript to treat the database time as UTC
    // If the database string doesn't end with 'Z' (which stands for Zulu/UTC), we add it.
    // This makes your phone automatically convert the time to Indian Standard Time (IST)!
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
        <Text style={styles.headerTitle}>My Reports</Text>
        <View style={{ width: 60 }} />
      </LinearGradient>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>No reports yet</Text>
            <Text style={styles.emptySubtitle}>
              Your daily work updates will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
              <Text style={styles.idText}>ID #{item.id}</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.detailsText}>{item.work_details}</Text>
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
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  emptySubtitle: { fontSize: 14, color: "#64748b" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateText: { fontSize: 14, fontWeight: "700", color: "#2563eb" },
  idText: { fontSize: 12, color: "#94a3b8", fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginBottom: 12 },
  detailsText: { fontSize: 15, color: "#334155", lineHeight: 22 },
});
