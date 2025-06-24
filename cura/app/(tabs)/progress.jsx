import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

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
  
