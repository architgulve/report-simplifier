import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getAllMedicines,
  createMedicineTable,
  getAllNotifications,
} from "../utility/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function HomeReminderPreview() {
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
    setMorningTime(tempMorning);
    setAfternoonTime(tempAfternoon);
    setNightTime(tempNight);
  };

  const timemap = {
    morning: morningTime,
    afternoon: afternoonTime,
    night: nightTime,
    evening: nightTime,
  };

  const fetchData = async () => {
    try {
      const noti = await getAllNotifications();
      setNotis(noti);
      console.log("✅ Fetched meds:", noti);
    } catch (err) {
      console.error("❌ Error fetching meds for homepage", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMealTimes();
  }, []);

  return (
    <View
      style={{
        margin: 15,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="alarm-outline" size={30} color="black" />
          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
            Medication Reminders
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            fetchData();
            fetchMealTimes();
          }}
        >
          <Ionicons name="refresh-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <View>
        {notis.map((noti) => (
          <View key={noti.NotificationID}>
            {timemap[noti.NotificationTime] >= currentTime && (
              <View
                style={{
                  backgroundColor: "#F0F0F0",
                  width: "100%",
                  height: 70,
                  marginTop: 10,
                  borderRadius: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "55%", justifyContent: "center" }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {noti.NotificationName}
                  </Text>
                  <Text>{timemap[noti.NotificationTime]}</Text>
                </View>
                <View
                  style={{
                    width: "30%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: noti.taken ? "#C0F0C0" : "#FFB6C1",
                    borderRadius: 10,
                    padding: 5,
                  }}
                >
                  <Text
                    style={{
                      color: noti.taken ? "green" : "darkred",
                      fontWeight: "bold",
                    }}
                  >
                    {noti.taken ? "Taken" : "Upcoming"}
                  </Text>
                </View>
              </View>
            )}
          </View>
        ))}

        {/* View All Button */}
        <TouchableOpacity
          onPress={() => router.push("/(medireminders)/remind")}
        >
          <View
            style={{
              backgroundColor: "#007AFF",
              width: "50%",
              height: 50,
              marginTop: 10,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              alignSelf: "center",
            }}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color="white"
              style={{ marginRight: 5 }}
            />
            <Text style={{ color: "white", fontWeight: "bold" }}>View All Reminders</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
