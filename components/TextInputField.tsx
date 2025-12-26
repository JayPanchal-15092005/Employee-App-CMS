import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type Props = { label?: string } & TextInputProps;

export default function TextInputField({
  label,
  ...props
}: Props) {
  return (
    <View style={styles.container}>
      {label ? (
        <Text style={styles.label}>
          {label}
        </Text>
      ) : null}
      <TextInput
        // 🟢 Explicitly setting the text color to dark gray/black
        style={[
          styles.input, 
          props.multiline && styles.multilineInput,
          props.style // Allows you to pass extra styles from form.tsx
        ]}
        // 🟢 Explicitly setting the placeholder color
        placeholderTextColor="#94a3b8" 
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 15,
    color: "#1e293b", // Slate-800
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0", // Gray-200/300
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#ffffff",
    fontSize: 16,
    // 🟢 CRITICAL: This ensures text is visible on white background
    color: "#0f172a", // Slate-900 (Dark)
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top', // Ensures text starts at the top on Android
  },
});