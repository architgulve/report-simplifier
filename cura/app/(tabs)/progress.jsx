import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';


export default function ProgressTracking() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */} 
      <View style={styles.header}>
        <Ionicons name="heart-circle" size={32} color="#00A8E8" />
        <Text style={styles.headerTitle}>Cura</Text>
        <Ionicons name="settings" size={24} color="black" />
      </View>
        <Text style={styles.title}>Progress Tracking</Text>
      <Text style={styles.subtitle}>Monitor your health journey over time</Text>
      {/* Health Stats */}
      <View style={styles.statRow}>
        <View style={[styles.statCard, { backgroundColor: '#008CDB' }]}>
          <Text style={styles.statLabel}>Heart Rate</Text>
          <Text style={styles.statValue}>72 bpm</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#27D240' }]}>
          <Text style={styles.statLabel}>Avg BP</Text>
          <Text style={styles.statValue}>120/80</Text>
        </View>
      </View>
      <View style={styles.graphCard}>
        <Text style={styles.graphTitle}>❤️ Heart Rate Trend</Text>
        <Text style={styles.placeholder}>Graph</Text>
      </View>

      <View style={styles.graphCard}>
        <View style={styles.graphHeader}>
          <Text style={styles.graphTitle}>Blood Pressure</Text>
          <Text style={styles.badge}>7 days</Text>
        </View>
        <Text style={styles.placeholder}>Graph</Text>
      </View>
      <View style={styles.graphCard}>
        <View style={styles.graphHeader}>
          <Text style={styles.graphTitle}>Medication Adherence</Text>
          <Text style={styles.badge}>Monthly</Text>
        </View>
        <Text style={styles.placeholder}>Graph</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  graphCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  graphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  graphTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: '#008CDB',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: '#fff',
  },
  placeholder: {
    height: 200,
    backgroundColor: '#E7F6FB',
    borderRadius: 8,
  },  
});
  
