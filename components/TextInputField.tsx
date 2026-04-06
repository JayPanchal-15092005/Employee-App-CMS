import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type Props = { label?: string } & TextInputProps;

export default function TextInputField({ label, style, ...props }: Props) {
  // 🟢 NEW: Track if the user is currently typing in this box
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[
          styles.input,
          props.multiline && styles.multilineInput,
          isFocused && styles.inputFocused, // 🟢 Apply blue border if focused
          style, // Allows custom styles (like height) from your forms
        ]}
        placeholderTextColor="#94a3b8"
        // 🟢 Intercept the focus/blur events to change the colors
        onFocus={(e) => {
          setIsFocused(true);
          if (props.onFocus) props.onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          if (props.onBlur) props.onBlur(e);
        }}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16, // Better spacing between inputs
    width: "100%",
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 15,
    color: "#1e293b", // Slate-800
  },
  input: {
    borderWidth: 1.5, // Slightly thicker border for a modern look
    borderColor: "#e2e8f0", // Light gray when inactive
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#f8fafc", // Very subtle gray background when inactive
    fontSize: 16,
    color: "#0f172a", // Slate-900 text
  },
  inputFocused: {
    borderColor: "#3b82f6", // 🟢 Beautiful Blue border when active
    backgroundColor: "#ffffff", // 🟢 Pure white background when active
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2, // Slight pop-out effect on Android
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top", // Ensures text starts at the top left
  },
});
