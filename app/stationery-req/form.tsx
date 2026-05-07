// import TextInputField from "@/components/TextInputField"; // Using your upgraded, empathy-enhanced input!
// import { API_BASE_URL } from "@/constants/Config";
// import auth from "@react-native-firebase/auth";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";

// // 🟢 The dynamic data provided by the user
// const STATIONERY_ITEMS = [
//   "A4 size Paper Packet",
//   "Ball Pen- Blue",
//   "Box file",
//   "Calculator",
//   "Cello Tape Transparent",
//   "Cover A4 Size GIL",
//   "File - Button",
//   "File - Strip",
//   "Gil Diary New",
//   "Green Bag",
// ];

// // Structure for a single item requested
// type RequestedItem = {
//   id: number;
//   name: string;
//   quantity: string;
// };

// export default function StationeryForm() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();

//   // 🟢 Fixed list of up to 4 items on the form
//   const [items, setItems] = useState<RequestedItem[]>([
//     { id: 1, name: "", quantity: "" },
//     { id: 2, name: "", quantity: "" },
//     { id: 3, name: "", quantity: "" },
//     { id: 4, name: "", quantity: "" },
//   ]);
//   const [loading, setLoading] = useState(false);

//   // Controls the custom dropdown modal
//   const [activeItemSlot, setActiveItemSlot] = useState<number | null>(null);
//   const [isPickerVisible, setPickerVisible] = useState(false);

//   const handleUpdateItem = (
//     id: number,
//     field: keyof RequestedItem,
//     value: string,
//   ) => {
//     setItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === id ? { ...item, [field]: value } : item,
//       ),
//     );
//   };

//   const handleOpenPicker = (slotId: number) => {
//     setActiveItemSlot(slotId);
//     setPickerVisible(true);
//   };

//   const handleSelectItem = (name: string) => {
//     if (activeItemSlot !== null) {
//       handleUpdateItem(activeItemSlot, "name", name);
//       setPickerVisible(false);
//       setActiveItemSlot(null);
//     }
//   };

//   const handleSubmit = async () => {
//     const currentUser = auth().currentUser;
//     if (!currentUser) {
//       Alert.alert("Error", "You must be logged in.");
//       return;
//     }

//     // 🟢 1. Collect and validate non-empty items
//     const filledItems = items.filter(
//       (i) => i.name.trim() !== "" && i.quantity.trim() !== "",
//     );

//     if (filledItems.length === 0) {
//       return Alert.alert(
//         "Validation",
//         "Please add at least one item with a valid name and quantity.",
//       );
//     }

//     // Simple validation: check for negative numbers or non-integers in quantity
//     for (const item of filledItems) {
//       if (!/^\d+$/.test(item.quantity) || parseInt(item.quantity) <= 0) {
//         return Alert.alert(
//           "Validation",
//           `Please enter a valid, positive quantity for item ${item.id}.`,
//         );
//       }
//     }

//     try {
//       setLoading(true);
//       const token = await currentUser.getIdToken();

//       const res = await fetch(
//         `${API_BASE_URL}/api/employee/stationery-requests`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             // The database will grab name and email from the token
//             employee_name: currentUser.displayName || "Employee",
//             items: filledItems.map((item) => ({
//               name: item.name,
//               quantity: item.quantity,
//             })),
//           }),
//         },
//       );

//       if (!res.ok) throw new Error("Failed to submit request");

//       Alert.alert("Success", "Stationery request submitted successfully!");

//       // Reset the form
//       setItems([
//         { id: 1, name: "", quantity: "" },
//         { id: 2, name: "", quantity: "" },
//         { id: 3, name: "", quantity: "" },
//         { id: 4, name: "", quantity: "" },
//       ]);
//       router.push("/stationery-req/history"); // 🟢 Go check my history
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
//         <Text style={styles.headerTitle}>Stationery Form</Text>
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
//                 * Submitted by the currently logged-in account.
//               </Text>
//             </View>

//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionIcon}>🔧</Text>
//               <Text style={styles.sectionHeaderText}>
//                 Request Gadgets (Up to 4)
//               </Text>
//             </View>

//             {items.map((item, index) => (
//               <View key={item.id} style={styles.itemSlot}>
//                 <Text style={styles.itemNumberBadge}>GIL-REQ {index + 1}</Text>

//                 {/* Custom Modal-Based Dropdown (Chameleon doesn't know sides) */}
//                 <Text style={styles.itemSlotLabel}>GIL Items *</Text>
//                 <TouchableOpacity
//                   onPress={() => handleOpenPicker(item.id)}
//                   style={styles.dropdownPickerButton}
//                 >
//                   <Text
//                     style={[
//                       styles.dropdownPickerText,
//                       !item.name && { color: "#94a3b8" },
//                     ]}
//                   >
//                     {item.name || "A4 size Paper Packet..."}
//                   </Text>
//                   <Text style={styles.dropdownIcon}>▼</Text>
//                 </TouchableOpacity>

//                 <TextInputField
//                   label="GIL Total QTY *"
//                   value={item.quantity}
//                   onChangeText={(val) =>
//                     handleUpdateItem(item.id, "quantity", val)
//                   }
//                   placeholder="E.g., 2..."
//                   keyboardType="numeric"
//                   style={styles.quantityInputField}
//                 />
//               </View>
//             ))}

//             <TouchableOpacity
//               style={styles.submitButton}
//               onPress={handleSubmit}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.submitButtonText}>Submit Request Form</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>

//       {/* Custom Item Picker Modal (Chameleon doesn't know fonts) */}
//       <Modal
//         visible={isPickerVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setPickerVisible(false)}
//       >
//         <SafeAreaView style={styles.pickerModalContainer}>
//           <TouchableOpacity
//             style={styles.modalOverlay}
//             onPress={() => setPickerVisible(false)}
//           />
//           <View style={styles.pickerModalContent}>
//             <View style={styles.pickerModalHeader}>
//               <Text style={styles.pickerModalTitle}>
//                 Select Stationery Item
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setPickerVisible(false)}
//                 style={styles.pickerModalCloseBtn}
//               >
//                 <Text style={styles.pickerModalCloseBtnText}>✕ Close</Text>
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={STATIONERY_ITEMS}
//               keyExtractor={(item) => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   onPress={() => handleSelectItem(item)}
//                   style={styles.pickerModalItemButton}
//                 >
//                   <Text style={styles.pickerModalItemText}>{item}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </SafeAreaView>
//       </Modal>
//     </View>
//   );
// }

import TextInputField from "@/components/TextInputField"; // Using your upgraded, empathy-enhanced input!
import { API_BASE_URL } from "@/constants/Config";
// 🟢 NEW WAY: Import getAuth from Firebase Modular API
import { getAuth, getIdToken } from "@react-native-firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// 🟢 The dynamic data provided by the user
const STATIONERY_ITEMS = [
  "A4 size Paper Packet",
  "Ball Pen- Blue",
  "Box file",
  "Calculator",
  "Cello Tape Transparent",
  "Cover A4 Size GIL",
  "File - Button",
  "File - Strip",
  "Gil Diary New",
  "Green Bag",
];

// Structure for a single item requested
type RequestedItem = {
  id: number;
  name: string;
  quantity: string;
};

export default function StationeryForm() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // 🟢 NEW WAY: Initialize auth and store the user globally for this component
  const firebaseAuth = getAuth();
  const currentUser = firebaseAuth.currentUser;

  // 🟢 Fixed list of up to 4 items on the form
  const [items, setItems] = useState<RequestedItem[]>([
    { id: 1, name: "", quantity: "" },
    { id: 2, name: "", quantity: "" },
    { id: 3, name: "", quantity: "" },
    { id: 4, name: "", quantity: "" },
  ]);
  const [loading, setLoading] = useState(false);

  // Controls the custom dropdown modal
  const [activeItemSlot, setActiveItemSlot] = useState<number | null>(null);
  const [isPickerVisible, setPickerVisible] = useState(false);

  const handleUpdateItem = (
    id: number,
    field: keyof RequestedItem,
    value: string,
  ) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleOpenPicker = (slotId: number) => {
    setActiveItemSlot(slotId);
    setPickerVisible(true);
  };

  const handleSelectItem = (name: string) => {
    if (activeItemSlot !== null) {
      handleUpdateItem(activeItemSlot, "name", name);
      setPickerVisible(false);
      setActiveItemSlot(null);
    }
  };

  const handleSubmit = async () => {
    // 🟢 NEW WAY: Use the currentUser variable we created above
    if (!currentUser) {
      Alert.alert("Error", "You must be logged in.");
      return;
    }

    // 🟢 1. Collect and validate non-empty items
    const filledItems = items.filter(
      (i) => i.name.trim() !== "" && i.quantity.trim() !== "",
    );

    if (filledItems.length === 0) {
      return Alert.alert(
        "Validation",
        "Please add at least one item with a valid name and quantity.",
      );
    }

    // Simple validation: check for negative numbers or non-integers in quantity
    for (const item of filledItems) {
      if (!/^\d+$/.test(item.quantity) || parseInt(item.quantity) <= 0) {
        return Alert.alert(
          "Validation",
          `Please enter a valid, positive quantity for item ${item.id}.`,
        );
      }
    }

    try {
      setLoading(true);
      // const token = await currentUser.getIdToken();
      const token = await getIdToken(currentUser);

      const res = await fetch(
        `${API_BASE_URL}/api/employee/stationery-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            // The database will grab name and email from the token
            employee_name: currentUser.displayName || "Employee",
            items: filledItems.map((item) => ({
              name: item.name,
              quantity: item.quantity,
            })),
          }),
        },
      );

      if (!res.ok) throw new Error("Failed to submit request");

      Alert.alert("Success", "Stationery request submitted successfully!");

      // Reset the form
      setItems([
        { id: 1, name: "", quantity: "" },
        { id: 2, name: "", quantity: "" },
        { id: 3, name: "", quantity: "" },
        { id: 4, name: "", quantity: "" },
      ]);
      router.push("/stationery-req/history"); // 🟢 Go check my history
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
        <Text style={styles.headerTitle}>Stationery Form</Text>
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
                * Submitted by the currently logged-in account.
              </Text>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🔧</Text>
              <Text style={styles.sectionHeaderText}>
                Request Gadgets (Up to 4)
              </Text>
            </View>

            {items.map((item, index) => (
              <View key={item.id} style={styles.itemSlot}>
                <Text style={styles.itemNumberBadge}>GIL-REQ {index + 1}</Text>

                {/* Custom Modal-Based Dropdown (Chameleon doesn't know sides) */}
                <Text style={styles.itemSlotLabel}>GIL Items *</Text>
                <TouchableOpacity
                  onPress={() => handleOpenPicker(item.id)}
                  style={styles.dropdownPickerButton}
                >
                  <Text
                    style={[
                      styles.dropdownPickerText,
                      !item.name && { color: "#94a3b8" },
                    ]}
                  >
                    {item.name || "A4 size Paper Packet..."}
                  </Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>

                <TextInputField
                  label="GIL Total QTY *"
                  value={item.quantity}
                  onChangeText={(val) =>
                    handleUpdateItem(item.id, "quantity", val)
                  }
                  placeholder="E.g., 2..."
                  keyboardType="numeric"
                  style={styles.quantityInputField}
                />
              </View>
            ))}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Request Form</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Item Picker Modal (Chameleon doesn't know fonts) */}
      <Modal
        visible={isPickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPickerVisible(false)}
      >
        <SafeAreaView style={styles.pickerModalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setPickerVisible(false)}
          />
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>
                Select Stationery Item
              </Text>
              <TouchableOpacity
                onPress={() => setPickerVisible(false)}
                style={styles.pickerModalCloseBtn}
              >
                <Text style={styles.pickerModalCloseBtnText}>✕ Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={STATIONERY_ITEMS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectItem(item)}
                  style={styles.pickerModalItemButton}
                >
                  <Text style={styles.pickerModalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>
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
  itemSlot: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2, // Slight pop-out for Android
  },
  itemNumberBadge: {
    position: "absolute",
    top: -12,
    left: 16,
    backgroundColor: "#fbbf24", // Gil Color - Amber
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    textTransform: "uppercase",
  },
  itemSlotLabel: {
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 15,
    color: "#1e293b", // Slate-800
    marginTop: 10,
  },
  dropdownPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#f8fafc",
    fontSize: 16,
    color: "#0f172a", // Slate-900 (Dark)
    marginBottom: 10,
  },
  dropdownPickerText: {
    fontSize: 16,
    color: "#0f172a", // Slate-900 (Dark)
  },
  dropdownIcon: {
    fontSize: 12,
    color: "#64748b",
  },
  quantityInputField: {
    marginTop: 0,
    width: "40%", // Narrow field, Chameleon doesn't know sides
  },
  pickerModalContainer: {
    flex: 1,
    justifyContent: "flex-end", // Opens from the bottom
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerModalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: "70%", // Chameleon doesn't know fonts
  },
  pickerModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
  },
  pickerModalCloseBtn: {
    padding: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
  },
  pickerModalCloseBtnText: {
    color: "#dc2626", // Red-600
    fontWeight: "600",
    fontSize: 13,
  },
  pickerModalItemButton: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  pickerModalItemText: {
    fontSize: 16,
    color: "#1e293b", // Slate-800
  },
});
