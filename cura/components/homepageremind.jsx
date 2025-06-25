import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAllMedicines, createMedicineTable } from "../utility/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function HomeReminderPreview() {
  const [previewMeds, setPreviewMeds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await createMedicineTable();
        const meds = await getAllMedicines();
        console.log("✅ Fetched meds:", meds);

        const takenMapStr = await AsyncStorage.getItem("takenStatus");
        const takenMap = takenMapStr ? JSON.parse(takenMapStr) : {};
        console.log("🧠 Taken Map:", takenMap);

        const formatted = [];

        meds.forEach((med) => {
          const times = med.TimeToBeTakenAt?.split(",") || [];
          const dosage = med.QuantityTablet || med.QuantityLiquid || 0;

          times.forEach((time, index) => {
            const timeLabel =
              index === 0 ? "Morning" : index === 1 ? "Afternoon" : "Night";
            const medId = `${med.MedicineID}-${index}`;

            if (time && time.trim()) {
              formatted.push({
                id: medId,
                name: med.MedicineName,
                time: time.trim(),
                timeSlot: timeLabel,
                taken: takenMap[medId] ?? false,
              });
            }
          });
        });

        formatted.sort((a, b) => a.time.localeCompare(b.time));
        console.log("📋 Formatted meds:", formatted.slice(0, 2));

        setPreviewMeds(formatted.slice(0, 2)); // only top 2
      } catch (err) {
        console.error("❌ Error fetching meds for homepage", err);
      }
    };

    fetchData();
  }, []);

  return (
    <View
      style={{
        width: "100%",
        margin: 15,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="alarm-outline" size={30} color="black" />
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
          Medication Reminders
        </Text>
      </View>

      <View>
        {previewMeds.map((med, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "#F0F0F0",
              width: "100%",
              height: 70,
              marginTop: 10,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 10,
            }}
          >
            <View
              style={{
                width: "55%",
                height: 50,
                justifyContent: "center",
              }}
            >
              <Text>{med.name}</Text>
              <Text>{med.time}</Text>
            </View>
            <View
              style={{
                width: "45%",
                height: 45,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: med.taken ? "#C0F0C0" : "#FFB6C1",
                borderRadius: 10,
                padding: 5,
              }}
            >
              <Text
                style={{
                  color: med.taken ? "green" : "darkred",
                  fontWeight: "bold",
                }}
              >
                {med.taken ? "Taken" : "Due Now"}
              </Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={() => router.push("/(medireminders)/remind")}
        >
          <View
            style={{
              backgroundColor: "#F0F0F0",
              width: "50%",
              height: 50,
              marginTop: 10,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 10,
            }}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color="black"
              style={{ marginRight: 5 }}
            />
            <Text>View All Reminders</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
