import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const TabLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{ headerShown: false, title: "Home" }}
      />
      <Tabs.Screen
        name="remind"
        options={{ headerShown: false, title: "Reminders" }}
      />
      <Tabs.Screen
        name="diet"
        options={{ headerShown: false, title: "Diet Plan" }}
      />
      <Tabs.Screen
        name="progress"
        options={{ headerShown: false, title: "Progress" }}
      />
    </Tabs>
  );
};

export default TabLayout;
