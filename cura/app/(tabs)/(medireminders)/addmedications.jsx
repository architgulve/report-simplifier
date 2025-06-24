import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';

// Generate 24-hour time slots with 15-minute intervals
const generateTimeSlots = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMin = min.toString().padStart(2, '0');
      times.push({ label: `${formattedHour}:${formattedMin}`, value: `${formattedHour}:${formattedMin}` });
    }
  }
  return times;
};

export default function AddMedication() {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [morningTime, setMorningTime] = useState('');
  const [afternoonTime, setAfternoonTime] = useState('');
  const [nightTime, setNightTime] = useState('');

  const timeSlots = generateTimeSlots();

  const handleAddMedication = () => {
    if (name && dosage && morningTime && afternoonTime && nightTime) {
      Alert.alert(
        'Medication Added',
        `Name: ${name}\nDosage: ${dosage} mg/day\nTimes:\nMorning: ${morningTime}\nAfternoon: ${afternoonTime}\nNight: ${nightTime}`
      );
      setName('');
      setDosage('');
      setMorningTime('');
      setAfternoonTime('');
      setNightTime('');
    } else {
      Alert.alert('Error', 'Please fill all fields');
    }
  };

  const dropdownIcon = () => {
    return <Ionicons name="chevron-down" size={24} color="gray" />;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add a New Medication</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Medication"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Dosage (mg/day)</Text>
      <TextInput
        style={styles.input}
        placeholder="Dosage in mg/day"
        keyboardType="numeric"
        value={dosage}
        onChangeText={setDosage}
      />

      <Text style={styles.label}>Morning Time</Text>
      <View style={styles.pickerBox}>
        <RNPickerSelect
          onValueChange={(value) => setMorningTime(value)}
          items={timeSlots}
          placeholder={{ label: 'Select Morning Time', value: '' }}
          style={pickerSelectStyles}
          value={morningTime}
          Icon={dropdownIcon}
        />
      </View>

      <Text style={styles.label}>Afternoon Time</Text>
      <View style={styles.pickerBox}>
        <RNPickerSelect
          onValueChange={(value) => setAfternoonTime(value)}
          items={timeSlots}
          placeholder={{ label: 'Select Afternoon Time', value: '' }}
          style={pickerSelectStyles}
          value={afternoonTime}
          Icon={dropdownIcon}
        />
      </View>

      <Text style={styles.label}>Night Time</Text>
      <View style={styles.pickerBox}>
        <RNPickerSelect
          onValueChange={(value) => setNightTime(value)}
          items={timeSlots}
          placeholder={{ label: 'Select Night Time', value: '' }}
          style={pickerSelectStyles}
          value={nightTime}
          Icon={dropdownIcon}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddMedication}>
        <Text style={styles.buttonText}>Add Medication</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#e0f7fa',
    padding: 20,
    paddingTop: 60,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 5,
    paddingVertical: 3,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30, // To ensure the text doesn't overlap with the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30, // To ensure the text doesn't overlap with the icon
  },
  iconContainer: {
    top: 15,
    right: 10,
  },
};
