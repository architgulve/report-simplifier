import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function MedicationReminders() {
  const [medications, setMedications] = useState([
    { id: 1, name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', taken: false },
    { id: 2, name: 'Metformin', dosage: '10mg', time: '10:00 AM', taken: true },
  ]);

  const [notifications, setNotifications] = useState({
    push: false,
    voice: false,
    snooze: false,
  });

  const handleToggle = (id) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, taken: !med.taken } : med
    ));
  };

  const takenCount = medications.filter(med => med.taken).length;
  const pendingCount = medications.length - takenCount;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="heart-circle" size={32} color="#00A8E8" />
        <Text style={styles.headerTitle}>Cura</Text>
        <Ionicons name="settings" size={24} color="black" />
      </View>

      {/* Title */}
      <Text style={styles.mainTitle}>Medication Reminders</Text>
      <Text style={styles.subtitle}>Stay on track with your medication schedule</Text>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: 'green' }]}>{takenCount}</Text>
          <Text>Taken</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber,{color:"red"}]}>{pendingCount}</Text>
          <Text>Pending</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber,{color:"blue"}]}>{medications.length}</Text>
          <Text>Total</Text>
        </View>
      </View>

      {/* Medication List */}
      {medications.map((med) => (
        <View
          key={med.id}
          style={[
            styles.medCard,
            { backgroundColor: med.taken ? '#E0F8E0' : '#F5F5F5', borderColor: med.taken ? 'green' : '#ccc' }
          ]}
        >
          <View style={styles.medHeader}>
            <Text style={styles.medName}>{med.name}</Text>
            <Text style={[styles.statusBadge, { backgroundColor: med.taken ? 'green' : 'red' }]}>
              {med.taken ? 'Taken' : 'Pending'}
            </Text>
          </View>
          <Text>{med.dosage} • Once daily</Text>
          <Text>🕒 {med.time}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.largeActionButton}
              onPress={() => handleToggle(med.id)}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>{med.taken ? 'Undo' : 'Mark As Taken'}</Text>
            </TouchableOpacity>
            <Switch
              value={med.taken}
              onValueChange={() => handleToggle(med.id)}
            />
          </View>
        </View>
      ))}

      {/* Add Medication Button */}
      <TouchableOpacity style={
        styles.addButton
       }
       onPress={() => router.push("/(medireminders)/addmedications")}
      >
        <Text style={{ color: 'black' }}>+ Add New Medication</Text>
      </TouchableOpacity>

      {/* Notification Settings */}
      <View style={styles.notificationContainer}>
        <Text style={styles.notificationTitle}>Notification Settings</Text>

        {['Push Notifications', 'Voice Reminders', 'Snooze Options'].map((item, index) => (
          <View key={index} style={styles.notificationRow}>
            <Text>{item}</Text>
            <Switch
              value={notifications[item.toLowerCase().replace(/\s/g, '')]}
              onValueChange={() => setNotifications({
                ...notifications,
                [item.toLowerCase().replace(/\s/g, '')]: !notifications[item.toLowerCase().replace(/\s/g, '')]
              })}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6F4F1', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  mainTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 16, textAlign: 'center' },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  summaryCard: { backgroundColor: 'white', padding: 16, alignItems: 'center', borderRadius: 8, width: '30%' },
  summaryNumber: { fontSize: 25, fontWeight: 'bold', marginBottom: 4 },
  medCard: { borderWidth: 1, borderRadius: 8, padding: 16, marginBottom: 16 },
  medHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  medName: { fontSize: 16, fontWeight: 'bold' },
  statusBadge: { color: 'white', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 12 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  largeActionButton: { backgroundColor: '#1E1E2F', padding: 14, borderRadius: 8 },
  addButton: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  notificationContainer: { backgroundColor: 'white', borderRadius: 8, padding: 16, marginBottom: 32 },
  notificationTitle: { fontSize: 23, fontWeight: 'bold', marginBottom: 12 },
  notificationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
});
