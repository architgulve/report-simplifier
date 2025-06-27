// Modified: MedicationReminders with properly timed local notifications
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getAllNotifications, deleteNoti } from "../../../utility/database";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

const scheduleNotification = async (title, body, hour, minute) => {
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hour);
  scheduledTime.setMinutes(minute);
  scheduledTime.setSeconds(0);

  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1); // next day
  }

  const trigger = scheduledTime.getTime() - now.getTime();
  console.log(trigger);
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.floor(trigger / 1000),
    },
  });
};

const parseTime = (timeStr) => {
  const [hour, minute] = timeStr.trim().split(":").map(Number);
  return { hour, minute };
};

export default function MedicationReminders() {
  const [loading, setLoading] = useState(true);
  const [notis, setNotis] = useState([]);

  const [morningTime, setMorningTime] = useState("09:00");
  const [afternoonTime, setAfternoonTime] = useState("13:00");
  const [nightTime, setNightTime] = useState("20:00");

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  const fetchMealTimes = async () => {
    const tempMorning = await AsyncStorage.getItem("morningTime");
    const tempAfternoon = await AsyncStorage.getItem("afternoonTime");
    const tempNight = await AsyncStorage.getItem("nightTime");
    setMorningTime(tempMorning || "09:00");
    setAfternoonTime(tempAfternoon || "13:00");
    setNightTime(tempNight || "20:00");
  };

  const fetchMeds = async () => {
    try {
      setLoading(true);
      // await Notifications.cancelAllScheduledNotificationsAsync();

      const noti = await getAllNotifications();
      setNotis(noti);

      const granted = await requestNotificationPermission();
      if (!granted) return;

      for (const n of noti) {
        let time = "";
        if (n.NotificationTime === "morning") time = morningTime;
        else if (n.NotificationTime === "afternoon") time = afternoonTime;
        else time = nightTime;
       
        const { hour, minute } = parseTime(time);
        const title = `Time to take ${n.NotificationName}`;
        const body = `Reminder to take your medicine.`;
        console.log("⏰ Scheduling notification:", title, "at", hour, minute);
        await scheduleNotification(title, body, hour, minute);
      }
    } catch (error) {
      console.error("❌ Error fetching medications:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMeds();
    fetchMealTimes();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMeds();
      fetchMealTimes();
    }, [])
  );


  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Loading medications...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ backgroundColor: "#DFF6FB", flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.mainTitle}>Medication Reminders</Text>
          <Text style={styles.subtitle}>
            Stay on track with your medication schedule
          </Text>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryNumber, { color: "#007AFF" }]}>
                {notis.length}
              </Text>
              <Text>Total</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/(medireminders)/addmedications")}
          >
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={styles.addButtonText}>Add New Medication</Text>
          </TouchableOpacity>

          <Text
            style={{ fontSize: 20, fontWeight: "bold", marginVertical: 20 }}
          >
            Medication Reminders
          </Text>

          {notis.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="medical" size={64} color="#ccc" />
              <Text style={styles.emptyStateText}>
                No medications added yet
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Tap the button below to add your first medication
              </Text>
            </View>
          ) : (
            notis.map((noti) => {
              const isUpcoming = (() => {
                if (noti.NotificationTime === "morning")
                  return morningTime > currentTime;
                if (noti.NotificationTime === "afternoon")
                  return afternoonTime > currentTime;
                return nightTime > currentTime;
              })();

              const displayTime =
                noti.NotificationTime === "morning"
                  ? morningTime
                  : noti.NotificationTime === "afternoon"
                    ? afternoonTime
                    : nightTime;

              return (
                <View
                  key={noti.NotificationID}
                  style={{
                    padding: 20,
                    backgroundColor: "white",
                    marginBottom: 10,
                    borderRadius: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ width: "90%" }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                      {noti.NotificationName}
                    </Text>
                    <Text style={{ marginTop: 10 }}>Time: {displayTime}</Text>
                    <View
                      style={{
                        padding: 10,
                        backgroundColor: isUpcoming ? "#FFB6C1" : "grey",
                        borderRadius: 10,
                        marginTop: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
                      <Text
                        style={{
                          color: isUpcoming ? "darkred" : "white",
                          fontWeight: "bold",
                        }}
                      >
                        {isUpcoming ? "Upcoming" : "Done"}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{ padding: 10, borderRadius: 99 }}
                    onPress={() => {
                      deleteNoti(noti.NotificationID);
                      fetchMeds();
                    }}
                  >
                    <Ionicons name="trash-outline" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            scheduleNotification(
              "Test",
              "This is a test",
              new Date().getHours(),
              new Date().getMinutes() + 1
            )
          }
        >
          <Text style={styles.addButtonText}>Send Test Notification</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// (StyleSheet remains unchanged) [RETAIN YOUR EXISTING STYLES BELOW THIS LINE] ↓

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFF6FB",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 16,
    textAlign: "center",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: "white",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  summaryNumber: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
  medCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  medHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timeSlotLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dosageText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#FFE5E5",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  largeActionButton: {
    padding: 14,
    borderRadius: 8,
    minWidth: 140,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  notificationContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 32,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  notificationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  notificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 4,
  },
  notificationLabel: {
    fontSize: 16,
    color: "#333",
  },
});
