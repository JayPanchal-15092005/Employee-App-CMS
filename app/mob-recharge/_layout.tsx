import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function MobRechargeLayout() {
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
        tabBarLabelStyle: { fontWeight: "600", fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="form"
        options={{
          title: "Recharge Form",
          tabBarIcon: ({ color }) => (
            <Ionicons name="phone-portrait-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "My History",
          tabBarIcon: ({ color }) => (
            <Ionicons name="time-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
