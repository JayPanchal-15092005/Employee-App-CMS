import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function VerifyScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [code, setCode] = useState("")

  const onVerify = async () => {
    if (!isLoaded) return;

    try {
      // 🟢 Logic to handle both First Factor (signup) and Second Factor (MFA)
      const result = await (signIn.status === "needs_second_factor" 
        ? signIn.attemptSecondFactor({ strategy: "email_code", code })
        : signIn.attemptFirstFactor({ strategy: "email_code", code }));

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(tabs)/form");
      }
    } catch (err: any) {
      Alert.alert("Verification failed", err.errors?.[0]?.message || "Invalid code");
    }
  };
  return (
    <View style={{ padding: 20 }}>
      <Text>Enter verification code</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
      />
      <TouchableOpacity onPress={onVerify}>
        <Text>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}
