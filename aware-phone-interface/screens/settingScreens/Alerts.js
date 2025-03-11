import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, ScrollView, TouchableWithoutFeedback } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { supabase } from '../../lib/supabase'; // Import your Supabase client
import * as Notifications from 'expo-notifications';

const Alerts = ({ navigation }) => {
  const previousRouteName = navigation.getState().routes[navigation.getState().index - 1]?.name || 'Back';

  const [alerts, setAlerts] = useState([]);
  const [alertName, setAlertName] = useState('');
  const [alertTime, setAlertTime] = useState(''); // Store selected time
  const [alertContent, setAlertContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false); // Time picker state

  useEffect(() => {
    requestNotificationPermissions();
    fetchAlerts();
  }, []);

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access notifications was denied');
    }
  };

  const fetchAlerts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('timed_alerts').select('*');
    if (error) {
      console.error('Error fetching alerts:', error);
    } else {
      setAlerts(data);
    }
    setLoading(false);
  };

  const addAlert = async () => {
    Keyboard.dismiss();

    if (alertName && alertTime && alertContent) {
      console.log('Adding alert:', { alertName, alertTime, alertContent });

      const { data, error } = await supabase
        .from('timed_alerts')
        .insert([{ name: alertName, alert_time: alertTime, message: alertContent }])
        .select();

      if (error) {
        console.error('Error adding alert:', error);
      } else if (data && data.length > 0) {
        setAlerts((prevAlerts) => [...prevAlerts, ...data]);

        // Convert HH:MM to a Date object for scheduling
        const now = new Date();
        const [hours, minutes] = alertTime.split(':').map(Number);
        let scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

        // If the time has already passed today, schedule it for tomorrow
        if (scheduledTime <= now) {
          scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        console.log(`🔔 Scheduling notification for: ${scheduledTime}`);

        // Schedule the notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Reminder: ${alertName}`,
            body: alertContent,
            sound: 'default',
          },
          trigger: { date: scheduledTime },
        });

        console.log('Notification scheduled successfully');

        // Clear input fields
        setAlertName('');
        setAlertTime('');
        setAlertContent('');
      }
    }
  };

  const showTimePicker = () => setTimePickerVisible(true);
  const hideTimePicker = () => setTimePickerVisible(false);

  const handleConfirm = (time) => {
    const formattedTime = time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false // Ensures 24-hour format
    }); 
    setAlertTime(formattedTime);
    hideTimePicker();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Alerts</Text>
          <Text style={styles.headerDescription}>
            Here is a description of what you can do with the alerts section
          </Text>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="blue" />
          <Text style={styles.backButtonText}>{previousRouteName}</Text>
        </TouchableOpacity>

        {/* Create Alert Section */}
        <View style={styles.createAlert}>
          <Text style={styles.sectionTitle}>Create an alert</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput style={styles.input} placeholder="Enter alert name" value={alertName} onChangeText={setAlertName} />
          </View>
          
          {/* Time Picker Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Time</Text>
            <TouchableOpacity onPress={showTimePicker} style={styles.timePicker}>
              <Text style={styles.timeText}>{alertTime || 'Select Time'}</Text>
            </TouchableOpacity>
            <DateTimePickerModal isVisible={isTimePickerVisible} mode="time" onConfirm={handleConfirm} onCancel={hideTimePicker} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Alert Content</Text>
            <TextInput style={[styles.input, styles.multilineInput]} placeholder="Enter alert content" value={alertContent} onChangeText={setAlertContent} multiline />
          </View>
          
          <TouchableOpacity style={styles.addButton} onPress={addAlert}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Saved Alerts Section */}
        <View style={styles.savedAlerts}>
          <Text style={styles.sectionTitle}>Saved Alerts</Text>
          {loading ? <Text style={styles.loadingText}>Loading...</Text> : alerts.length === 0 ? <Text style={styles.emptyList}>No saved alerts yet.</Text> :
            alerts.map((item) => (
              <View key={item.id.toString()} style={styles.alertItem}>
                <Text style={styles.alertLabel}>Name: <Text style={styles.alertValue}>{item.name}</Text></Text>
                <Text style={styles.alertLabel}>Time: <Text style={styles.alertValue}>{item.alert_time}</Text></Text>
                <Text style={styles.alertLabel}>Alert Content: <Text style={styles.alertValue}>{item.message}</Text></Text>
              </View>
            ))}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: 
  { flex: 1, 
    backgroundColor: '#fff', 
    padding: 16 
  },

  header: 
  { marginTop: 60, 
    marginBottom: 20, 
    alignItems: 'center' 
  },

  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  
  headerDescription: 
  { fontSize: 16, 
    color: '#666', 
    textAlign: 'center', 
    marginTop: 8 
  },

  backButton: 
  { flexDirection: 'row', 
    alignItems: 'center', 
    position: 'absolute', 
    top: 10, 
    left: 10 
  },

  backButtonText: 
  { fontSize: 18, 
    marginLeft: 5, 
    color: 'blue' 
  },

  createAlert: 
  { backgroundColor: '#ffffff', 
    borderRadius: 10, 
    padding: 16, 
    marginBottom: 20
  },

  sectionTitle: 
  { fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },

  inputGroup: 
  { marginBottom: 10 },
  
  inputLabel: 
  { fontSize: 14, 
    fontWeight: 'bold', 
    marginBottom: 4 
  },

  input: 
  { backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5, 
    padding: 8, 
    fontSize: 16 
  },

  multilineInput: 
  { height: 60, 
    textAlignVertical: 'top' 
  },

  timePicker: 
  { backgroundColor: '#fff', 
    padding: 12, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5 
  },

  timeText: 
  { fontSize: 16, 
    color: '#333' 
  },

  addButton: 
  { backgroundColor: '#007BFF', 
    width: 330, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    alignSelf: 'flex-end', 
    marginTop: 10 
  },

  addButtonText: 
  { fontSize: 24, 
    color: '#fff', 
    fontWeight: 'bold' 
  },

  savedAlerts: 
  { marginBottom: 20,
    padding: 16,
  },

  alertItem: 
  { backgroundColor: '#f9f9f9', 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: '#ccc' 
  },

  alertLabel: 
  { fontSize: 16, 
    fontWeight: 'bold',
    padding: 9,
  },

  alertValue: 
  { fontSize: 16, 
    fontWeight: 'normal', 
    color: '#333', 
  },

  emptyList: 
  { fontSize: 16, 
    color: '#888', 
    textAlign: 'center', 
    marginTop: 10 
  },

  loadingText: 
  { fontSize: 16, 
    textAlign: 'center', 
    color: '#666' 
  },
});

export default Alerts;