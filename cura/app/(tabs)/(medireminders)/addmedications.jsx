import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";
import { addNoti } from "../../../utility/database";
import { router } from "expo-router";

export default function AddMedication() {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [morningTime, setMorningTime] = useState("");

  const handleAddMedication = async () => {
    if (name && dosage && morningTime) {
      try {
        // const timeString = `${morningTime},${afternoonTime},${nightTime}`;
        // console.log("📝 Adding medication:", {
        //   name,
        //   dosage: parseInt(dosage),
        //   timeString,
        // });

        const success = await addNoti(`Take ${name} ${dosage}`, morningTime);

        console.log("💾 Insert result:", success);

        if (success) {
          Alert.alert("Success", "Medication added successfully!", [
            {
              text: "OK",
              onPress: () => {
                setName("");
                setDosage("");
                setMorningTime("");
                router.back();
              },
            },
          ]);
        } else {
          Alert.alert("Error", "Failed to add medication. Please try again.");
        }
      } catch (error) {
        console.error("❌ Error in handleAddMedication:", error);
        Alert.alert("Error", "An error occurred while adding the medication.");
      }
    } else {
      Alert.alert(
        "Missing Information",
        "Please fill in all fields before adding the medication."
      );
    }
  };

  const dropdownIcon = () => (
    <Ionicons name="chevron-down" size={24} color="gray" />
  );

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.heading}>Add a New Medication</Text>

        <Text style={styles.label}>Medication Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter medication name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Dosage (mg per dose) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter dosage in mg"
          keyboardType="numeric"
          value={dosage}
          onChangeText={setDosage}
        />

        <Text style={styles.label}>Meal Time</Text>
        <View style={styles.pickerBox}>
          <RNPickerSelect
            onValueChange={setMorningTime}
            items={[
              { label: "Morning", value: "morning", color: "black" },
              { label: "Afternoon", value: "afternoon", color: "black" },
              { label: "Night", value: "night", color: "black" },
            ]}
            placeholder={{
              label: "Select Morning Time",
              value: "",
              color: "black",
            }}
            style={pickerSelectStyles}
            value={morningTime}
            Icon={dropdownIcon}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAddMedication}>
          <Text style={styles.buttonText}>Add Medication</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          padding: 10,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "lightgrey",
              padding: 5,
              borderRadius: 100,
              marginBottom: 30,
            }}
          >
            <Ionicons name="close" size={60} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#e0f7fa",
    padding: 20,
    paddingTop: 60,
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: "#000",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pickerBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 5,
    paddingVertical: 3,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#2196f3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
