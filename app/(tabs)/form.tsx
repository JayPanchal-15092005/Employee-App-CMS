// app/(tabs)/form.tsx - Beautiful Modern Design
// import { useAuth } from "@clerk/clerk-expo";
// import { Picker } from "@react-native-picker/picker";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// import AssetCheckbox from "@/components/AssetCheckBox";
// import TextInputField from "@/components/TextInputField";
// import { API_BASE_URL } from "@/constants/Config";

// const ASSETS = [
//   "Software",
//   "CCTV",
//   "Keyboard",
//   "Desktop",
//   "WebCAM",
//   "Monitor",
//   "Mouse",
//   "Laptop",
//   "Internet / WiFi",
//   "Cartridge Toner",
//   "Extension Board",
//   "Telephone Extension",
//   "Wave Issue",
//   "Mobile Phone",
//   "Elecctric",
//   "Printer",
//   "IPD",
//   "Other Complaint",
// ];

// const LOGO_IMG = require("@/assets/images/icon.png");

// export default function ComplaintScreen() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
//   const { getToken, isSignedIn, signOut, isLoaded } = useAuth();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [department, setDepartment] = useState("");
//   const [selected, setSelected] = useState<Record<string, boolean>>({});
//   const [detail, setDetail] = useState("");
//   const [location, setLocation] = useState("");
//   const [toWhom, setToWhom] = useState("");
//   const [priority, setPriority] = useState("");
//   const [loading, setLoading] = useState(false);

//   const toggleAsset = (label: string) =>
//     setSelected((prev) => ({ ...prev, [label]: !prev[label] }));

//   const handleSignOut = async () => {
//     try {
//       await signOut();
//       router.replace("/(auth)/login");
//     } catch (err) {
//       console.error("Sign out error", err);
//       Alert.alert("Error", "Failed to sign out");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!isLoaded) {
//       Alert.alert("Please wait", "Authentication is still loading");
//       return;
//     }

//     if (!department.trim()) {
//       return Alert.alert("Validation", "Department is required field");
//     }
//     if (!detail.trim()) {
//       return Alert.alert("Validation", "Complaint Detail is required field");
//     }
//     if (!name.trim()) {
//       return Alert.alert("Validation", "Name is required field field");
//     }
//     if (!email.trim()) {
//       return Alert.alert("Validation", "Email is required field");
//     }

//     const assets = Object.keys(selected).filter((k) => selected[k]);
//     const payload = {
//       submitter_name: name.trim() || null,
//       submitter_email: email.trim() || null,
//       department,
//       assets,
//       complain_detail: detail,
//       complain_location: location || null,
//       to_whom: toWhom || null,
//       priority: priority || "Medium",
//     };

//     try {
//       setLoading(true);

//       const token = await getToken({ template: "backend" });

//       if (!token) {
//         Alert.alert(
//           "Session Expired",
//           "Your session expired. Please sign in again.",
//         );
//         router.replace("/(auth)/login");
//         return;
//       }

//       await fetch(`${API_BASE_URL}/api/debug-auth`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${await getToken()}`,
//         },
//       });

//       const res = await fetch(`${API_BASE_URL}/api/complaints`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json().catch(() => ({}));

//       if (!res.ok) {
//         throw new Error(data.error || `Server error ${res.status}`);
//       }

//       Alert.alert("Success", "Your Complaint Submitted.");

//       setName("");
//       setEmail("");
//       setDepartment("");
//       setSelected({});
//       setDetail("");
//       setLocation("");
//       setToWhom("");
//       setPriority("");
//     } catch (err: any) {
//       console.error("Submit error", err);
//       Alert.alert("Submit Failed", err.message || "Unknown error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.wrapper}>
//       {/* Gradient Header */}
//       <LinearGradient
//         colors={["#3b82f6", "#2563eb", "#1d4ed8"]}
//         style={[styles.header, { paddingTop: insets.top + 10 }]}
//       >
//         <View style={styles.headerContent}>
//           {/* 🟢 Logo and Title Container */}
//           <View style={styles.titleContainer}>
//             <Image
//               source={LOGO_IMG}
//               style={styles.headerLogo}
//               resizeMode="contain"
//             />
//             <Text style={styles.headerTitle}>CMS FORM</Text>
//           </View>
//           <TouchableOpacity
//             style={styles.signOutButton}
//             onPress={handleSignOut}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.signOutText}>Sign Out</Text>
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>

//       <KeyboardAvoidingView
//         style={styles.keyboardView}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.select({ ios: 0, android: 60 })}
//       >
//         <ScrollView
//           contentContainerStyle={[
//             styles.scrollContent,
//             { paddingBottom: 32 + insets.bottom },
//           ]}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Form Card */}
//           <View style={styles.formCard}>
//             {/* Personal Info Section */}
//             <View style={styles.sectionHeader}>
//               <View style={styles.sectionIconContainer}>
//                 <Text style={styles.sectionIcon}>👤</Text>
//               </View>
//               <Text style={styles.sectionHeaderText}>Personal Information</Text>
//             </View>

//             <TextInputField
//               label="Full Name *"
//               value={name}
//               onChangeText={(text) => setName(text)}
//               placeholder="Enter your name"
//             />

//             <TextInputField
//               label="Email *"
//               value={email}
//               onChangeText={setEmail}
//               placeholder="you@gmail.com"
//               keyboardType="email-address"
//             />

//             {/* Complaint Details Section */}
//             <View style={[styles.sectionHeader, { marginTop: 24 }]}>
//               <View style={styles.sectionIconContainer}>
//                 <Text style={styles.sectionIcon}>📝</Text>
//               </View>
//               <Text style={styles.sectionHeaderText}>Complaint Details</Text>
//             </View>

//             <TextInputField
//               label="Department *"
//               value={department}
//               onChangeText={setDepartment}
//               placeholder="e.g. IT, HR, BOBFI, SBIFI"
//             />

//             {/* Assets Selection */}
//             <View style={styles.section}>
//               <Text style={styles.label}>
//                 <Text style={styles.labelIcon}>🔧</Text> Assets (select any) *
//               </Text>
//               <View style={styles.assetsContainer}>
//                 <ScrollView
//                   style={styles.assetsScroll}
//                   showsVerticalScrollIndicator={true}
//                   nestedScrollEnabled={true}
//                 >
//                   {ASSETS.map((asset, index) => (
//                     <View
//                       key={asset}
//                       style={[
//                         styles.assetItemWrapper,
//                         index !== ASSETS.length - 1 && styles.assetItemBorder,
//                       ]}
//                     >
//                       <AssetCheckbox
//                         label={asset}
//                         value={!!selected[asset]}
//                         onChange={() => toggleAsset(asset)}
//                       />
//                     </View>
//                   ))}
//                 </ScrollView>
//               </View>
//             </View>

//             <TextInputField
//               label="Complaint Detail *"
//               value={detail}
//               onChangeText={setDetail}
//               placeholder="Describe the issue in detail..."
//               multiline
//               numberOfLines={5}
//               style={{ height: 100 }}
//             />

//             <TextInputField
//               label="Location *"
//               value={location}
//               onChangeText={setLocation}
//               placeholder="Cubical / Cabin / Desk number"
//             />

//             {/* Assignment Section */}
//             <View style={[styles.sectionHeader, { marginTop: 24 }]}>
//               <View style={styles.sectionIconContainer}>
//                 <Text style={styles.sectionIcon}>⚙️</Text>
//               </View>
//               <Text style={styles.sectionHeaderText}>Assignment</Text>
//             </View>

//             <View style={styles.section}>
//               <Text style={styles.label}>
//                 <Text style={styles.labelIcon}>👷</Text> Assign To
//               </Text>
//               <View style={styles.pickerContainer}>
//                 <Picker
//                   selectedValue={toWhom}
//                   onValueChange={setToWhom}
//                   style={[styles.picker, { color: "#0f172a" }]}
//                   dropdownIconColor="#0f172a"
//                 >
//                   <Picker.Item label="Select person..." value="" />
//                   <Picker.Item label="Bhargav Suthar" value="Bhargav Suthar" />
//                   {/* <Picker.Item label="Jay Panchal" value="Hardware Team" /> */}
//                 </Picker>
//               </View>
//             </View>

//             <View style={styles.section}>
//               <Text style={styles.label}>
//                 <Text style={styles.labelIcon}></Text> Priority Level
//               </Text>
//               <View style={styles.priorityContainer}>
//                 {["Low", "Medium", "High"].map((level) => (
//                   <TouchableOpacity
//                     key={level}
//                     style={[
//                       styles.priorityChip,
//                       priority === level && styles.priorityChipActive,
//                       priority === level &&
//                         level === "Low" &&
//                         styles.priorityLow,
//                       priority === level &&
//                         level === "Medium" &&
//                         styles.priorityMedium,
//                       priority === level &&
//                         level === "High" &&
//                         styles.priorityHigh,
//                     ]}
//                     onPress={() => setPriority(level)}
//                     activeOpacity={0.7}
//                   >
//                     <Text
//                       style={[
//                         styles.priorityChipText,
//                         priority === level && styles.priorityChipTextActive,
//                       ]}
//                     >
//                       {level}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Submit Button */}
//             <View style={styles.submitSection}>
//               {loading ? (
//                 <View style={styles.loadingContainer}>
//                   <ActivityIndicator size="large" color="#2563eb" />
//                   <Text style={styles.loadingText}>
//                     Submitting your complaint...
//                   </Text>
//                 </View>
//               ) : (
//                 <TouchableOpacity
//                   style={styles.submitButton}
//                   onPress={handleSubmit}
//                   disabled={loading}
//                   activeOpacity={0.9}
//                 >
//                   <LinearGradient
//                     colors={["#3b82f6", "#2563eb"]}
//                     style={styles.submitButtonGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 0 }}
//                   >
//                     <Text style={styles.submitButtonText}>
//                       Submit Complaint
//                     </Text>
//                     <Text style={styles.submitButtonIcon}>→</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// app/(tabs)/form.tsx
// 🟢 1. Change Import: Remove Clerk, Add Firebase
import auth from "@react-native-firebase/auth";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AssetCheckbox from "@/components/AssetCheckBox";
import TextInputField from "@/components/TextInputField";
import { API_BASE_URL } from "@/constants/Config";

const ASSETS = [
  "Software",
  "CCTV",
  "Keyboard",
  "Desktop",
  "WebCAM",
  "Monitor",
  "Mouse",
  "Laptop",
  "Internet / WiFi",
  "Cartridge Toner",
  "Extension Board",
  "Telephone Extension",
  "Wave Issue",
  "Mobile Phone",
  "Elecctric",
  "Printer",
  "IPD",
  "Other Complaint",
];

const LOGO_IMG = require("@/assets/images/icon.png");

export default function ComplaintScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // 🟢 REMOVED: const { getToken, isSignedIn, signOut, isLoaded } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [detail, setDetail] = useState("");
  const [location, setLocation] = useState("");
  const [toWhom, setToWhom] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleAsset = (label: string) =>
    setSelected((prev) => ({ ...prev, [label]: !prev[label] }));

  const handleSignOut = async () => {
    try {
      // 🟢 UPDATED: Sign out using Firebase
      await auth().signOut();
      router.replace("/(auth)/login");
    } catch (err) {
      console.error("Sign out error", err);
      Alert.alert("Error", "Failed to sign out");
    }
  };

  const handleSubmit = async () => {
    // 🟢 UPDATED: Check Firebase Auth State
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert("Please wait", "You are not logged in.");
      router.replace("/(auth)/login");
      return;
    }

    if (!department.trim())
      return Alert.alert("Validation", "Department is required");
    if (!detail.trim())
      return Alert.alert("Validation", "Complaint Detail is required");
    if (!name.trim()) return Alert.alert("Validation", "Name is required");
    if (!email.trim()) return Alert.alert("Validation", "Email is required");

    const assets = Object.keys(selected).filter((k) => selected[k]);
    const payload = {
      submitter_name: name.trim() || null,
      submitter_email: email.trim() || null,
      department,
      assets,
      complain_detail: detail,
      complain_location: location || null,
      to_whom: toWhom || null,
      priority: priority || "Medium",
    };

    try {
      setLoading(true);

      // 🟢 UPDATED: Get Token from Firebase
      const token = await currentUser.getIdToken();

      if (!token) {
        Alert.alert("Session Expired", "Please sign in again.");
        router.replace("/(auth)/login");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 🟢 Token is now the Firebase Token
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Server error ${res.status}`);
      }

      Alert.alert("Success", "Your Complaint Submitted.");

      // Reset Form
      setName("");
      setEmail("");
      setDepartment("");
      setSelected({});
      setDetail("");
      setLocation("");
      setToWhom("");
      setPriority("");
    } catch (err: any) {
      console.error("Submit error", err);
      Alert.alert("Submit Failed", err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... (The rest of your JSX UI remains exactly the same)
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["#3b82f6", "#2563eb", "#1d4ed8"]}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Image
              source={LOGO_IMG}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>CMS FORM</Text>
          </View>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ... Rest of your UI code ... */}

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 60 })}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 32 + insets.bottom },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIcon}>👤</Text>
              </View>
              <Text style={styles.sectionHeaderText}>Personal Information</Text>
            </View>

            <TextInputField
              label="Full Name *"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />

            <TextInputField
              label="Email *"
              value={email}
              onChangeText={setEmail}
              placeholder="you@gmail.com"
              keyboardType="email-address"
            />

            <View style={[styles.sectionHeader, { marginTop: 24 }]}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIcon}>📝</Text>
              </View>
              <Text style={styles.sectionHeaderText}>Complaint Details</Text>
            </View>

            <TextInputField
              label="Department *"
              value={department}
              onChangeText={setDepartment}
              placeholder="e.g. IT, HR, BOBFI, SBIFI"
            />

            <View style={styles.section}>
              <Text style={styles.label}>
                <Text style={styles.labelIcon}>🔧</Text> Assets (select any) *
              </Text>
              <View style={styles.assetsContainer}>
                <ScrollView
                  style={styles.assetsScroll}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {ASSETS.map((asset, index) => (
                    <View
                      key={asset}
                      style={[
                        styles.assetItemWrapper,
                        index !== ASSETS.length - 1 && styles.assetItemBorder,
                      ]}
                    >
                      <AssetCheckbox
                        label={asset}
                        value={!!selected[asset]}
                        onChange={() => toggleAsset(asset)}
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>

            <TextInputField
              label="Complaint Detail *"
              value={detail}
              onChangeText={setDetail}
              placeholder="Describe the issue in detail..."
              multiline
              numberOfLines={5}
              style={{ height: 100 }}
            />

            <TextInputField
              label="Location *"
              value={location}
              onChangeText={setLocation}
              placeholder="Cubical / Cabin / Desk number"
            />

            <View style={[styles.sectionHeader, { marginTop: 24 }]}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIcon}>⚙️</Text>
              </View>
              <Text style={styles.sectionHeaderText}>Assignment</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>
                <Text style={styles.labelIcon}>👷</Text> Assign To
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={toWhom}
                  onValueChange={setToWhom}
                  style={[styles.picker, { color: "#0f172a" }]}
                  dropdownIconColor="#0f172a"
                >
                  <Picker.Item label="Select person..." value="" />
                  <Picker.Item label="Bhargav Suthar" value="Bhargav Suthar" />
                </Picker>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>
                <Text style={styles.labelIcon}></Text> Priority Level
              </Text>
              <View style={styles.priorityContainer}>
                {["Low", "Medium", "High"].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.priorityChip,
                      priority === level && styles.priorityChipActive,
                      priority === level &&
                        level === "Low" &&
                        styles.priorityLow,
                      priority === level &&
                        level === "Medium" &&
                        styles.priorityMedium,
                      priority === level &&
                        level === "High" &&
                        styles.priorityHigh,
                    ]}
                    onPress={() => setPriority(level)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.priorityChipText,
                        priority === level && styles.priorityChipTextActive,
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.submitSection}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#2563eb" />
                  <Text style={styles.loadingText}>
                    Submitting your complaint...
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={["#3b82f6", "#2563eb"]}
                    style={styles.submitButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.submitButtonText}>
                      Submit Complaint
                    </Text>
                    <Text style={styles.submitButtonIcon}>→</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#1d4ed8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLogo: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Light backing for visibility
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#dbeafe",
    marginTop: 4,
    fontWeight: "500",
  },
  signOutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  signOutText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  section: {
    marginTop: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  labelIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  assetsContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  assetsScroll: {
    maxHeight: 240,
  },
  assetItemWrapper: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  assetItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  pickerContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  picker: {
    height: 55,
    width: "100%",
  },
  priorityContainer: {
    flexDirection: "row",
    gap: 12,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  priorityChipActive: {
    borderWidth: 2,
  },
  priorityLow: {
    backgroundColor: "#dcfce7",
    borderColor: "#22c55e",
  },
  priorityMedium: {
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
  },
  priorityHigh: {
    backgroundColor: "#fee2e2",
    borderColor: "#ef4444",
  },
  priorityChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  priorityChipTextActive: {
    color: "#1e293b",
  },
  submitSection: {
    marginTop: 32,
  },
  submitButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  submitButtonIcon: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#64748b",
    fontWeight: "500",
  },
});
