import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
};

export default function PrimaryButton({
  children,
  onPress,
  disabled,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled ? styles.buttonDisabled : styles.buttonEnabled,
      ]}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 24, // equivalent to mt-6 (6 * 4)
    paddingVertical: 12, // equivalent to py-3 (3 * 4)
    borderRadius: 6, // equivalent to rounded-md
    alignItems: "center",
    justifyContent: "center",
  },
  buttonEnabled: {
    backgroundColor: "#2563eb", // equivalent to bg-blue-600
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af", // equivalent to bg-gray-400
  },
  text: {
    color: "#ffffff", // equivalent to text-white
    fontWeight: "600", // equivalent to font-semibold
    fontSize: 16,
  },
});