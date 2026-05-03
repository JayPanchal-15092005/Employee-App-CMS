import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CreateQuotation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [modelNo, setModelNo] = useState("RP7504");
  const [size, setSize] = useState('75"');
  const [qty, setQty] = useState("1");
  const [unitPrice, setUnitPrice] = useState("159000");

  // Calculations
  const parsedQty = parseInt(qty) || 0;
  const parsedPrice = parseInt(unitPrice) || 0;

  const baseTotal = parsedQty * parsedPrice;
  const gstAmount = baseTotal * 0.18; // 18% GST
  const finalTotal = baseTotal + gstAmount;

  // Formatter for Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
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
      const today = new Date().toLocaleDateString("en-GB");

      // 🟢 Automatically load and convert the logo to Base64
      //   let logoSrc = '';
      //   try {
      //     const logoAsset = Asset.fromModule(require('@/assets/images/icon.png'));
      //     await logoAsset.downloadAsync();
      //     if (logoAsset.localUri) {
      //       const base64 = await FileSystem.readAsStringAsync(logoAsset.localUri, {
      //         encoding: FileSystem.EncodingType.Base64,
      //       });
      //       logoSrc = `data:image/jpeg;base64,${base64}`;
      //     }
      //   } catch (imgError) {
      //     console.log("Could not load local logo, check file path:", imgError);
      //     // Fallback to a blank image if the local file is missing so the app doesn't crash
      //     logoSrc = 'https://via.placeholder.com/120x120.png?text=Logo+Missing';
      //   }

      // 🟢 Automatically load and convert the logo to Base64
      let logoSrc = "";
      try {
        const logoAsset = Asset.fromModule(require("@/assets/images/icon.png"));
        await logoAsset.downloadAsync();

        if (logoAsset.localUri) {
          // 🟢 FIX: We use the direct string 'base64' here instead of the missing property!
          const base64 = await FileSystem.readAsStringAsync(
            logoAsset.localUri,
            {
              encoding: "base64",
            },
          );
          logoSrc = `data:image/jpeg;base64,${base64}`;
        }
      } catch (imgError) {
        console.log("Could not load local logo, check file path:", imgError);
        // Fallback to a blank image if the local file is missing so the app doesn't crash
        logoSrc = "https://via.placeholder.com/120x120.png?text=Logo+Missing";
      }

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
            .signature { font-size: 12px; line-height: 1.4; }
            .sign-name { font-weight: bold; margin-top: 40px; }
            .footer { position: fixed; bottom: 30px; left: 40px; right: 40px; font-size: 10px; text-align: center; color: #555; }
          </style>
        </head>
        <body>
          
          <div class="header-container">
            <div class="logo-section">
              <!-- 🟢 Here is where our dynamic Base64 Logo gets injected! -->
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

          <div class="divider-line">
            CIN No. : U72200GJ1995PLC025454
          </div>

          <div class="date-row">
            Date: ${today}
          </div>

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
                <td class="item-desc">BenQ Interactive Panel - RP Series</td>
                <td>${modelNo}</td>
                <td>${size}</td>
                <td>${parsedQty}</td>
                <td>${formatCurrency(parsedPrice)}</td>
                <td>${formatCurrency(gstAmount)}</td>
                <td><strong>${formatCurrency(finalTotal)}</strong></td>
              </tr>
              <tr>
                <td>2</td>
                <td class="item-desc">Floor Stand (55-86")</td>
                <td>PL-E800</td>
                <td>-</td>
                <td>1</td>
                <td>₹10,000</td>
                <td>₹1,800</td>
                <td>₹11,800</td>
              </tr>
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

          <div class="signature">
            Thanking You,<br>
            For, Gujarat Infotech Limited<br>
            <div class="sign-name">Bhargav Suthar</div>
            IT Manager<br>
            M no: 9712995002<br>
            Place: Ahmedabad
          </div>

          <div class="footer">
            Corporate Office: 304-307, 3rd Floor, FORTUNE BUSINESS HUB,<br>
            Nr. Shell Petrol Pump, Science City Road, Sola, Ahmedabad 380060
          </div>

        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Share BenQ Quotation",
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error("PDF Error:", error);
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
            value={customerName}
            onChangeText={setCustomerName}
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter full address..."
            multiline
            numberOfLines={3}
            value={customerAddress}
            onChangeText={setCustomerAddress}
          />

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Product Details</Text>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Model No.</Text>
              <TextInput
                style={styles.input}
                value={modelNo}
                onChangeText={setModelNo}
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Size</Text>
              <TextInput
                style={styles.input}
                value={size}
                onChangeText={setSize}
              />
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

          {/* Live Calculation Preview */}
          <View style={styles.calcBox}>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Base Total:</Text>
              <Text style={styles.calcValue}>{formatCurrency(baseTotal)}</Text>
            </View>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>GST (18%):</Text>
              <Text style={styles.calcValue}>
                + {formatCurrency(gstAmount)}
              </Text>
            </View>
            <View style={[styles.calcRow, styles.finalCalcRow]}>
              <Text style={styles.finalTotalLabel}>Grand Total:</Text>
              <Text style={styles.finalTotalValue}>
                {formatCurrency(finalTotal)}
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
  textArea: { height: 80, textAlignVertical: "top" },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  halfWidth: { flex: 1 },
  calcBox: {
    backgroundColor: "#f0fdf4",
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
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
});
