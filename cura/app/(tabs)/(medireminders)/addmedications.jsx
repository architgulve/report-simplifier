import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import { insertMedicine } from '../../../utility/database';
import { router } from 'expo-router';

// Generate 24-hour time slots with 15-minute intervals
const generateTimeSlots = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMin = min.toString().padStart(2, '0');
      times.push({
        label: `${formattedHour}:${formattedMin}`,
        value: `${formattedHour}:${formattedMin}`
      });
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

  const handleAddMedication = async () => {
    if (name && dosage && morningTime && afternoonTime && nightTime) {
      try {
        const timeString = `${morningTime},${afternoonTime},${nightTime}`;
        console.log('📝 Adding medication:', {
          name,
          dosage: parseInt(dosage),
          timeString,
        });
        
        // Fixed: Pass parameters in correct order matching database function
        const success = await insertMedicine(
          name,                    // MedicineName
          0,                      // QuantityLiquid
          parseInt(dosage),       // QuantityTablet
          1,                      // NumberOfDays
          timeString,             // TimeToBeTakenAt
          new Date().toISOString().split('T')[0] // StartDate
        );

        console.log('💾 Insert result:', success);

        if (success) {
          Alert.alert(
            'Success', 
            'Medication added successfully!',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Clear form
                  setName('');
                  setDosage('');
                  setMorningTime('');
                  setAfternoonTime('');
                  setNightTime('');
                  router.back();
                }
              }
            ]
          );
        } else {
          Alert.alert('Error', 'Failed to add medication. Please try again.');
        }
      } catch (error) {
        console.error('❌ Error in handleAddMedication:', error);
        Alert.alert('Error', 'An error occurred while adding the medication.');
      }
    } else {
      Alert.alert('Missing Information', 'Please fill in all fields before adding the medication.');
    }
  };

  const dropdownIcon = () => (
    <Ionicons name="chevron-down" size={24} color="gray" />
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <Text style={styles.label}>Morning Time *</Text>
      <View style={styles.pickerBox}>
        <RNPickerSelect
          onValueChange={setMorningTime}
          items={timeSlots}
          placeholder={{ label: 'Select Morning Time', value: '' }}
          style={pickerSelectStyles}
          value={morningTime}
          Icon={dropdownIcon}
        />
      </View>

      <Text style={styles.label}>Afternoon Time *</Text>
      <View style={styles.pickerBox}>
        <RNPickerSelect
          onValueChange={setAfternoonTime}
          items={timeSlots}
          placeholder={{ label: 'Select Afternoon Time', value: '' }}
          style={pickerSelectStyles}
          value={afternoonTime}
          Icon={dropdownIcon}
        />
      </View>

      <Text style={styles.label}>Night Time *</Text>
      <View style={styles.pickerBox}>
        <RNPickerSelect
          onValueChange={setNightTime}
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
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 5,
    paddingVertical: 3,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30,
  },
  iconContainer: {
    top: 15,
    right: 10,
  },
};