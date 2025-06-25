import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
} from "react-native";

export default function ProfileSettings() {
  const [pushNotifications, setPushNotifications] = useState(false);
  const [voiceReminders, setVoiceReminders] = useState(false);
  const [snoozeOptions, setSnoozeOptions] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your health information</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} />
          <Text style={styles.label}>Age</Text>
          <TextInput keyboardType="numeric" style={styles.input} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notification Settings</Text>
          <View style={styles.row}>
            <Text>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
            />
          </View>
          <View style={styles.row}>
            <Text>Voice Reminders</Text>
            <Switch value={voiceReminders} onValueChange={setVoiceReminders} />
          </View>
          <View style={styles.row}>
            <Text>Snooze Options</Text>
            <Switch value={snoozeOptions} onValueChange={setSnoozeOptions} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Language & Preference</Text>
          <TextInput value="English" editable={false} style={styles.input} />
          <View style={styles.row}>
            <Text style={styles.textSize}>Size of Text:</Text>
            <View style={styles.textSizeBox}>
              <Text style={styles.textSizeValue}>16 px</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Medical Information</Text>
          <Text style={styles.label}>Blood Group</Text>
          <TextInput value="O+" editable={false} style={styles.inputReadonly} />
          <Text style={styles.label}>Emergency Contact</Text>
          <TextInput style={styles.inputReadonly} editable={false} />
          <Text style={styles.label}>Primary Doctor</Text>
          <TextInput style={styles.inputReadonly} editable={false} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7F6FB",
  },
  scrollView: {
    padding: 16,
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
  },
  inputReadonly: {
    backgroundColor: "#F7F2F2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
});
