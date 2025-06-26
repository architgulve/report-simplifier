
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { 
  initializeDatabase, 
  insertSetting, 
  getSettings,
  getDatabaseStatus,
  clearSettings,
} from '../utility/database';

export default function ProfileSettings() {
  // Database fields
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [language, setLanguage] = useState('English');
  const [bloodGroup, setBloodGroup] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [primaryDoctor, setPrimaryDoctor] = useState('');
  
  // Notification states (original structure)
  const [pushNotifications, setPushNotifications] = useState(false);
  const [voiceReminders, setVoiceReminders] = useState(false);
  const [snoozeOptions, setSnoozeOptions] = useState(false);

  // Loading state to prevent multiple initializations
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
  const initializeAndLoad = async () => {
    if (isInitialized) return;

    try {
      console.log('🔄 Initializing database...');
      setIsLoading(true);

      initializeDatabase();
      setIsInitialized(true);
      console.log('✅ Database initialized successfully');

      // 🚫 REMOVE this if getDatabaseStatus is undefined or causes error
      // const status = await getDatabaseStatus();
      // console.log('📊 Database status:', status);

      await loadSettings();
    } catch (error) {
      console.error('❌ Error initializing:', error);
      Alert.alert('Database Error', error?.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  initializeAndLoad();
}, [isInitialized]);



  // Load existing settings from database
  const loadSettings = async () => {
    try {
      console.log('🔄 Loading settings from database...');
      setIsLoading(true);
      
      const settings = await getSettings();
      console.log('📋 Settings from database:', settings);
      
      if (settings) {
        console.log('✅ Settings found, updating state...');
        // Use optional chaining and provide defaults
        setFullName(settings.name ?? '');
        setAge(settings.age ? settings.age.toString() : ''); // Ensure string for TextInput
        setLanguage(settings.language ?? 'English');
        setBloodGroup(settings.bloodgroup ?? '');
        setEmergencyContact(settings.emergencyContact ?? '');
        setPrimaryDoctor(settings.primaryDoctor ?? '');
        
        console.log('✅ State updated with:', {
          name: settings.name,
          age: settings.age,
          language: settings.language,
          bloodgroup: settings.bloodgroup,
          emergencyContact: settings.emergencyContact,
          primaryDoctor: settings.primaryDoctor
        });
      } else {
        console.log('ℹ️ No settings found in database');
      }
    } catch (error) {
      console.error('❌ Error loading settings:', error);
      Alert.alert('Error', 'Failed to load settings: ' + (error?.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings to database
  const saveSettings = async () => {
    if (!fullName.trim()) {
      Alert.alert('Required Field', 'Please enter your full name');
      return;
    }

    // Validate age if provided
    if (age && (isNaN(parseInt(age)) || parseInt(age) < 0 || parseInt(age) > 150)) {
      Alert.alert('Invalid Age', 'Please enter a valid age between 0 and 150');
      return;
    }

    try {
      console.log('🔄 Saving settings to database...');
      setIsLoading(true);
      
      const dataToSave = {
        fullName: fullName.trim(),
        age: age ? parseInt(age) : null,
        language: language.trim() || 'English',
        bloodGroup: bloodGroup.trim(),
        emergencyContact: emergencyContact.trim(),
        primaryDoctor: primaryDoctor.trim()
      };
      
      console.log('📝 Data to save:', dataToSave);
      
      const success = await insertSetting(
        dataToSave.fullName,
        dataToSave.age,
        dataToSave.language,
        dataToSave.bloodGroup,
        dataToSave.emergencyContact,
        dataToSave.primaryDoctor
      );
      
      console.log('💾 Save result:', success);
      
      if (success) {
        Alert.alert('Success', 'Settings saved successfully!');
        // Reload to verify save worked
        await loadSettings();
      } else {
        Alert.alert('Error', 'Failed to save settings - database operation returned false');
      }
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      Alert.alert(
        'Save Error', 
        `Failed to save settings: ${error?.message || 'Unknown error'}\n\nPlease check your data and try again.`
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

        {/* Notification Settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notification Settings</Text>
          <View style={styles.row}>
            <Text style={styles.rowText}>Push Notifications</Text>
            <Switch value={pushNotifications} onValueChange={setPushNotifications} />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>Voice Reminders</Text>
            <Switch value={voiceReminders} onValueChange={setVoiceReminders} />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>Snooze Options</Text>
            <Switch value={snoozeOptions} onValueChange={setSnoozeOptions} />
          </View>
        </View>

        {/* Language & Preference */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Language & Preference</Text>
          <Text style={styles.label}>Language</Text>
          <TextInput 
            value={language} 
            onChangeText={setLanguage}
            style={styles.input}
            placeholder="Enter preferred language"
          />
          <View style={styles.row}>
            <Text style={styles.textSize}>Size of Text:</Text>
            <View style={styles.textSizeBox}>
              <Text style={styles.textSizeValue}>16 px</Text>
            </View>
          </View>
        </View>

        {/* Medical Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Medical Information</Text>
          <Text style={styles.label}>Blood Group</Text>
          <TextInput 
            value={bloodGroup} 
            onChangeText={setBloodGroup}
            style={styles.input}
            placeholder="e.g., O+, A-, B+"
            autoCapitalize="characters"
          />
          <Text style={styles.label}>Emergency Contact</Text>
          <TextInput 
            style={styles.input}
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            placeholder="Enter emergency contact number"
            keyboardType="phone-pad"
          />
          <Text style={styles.label}>Primary Doctor</Text>
          <TextInput 
            style={styles.input}
            value={primaryDoctor}
            onChangeText={setPrimaryDoctor}
            placeholder="Enter your primary doctor's name"
            autoCapitalize="words"
          />
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.disabledButton]} 
            onPress={saveSettings}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.reloadButton, isLoading && styles.disabledButton]} 
            onPress={loadSettings}
            disabled={isLoading}
          >
            <Text style={styles.reloadButtonText}>Reload</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    color: '#555',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  reloadButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  reloadButtonText: {
    color: '#007AFF',
    fontWeight: '600',
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
    color: '#333',
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
    color: '#333',
  },
  debugSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  debugButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
