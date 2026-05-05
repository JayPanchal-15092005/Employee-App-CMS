// import { Ionicons } from "@expo/vector-icons";
// import { Asset } from "expo-asset";
// import * as FileSystem from "expo-file-system/legacy";
// import * as Print from "expo-print";
// import { useRouter } from "expo-router";
// import * as Sharing from "expo-sharing";
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
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// // 🟢 ALL OUR BENQ MODELS & DATA
// const BENQ_MODELS = [
//   { id: "RP6504", series: "RP", size: '65"', price: 112000 },
//   { id: "RP7504", series: "RP", size: '75"', price: 144000 },
//   { id: "RP8604", series: "RP", size: '86"', price: 205000 },
//   { id: "RE6504", series: "RE", size: '65"', price: 78000 },
//   { id: "RE7504", series: "RE", size: '75"', price: 98000 },
//   { id: "RE8604", series: "RE", size: '86"', price: 144000 },
// ];

// export default function CreateQuotation() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [isDropdownVisible, setDropdownVisible] = useState(false);

//   // Form State
//   const [customerName, setCustomerName] = useState("");
//   const [customerAddress, setCustomerAddress] = useState("");
//   const [selectedModel, setSelectedModel] = useState(BENQ_MODELS[1]); // Default RP7504
//   const [qty, setQty] = useState("1");
//   const [unitPrice, setUnitPrice] = useState(String(BENQ_MODELS[1].price));

//   // --- 🟢 CALCULATIONS ---
//   const parsedQty = parseInt(qty) || 0;
//   const parsedPrice = parseInt(unitPrice) || 0;

//   // 1. Panel Math
//   const panelBaseTotal = parsedQty * parsedPrice;
//   const panelGst = panelBaseTotal * 0.18;
//   const panelFinalTotal = panelBaseTotal + panelGst;

//   // 2. Floor Stand Math (Fixed at 8000)
//   const standBaseTotal = 8000;
//   const standGst = standBaseTotal * 0.18; // 1440
//   const standFinalTotal = standBaseTotal + standGst; // 9440

//   // 3. Grand Totals
//   const grandBase = panelBaseTotal + standBaseTotal;
//   const grandGst = panelGst + standGst;
//   const grandTotal = panelFinalTotal + standFinalTotal;

//   // Formatter for Indian Rupees
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   // Handle Model Selection
//   const handleSelectModel = (model: any) => {
//     setSelectedModel(model);
//     setUnitPrice(String(model.price)); // Auto-update price when model changes!
//     setDropdownVisible(false);
//   };

//   const generatePDF = async () => {
//     if (!customerName || !customerAddress) {
//       Alert.alert(
//         "Missing Info",
//         "Please fill in the Customer Name and Address.",
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const today = new Date().toLocaleDateString("en-GB");

//       let logoSrc = "";
//       try {
//         const logoAsset = Asset.fromModule(require("@/assets/images/icon.png"));
//         await logoAsset.downloadAsync();
//         if (logoAsset.localUri) {
//           const base64 = await FileSystem.readAsStringAsync(
//             logoAsset.localUri,
//             { encoding: "base64" },
//           );
//           logoSrc = `data:image/jpeg;base64,${base64}`;
//         }
//       } catch (imgError) {
//         logoSrc = "https://via.placeholder.com/120x120.png?text=Logo+Missing";
//       }

//       const htmlContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 40px; color: #000; }
//             .header-container { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
//             .logo-section { width: 25%; text-align: left; }
//             .details-section { width: 75%; text-align: center; }
//             .company-name { font-family: 'Times New Roman', Times, serif; font-size: 26px; font-weight: bold; color: #1e3a8a; margin: 0; letter-spacing: 0.5px; }
//             .tagline { font-size: 13px; color: #333; margin: 4px 0; font-family: Arial, sans-serif; }
//             .iso-badge { background-color: #1e3a8a; color: #fff; display: inline-block; padding: 4px 16px; font-size: 12px; font-weight: bold; margin: 4px 0; }
//             .address-text { font-size: 10px; color: #333; margin-top: 4px; line-height: 1.4; }
//             .divider-line { border-top: 2px solid #555; margin-top: 10px; padding-top: 5px; text-align: right; font-size: 11px; font-weight: bold; }
//             .date-row { text-align: right; font-size: 12px; font-weight: bold; margin-top: 20px; margin-bottom: 20px; }
//             .to-section { font-size: 13px; line-height: 1.5; margin-bottom: 25px; }
//             .subject { font-weight: bold; font-size: 13px; margin-bottom: 20px; }
//             table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px;}
//             th, td { border: 1px solid #000; padding: 8px; text-align: center; }
//             th { font-weight: bold; }
//             .item-desc { text-align: left; font-weight: bold; }
//             .terms { font-size: 11px; line-height: 1.6; margin-bottom: 40px; }
//             .terms-title { font-weight: bold; font-size: 12px; text-decoration: underline; margin-bottom: 5px;}
//             .signature { font-size: 12px; line-height: 1.4; }
//             .sign-name { font-weight: bold; margin-top: 40px; }
//             .footer { position: fixed; bottom: 30px; left: 40px; right: 40px; font-size: 10px; text-align: center; color: #555; }
//           </style>
//         </head>
//         <body>

//           <div class="header-container">
//             <div class="logo-section">
//               <img src="${logoSrc}" style="width: 100px; height: auto;" />
//             </div>
//             <div class="details-section">
//               <h1 class="company-name">GUJARAT INFOTECH LIMITED</h1>
//               <p class="tagline">Information Technology For Better Services to Citizens</p>
//               <div class="iso-badge">ISO 9001 : 2015 and 27001 : 2013</div>
//               <div class="address-text">
//                 JAMSAB, A-2, 2nd Floor, Jay Tower, Ankur Complex, Naranpura, Ahmedabad 380013. (Gujarat)<br>
//                 Ph: 079-27452276, 27457650 • E-mail: tender@gujaratinfotech.com<br>
//                 www.gujaratinfotech.com, www.jamsab.com, www.gram-seva.org
//               </div>
//             </div>
//           </div>

//           <div class="divider-line">CIN No. : U72200GJ1995PLC025454</div>
//           <div class="date-row">Date: ${today}</div>

//           <div class="to-section">
//             <strong>To,</strong><br>
//             <strong>${customerName}</strong><br>
//             ${customerAddress.replace(/\n/g, "<br>")}
//           </div>

//           <div class="subject">Subject: Quotation for BenQ Interactive Whiteboards</div>

//           <table>
//             <thead>
//               <tr>
//                 <th>Sr No</th>
//                 <th class="item-desc">Description</th>
//                 <th>Model</th>
//                 <th>Size</th>
//                 <th>Qty</th>
//                 <th>Unit Price</th>
//                 <th>GST (18%)</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>1</td>
//                 <!-- 🟢 Dynamic Series Description -->
//                 <td class="item-desc">BenQ Interactive Panel - ${selectedModel.series} Series</td>
//                 <td>${selectedModel.id}</td>
//                 <td>${selectedModel.size}</td>
//                 <td>${parsedQty}</td>
//                 <td>${formatCurrency(parsedPrice)}</td>
//                 <td>${formatCurrency(panelGst)}</td>
//                 <td><strong>${formatCurrency(panelFinalTotal)}</strong></td>
//               </tr>
//               <tr>
//                 <td>2</td>
//                 <td class="item-desc">Floor Stand (55-86")</td>
//                 <td>PL-E800</td>
//                 <td>-</td>
//                 <td>1</td>
//                 <td>₹8,000</td>
//                 <td>₹1,440</td>
//                 <td>₹9,440</td>
//               </tr>
//             </tbody>
//           </table>

//           <div class="terms">
//             <div class="terms-title">Terms and Conditions:</div>
//             • Price is inclusive of all taxes<br>
//             • Payment is Advance 100%.<br>
//             • Supply and Installation will be completed within 5 days of receiving confirmation.<br>
//             • Validity of the commercials - 6 Working days<br>
//             • Installation will be Complementary if it is concrete wall
//           </div>

//           <div class="signature">
//             Thanking You,<br>
//             For, Gujarat Infotech Limited<br>
//             <div class="sign-name">Bhargav Suthar</div>
//             IT Manager<br>
//             M no: 9712995002<br>
//             Place: Ahmedabad
//           </div>

//           <div class="footer">
//             Corporate Office: 304-307, 3rd Floor, FORTUNE BUSINESS HUB,<br>
//             Nr. Shell Petrol Pump, Science City Road, Sola, Ahmedabad 380060
//           </div>

//         </body>
//         </html>
//       `;

//       const { uri } = await Print.printToFileAsync({
//         html: htmlContent,
//         base64: false,
//       });

//       if (await Sharing.isAvailableAsync()) {
//         await Sharing.shareAsync(uri, {
//           mimeType: "application/pdf",
//           dialogTitle: "Share Quotation",
//         });
//       } else {
//         Alert.alert("Error", "Sharing is not available on this device");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Could not generate the PDF.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: "#f4f4f5" }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView
//         style={styles.container}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ flexGrow: 1 }}
//       >
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => router.back()}
//             style={styles.backButton}
//           >
//             <Ionicons name="arrow-back" size={24} color="#333" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>New Quotation</Text>
//         </View>

//         <View style={styles.formCard}>
//           <Text style={styles.sectionTitle}>Customer Details</Text>
//           <Text style={styles.label}>Customer Name (To)</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g. Akshat Ligga Academy"
//             value={customerName}
//             onChangeText={setCustomerName}
//           />

//           <Text style={styles.label}>Address</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             placeholder="Enter full address..."
//             multiline
//             numberOfLines={3}
//             value={customerAddress}
//             onChangeText={setCustomerAddress}
//           />

//           <View style={styles.divider} />
//           <Text style={styles.sectionTitle}>Product Details</Text>

//           <View style={styles.row}>
//             <View style={{ flex: 2, marginRight: 12 }}>
//               <Text style={styles.label}>Select Model</Text>
//               {/* 🟢 CUSTOM DROPDOWN BUTTON */}
//               <TouchableOpacity
//                 style={styles.dropdownBtn}
//                 onPress={() => setDropdownVisible(true)}
//               >
//                 <Text style={styles.dropdownText}>{selectedModel.id}</Text>
//                 <Ionicons name="chevron-down" size={18} color="#64748b" />
//               </TouchableOpacity>
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.label}>Size</Text>
//               {/* Size is now auto-populated and read-only */}
//               <View style={styles.readOnlyInput}>
//                 <Text style={styles.readOnlyText}>{selectedModel.size}</Text>
//               </View>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={styles.halfWidth}>
//               <Text style={styles.label}>Quantity</Text>
//               <TextInput
//                 style={styles.input}
//                 keyboardType="number-pad"
//                 value={qty}
//                 onChangeText={setQty}
//               />
//             </View>
//             <View style={styles.halfWidth}>
//               <Text style={styles.label}>Unit Price (₹)</Text>
//               {/* Price auto-updates, but stays as an input so they can apply manual discounts! */}
//               <TextInput
//                 style={styles.input}
//                 keyboardType="number-pad"
//                 value={unitPrice}
//                 onChangeText={setUnitPrice}
//               />
//             </View>
//           </View>

//           {/* 🟢 LIVE PREVIEW INCLUDING THE FLOOR STAND */}
//           <View style={styles.calcBox}>
//             <View style={styles.calcRow}>
//               <Text style={styles.calcLabel}>Panel Base Total:</Text>
//               <Text style={styles.calcValue}>
//                 {formatCurrency(panelBaseTotal)}
//               </Text>
//             </View>
//             <View style={styles.calcRow}>
//               <Text style={styles.calcLabel}>Floor Stand (Base):</Text>
//               <Text style={styles.calcValue}>
//                 + {formatCurrency(standBaseTotal)}
//               </Text>
//             </View>
//             <View style={styles.calcRow}>
//               <Text style={styles.calcLabel}>Total GST (18%):</Text>
//               <Text style={styles.calcValue}>+ {formatCurrency(grandGst)}</Text>
//             </View>
//             <View style={[styles.calcRow, styles.finalCalcRow]}>
//               <Text style={styles.finalTotalLabel}>Grand Total:</Text>
//               <Text style={styles.finalTotalValue}>
//                 {formatCurrency(grandTotal)}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <TouchableOpacity
//           style={styles.generateButton}
//           onPress={generatePDF}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <>
//               <Ionicons
//                 name="document-text"
//                 size={20}
//                 color="#fff"
//                 style={{ marginRight: 8 }}
//               />
//               <Text style={styles.generateBtnText}>Generate & Share PDF</Text>
//             </>
//           )}
//         </TouchableOpacity>

//         <View style={{ height: 80 }} />
//       </ScrollView>

//       {/* 🟢 THE CUSTOM DROPDOWN MODAL */}
//       <Modal
//         visible={isDropdownVisible}
//         transparent={true}
//         animationType="fade"
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setDropdownVisible(false)}
//         >
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select BenQ Model</Text>
//             <FlatList
//               data={BENQ_MODELS}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.modalItem}
//                   onPress={() => handleSelectModel(item)}
//                 >
//                   <Text style={styles.modalItemTitle}>
//                     {item.id} ({item.size})
//                   </Text>
//                   <Text style={styles.modalItemSub}>
//                     {item.series} Series • {formatCurrency(item.price)}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f4f4f5" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 20,
//     paddingTop: 50,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e4e4e7",
//   },
//   backButton: { marginRight: 15 },
//   headerTitle: { fontSize: 20, fontWeight: "bold", color: "#18181b" },
//   formCard: {
//     backgroundColor: "#fff",
//     margin: 16,
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#0056b3",
//     marginBottom: 15,
//   },
//   divider: { height: 1, backgroundColor: "#e4e4e7", marginVertical: 20 },
//   label: { fontSize: 13, fontWeight: "600", color: "#52525b", marginBottom: 6 },
//   input: {
//     backgroundColor: "#f8fafc",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 15,
//     color: "#0f172a",
//     marginBottom: 16,
//   },
//   readOnlyInput: {
//     backgroundColor: "#f1f5f9",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   readOnlyText: {
//     fontSize: 15,
//     color: "#64748b",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   textArea: { height: 80, textAlignVertical: "top" },
//   row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
//   halfWidth: { flex: 1 },
//   calcBox: {
//     backgroundColor: "#f0fdf4",
//     padding: 16,
//     borderRadius: 8,
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: "#bbf7d0",
//   },
//   calcRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 6,
//   },
//   calcLabel: { color: "#166534", fontSize: 13 },
//   calcValue: { color: "#166534", fontSize: 13, fontWeight: "500" },
//   finalCalcRow: {
//     marginTop: 8,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: "#bbf7d0",
//   },
//   finalTotalLabel: { color: "#14532d", fontSize: 15, fontWeight: "bold" },
//   finalTotalValue: { color: "#14532d", fontSize: 16, fontWeight: "bold" },
//   generateButton: {
//     backgroundColor: "#0056b3",
//     marginHorizontal: 16,
//     padding: 16,
//     borderRadius: 12,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#0056b3",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   generateBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

//   // Modal Styles
//   dropdownBtn: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#0056b3",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   dropdownText: { fontSize: 15, fontWeight: "bold", color: "#0056b3" },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 20,
//     maxHeight: "80%",
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1e293b",
//     marginBottom: 15,
//     textAlign: "center",
//   },
//   modalItem: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f1f5f9",
//   },
//   modalItemTitle: { fontSize: 16, fontWeight: "bold", color: "#0f172a" },
//   modalItemSub: { fontSize: 13, color: "#64748b", marginTop: 2 },
// });

// import { Ionicons } from "@expo/vector-icons";
// import { Asset } from "expo-asset";
// import * as FileSystem from "expo-file-system/legacy";
// import * as Print from "expo-print";
// import { useRouter } from "expo-router";
// import * as Sharing from "expo-sharing";
// import React, { useEffect, useState } from "react"; // 🟢 ADDED useEffect
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
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// // ALL OUR BENQ MODELS & DATA
// const BENQ_MODELS = [
//   { id: "RP6504", series: "RP", size: '65"', price: 112000 },
//   { id: "RP7504", series: "RP", size: '75"', price: 144000 },
//   { id: "RP8604", series: "RP", size: '86"', price: 205000 },
//   { id: "RE6504", series: "RE", size: '65"', price: 78000 },
//   { id: "RE7504", series: "RE", size: '75"', price: 98000 },
//   { id: "RE8604", series: "RE", size: '86"', price: 144000 },
// ];

// export default function CreateQuotation() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [isDropdownVisible, setDropdownVisible] = useState(false);

//   // 🟢 NEW: State to hold the pre-loaded logo
//   const [logoSrc, setLogoSrc] = useState(
//     "https://via.placeholder.com/120x120.png?text=Logo+Missing",
//   );

//   // Form State
//   const [customerName, setCustomerName] = useState("");
//   const [customerAddress, setCustomerAddress] = useState("");
//   const [selectedModel, setSelectedModel] = useState(BENQ_MODELS[1]);
//   const [qty, setQty] = useState("1");
//   const [unitPrice, setUnitPrice] = useState(String(BENQ_MODELS[1].price));
//   const [includeStand, setIncludeStand] = useState(false);

//   // 🟢 NEW: Pre-load the logo ONCE when the screen opens so it never freezes
//   useEffect(() => {
//     const loadLogo = async () => {
//       try {
//         const logoAsset = Asset.fromModule(
//           require("@/assets/images/gil-logo.jpg"),
//         );
//         await logoAsset.downloadAsync();
//         if (logoAsset.localUri) {
//           const base64 = await FileSystem.readAsStringAsync(
//             logoAsset.localUri,
//             { encoding: "base64" },
//           );
//           setLogoSrc(`data:image/jpeg;base64,${base64}`);
//         }
//       } catch (error) {
//         console.log("Failed to preload logo", error);
//       }
//     };
//     loadLogo();
//   }, []); // Empty array means this runs ONLY ONCE

//   // --- CALCULATIONS ---
//   const parsedQty = parseInt(qty) || 0;
//   const parsedPrice = parseInt(unitPrice) || 0;

//   const panelBaseTotal = parsedQty * parsedPrice;
//   const panelGst = panelBaseTotal * 0.18;
//   const panelFinalTotal = panelBaseTotal + panelGst;

//   const standBaseTotal = includeStand ? 8000 : 0;
//   const standGst = standBaseTotal * 0.18;
//   const standFinalTotal = standBaseTotal + standGst;

//   const grandBase = panelBaseTotal + standBaseTotal;
//   const grandGst = panelGst + standGst;
//   const grandTotal = panelFinalTotal + standFinalTotal;

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const handleSelectModel = (model: any) => {
//     setSelectedModel(model);
//     setUnitPrice(String(model.price));
//     setDropdownVisible(false);
//   };

//   const generatePDF = async () => {
//     if (!customerName || !customerAddress) {
//       Alert.alert(
//         "Missing Info",
//         "Please fill in the Customer Name and Address.",
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const today = new Date().toLocaleDateString("en-GB");

//       const floorStandHtml = includeStand
//         ? `
//         <tr>
//           <td>2</td>
//           <td class="item-desc">Floor Stand (55-86")</td>
//           <td>PL-E800</td>
//           <td>-</td>
//           <td>1</td>
//           <td>₹8,000</td>
//           <td>₹1,440</td>
//           <td>₹9,440</td>
//         </tr>
//       `
//         : "";

//       const htmlContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 40px; color: #000; }
//             .header-container { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
//             .logo-section { width: 25%; text-align: left; }
//             .details-section { width: 75%; text-align: center; }
//             .company-name { font-family: 'Times New Roman', Times, serif; font-size: 26px; font-weight: bold; color: #1e3a8a; margin: 0; letter-spacing: 0.5px; }
//             .tagline { font-size: 13px; color: #333; margin: 4px 0; font-family: Arial, sans-serif; }
//             .iso-badge { background-color: #1e3a8a; color: #fff; display: inline-block; padding: 4px 16px; font-size: 12px; font-weight: bold; margin: 4px 0; }
//             .address-text { font-size: 10px; color: #333; margin-top: 4px; line-height: 1.4; }
//             .divider-line { border-top: 2px solid #555; margin-top: 10px; padding-top: 5px; text-align: right; font-size: 11px; font-weight: bold; }
//             .date-row { text-align: right; font-size: 12px; font-weight: bold; margin-top: 20px; margin-bottom: 20px; }
//             .to-section { font-size: 13px; line-height: 1.5; margin-bottom: 25px; }
//             .subject { font-weight: bold; font-size: 13px; margin-bottom: 20px; }
//             table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px;}
//             th, td { border: 1px solid #000; padding: 8px; text-align: center; }
//             th { font-weight: bold; }
//             .item-desc { text-align: left; font-weight: bold; }
//             .terms { font-size: 11px; line-height: 1.6; margin-bottom: 40px; }
//             .terms-title { font-weight: bold; font-size: 12px; text-decoration: underline; margin-bottom: 5px;}
//             .signature { font-size: 12px; line-height: 1.4; }
//             .sign-name { font-weight: bold; margin-top: 40px; }
//             .footer { position: fixed; bottom: 30px; left: 40px; right: 40px; font-size: 10px; text-align: center; color: #555; }
//           </style>
//         </head>
//         <body>

//           <div class="header-container">
//             <div class="logo-section">
//               <img src="${logoSrc}" style="width: 100px; height: auto;" />
//             </div>
//             <div class="details-section">
//               <h1 class="company-name">GUJARAT INFOTECH LIMITED</h1>
//               <p class="tagline">Information Technology For Better Services to Citizens</p>
//               <div class="iso-badge">ISO 9001 : 2015 and 27001 : 2013</div>
//               <div class="address-text">
//                 JAMSAB, A-2, 2nd Floor, Jay Tower, Ankur Complex, Naranpura, Ahmedabad 380013. (Gujarat)<br>
//                 Ph: 079-27452276, 27457650 • E-mail: tender@gujaratinfotech.com<br>
//                 www.gujaratinfotech.com, www.jamsab.com, www.gram-seva.org
//               </div>
//             </div>
//           </div>

//           <div class="divider-line">CIN No. : U72200GJ1995PLC025454</div>
//           <div class="date-row">Date: ${today}</div>

//           <div class="to-section">
//             <strong>To,</strong><br>
//             <strong>${customerName}</strong><br>
//             ${customerAddress.replace(/\n/g, "<br>")}
//           </div>

//           <div class="subject">Subject: Quotation for BenQ Interactive Whiteboards</div>

//           <table>
//             <thead>
//               <tr>
//                 <th>Sr No</th>
//                 <th class="item-desc">Description</th>
//                 <th>Model</th>
//                 <th>Size</th>
//                 <th>Qty</th>
//                 <th>Unit Price</th>
//                 <th>GST (18%)</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>1</td>
//                 <td class="item-desc">BenQ Interactive Panel - ${selectedModel.series} Series</td>
//                 <td>${selectedModel.id}</td>
//                 <td>${selectedModel.size}</td>
//                 <td>${parsedQty}</td>
//                 <td>${formatCurrency(parsedPrice)}</td>
//                 <td>${formatCurrency(panelGst)}</td>
//                 <td><strong>${formatCurrency(panelFinalTotal)}</strong></td>
//               </tr>
//               ${floorStandHtml}
//             </tbody>
//           </table>

//           <div class="terms">
//             <div class="terms-title">Terms and Conditions:</div>
//             • Price is inclusive of all taxes<br>
//             • Payment is Advance 100%.<br>
//             • Supply and Installation will be completed within 5 days of receiving confirmation.<br>
//             • Validity of the commercials - 6 Working days<br>
//             • Installation will be Complementary if it is concrete wall
//           </div>

//           <div class="signature">
//             Thanking You,<br>
//             For, Gujarat Infotech Limited<br>
//             <div class="sign-name">Bhargav Suthar</div>
//             IT Manager<br>
//             M no: 9712995002<br>
//             Place: Ahmedabad
//           </div>

//           <div class="footer">
//             Corporate Office: 304-307, 3rd Floor, FORTUNE BUSINESS HUB,<br>
//             Nr. Shell Petrol Pump, Science City Road, Sola, Ahmedabad 380060
//           </div>

//         </body>
//         </html>
//       `;

//       const { uri } = await Print.printToFileAsync({
//         html: htmlContent,
//         base64: false,
//       });

//       if (await Sharing.isAvailableAsync()) {
//         await Sharing.shareAsync(uri, {
//           mimeType: "application/pdf",
//           dialogTitle: "Share Quotation",
//         });
//       } else {
//         Alert.alert("Error", "Sharing is not available on this device");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Could not generate the PDF.");
//     } finally {
//       setLoading(false); // This will now trigger perfectly every time!
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: "#f4f4f5" }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView
//         style={styles.container}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ flexGrow: 1 }}
//       >
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => router.back()}
//             style={styles.backButton}
//           >
//             <Ionicons name="arrow-back" size={24} color="#333" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>New Quotation</Text>
//         </View>

//         <View style={styles.formCard}>
//           <Text style={styles.sectionTitle}>Customer Details</Text>

//           <Text style={styles.label}>Customer Name (To)</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g. Akshat Ligga Academy"
//             placeholderTextColor="#9ca3af"
//             value={customerName}
//             onChangeText={setCustomerName}
//           />

//           <Text style={styles.label}>Address</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             placeholder="Enter full address..."
//             placeholderTextColor="#9ca3af"
//             multiline
//             numberOfLines={3}
//             value={customerAddress}
//             onChangeText={setCustomerAddress}
//           />

//           <View style={styles.divider} />
//           <Text style={styles.sectionTitle}>Product Details</Text>

//           <View style={styles.row}>
//             <View style={{ flex: 2, marginRight: 12 }}>
//               <Text style={styles.label}>Select Model</Text>
//               <TouchableOpacity
//                 style={styles.dropdownBtn}
//                 onPress={() => setDropdownVisible(true)}
//               >
//                 <Text style={styles.dropdownText}>{selectedModel.id}</Text>
//                 <Ionicons name="chevron-down" size={18} color="#64748b" />
//               </TouchableOpacity>
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.label}>Size</Text>
//               <View style={styles.readOnlyInput}>
//                 <Text style={styles.readOnlyText}>{selectedModel.size}</Text>
//               </View>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={styles.halfWidth}>
//               <Text style={styles.label}>Quantity</Text>
//               <TextInput
//                 style={styles.input}
//                 keyboardType="number-pad"
//                 value={qty}
//                 onChangeText={setQty}
//               />
//             </View>
//             <View style={styles.halfWidth}>
//               <Text style={styles.label}>Unit Price (₹)</Text>
//               <TextInput
//                 style={styles.input}
//                 keyboardType="number-pad"
//                 value={unitPrice}
//                 onChangeText={setUnitPrice}
//               />
//             </View>
//           </View>

//           <TouchableOpacity
//             style={styles.checkboxRow}
//             activeOpacity={0.7}
//             onPress={() => setIncludeStand(!includeStand)}
//           >
//             <Ionicons
//               name={includeStand ? "checkbox" : "square-outline"}
//               size={24}
//               color={includeStand ? "#0056b3" : "#64748b"}
//             />
//             <Text style={styles.checkboxLabel}>
//               Include Floor Stand (₹8,000)
//             </Text>
//           </TouchableOpacity>

//           <View style={styles.calcBox}>
//             <View style={styles.calcRow}>
//               <Text style={styles.calcLabel}>Panel Base Total:</Text>
//               <Text style={styles.calcValue}>
//                 {formatCurrency(panelBaseTotal)}
//               </Text>
//             </View>

//             {includeStand && (
//               <View style={styles.calcRow}>
//                 <Text style={styles.calcLabel}>Floor Stand (Base):</Text>
//                 <Text style={styles.calcValue}>
//                   + {formatCurrency(standBaseTotal)}
//                 </Text>
//               </View>
//             )}

//             <View style={styles.calcRow}>
//               <Text style={styles.calcLabel}>Total GST (18%):</Text>
//               <Text style={styles.calcValue}>+ {formatCurrency(grandGst)}</Text>
//             </View>
//             <View style={[styles.calcRow, styles.finalCalcRow]}>
//               <Text style={styles.finalTotalLabel}>Grand Total:</Text>
//               <Text style={styles.finalTotalValue}>
//                 {formatCurrency(grandTotal)}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <TouchableOpacity
//           style={styles.generateButton}
//           onPress={generatePDF}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <>
//               <Ionicons
//                 name="document-text"
//                 size={20}
//                 color="#fff"
//                 style={{ marginRight: 8 }}
//               />
//               <Text style={styles.generateBtnText}>Generate & Share PDF</Text>
//             </>
//           )}
//         </TouchableOpacity>

//         <View style={{ height: 80 }} />
//       </ScrollView>

//       <Modal
//         visible={isDropdownVisible}
//         transparent={true}
//         animationType="fade"
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setDropdownVisible(false)}
//         >
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select BenQ Model</Text>
//             <FlatList
//               data={BENQ_MODELS}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.modalItem}
//                   onPress={() => handleSelectModel(item)}
//                 >
//                   <Text style={styles.modalItemTitle}>
//                     {item.id} ({item.size})
//                   </Text>
//                   <Text style={styles.modalItemSub}>
//                     {item.series} Series • {formatCurrency(item.price)}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f4f4f5" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 20,
//     paddingTop: 50,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e4e4e7",
//   },
//   backButton: { marginRight: 15 },
//   headerTitle: { fontSize: 20, fontWeight: "bold", color: "#18181b" },
//   formCard: {
//     backgroundColor: "#fff",
//     margin: 16,
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#0056b3",
//     marginBottom: 15,
//   },
//   divider: { height: 1, backgroundColor: "#e4e4e7", marginVertical: 20 },
//   label: { fontSize: 13, fontWeight: "600", color: "#52525b", marginBottom: 6 },
//   input: {
//     backgroundColor: "#f8fafc",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 15,
//     color: "#0f172a",
//     marginBottom: 16,
//   },
//   readOnlyInput: {
//     backgroundColor: "#f1f5f9",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   readOnlyText: {
//     fontSize: 15,
//     color: "#64748b",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   textArea: { height: 80, textAlignVertical: "top" },
//   row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
//   halfWidth: { flex: 1 },
//   checkboxRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//     marginTop: 4,
//   },
//   checkboxLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#334155",
//     marginLeft: 8,
//   },
//   calcBox: {
//     backgroundColor: "#f0fdf4",
//     padding: 16,
//     borderRadius: 8,
//     marginTop: 4,
//     borderWidth: 1,
//     borderColor: "#bbf7d0",
//   },
//   calcRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 6,
//   },
//   calcLabel: { color: "#166534", fontSize: 13 },
//   calcValue: { color: "#166534", fontSize: 13, fontWeight: "500" },
//   finalCalcRow: {
//     marginTop: 8,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: "#bbf7d0",
//   },
//   finalTotalLabel: { color: "#14532d", fontSize: 15, fontWeight: "bold" },
//   finalTotalValue: { color: "#14532d", fontSize: 16, fontWeight: "bold" },
//   generateButton: {
//     backgroundColor: "#0056b3",
//     marginHorizontal: 16,
//     padding: 16,
//     borderRadius: 12,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#0056b3",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   generateBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//   dropdownBtn: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#0056b3",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   dropdownText: { fontSize: 15, fontWeight: "bold", color: "#0056b3" },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 20,
//     maxHeight: "80%",
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1e293b",
//     marginBottom: 15,
//     textAlign: "center",
//   },
//   modalItem: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f1f5f9",
//   },
//   modalItemTitle: { fontSize: 16, fontWeight: "bold", color: "#0f172a" },
//   modalItemSub: { fontSize: 13, color: "#64748b", marginTop: 2 },
// });

// import { Ionicons } from "@expo/vector-icons";
// import { Asset } from "expo-asset";
// import * as FileSystem from "expo-file-system/legacy";
// import * as Print from "expo-print";
// import { useRouter } from "expo-router";
// import * as Sharing from "expo-sharing";
// import React, { useEffect, useState } from "react";
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
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// // ALL OUR NEW BENQ MODELS & PRICING
// const BENQ_MODELS = [
//   { id: "RP6504", series: "RP", size: '65"', price: 125440 },
//   { id: "RP7504", series: "RP", size: '75"', price: 161280 },
//   { id: "RP8604", series: "RP", size: '86"', price: 229600 },
//   { id: "RE6504", series: "RE", size: '65"', price: 87630 },
//   { id: "RE7504", series: "RE", size: '75"', price: 109760 },
//   { id: "RE8604", series: "RE", size: '86"', price: 161280 },
// ];

// export default function CreateQuotation() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [isDropdownVisible, setDropdownVisible] = useState(false);

//   // 🟢 IMAGE STATES
//   const [logoSrc, setLogoSrc] = useState(
//     "https://via.placeholder.com/120x120.png?text=Logo+Missing",
//   );
//   const [stampSrc, setStampSrc] = useState(""); // 🟢 NEW STATE FOR THE STAMP

//   // Form State
//   const [customerName, setCustomerName] = useState("");
//   const [customerAddress, setCustomerAddress] = useState("");
//   const [selectedModel, setSelectedModel] = useState(BENQ_MODELS[1]);
//   const [qty, setQty] = useState("1");
//   const [unitPrice, setUnitPrice] = useState(String(BENQ_MODELS[1].price));
//   const [includeStand, setIncludeStand] = useState(false);

//   // 🟢 NEW: Pre-load BOTH images at the same time
//   useEffect(() => {
//     const loadImages = async () => {
//       try {
//         // Load Logo
//         const logoAsset = Asset.fromModule(require("@/assets/images/icon.png"));
//         await logoAsset.downloadAsync();
//         if (logoAsset.localUri) {
//           const base64Logo = await FileSystem.readAsStringAsync(
//             logoAsset.localUri,
//             { encoding: "base64" },
//           );
//           setLogoSrc(`data:image/jpeg;base64,${base64Logo}`);
//         }

//         // 🟢 Load Stamp (CHANGE "round-stamp.png" TO MATCH YOUR ACTUAL FILENAME!)
//         const stampAsset = Asset.fromModule(
//           require("@/assets/images/round-stamp.png"),
//         );
//         await stampAsset.downloadAsync();
//         if (stampAsset.localUri) {
//           // If it's a jpeg, change data:image/png to data:image/jpeg below
//           const base64Stamp = await FileSystem.readAsStringAsync(
//             stampAsset.localUri,
//             { encoding: "base64" },
//           );
//           setStampSrc(`data:image/png;base64,${base64Stamp}`);
//         }
//       } catch (error) {
//         console.log("Failed to preload images", error);
//       }
//     };
//     loadImages();
//   }, []);

//   // --- CALCULATIONS ---
//   const parsedQty = parseInt(qty) || 0;
//   const parsedPrice = parseInt(unitPrice) || 0;

//   const panelBaseTotal = parsedQty * parsedPrice;
//   const panelGst = panelBaseTotal * 0.18;
//   const panelFinalTotal = panelBaseTotal + panelGst;

//   const standBaseTotal = includeStand ? 8000 : 0;
//   const standGst = standBaseTotal * 0.18;
//   const standFinalTotal = standBaseTotal + standGst;

//   const grandBase = panelBaseTotal + standBaseTotal;
//   const grandGst = panelGst + standGst;
//   const grandTotal = panelFinalTotal + standFinalTotal;

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const handleSelectModel = (model: any) => {
//     setSelectedModel(model);
//     setUnitPrice(String(model.price));
//     setDropdownVisible(false);
//   };

//   const generatePDF = async () => {
//     if (!customerName || !customerAddress) {
//       Alert.alert(
//         "Missing Info",
//         "Please fill in the Customer Name and Address.",
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const today = new Date().toLocaleDateString("en-GB");

//       const floorStandHtml = includeStand
//         ? `
//         <tr>
//           <td>2</td>
//           <td class="item-desc">Floor Stand (55-86")</td>
//           <td>PL-E800</td>
//           <td>-</td>
//           <td>1</td>
//           <td>₹8,000</td>
//           <td>₹1,440</td>
//           <td>₹9,440</td>
//         </tr>
//       `
//         : "";

//       const htmlContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 40px; color: #000; }
//             .header-container { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
//             .logo-section { width: 25%; text-align: left; }
//             .details-section { width: 75%; text-align: center; }
//             .company-name { font-family: 'Times New Roman', Times, serif; font-size: 26px; font-weight: bold; color: #1e3a8a; margin: 0; letter-spacing: 0.5px; }
//             .tagline { font-size: 13px; color: #333; margin: 4px 0; font-family: Arial, sans-serif; }
//             .iso-badge { background-color: #1e3a8a; color: #fff; display: inline-block; padding: 4px 16px; font-size: 12px; font-weight: bold; margin: 4px 0; }
//             .address-text { font-size: 10px; color: #333; margin-top: 4px; line-height: 1.4; }
//             .divider-line { border-top: 2px solid #555; margin-top: 10px; padding-top: 5px; text-align: right; font-size: 11px; font-weight: bold; }
//             .date-row { text-align: right; font-size: 12px; font-weight: bold; margin-top: 20px; margin-bottom: 20px; }
//             .to-section { font-size: 13px; line-height: 1.5; margin-bottom: 25px; }
//             .subject { font-weight: bold; font-size: 13px; margin-bottom: 20px; }
//             table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px;}
//             th, td { border: 1px solid #000; padding: 8px; text-align: center; }
//             th { font-weight: bold; }
//             .item-desc { text-align: left; font-weight: bold; }
//             .terms { font-size: 11px; line-height: 1.6; margin-bottom: 40px; }
//             .terms-title { font-weight: bold; font-size: 12px; text-decoration: underline; margin-bottom: 5px;}
//             .signature { font-size: 12px; line-height: 1.4; }
//             .sign-name { font-weight: bold; margin-top: 40px; }

//             /* 🟢 NEW: CSS styling for the stamp */
//             .stamp-wrapper { margin-top: 15px; text-align: left; padding-left: 10px;}
//             .stamp-image { width: 110px; height: auto; opacity: 0.9; }

//             .footer { position: fixed; bottom: 30px; left: 40px; right: 40px; font-size: 10px; text-align: center; color: #555; }
//           </style>
//         </head>
//         <body>

//           <div class="header-container">
//             <div class="logo-section">
//               <img src="${logoSrc}" style="width: 100px; height: auto;" />
//             </div>
//             <div class="details-section">
//               <h1 class="company-name">GUJARAT INFOTECH LIMITED</h1>
//               <p class="tagline">Information Technology For Better Services to Citizens</p>
//               <div class="iso-badge">ISO 9001 : 2015 and 27001 : 2013</div>
//               <div class="address-text">
//                 JAMSAB, A-2, 2nd Floor, Jay Tower, Ankur Complex, Naranpura, Ahmedabad 380013. (Gujarat)<br>
//                 Ph: 079-27452276, 27457650 • E-mail: tender@gujaratinfotech.com<br>
//                 www.gujaratinfotech.com, www.jamsab.com, www.gram-seva.org
//               </div>
//             </div>
//           </div>

//           <div class="divider-line">CIN No. : U72200GJ1995PLC025454</div>
//           <div class="date-row">Date: ${today}</div>

//           <div class="to-section">
//             <strong>To,</strong><br>
//             <strong>${customerName}</strong><br>
//             ${customerAddress.replace(/\n/g, "<br>")}
//           </div>

//           <div class="subject">Subject: Quotation for BenQ Interactive Whiteboards</div>

//           <table>
//             <thead>
//               <tr>
//                 <th>Sr No</th>
//                 <th class="item-desc">Description</th>
//                 <th>Model</th>
//                 <th>Size</th>
//                 <th>Qty</th>
//                 <th>Unit Price</th>
//                 <th>GST (18%)</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>1</td>
//                 <td class="item-desc">BenQ Interactive Panel - ${selectedModel.series} Series</td>
//                 <td>${selectedModel.id}</td>
//                 <td>${selectedModel.size}</td>
//                 <td>${parsedQty}</td>
//                 <td>${formatCurrency(parsedPrice)}</td>
//                 <td>${formatCurrency(panelGst)}</td>
//                 <td><strong>${formatCurrency(panelFinalTotal)}</strong></td>
//               </tr>
//               ${floorStandHtml}
//             </tbody>
//           </table>

//           <div class="terms">
//             <div class="terms-title">Terms and Conditions:</div>
//             • Price is inclusive of all taxes<br>
//             • Payment is Advance 100%.<br>
//             • Supply and Installation will be completed within 5 days of receiving confirmation.<br>
//             • Validity of the commercials - 6 Working days<br>
//             • Installation will be Complementary if it is concrete wall
//           </div>

//           <div class="signature">
//             Thanking You,<br>
//             For, Gujarat Infotech Limited<br>
//             <div class="sign-name">Bhargav Suthar</div>
//             IT Manager<br>
//             M no: 9712995002<br>
//             Place: Ahmedabad
//           </div>

//           <!-- 🟢 NEW: Round Stamp injected under signature -->
//           ${stampSrc ? `<div class="stamp-wrapper"><img src="${stampSrc}" class="stamp-image" /></div>` : ""}

//           <div class="footer">
//             Corporate Office: 304-307, 3rd Floor, FORTUNE BUSINESS HUB,<br>
//             Nr. Shell Petrol Pump, Science City Road, Sola, Ahmedabad 380060
//           </div>

//         </body>
//         </html>
//       `;

//       const { uri } = await Print.printToFileAsync({
//         html: htmlContent,
//         base64: false,
//       });

//       if (await Sharing.isAvailableAsync()) {
//         await Sharing.shareAsync(uri, {
//           mimeType: "application/pdf",
//           dialogTitle: "Share Quotation",
//         });
//       } else {
//         Alert.alert("Error", "Sharing is not available on this device");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Could not generate the PDF.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: "#f4f4f5" }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView
//         style={styles.container}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ flexGrow: 1 }}
//       >
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => router.back()}
//             style={styles.backButton}
//           >
//             <Ionicons name="arrow-back" size={24} color="#333" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>New Quotation</Text>
//         </View>

//         <View style={styles.formCard}>
//           <Text style={styles.sectionTitle}>Customer Details</Text>

//           <Text style={styles.label}>Customer Name (To)</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g. Akshat Ligga Academy"
//             placeholderTextColor="#9ca3af"
//             value={customerName}
//             onChangeText={setCustomerName}
//           />

//           <Text style={styles.label}>Address</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             placeholder="Enter full address..."
//             placeholderTextColor="#9ca3af"
//             multiline
//             numberOfLines={3}
//             value={customerAddress}
//             onChangeText={setCustomerAddress}
//           />

//           <View style={styles.divider} />
//           <Text style={styles.sectionTitle}>Product Details</Text>

//           <View style={styles.row}>
//             <View style={{ flex: 2, marginRight: 12 }}>
//               <Text style={styles.label}>Select Model</Text>
//               <TouchableOpacity
//                 style={styles.dropdownBtn}
//                 onPress={() => setDropdownVisible(true)}
//               >
//                 <Text style={styles.dropdownText}>{selectedModel.id}</Text>
//                 <Ionicons name="chevron-down" size={18} color="#64748b" />
//               </TouchableOpacity>
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.label}>Size</Text>
//               <View style={styles.readOnlyInput}>
//                 <Text style={styles.readOnlyText}>{selectedModel.size}</Text>
//               </View>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={styles.halfWidth}>
//               <Text style={styles.label}>Quantity</Text>
//               <TextInput
//                 style={styles.input}
//                 keyboardType="number-pad"
//                 value={qty}
//                 onChangeText={setQty}
//               />
//             </View>
//             <View style={styles.halfWidth}>
//               <Text style={styles.label}>Unit Price (₹)</Text>
//               <TextInput
//                 style={styles.input}
//                 keyboardType="number-pad"
//                 value={unitPrice}
//                 onChangeText={setUnitPrice}
//               />
//             </View>
//           </View>

//           <TouchableOpacity
//             style={styles.checkboxRow}
//             activeOpacity={0.7}
//             onPress={() => setIncludeStand(!includeStand)}
//           >
//             <Ionicons
//               name={includeStand ? "checkbox" : "square-outline"}
//               size={24}
//               color={includeStand ? "#0056b3" : "#64748b"}
//             />
//             <Text style={styles.checkboxLabel}>
//               Include Floor Stand (₹8,000)
//             </Text>
//           </TouchableOpacity>

//           <View style={styles.calcBox}>
//             <View style={styles.calcRow}>
//               <Text style={styles.calcLabel}>Panel Base Total:</Text>
//               <Text style={styles.calcValue}>
//                 {formatCurrency(panelBaseTotal)}
//               </Text>
//             </View>

//             {includeStand && (
//               <View style={styles.calcRow}>
//                 <Text style={styles.calcLabel}>Floor Stand (Base):</Text>
//                 <Text style={styles.calcValue}>
//                   + {formatCurrency(standBaseTotal)}
//                 </Text>
//               </View>
//             )}

//             <View style={styles.calcRow}>
//               <Text style={styles.calcLabel}>Total GST (18%):</Text>
//               <Text style={styles.calcValue}>+ {formatCurrency(grandGst)}</Text>
//             </View>
//             <View style={[styles.calcRow, styles.finalCalcRow]}>
//               <Text style={styles.finalTotalLabel}>Grand Total:</Text>
//               <Text style={styles.finalTotalValue}>
//                 {formatCurrency(grandTotal)}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <TouchableOpacity
//           style={styles.generateButton}
//           onPress={generatePDF}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <>
//               <Ionicons
//                 name="document-text"
//                 size={20}
//                 color="#fff"
//                 style={{ marginRight: 8 }}
//               />
//               <Text style={styles.generateBtnText}>Generate & Share PDF</Text>
//             </>
//           )}
//         </TouchableOpacity>

//         <View style={{ height: 80 }} />
//       </ScrollView>

//       <Modal
//         visible={isDropdownVisible}
//         transparent={true}
//         animationType="fade"
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setDropdownVisible(false)}
//         >
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select BenQ Model</Text>
//             <FlatList
//               data={BENQ_MODELS}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.modalItem}
//                   onPress={() => handleSelectModel(item)}
//                 >
//                   <Text style={styles.modalItemTitle}>
//                     {item.id} ({item.size})
//                   </Text>
//                   <Text style={styles.modalItemSub}>
//                     {item.series} Series • {formatCurrency(item.price)}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f4f4f5" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 20,
//     paddingTop: 50,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e4e4e7",
//   },
//   backButton: { marginRight: 15 },
//   headerTitle: { fontSize: 20, fontWeight: "bold", color: "#18181b" },
//   formCard: {
//     backgroundColor: "#fff",
//     margin: 16,
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#0056b3",
//     marginBottom: 15,
//   },
//   divider: { height: 1, backgroundColor: "#e4e4e7", marginVertical: 20 },
//   label: { fontSize: 13, fontWeight: "600", color: "#52525b", marginBottom: 6 },
//   input: {
//     backgroundColor: "#f8fafc",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 15,
//     color: "#0f172a",
//     marginBottom: 16,
//   },
//   readOnlyInput: {
//     backgroundColor: "#f1f5f9",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   readOnlyText: {
//     fontSize: 15,
//     color: "#64748b",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   textArea: { height: 80, textAlignVertical: "top" },
//   row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
//   halfWidth: { flex: 1 },
//   checkboxRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//     marginTop: 4,
//   },
//   checkboxLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#334155",
//     marginLeft: 8,
//   },
//   calcBox: {
//     backgroundColor: "#f0fdf4",
//     padding: 16,
//     borderRadius: 8,
//     marginTop: 4,
//     borderWidth: 1,
//     borderColor: "#bbf7d0",
//   },
//   calcRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 6,
//   },
//   calcLabel: { color: "#166534", fontSize: 13 },
//   calcValue: { color: "#166534", fontSize: 13, fontWeight: "500" },
//   finalCalcRow: {
//     marginTop: 8,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: "#bbf7d0",
//   },
//   finalTotalLabel: { color: "#14532d", fontSize: 15, fontWeight: "bold" },
//   finalTotalValue: { color: "#14532d", fontSize: 16, fontWeight: "bold" },
//   generateButton: {
//     backgroundColor: "#0056b3",
//     marginHorizontal: 16,
//     padding: 16,
//     borderRadius: 12,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#0056b3",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   generateBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//   dropdownBtn: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#0056b3",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   dropdownText: { fontSize: 15, fontWeight: "bold", color: "#0056b3" },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 20,
//     maxHeight: "80%",
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1e293b",
//     marginBottom: 15,
//     textAlign: "center",
//   },
//   modalItem: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f1f5f9",
//   },
//   modalItemTitle: { fontSize: 16, fontWeight: "bold", color: "#0f172a" },
//   modalItemSub: { fontSize: 13, color: "#64748b", marginTop: 2 },
// });

import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ALL OUR NEW BENQ MODELS & PRICING
const BENQ_MODELS = [
  { id: "RP6504", series: "RP", size: '65"', price: 125440 },
  { id: "RP7504", series: "RP", size: '75"', price: 161280 },
  { id: "RP8604", series: "RP", size: '86"', price: 229600 },
  { id: "RE6504", series: "RE", size: '65"', price: 87630 },
  { id: "RE7504", series: "RE", size: '75"', price: 109760 },
  { id: "RE8604", series: "RE", size: '86"', price: 161280 },
];

export default function CreateQuotation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // 🟢 IMAGE STATES
  const [logoSrc, setLogoSrc] = useState(
    "https://via.placeholder.com/120x120.png?text=Logo+Missing",
  );
  const [stampSrc, setStampSrc] = useState("");

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedModel, setSelectedModel] = useState(BENQ_MODELS[1]);
  const [qty, setQty] = useState("1");
  const [unitPrice, setUnitPrice] = useState(String(BENQ_MODELS[1].price));
  const [includeStand, setIncludeStand] = useState(false);

  // Pre-load BOTH images at the same time
  useEffect(() => {
    const loadImages = async () => {
      try {
        const logoAsset = Asset.fromModule(require("@/assets/images/icon.png"));
        await logoAsset.downloadAsync();
        if (logoAsset.localUri) {
          const base64Logo = await FileSystem.readAsStringAsync(
            logoAsset.localUri,
            { encoding: "base64" },
          );
          setLogoSrc(`data:image/jpeg;base64,${base64Logo}`);
        }

        const stampAsset = Asset.fromModule(
          require("@/assets/images/round-stamp.png"),
        );
        await stampAsset.downloadAsync();
        if (stampAsset.localUri) {
          const base64Stamp = await FileSystem.readAsStringAsync(
            stampAsset.localUri,
            { encoding: "base64" },
          );
          setStampSrc(`data:image/png;base64,${base64Stamp}`);
        }
      } catch (error) {
        console.log("Failed to preload images", error);
      }
    };
    loadImages();
  }, []);

  // --- CALCULATIONS ---
  const parsedQty = parseInt(qty) || 0;
  const parsedPrice = parseInt(unitPrice) || 0;

  const panelBaseTotal = parsedQty * parsedPrice;
  const panelGst = panelBaseTotal * 0.18;
  const panelFinalTotal = panelBaseTotal + panelGst;

  const standBaseTotal = includeStand ? 8000 : 0;
  const standGst = standBaseTotal * 0.18;
  const standFinalTotal = standBaseTotal + standGst;

  const grandBase = panelBaseTotal + standBaseTotal;
  const grandGst = panelGst + standGst;
  const grandTotal = panelFinalTotal + standFinalTotal;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSelectModel = (model: any) => {
    setSelectedModel(model);
    setUnitPrice(String(model.price));
    setDropdownVisible(false);
  };

  const generatePDF = async () => {
    if (!customerName || !customerAddress) {
      Alert.alert(
        "Missing Info",
        "Please fill in the Customer Name and Address.",
      );
      return;
    }

    setLoading(true);

    try {
      // 🟢 GET CURRENT DATE FOR PDF DISPLAY AND FILENAME
      const dateObj = new Date();
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();

      const displayDate = `${day}/${month}/${year}`; // e.g. 05/05/2026
      const safeFileDate = `${day}-${month}-${year}`; // Slashes crash file systems, so we use dashes

      const floorStandHtml = includeStand
        ? `
        <tr>
          <td>2</td>
          <td class="item-desc">Floor Stand (55-86")</td>
          <td>PL-E800</td>
          <td>-</td>
          <td>1</td>
          <td>₹8,000</td>
          <td>₹1,440</td>
          <td>₹9,440</td>
        </tr>
      `
        : "";

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #000; }
            .header-container { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
            .logo-section { width: 25%; text-align: left; }
            .details-section { width: 75%; text-align: center; }
            .company-name { font-family: 'Times New Roman', Times, serif; font-size: 26px; font-weight: bold; color: #1e3a8a; margin: 0; letter-spacing: 0.5px; }
            .tagline { font-size: 13px; color: #333; margin: 4px 0; font-family: Arial, sans-serif; }
            .iso-badge { background-color: #1e3a8a; color: #fff; display: inline-block; padding: 4px 16px; font-size: 12px; font-weight: bold; margin: 4px 0; }
            .address-text { font-size: 10px; color: #333; margin-top: 4px; line-height: 1.4; }
            .divider-line { border-top: 2px solid #555; margin-top: 10px; padding-top: 5px; text-align: right; font-size: 11px; font-weight: bold; }
            .date-row { text-align: right; font-size: 12px; font-weight: bold; margin-top: 20px; margin-bottom: 20px; }
            .to-section { font-size: 13px; line-height: 1.5; margin-bottom: 25px; }
            .subject { font-weight: bold; font-size: 13px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px;}
            th, td { border: 1px solid #000; padding: 8px; text-align: center; }
            th { font-weight: bold; }
            .item-desc { text-align: left; font-weight: bold; }
            .terms { font-size: 11px; line-height: 1.6; margin-bottom: 40px; }
            .terms-title { font-weight: bold; font-size: 12px; text-decoration: underline; margin-bottom: 5px;}
            
            .footer { position: fixed; bottom: 30px; left: 40px; right: 40px; font-size: 10px; text-align: center; color: #555; }
          </style>
        </head>
        <body>
          
          <div class="header-container">
            <div class="logo-section">
              <img src="${logoSrc}" style="width: 100px; height: auto;" />
            </div>
            <div class="details-section">
              <h1 class="company-name">GUJARAT INFOTECH LIMITED</h1>
              <p class="tagline">Information Technology For Better Services to Citizens</p>
              <div class="iso-badge">ISO 9001 : 2015 and 27001 : 2013</div>
              <div class="address-text">
                JAMSAB, A-2, 2nd Floor, Jay Tower, Ankur Complex, Naranpura, Ahmedabad 380013. (Gujarat)<br>
                Ph: 079-27452276, 27457650 • E-mail: tender@gujaratinfotech.com<br>
                www.gujaratinfotech.com, www.jamsab.com, www.gram-seva.org
              </div>
            </div>
          </div>

          <div class="divider-line">CIN No. : U72200GJ1995PLC025454</div>
          <div class="date-row">Date: ${displayDate}</div>

          <div class="to-section">
            <strong>To,</strong><br>
            <strong>${customerName}</strong><br>
            ${customerAddress.replace(/\n/g, "<br>")}
          </div>

          <div class="subject">Subject: Quotation for BenQ Interactive Whiteboards</div>

          <table>
            <thead>
              <tr>
                <th>Sr No</th>
                <th class="item-desc">Description</th>
                <th>Model</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>GST (18%)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td class="item-desc">BenQ Interactive Panel - ${selectedModel.series} Series</td>
                <td>${selectedModel.id}</td>
                <td>${selectedModel.size}</td>
                <td>${parsedQty}</td>
                <td>${formatCurrency(parsedPrice)}</td>
                <td>${formatCurrency(panelGst)}</td>
                <td><strong>${formatCurrency(panelFinalTotal)}</strong></td>
              </tr>
              ${floorStandHtml}
            </tbody>
          </table>

          <div class="terms">
            <div class="terms-title">Terms and Conditions:</div>
            • Price is inclusive of all taxes<br>
            • Payment is Advance 100%.<br>
            • Supply and Installation will be completed within 5 days of receiving confirmation.<br>
            • Validity of the commercials - 6 Working days<br>
            • Installation will be Complementary if it is concrete wall
          </div>

          <!-- 🟢 UPDATED: Sign-off block -->
          <div style="font-size: 12px; line-height: 1.4;">
            Thanking You,<br>
            For, Gujarat Infotech Limited<br>
          </div>

          <!-- 🟢 UPDATED: Flexbox to put the name and stamp side-by-side -->
          <div style="display: flex; align-items: center; margin-top: 40px; gap: 30px;">
            <div style="font-size: 12px; line-height: 1.4; width: 220px;">
              <strong>Bhargav Suthar</strong><br>
              IT Manager<br>
              M no: 9712995002<br>
              Place: Ahmedabad
            </div>
            
            ${stampSrc ? `<div><img src="${stampSrc}" style="width: 110px; height: auto; opacity: 0.9;" /></div>` : ""}
          </div>

          <div class="footer">
            Corporate Office: 304-307, 3rd Floor, FORTUNE BUSINESS HUB,<br>
            Nr. Shell Petrol Pump, Science City Road, Sola, Ahmedabad 380060
          </div>

        </body>
        </html>
      `;

      // 1. Generate the random file
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // 2. 🟢 Copy and Rename the file to BenQ Po DD-MM-YYYY.pdf
      const newFileName = `BenQ Po ${safeFileDate}.pdf`;
      const newFileUri = `${FileSystem.cacheDirectory}${newFileName}`;

      await FileSystem.copyAsync({
        from: uri,
        to: newFileUri,
      });

      // 3. Share the newly named file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newFileUri, {
          mimeType: "application/pdf",
          dialogTitle: "Share Quotation",
        });
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      Alert.alert("Error", "Could not generate the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f4f4f5" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Quotation</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Customer Details</Text>

          <Text style={styles.label}>Customer Name (To)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Akshat Ligga Academy"
            placeholderTextColor="#9ca3af"
            value={customerName}
            onChangeText={setCustomerName}
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter full address..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
            value={customerAddress}
            onChangeText={setCustomerAddress}
          />

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Product Details</Text>

          <View style={styles.row}>
            <View style={{ flex: 2, marginRight: 12 }}>
              <Text style={styles.label}>Select Model</Text>
              <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() => setDropdownVisible(true)}
              >
                <Text style={styles.dropdownText}>{selectedModel.id}</Text>
                <Ionicons name="chevron-down" size={18} color="#64748b" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Size</Text>
              <View style={styles.readOnlyInput}>
                <Text style={styles.readOnlyText}>{selectedModel.size}</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={qty}
                onChangeText={setQty}
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Unit Price (₹)</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={unitPrice}
                onChangeText={setUnitPrice}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.checkboxRow}
            activeOpacity={0.7}
            onPress={() => setIncludeStand(!includeStand)}
          >
            <Ionicons
              name={includeStand ? "checkbox" : "square-outline"}
              size={24}
              color={includeStand ? "#0056b3" : "#64748b"}
            />
            <Text style={styles.checkboxLabel}>
              Include Floor Stand (₹8,000)
            </Text>
          </TouchableOpacity>

          <View style={styles.calcBox}>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Panel Base Total:</Text>
              <Text style={styles.calcValue}>
                {formatCurrency(panelBaseTotal)}
              </Text>
            </View>

            {includeStand && (
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Floor Stand (Base):</Text>
                <Text style={styles.calcValue}>
                  + {formatCurrency(standBaseTotal)}
                </Text>
              </View>
            )}

            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Total GST (18%):</Text>
              <Text style={styles.calcValue}>+ {formatCurrency(grandGst)}</Text>
            </View>
            <View style={[styles.calcRow, styles.finalCalcRow]}>
              <Text style={styles.finalTotalLabel}>Grand Total:</Text>
              <Text style={styles.finalTotalValue}>
                {formatCurrency(grandTotal)}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.generateButton}
          onPress={generatePDF}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons
                name="document-text"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.generateBtnText}>Generate & Share PDF</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>

      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select BenQ Model</Text>
            <FlatList
              data={BENQ_MODELS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectModel(item)}
                >
                  <Text style={styles.modalItemTitle}>
                    {item.id} ({item.size})
                  </Text>
                  <Text style={styles.modalItemSub}>
                    {item.series} Series • {formatCurrency(item.price)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
  },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#18181b" },
  formCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0056b3",
    marginBottom: 15,
  },
  divider: { height: 1, backgroundColor: "#e4e4e7", marginVertical: 20 },
  label: { fontSize: 13, fontWeight: "600", color: "#52525b", marginBottom: 6 },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#0f172a",
    marginBottom: 16,
  },
  readOnlyInput: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  readOnlyText: {
    fontSize: 15,
    color: "#64748b",
    fontWeight: "bold",
    textAlign: "center",
  },
  textArea: { height: 80, textAlignVertical: "top" },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  halfWidth: { flex: 1 },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 4,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginLeft: 8,
  },
  calcBox: {
    backgroundColor: "#f0fdf4",
    padding: 16,
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  calcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  calcLabel: { color: "#166534", fontSize: 13 },
  calcValue: { color: "#166534", fontSize: 13, fontWeight: "500" },
  finalCalcRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#bbf7d0",
  },
  finalTotalLabel: { color: "#14532d", fontSize: 15, fontWeight: "bold" },
  finalTotalValue: { color: "#14532d", fontSize: 16, fontWeight: "bold" },
  generateButton: {
    backgroundColor: "#0056b3",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0056b3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  dropdownBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0056b3",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dropdownText: { fontSize: 15, fontWeight: "bold", color: "#0056b3" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 15,
    textAlign: "center",
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalItemTitle: { fontSize: 16, fontWeight: "bold", color: "#0f172a" },
  modalItemSub: { fontSize: 13, color: "#64748b", marginTop: 2 },
});
