// import React, { useState ,useEffect} from 'react';
// import { SafeAreaView, ScrollView, View, Text, TextInput, Switch, StyleSheet } from 'react-native';
// // import db from '../utils/database'; // Assuming you have a database utility file
// import { 
//   initializeDatabase, 
//   insertSetting, 
//   getSettings,
//   insertDiet,
//   getLatestDiet 
// } from '../utils/databse';

// export default function ProfileSettings() {
//   const [pushNotifications, setPushNotifications] = useState(false);
//   const [voiceReminders, setVoiceReminders] = useState(false);
//   const [snoozeOptions, setSnoozeOptions] = useState(false);
//   useEffect(() => {
//   initializeDatabase();
// }, []);

// // Use the functions (they're now async)
// const handleSaveSetting = async () => {
//   const success = await insertSetting('John', 'English', 'O+', '+1234567890', 'Dr. Smith');
//   if (success) {
//     console.log('Settings saved!');
//   }
// };

// const loadSettings = async () => {
//   const settings = await getSettings();
//   if (settings) {
//     console.log('User settings:', settings);
//   }
// };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollView}>
//         <Text style={styles.title}>Settings</Text>
//         <Text style={styles.subtitle}>Manage your health information</Text>

        
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Personal Information</Text>
//           <Text style={styles.label}>Full Name</Text>
//           <TextInput style={styles.input} />
//           <Text style={styles.label}>Age</Text>
//           <TextInput keyboardType="numeric" style={styles.input} />
//         </View>

        
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Notification Settings</Text>
//           <View style={styles.row}>
//             <Text>Push Notifications</Text>
//             <Switch value={pushNotifications} onValueChange={setPushNotifications} />
//           </View>
//           <View style={styles.row}>
//             <Text>Voice Reminders</Text>
//             <Switch value={voiceReminders} onValueChange={setVoiceReminders} />
//           </View>
//           <View style={styles.row}>
//             <Text>Snooze Options</Text>
//             <Switch value={snoozeOptions} onValueChange={setSnoozeOptions} />
//           </View>
//         </View>

        
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Language & Preference</Text>
//           <TextInput value="English" editable={false} style={styles.input} />
//           <View style={styles.row}>
//             <Text style={styles.textSize}>Size of Text:</Text>
//             <View style={styles.textSizeBox}>
//               <Text style={styles.textSizeValue}>16 px</Text>
//             </View>
//           </View>
//         </View>

        
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Medical Information</Text>
//           <Text style={styles.label}>Blood Group</Text>
//           <TextInput value="O+" editable={false} style={styles.inputReadonly} />
//           <Text style={styles.label}>Emergency Contact</Text>
//           <TextInput style={styles.inputReadonly} editable={false} />
//           <Text style={styles.label}>Primary Doctor</Text>
//           <TextInput style={styles.inputReadonly} editable={false} />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#E7F6FB',
//   },
//   scrollView: {
//     padding: 16,
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: '700',
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 14,
//     textAlign: 'center',
//     marginBottom: 16,
//     color: '#555',
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   label: {
//     fontSize: 14,
//     color: '#444',
//     marginBottom: 4,
//     marginTop: 8,
//   },
//   input: {
//     backgroundColor: '#F4F4F4',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 12,
//   },
//   inputReadonly: {
//     backgroundColor: '#F7F2F2',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 12,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   textSize: {
//     fontSize: 14,
//     color: '#444',
//   },
//   textSizeBox: {
//     backgroundColor: '#F4F4F4',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   textSizeValue: {
//     fontSize: 14,
//     color: '#333',
//   },
// });

import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { 
  initializeDatabase, 
  insertSetting, 
  getSettings,
} from '../utils/databse'; // Fixed typo: databse → database

export default function ProfileSettings() {
  // Form state - matching your database schema exactly
  const [fullName, setFullName] = useState('');
  const [language, setLanguage] = useState('English');
  const [bloodGroup, setBloodGroup] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [primaryDoctor, setPrimaryDoctor] = useState('');
  
  // Notification states (not stored in DB yet - you may want to add these)
  const [pushNotifications, setPushNotifications] = useState(false);
  const [voiceReminders, setVoiceReminders] = useState(false);
  const [snoozeOptions, setSnoozeOptions] = useState(false);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  // Initialize database and load existing settings
  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        console.log('🔄 Initializing database...');
        initializeDatabase();
        await loadSettings();
      } catch (error) {
        console.error('❌ Error initializing:', error);
        Alert.alert('Error', 'Failed to initialize database');
      }
    };
    
    initializeAndLoad();
  }, []);

  // Load existing settings from database
  const loadSettings = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Loading settings from database...');
      
      const settings = await getSettings();
      
      if (settings) {
        console.log('✅ Settings found:', settings);
        setFullName(settings.name || '');
        setLanguage(settings.language || 'English');
        setBloodGroup(settings.bloodgroup || '');
        setEmergencyContact(settings.emergencyContact || '');
        setPrimaryDoctor(settings.primaryDoctor || '');
      } else {
        console.log('ℹ️ No existing settings found - this is normal for first run');
        setIsEditable(true); // Enable editing for new users
      }
    } catch (error) {
      console.error('❌ Error loading settings:', error);
      Alert.alert('Error', 'Failed to load settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings to database
  const handleSaveSettings = async () => {
    // Basic validation
    if (!fullName.trim()) {
      Alert.alert('Required Field', 'Please enter your full name');
      return;
    }
    
    if (!bloodGroup.trim()) {
      Alert.alert('Required Field', 'Please enter your blood group');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔄 Saving settings to database...');
      
      const success = await insertSetting(
        fullName.trim(),
        language,
        bloodGroup.trim(),
        emergencyContact.trim(),
        primaryDoctor.trim()
      );
      
      if (success) {
        Alert.alert('Success', 'Your settings have been saved successfully!');
        setIsEditable(false);
        console.log('✅ Settings saved successfully');
      } else {
        throw new Error('Insert operation returned false');
      }
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditable) {
      // If canceling edit, reload from database
      loadSettings();
    }
    setIsEditable(!isEditable);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your health information</Text>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.editButton]} 
            onPress={toggleEditMode}
          >
            <Text style={styles.buttonText}>
              {isEditable ? 'Cancel' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
          
          {isEditable && (
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleSaveSettings}
              disabled={isLoading}
            >
              <Text style={styles.buttonTextWhite}>Save</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Personal Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput 
            style={[styles.input, !isEditable && styles.inputReadonly]}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            editable={isEditable}
          />
        </View>

        {/* Notification Settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notification Settings</Text>
          <View style={styles.row}>
            <Text>Push Notifications</Text>
            <Switch value={pushNotifications} onValueChange={setPushNotifications} />
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

        {/* Language & Preference */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Language & Preference</Text>
          <Text style={styles.label}>Language</Text>
          <TextInput 
            value={language} 
            onChangeText={setLanguage}
            style={[styles.input, !isEditable && styles.inputReadonly]}
            editable={isEditable}
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
          <Text style={styles.label}>Blood Group *</Text>
          <TextInput 
            value={bloodGroup} 
            onChangeText={setBloodGroup}
            style={[styles.input, !isEditable && styles.inputReadonly]}
            placeholder="e.g., O+, A-, B+, AB-"
            editable={isEditable}
          />
          <Text style={styles.label}>Emergency Contact</Text>
          <TextInput 
            style={[styles.input, !isEditable && styles.inputReadonly]}
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            placeholder="Enter emergency contact number"
            keyboardType="phone-pad"
            editable={isEditable}
          />
          <Text style={styles.label}>Primary Doctor</Text>
          <TextInput 
            style={[styles.input, !isEditable && styles.inputReadonly]}
            value={primaryDoctor}
            onChangeText={setPrimaryDoctor}
            placeholder="Enter your primary doctor's name"
            editable={isEditable}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7F6FB',
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
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  buttonTextWhite: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputReadonly: {
    backgroundColor: '#F7F2F2',
    borderColor: '#E0E0E0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  textSize: {
    fontSize: 14,
    color: '#444',
  },
  textSizeBox: {
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  textSizeValue: {
    fontSize: 14,
    color: '#333',
  },
});