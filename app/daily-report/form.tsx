// import TextInputField from "@/components/TextInputField";
// import { API_BASE_URL } from "@/constants/Config";
// import auth from "@react-native-firebase/auth";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// export default function DailyReportForm() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();

//   const [workDetails, setWorkDetails] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     const currentUser = auth().currentUser;
//     if (!currentUser) {
//       Alert.alert("Error", "You must be logged in.");
//       return;
//     }

//     if (!workDetails.trim()) {
//       return Alert.alert(
//         "Validation",
//         "Please enter your work details for today.",
//       );
//     }

//     try {
//       setLoading(true);
//       const token = await currentUser.getIdToken();

//       const res = await fetch(`${API_BASE_URL}/api/employee/daily-reports`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           employee_name: currentUser.displayName || "Employee",
//           work_details: workDetails.trim(),
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to submit report");

//       Alert.alert("Success", "Daily report submitted successfully!");
//       setWorkDetails("");

//       // Navigate them to their history tab to see their new submission
//       router.push("/daily-report/history");
//     } catch (err: any) {
//       console.error("Submit error", err);
//       Alert.alert("Error", "Could not submit the daily report.");
//     } finally {
//       setLoading(false);
//     }
//   };

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
//         <Text style={styles.headerTitle}>Daily Report</Text>
//         <View style={{ width: 60 }} />
//       </LinearGradient>

//       <KeyboardAvoidingView
//         style={styles.keyboardView}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <View style={styles.formCard}>
//             <View style={styles.infoBox}>
//               <Text style={styles.infoText}>
//                 👤 Name: {auth().currentUser?.displayName || "Employee"}
//               </Text>
//               <Text style={styles.infoText}>
//                 📧 Email: {auth().currentUser?.email}
//               </Text>
//               <Text style={styles.infoSubText}>
//                 * This information is securely attached automatically.
//               </Text>
//             </View>

//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionIcon}>📝</Text>
//               <Text style={styles.sectionHeaderText}>Work Details</Text>
//             </View>

//             <TextInputField
//               label="What did you work on today? *"
//               value={workDetails}
//               onChangeText={setWorkDetails}
//               placeholder="E.g., Fixed 3 printers, updated server software..."
//               multiline
//               numberOfLines={8}
//               style={{ height: 150, textAlignVertical: "top" }}
//             />

//             <TouchableOpacity
//               style={styles.submitButton}
//               onPress={handleSubmit}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.submitButtonText}>Submit Report</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

import TextInputField from "@/components/TextInputField";
import { API_BASE_URL } from "@/constants/Config";
// 🟢 NEW WAY: Import getAuth from Firebase Modular API
import { getAuth, getIdToken } from "@react-native-firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DailyReportForm() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // 🟢 NEW WAY: Initialize auth and store the user globally for this component
  const firebaseAuth = getAuth();
  const currentUser = firebaseAuth.currentUser;

  const [workDetails, setWorkDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // 🟢 NEW WAY: Use the currentUser variable we created above
    if (!currentUser) {
      Alert.alert("Error", "You must be logged in.");
      return;
    }

    if (!workDetails.trim()) {
      return Alert.alert(
        "Validation",
        "Please enter your work details for today.",
      );
    }

    try {
      setLoading(true);
      // const token = await currentUser.getIdToken();
      const token = await getIdToken(currentUser);

      const res = await fetch(`${API_BASE_URL}/api/employee/daily-reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_name: currentUser.displayName || "Employee",
          work_details: workDetails.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit report");

      Alert.alert("Success", "Daily report submitted successfully!");
      setWorkDetails("");

      // Navigate them to their history tab to see their new submission
      router.push("/daily-report/history");
    } catch (err: any) {
      console.error("Submit error", err);
      Alert.alert("Error", "Could not submit the daily report.");
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.headerTitle}>Daily Report</Text>
        <View style={{ width: 60 }} />
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formCard}>
            <View style={styles.infoBox}>
              {/* 🟢 NEW WAY: Safely use the currentUser variable instead of calling auth() */}
              <Text style={styles.infoText}>
                👤 Name: {currentUser?.displayName || "Employee"}
              </Text>
              <Text style={styles.infoText}>
                📧 Email: {currentUser?.email}
              </Text>
              <Text style={styles.infoSubText}>
                * This information is securely attached automatically.
              </Text>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📝</Text>
              <Text style={styles.sectionHeaderText}>Work Details</Text>
            </View>

            <TextInputField
              label="What did you work on today? *"
              value={workDetails}
              onChangeText={setWorkDetails}
              placeholder="E.g., Fixed 3 printers, updated server software..."
              multiline
              numberOfLines={8}
              style={{ height: 150, textAlignVertical: "top" }}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Report</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 24 },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoBox: {
    backgroundColor: "#f1f5f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 15,
    color: "#1e293b",
    fontWeight: "600",
    marginBottom: 4,
  },
  infoSubText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 8,
    fontStyle: "italic",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIcon: { fontSize: 20, marginRight: 8 },
  sectionHeaderText: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  submitButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
