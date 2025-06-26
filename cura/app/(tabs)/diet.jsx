import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, useState } from "react";
import { useEffect } from "react";
import LottieView from "lottie-react-native";
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
      style={[
        styles.mealCard,
        {
          backgroundColor: status === "Completed" ? "#E8FFF0" : "#F5F5F5",
          borderColor: "#ccc",
        },
      ]}
    >
      <View style={styles.mealHeader}>
        <View>
          <Text style={styles.mealTitle}>{title}</Text>
          <Text style={styles.mealTime}>{time}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: status === "Completed" ? "#E0D6F9" : "#DCDCDC",
              },
            ]}
          >
            <Text style={styles.statusText}>{status}</Text>
          </View>
          <Text style={styles.caloriesText}>{calories} cal</Text>
        </View>
      </View>
      <View style={styles.mealItems}>
        {items.map((item, index) => (
          <Text key={index} style={styles.mealItemText}>
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
  const [pdr, setPdr] = useState("hello");

  const loadDiet = async () => {
    try {
      const storedDiet = await AsyncStorage.getItem("dietRecommendation");
      if (storedDiet !== null) {
        setPdr(cleanDietText(storedDiet));
      }
    } catch (e) {
      console.error("Error loading diet:", e);
    }
  };
  const cleanDietText = (text) => {
    return text
      .replace(/^\s*Diet Recommendation:\s*/i, "")
      .replace(/^\s*\*\*Diet Recommendation\*\*\s*/i, "")
      .trim();
  };

  useEffect(() => {
    loadDiet();
  }, []);


  useEffect(() => {
  initializeDatabase();
}, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Diet Plan</Text>
            <Text style={styles.subtitle}>
              Stay on track with your medication schedule
            </Text>
          </View>

          <View style={styles.recommendationCard}>
            <View style={styles.goalHeader}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <LottieView
                  source={require("../../assets/animations/AIHeart.json")}
                  autoPlay
                  loop
                  style={{
                    width: 50,
                    height: 50,
                    // backgroundColor: "black",
                  }}
                ></LottieView>
                {/* <Ionicons name="person" size={22} color="black" /> */}
                <Text style={styles.goalTitle}>
                  {" "}
                  AI Recommendation
                </Text>
              </View>
              <TouchableOpacity
                onPress={loadDiet}
                style={{
                  padding: 5,
                }}
              >
                <Ionicons name="refresh-outline" size={22} color="grey" />
              </TouchableOpacity>
            </View>
            <Text style={styles.recommendationText}>{pdr}</Text>
          </View>

          {/* Goals Section */}
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color="green"
              />
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

          {/* Meals Section */}
          <View style={styles.mealSection}>
            <View style={styles.mealHeaderSection}>
              <Ionicons name="restaurant-outline" size={22} color="#333" />
              <Text style={styles.mealSectionTitle}>Today's Meals</Text>
            </View>
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
              status="Completed"
              calories={450}
              items={["Grilled Chicken Salad", "Quinoa", "Olive Oil Dressing"]}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E6FAFD",
    flex: 1,
  },
  innerContainer: {
    paddingTop: 50, // increased from 24 to 100
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 5,
    color: "#555",
  },
  goalCard: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 0,
  },
  progressContainer: {
    marginVertical: 8,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: "#333",
  },
  value: {
    fontSize: 13,
    color: "#333",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#e5e5e5",
    borderRadius: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#000",
    borderRadius: 4,
  },
  mealSection: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  mealHeaderSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 6,
  },
  mealSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  mealCard: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mealTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  mealTime: {
    fontSize: 12,
    color: "#555",
  },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#444",
  },
  caloriesText: {
    fontSize: 14,
    marginTop: 4,
    color: "#333",
  },
  mealItems: {
    marginTop: 10,
  },
  mealItemText: {
    fontSize: 14,
    color: "#333",
  },
  actionButtonWrapper: {
    marginTop: 10,
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  actionButtonText: {
    fontWeight: "bold",
    color: "#333",
  },
  recommendationCard: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 10,
    padding: 12,
    borderColor: "#FFC0CB",
    borderWidth: 0,
  },
  recommendationText: {
    marginTop: 4,
    fontSize: 13,
    color: "#333",
  },
});

export default DietPlan;