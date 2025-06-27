import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  initializeDatabase,
  insertSetting,
  getSettings,
  getDatabaseStatus,
  clearSettings,
} from "../utility/database";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";


const generateTimeSlots = () => {
  const timeSlots = [];
  for (let hour = 0; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 60) {
      const formattedTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      timeSlots.push(formattedTime);
    }
  }
  return timeSlots;
};

export default function ProfileSettings() {
  // Database fields
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [morningTime, setMorningTime] = useState("09:00");
  const [afternoonTime, setAfternoonTime] = useState("13:00");
  const [nightTime, setNightTime] = useState("20:00");
  
  const getTimes = async () => {
    const tempMorning = await AsyncStorage.getItem("morningTime");
    const tempAfternoon = await AsyncStorage.getItem("afternoonTime");
    const tempNight = await AsyncStorage.getItem("nightTime");
    setMorningTime(tempMorning);
    setAfternoonTime(tempAfternoon);
    setNightTime(tempNight);
  }

  const timeSlots = generateTimeSlots();

  // Loading state to prevent multiple initializations
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    getTimes();
    const initializeAndLoad = async () => {
      if (isInitialized) return;

      try {
        console.log("🔄 Initializing database...");
        setIsLoading(true);

        initializeDatabase();
        setIsInitialized(true);
        console.log("✅ Database initialized successfully");

        // 🚫 REMOVE this if getDatabaseStatus is undefined or causes error
        // const status = await getDatabaseStatus();
        // console.log('📊 Database status:', status);

        await loadSettings();
      } catch (error) {
        console.error("❌ Error initializing:", error);
        Alert.alert("Database Error", error?.message || "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAndLoad();
  }, [isInitialized]);

  // Load existing settings from database
  const loadSettings = async () => {
    try {
      console.log("🔄 Loading settings from database...");
      setIsLoading(true);

      const settings = await getSettings();
      console.log("📋 Settings from database:", settings);

      if (settings) {
        console.log("✅ Settings found, updating state...");
        // Use optional chaining and provide defaults
        setFullName(settings.name ?? "");
        setAge(settings.age ? settings.age.toString() : ""); // Ensure string for TextInput
        setMorningTime(settings.morningtime ?? "09:00");
        setAfternoonTime(settings.afternoontime ?? "13:00");
        setNightTime(settings.nighttime ?? "20:00");

        console.log("✅ State updated with:", {
          name: settings.name,
          age: settings.age,
          morningTime: settings.morningtime,
          afternoonTime: settings.afternoontime,
          nightTime: settings.nighttime,
        });
      } else {
        console.log("ℹ️ No settings found in database");
      }
    } catch (error) {
      console.error("❌ Error loading settings:", error);
      Alert.alert(
        "Error",
        "Failed to load settings: " + (error?.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings to database
  const saveSettings = async () => {
    if (!fullName.trim()) {
      Alert.alert("Required Field", "Please enter your full name");
      return;
    }

    // Validate age if provided
    if (
      age &&
      (isNaN(parseInt(age)) || parseInt(age) < 0 || parseInt(age) > 150)
    ) {
      Alert.alert("Invalid Age", "Please enter a valid age between 0 and 150");
      return;
    }

    try {
      console.log("🔄 Saving settings to database...");
      setIsLoading(true);

      const dataToSave = {
        fullName: fullName.trim(),
        age: age ? parseInt(age) : null,
        morningTime: morningTime.trim(),
        afternoonTime: afternoonTime.trim(),
        nightTime: nightTime.trim(),
      };

      console.log("📝 Data to save:", dataToSave);

      const success = await insertSetting(
        dataToSave.fullName,
        dataToSave.age,
        "",
        "",
        "",
        "",
        dataToSave.morningTime,
        dataToSave.afternoonTime,
        dataToSave.nightTime
      );
      
      await AsyncStorage.setItem("morningTime", dataToSave.morningTime);
      await AsyncStorage.setItem("afternoonTime", dataToSave.afternoonTime);
      await AsyncStorage.setItem("nightTime", dataToSave.nightTime);       

      console.log("💾 Save result:", success);

      if (success) {
        Alert.alert("Success", "Settings saved successfully!");
        // Reload to verify save worked
        await loadSettings();
      } else {
        Alert.alert(
          "Error",
          "Failed to save settings - database operation returned false"
        );
      }
    } catch (error) {
      console.error("❌ Error saving settings:", error);
      Alert.alert(
        "Save Error",
        `Failed to save settings: ${error?.message || "Unknown error"}\n\nPlease check your data and try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your health information</Text>

        {/* Personal Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            autoCapitalize="words"
          />
          <Text style={styles.label}>Age</Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="Enter your age"
            maxLength={3}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Meal Times</Text>

          <Text style={styles.label}>Breakfast Time</Text>
          <RNPickerSelect
            onValueChange={setMorningTime}
            value={morningTime}
            items={timeSlots.map((time) => ({ label: time, value: time }))}
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
              iconContainer: {
                top: 10,
                right: 10,
              }
            }}
            Icon={() => <Ionicons name="chevron-down" size={24} color="black" />}
          />

          <Text style={styles.label}>Lunch Time</Text>
          <RNPickerSelect
            onValueChange={setAfternoonTime}
            value={afternoonTime}
            items={timeSlots.map((time) => ({ label: time, value: time }))}
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
              iconContainer: {
                top: 10,
                right: 10,
              }
            }}
            Icon={() => <Ionicons name="chevron-down" size={24} color="black" />}
          />

          <Text style={styles.label}>Dinner Time</Text>
          <RNPickerSelect
            onValueChange={setNightTime}
            value={nightTime}
            items={timeSlots.map((time) => ({ label: time, value: time }))}
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
              iconContainer: {
                top: 10,
                right: 10,
              }
            }}
            Icon={() => <Ionicons name="chevron-down" size={24} color="black" />}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.reloadButton, isLoading && styles.disabledButton]}
            onPress={loadSettings}
            disabled={isLoading}
          >
            <Text style={styles.reloadButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.disabledButton]}
            onPress={saveSettings}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? "Saving..." : "Save Settings"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFF6FB",
  },
  scrollView: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    color: "#555",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  reloadButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  reloadButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rowText: {
    fontSize: 16,
    color: "#333",
  },
  textSize: {
    fontSize: 14,
    color: "#444",
  },
  textSizeBox: {
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  textSizeValue: {
    fontSize: 14,
    color: "#333",
  },
  debugSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  debugButton: {
    backgroundColor: "#6c757d",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  debugButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  clearButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "black",
    paddingRight: 30,
  },
  iconContainer: {
    top: 15,
    right: 10,
  },
};
