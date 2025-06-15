import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const TabLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{ headerShown: false, title: "Home" }}
      />
      <Tabs.Screen
        name="remind"
        options={{
          title: "Reminders",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alarm" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: "Diet Plan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
