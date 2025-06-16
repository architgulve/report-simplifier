import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const TabLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Tabs screenOptions={{ headerShown: false }}>
          <Tabs.Screen
            name="index_hm"
            options={{
              title: "Home",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" size={size} color={color} />
              ),
            }}
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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default TabLayout;
