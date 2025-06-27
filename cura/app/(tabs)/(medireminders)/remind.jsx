import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  getAllMedicines,
  createMedicineTable,
  deleteMedicine,
  getAllNotifications,
  deleteNoti,
} from "../../../utility/database";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MedicationReminders() {
  const [notifications, setNotifications] = useState({
    pushnotifications: false,
    voicereminders: false,
    snooze: false,
  });

  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notis, setNotis] = useState([]);

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  const [morningTime, setMorningTime] = useState("09:00");
  const [afternoonTime, setAfternoonTime] = useState("13:00");
  const [nightTime, setNightTime] = useState("20:00");

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
      await createMedicineTable();
      const meds = await getAllMedicines();
      const noti = await getAllNotifications();
      setNotis(noti);
      const formatted = [];

      // Get saved taken statuses from storage
      const storedTakenMapStr = await AsyncStorage.getItem("takenStatus");
      const takenMap = storedTakenMapStr ? JSON.parse(storedTakenMapStr) : {};

      meds.forEach((med) => {
        const times = med.TimeToBeTakenAt.split(",");
        const dosage = med.QuantityTablet || med.QuantityLiquid || 0;

        times.forEach((time, index) => {
          const timeLabel =
            index === 0 ? "Morning" : index === 1 ? "Afternoon" : "Night";
          const medId = `${med.MedicineID}-${index}`;
          if (time && time.trim()) {
            formatted.push({
              id: medId,
              originalId: med.MedicineID,
              name: med.MedicineName,
              dosage: `${dosage}mg`,
              time: time.trim(),
              timeSlot: timeLabel,
              taken: takenMap[medId] ?? false,
              startDate: med.StartDate,
              numberOfDays: med.NumberOfDays,
            });
          }
        });
      });

      formatted.sort((a, b) => a.time.localeCompare(b.time));
      setMedications(formatted);
    } catch (error) {
      console.error("❌ Error fetching medications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use useFocusEffect to refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchMeds();
      fetchMealTimes();
    }, [])
  );

  // Also fetch on component mount
  useEffect(() => {
    fetchMeds();
    fetchMealTimes();
  }, []);

  const handleToggle = async (id) => {
    const updatedMeds = medications.map((m) =>
      m.id === id ? { ...m, taken: !m.taken } : m
    );
    setMedications(updatedMeds);

    try {
      const takenMap = {};
      updatedMeds.forEach((m) => {
        takenMap[m.id] = m.taken;
      });
      await AsyncStorage.setItem("takenStatus", JSON.stringify(takenMap));
    } catch (e) {
      console.log("⚠️ Failed to save taken statuses", e);
    }
  };

  const handleDeleteMedicine = (originalId, medicineName) => {
    Alert.alert(
      "Delete Medication",
      `Are you sure you want to delete "${medicineName}"? This will remove all reminders for this medication.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await deleteMedicine(originalId);
              if (success) {
                console.log(
                  `✅ Successfully deleted medicine with ID: ${originalId}`
                );
                // Refresh the medications list
                await fetchMeds();
                Alert.alert("Success", "Medication deleted successfully!");
              } else {
                Alert.alert(
                  "Error",
                  "Failed to delete medication. Please try again."
                );
              }
            } catch (error) {
              console.error("❌ Error deleting medicine:", error);
              Alert.alert(
                "Error",
                "An error occurred while deleting the medication."
              );
            }
          },
        },
      ]
    );
  };

  const takenCount = notis.filter((m) => m.taken).length;
  const pendingCount = notis.length - takenCount;

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
      style={{
        backgroundColor: "#DFF6FB",
        flex: 1,
      }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.innerContainer}>
          {/* Title */}
          <Text style={styles.mainTitle}>Medication Reminders</Text>
          <Text style={styles.subtitle}>
            Stay on track with your medication schedule
          </Text>

          {/* Summary Cards */}
          <View style={styles.summaryContainer}>
            {/* <View style={styles.summaryCard}>
              <Text style={[styles.summaryNumber, { color: "green" }]}>
                {takenCount}
              </Text>
              <Text>Taken</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryNumber, { color: "red" }]}>
                {pendingCount}
              </Text>
              <Text>Pending</Text>
            </View> */}
            <View></View>
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

          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 20,
                marginTop: 20,
              }}
            >
              Medication Reminders
            </Text>
          </View>

          {/* Medication List */}
          {medications.length === 0 ? (
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
            notis.map((noti) => (
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
                <View
                  style={{
                    width: "90%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {noti.NotificationName}
                  </Text>
                  {/* <Text
                  style={{
                    marginTop: 10,
                  }}
                >
                  Time: {noti.NotificationTime}
                </Text> */}
                  {noti.NotificationTime === "morning" && (
                    <>
                      <View style={{ flexDirection: "row" }}>
                        <View
                          style={{
                            padding: 10,
                          }}
                        >
                          <Text style={{ marginTop: 10 }}>
                            Time: {morningTime}
                          </Text>
                        </View>

                        {morningTime > currentTime ? (
                          <View
                            style={{
                              padding: 10,
                              backgroundColor: "#FFB6C1",
                              borderRadius: 10,
                              marginTop: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              width: "50%",
                            }}
                          >
                            <Text
                              style={{ color: "darkred", fontWeight: "bold" }}
                            >
                              Upcoming
                            </Text>
                          </View>
                        ) : (
                          <>
                            <View
                              style={{
                                padding: 10,
                                backgroundColor: "grey",
                                borderRadius: 10,
                                marginTop: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                width: "50%",
                              }}
                            >
                              <Text style={{ color: "white" }}>Done</Text>
                            </View>
                          </>
                        )}
                      </View>
                    </>
                  )}
                  {noti.NotificationTime === "afternoon" && (
                    <>
                      <View style={{ flexDirection: "row" }}>
                        <View
                          style={{
                            padding: 10,
                          }}
                        >
                          <Text style={{ marginTop: 10 }}>
                            Time: {afternoonTime}
                          </Text>
                        </View>

                        {afternoonTime > currentTime ? (
                          <View
                            style={{
                              padding: 10,
                              backgroundColor: "#FFB6C1",
                              borderRadius: 10,
                              marginTop: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              width: "50%",
                            }}
                          >
                            <Text
                              style={{ color: "darkred", fontWeight: "bold" }}
                            >
                              Upcoming
                            </Text>
                          </View>
                        ) : (
                          <>
                            <View
                              style={{
                                padding: 10,
                                backgroundColor: "grey",
                                borderRadius: 10,
                                marginTop: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                width: "50%",
                              }}
                            >
                              <Text style={{ color: "white" }}>Done</Text>
                            </View>
                          </>
                        )}
                      </View>
                    </>
                  )}
                  {(noti.NotificationTime === "evening" ||
                    noti.NotificationTime === "night") && (
                    <>
                      <View style={{ flexDirection: "row" }}>
                        <View
                          style={{
                            padding: 10,
                          }}
                        >
                          <Text style={{ marginTop: 10 }}>
                            Time: {nightTime}
                          </Text>
                        </View>

                        {nightTime > currentTime ? (
                          <View
                            style={{
                              padding: 10,
                              backgroundColor: "#FFB6C1",
                              borderRadius: 10,
                              marginTop: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              width: "50%",
                            }}
                          >
                            <Text
                              style={{ color: "darkred", fontWeight: "bold" }}
                            >
                              Upcoming
                            </Text>
                          </View>
                        ) : (
                          <>
                            <View
                              style={{
                                padding: 10,
                                backgroundColor: "grey",
                                borderRadius: 10,
                                marginTop: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                width: "50%",
                              }}
                            >
                              <Text style={{ color: "white" }}>Done</Text>
                            </View>
                          </>
                        )}
                      </View>
                    </>
                  )}
                </View>
                <View>
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      borderRadius: 99,
                    }}
                    onPress={() => {
                      deleteNoti(noti.NotificationID);
                      fetchMeds();
                    }}
                  >
                    <Ionicons name="trash-outline" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {/* Add Medication Button */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
