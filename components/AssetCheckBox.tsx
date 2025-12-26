import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function AssetCheckbox({ label, value, onChange }: { label: string; value: boolean; onChange: () => void; }) {
  return (
    <Pressable onPress={onChange} style={styles.row}>
      <View style={[styles.box, value && styles.boxChecked]}>
        {value ? <Text style={styles.tick}>✓</Text> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  box: {
    width: 26,
    height: 26,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  boxChecked: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  tick: { color: "#fff", fontWeight: "700" },
  label: { fontSize: 16, color: "#111827" },
});
