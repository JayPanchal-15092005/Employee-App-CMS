import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Button, Text, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  // Configure Google Sign-In (Run this once, e.g. in a useEffect)
  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "122080548968-2nhb4ajonr1mg8to9ro5frdus44sesjs.apps.googleusercontent.com",
    });
  }, []);

  async function onGoogleButtonPress() {
    try {
      // 1. Check for Play Services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // 2. Get the User's ID Token
      const signInResult = await GoogleSignin.signIn();
      let idToken = signInResult.data?.idToken;

      // 3. Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken!);

      // 4. Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);

      // 5. Navigate to your app
      router.replace("/(tabs)/form");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Login Failed", error.message);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>CMS Portal</Text>
      <Button title="Continue with Google" onPress={onGoogleButtonPress} />
    </View>
  );
}
