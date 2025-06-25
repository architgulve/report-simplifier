import React from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, TouchableOpacity } from "react-native-gesture-handler";
import { useState,useEffect } from "react";
import { 
  initializeDatabase, 
  insertSetting, 
  getSettings,
  insertDiet,
  getLatestDiet 
} from '../../utility/database';

const ProgressItem = ({ label, value, max, unit }) => {
  const percentage = (value / max) * 100;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{`${value}/${max} ${unit}`}</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
};

const MealCard = ({ title, time, status: initialStatus, calories, items, isPending }) => {
  const [status, setStatus] = useState(initialStatus);

  return (
    <View
      style={{
        backgroundColor: status === "Completed" ? "#DBFFDD" : "#f0f0f0",
        borderRadius: 8,
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: "#ccc",
      }}
    >
      {/* Top Row: Title, Time, Status, Calories */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{title}</Text>
          <Text style={{ color: "#555", fontSize: 12 }}>{time}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <View
            style={{
              backgroundColor: "#ddd",
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 2,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>{status}</Text>
          </View>
          <Text style={{ fontSize: 14, marginTop: 4 }}>{calories} cal</Text>
        </View>
      </View>

      {/* Items */}
      <View style={{ marginTop: 10 }}>
        {items.map((item, index) => (
          <Text key={index} style={{ fontSize: 14 }}>
            - {item}
          </Text>
        ))}
      </View>

      {/* Button */}
      {isPending && status !== "Completed" && (
        <View style={{ marginTop: 10, alignItems: "center" }}>
          <Pressable
            style={{
              backgroundColor: "#fff",
              padding: 8,
              borderRadius: 8,
              width: "90%",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#ccc",
            }}
            onPress={() => {
              console.log(`${title} marked as taken`);
              setStatus("Completed"); // ✅ triggers re-render
            }}
          >
            <Text style={{ fontWeight: "bold" }}>✔ Mark As Taken</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const DietPlan = () => {

  useEffect(() => {
  initializeDatabase();
}, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#DFF6FB", flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Diet Plan</Text>
            <Text style={styles.subtitle}>
              Stay on Track with your Healthy Diet
            </Text>
          </View>

          {/* Goal Card */}
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Ionicons name="disc-outline" size={24} color="green" />
              <Text style={styles.goalTitle}> Today's Goals</Text>
            </View>

            <ProgressItem
              label="Calories"
              value={1650}
              max={2000}
              unit="kcal"
            />
            <ProgressItem label="Protein" value={85} max={120} unit="g" />
            <ProgressItem label="Water" value={6} max={8} unit="glasses" />
          </View>
          <View
            style={{
              flexDirection: "column",
              width: "95%",
              margin: 10,
              backgroundColor: "white",
              borderRadius: 10,
              paddingVertical: 10,
              alignSelf: "center",
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 10,
                marginBottom: 10,
              }}
            >
              <Ionicons name="restaurant-outline" size={24} color="black" />
              <Text
                style={{ fontSize: 18, marginLeft: 10, fontWeight: "bold" }}
              >
                Today's Meals
              </Text>
            </View>

            {/* Meals */}
            <MealCard
              title="Breakfast"
              time="10:00 AM"
              status="Completed"
              calories={350}
              items={["Oatmeal with berries", "Greek Yogurt", "Green Tea"]}
            />
            <MealCard
              title="Lunch"
              time="1:00 PM"
              status="Pending"
              calories={450}
              items={["Grilled Chicken Salad", "Quinoa", "Olive Oil Dressing"]}
              isPending
            />
            <MealCard
              title="Dinner"
              time="1:00 PM"
              status="Pending"
              calories={520}
              items={["Baked Salmon", "Steamed Broccoli", "Brown Rice"]}
              isPending
            />
          </View>
          <View
            style={{
              flexDirection: "column",
              width: "95%",
              margin: 10,
              backgroundColor: "white",
              borderRadius: 10,
              paddingVertical: 10,
              alignSelf: "center",
              padding:10
            }}
          >
            <View style={styles.goalHeader}>
              <Ionicons name="person" size={24} color="black"  />
              <Text>
                <Text style={styles.goalTitle}>Personalized Recommandation</Text>
              </Text>
            </View>
            <Text>
              Based on your current progress, we recommend increasing your
              protein intake to support muscle recovery and growth. Consider
              adding a protein shake or more lean meats to your meals.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    flexDirection: "column",
    backgroundColor: "lightblue",
    marginTop: 15,
  },
  title: {
    fontSize: 35,
    marginLeft: 10,
  },
  subtitle: {
    marginTop: 5,
    fontSize: 15,
  },
  goalCard: {
    flexDirection: "column",
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    width: "95%",
    paddingVertical: 10,
  },
  goalHeader: {
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
    marginBottom: 5,
  },
  goalTitle: {
    fontSize: 18,
    marginLeft: 20,
    fontWeight: "bold",
  },
  progressContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    color: "#000",
  },
  value: {
    fontSize: 14,
    color: "#000",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#e5e5e5",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#000",
  },
});

export default DietPlan;