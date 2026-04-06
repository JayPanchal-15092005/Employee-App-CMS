import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function StationeryLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e2e8f0",
          elevation: 8,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontWeight: "600",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="form"
        options={{
          title: "Submit Form",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "My History",
          tabBarIcon: ({ color }) => (
            <Ionicons name="reader-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
