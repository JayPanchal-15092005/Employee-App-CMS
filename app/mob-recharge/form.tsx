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

// const OPERATORS = ["Airtel", "BSNL", "Jio", "VI"];

// export default function MobRechargeForm() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();

//   const [mobileNo, setMobileNo] = useState("");
//   const [operator, setOperator] = useState("VI");
//   const [amount, setAmount] = useState("");
//   const [department, setDepartment] = useState("");
//   const [approvedByHr, setApprovedByHr] = useState<boolean | null>(null);
//   const [lastRechargeDate, setLastRechargeDate] = useState("");

//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     const currentUser = auth().currentUser;
//     if (!currentUser) return Alert.alert("Error", "You must be logged in.");

//     if (
//       !mobileNo ||
//       !amount ||
//       !department ||
//       approvedByHr === null ||
//       !lastRechargeDate
//     ) {
//       return Alert.alert("Validation", "Please fill out all required fields.");
//     }

//     try {
//       setLoading(true);
//       const token = await currentUser.getIdToken();

//       const res = await fetch(`${API_BASE_URL}/api/employee/mob-recharges`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           employee_name: currentUser.displayName || "Employee",
//           mobile_no: mobileNo.trim(),
//           operator: operator,
//           recharge_amount: amount.trim(),
//           department: department.trim(),
//           approved_by_hr: approvedByHr,
//           last_recharge_date: lastRechargeDate.trim(),
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to submit request");

//       Alert.alert("Success", "Recharge request submitted successfully!");

//       // Reset form
//       setMobileNo("");
//       setAmount("");
//       setDepartment("");
//       setApprovedByHr(null);
//       setLastRechargeDate("");

//       router.push("/mob-recharge/history");
//     } catch (err: any) {
//       console.error("Submit error", err);
//       Alert.alert("Error", "Could not submit the request.");
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
//         <Text style={styles.headerTitle}>Mob Recharge</Text>
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
//                 👤 {auth().currentUser?.displayName || "Employee"}
//               </Text>
//               <Text style={styles.infoText}>
//                 📧 {auth().currentUser?.email}
//               </Text>
//             </View>

//             <TextInputField
//               label="Mobile No *"
//               value={mobileNo}
//               onChangeText={setMobileNo}
//               placeholder="Enter 10-digit number"
//               keyboardType="phone-pad"
//               maxLength={10}
//             />

//             <Text style={styles.label}>Operator *</Text>
//             <View style={styles.chipRow}>
//               {OPERATORS.map((op) => (
//                 <TouchableOpacity
//                   key={op}
//                   style={[styles.chip, operator === op && styles.chipActive]}
//                   onPress={() => setOperator(op)}
//                 >
//                   <Text
//                     style={[
//                       styles.chipText,
//                       operator === op && styles.chipTextActive,
//                     ]}
//                   >
//                     {op}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <TextInputField
//               label="Recharge Amount (₹) *"
//               value={amount}
//               onChangeText={setAmount}
//               placeholder="e.g. 299"
//               keyboardType="numeric"
//             />

//             <TextInputField
//               label="Department *"
//               value={department}
//               onChangeText={setDepartment}
//               placeholder="e.g. Hardware, Software..."
//             />

//             <Text style={styles.label}>Approved by HR? *</Text>
//             <View style={styles.chipRow}>
//               <TouchableOpacity
//                 style={[
//                   styles.chip,
//                   approvedByHr === true && styles.chipActive,
//                 ]}
//                 onPress={() => setApprovedByHr(true)}
//               >
//                 <Text
//                   style={[
//                     styles.chipText,
//                     approvedByHr === true && styles.chipTextActive,
//                   ]}
//                 >
//                   Yes
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.chip,
//                   approvedByHr === false && styles.chipActive,
//                 ]}
//                 onPress={() => setApprovedByHr(false)}
//               >
//                 <Text
//                   style={[
//                     styles.chipText,
//                     approvedByHr === false && styles.chipTextActive,
//                   ]}
//                 >
//                   No
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             <TextInputField
//               label="Last Recharge Date *"
//               value={lastRechargeDate}
//               onChangeText={setLastRechargeDate}
//               placeholder="DD-MM-YYYY"
//             />

//             <TouchableOpacity
//               style={styles.submitButton}
//               onPress={handleSubmit}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.submitButtonText}>Submit Request</Text>
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

const OPERATORS = ["Airtel", "BSNL", "Jio", "VI"];

export default function MobRechargeForm() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // 🟢 NEW WAY: Initialize auth and store the user globally for this component
  const firebaseAuth = getAuth();
  const currentUser = firebaseAuth.currentUser;

  const [mobileNo, setMobileNo] = useState("");
  const [operator, setOperator] = useState("VI");
  const [amount, setAmount] = useState("");
  const [department, setDepartment] = useState("");
  const [approvedByHr, setApprovedByHr] = useState<boolean | null>(null);
  const [lastRechargeDate, setLastRechargeDate] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // 🟢 NEW WAY: Use the currentUser variable we created above
    if (!currentUser) return Alert.alert("Error", "You must be logged in.");

    if (
      !mobileNo ||
      !amount ||
      !department ||
      approvedByHr === null ||
      !lastRechargeDate
    ) {
      return Alert.alert("Validation", "Please fill out all required fields.");
    }

    try {
      setLoading(true);
      // const token = await currentUser.getIdToken();
      const token = await getIdToken(currentUser);

      const res = await fetch(`${API_BASE_URL}/api/employee/mob-recharges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_name: currentUser.displayName || "Employee",
          mobile_no: mobileNo.trim(),
          operator: operator,
          recharge_amount: amount.trim(),
          department: department.trim(),
          approved_by_hr: approvedByHr,
          last_recharge_date: lastRechargeDate.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit request");

      Alert.alert("Success", "Recharge request submitted successfully!");

      // Reset form
      setMobileNo("");
      setAmount("");
      setDepartment("");
      setApprovedByHr(null);
      setLastRechargeDate("");

      router.push("/mob-recharge/history");
    } catch (err: any) {
      console.error("Submit error", err);
      Alert.alert("Error", "Could not submit the request.");
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
        <Text style={styles.headerTitle}>Mob Recharge</Text>
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
                👤 {currentUser?.displayName || "Employee"}
              </Text>
              <Text style={styles.infoText}>📧 {currentUser?.email}</Text>
            </View>

            <TextInputField
              label="Mobile No *"
              value={mobileNo}
              onChangeText={setMobileNo}
              placeholder="Enter 10-digit number"
              keyboardType="phone-pad"
              maxLength={10}
            />

            <Text style={styles.label}>Operator *</Text>
            <View style={styles.chipRow}>
              {OPERATORS.map((op) => (
                <TouchableOpacity
                  key={op}
                  style={[styles.chip, operator === op && styles.chipActive]}
                  onPress={() => setOperator(op)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      operator === op && styles.chipTextActive,
                    ]}
                  >
                    {op}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInputField
              label="Recharge Amount (₹) *"
              value={amount}
              onChangeText={setAmount}
              placeholder="e.g. 299"
              keyboardType="numeric"
            />

            <TextInputField
              label="Department *"
              value={department}
              onChangeText={setDepartment}
              placeholder="e.g. Hardware, Software..."
            />

            <Text style={styles.label}>Approved by HR? *</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  approvedByHr === true && styles.chipActive,
                ]}
                onPress={() => setApprovedByHr(true)}
              >
                <Text
                  style={[
                    styles.chipText,
                    approvedByHr === true && styles.chipTextActive,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chip,
                  approvedByHr === false && styles.chipActive,
                ]}
                onPress={() => setApprovedByHr(false)}
              >
                <Text
                  style={[
                    styles.chipText,
                    approvedByHr === false && styles.chipTextActive,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>

            <TextInputField
              label="Last Recharge Date *"
              value={lastRechargeDate}
              onChangeText={setLastRechargeDate}
              placeholder="DD-MM-YYYY"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Request</Text>
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
  },
  infoBox: {
    backgroundColor: "#f1f5f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "600",
    marginBottom: 2,
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 15,
    color: "#1e293b",
    marginTop: 4,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  chipActive: { borderColor: "#3b82f6", backgroundColor: "#eff6ff" },
  chipText: { fontSize: 15, color: "#64748b", fontWeight: "600" },
  chipTextActive: { color: "#2563eb", fontWeight: "700" },
  submitButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
