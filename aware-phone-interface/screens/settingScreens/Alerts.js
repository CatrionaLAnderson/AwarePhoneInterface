import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, ScrollView, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import { Card, Title, Paragraph } from "react-native-paper";
import { useDrunkMode } from '../../constants/DrunkModeContext';
import { triggerDrunkModeAlerts } from "../../services/NotificationService2";
import { fetchAlertsFromDB, addOrUpdateAlert, deleteAlertFromDB } from "../../services/NotificationService2";

const Alerts = ({ navigation }) => {
  const previousRouteName = navigation.getState().routes[navigation.getState().index - 1]?.name || 'Back';
  const { isDrunkMode } = useDrunkMode();

  const [alerts, setAlerts] = useState([]);
  const [alertName, setAlertName] = useState('');
  const [alertContent, setAlertContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    requestNotificationPermissions();
    fetchAlerts();
  }, []);

  useEffect(() => {
    if (isDrunkMode) {
      triggerDrunkModeAlerts();
    }
  }, [isDrunkMode]);

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access notifications was denied');
    }
  };

  const fetchAlerts = async () => {
    setLoading(true);
    const data = await fetchAlertsFromDB();
    setAlerts(data);
    setLoading(false);
  };

  const addAlert = async () => {
    Keyboard.dismiss();

    if (alertName && alertContent) {
      const updatedAlert = await addOrUpdateAlert(alertName, alertContent, editingId);
      if (updatedAlert) {
        if (editingId) {
          setAlerts(alerts.map(alert => alert.id === editingId ? updatedAlert : alert));
          setEditingId(null);
        } else {
          setAlerts(prev => [...prev, updatedAlert]);
        }
        setAlertName('');
        setAlertContent('');
      }
    }
  };

  const deleteAlert = async (id) => {
    const success = await deleteAlertFromDB(id);
    if (success) {
      setAlerts(alerts.filter(alert => alert.id !== id));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView style={styles.container}>

        {/* Header Card */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Ionicons name="notifications" size={50} style={styles.icon} />
            <Title style={styles.title}>Alerts</Title>
            <Paragraph style={styles.paragraph}>
              Create and Schedule alerts for customised notifications during drunk mode.
            </Paragraph>
          </Card.Content>
        </Card>

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
                <Text style={styles.alertLabel}>Alert Content: <Text style={styles.alertValue}>{item.message}</Text></Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                  <TouchableOpacity
                    style={{ backgroundColor: '#e0f0ff', borderRadius: 20, padding: 6, marginRight: 10 }}
                    onPress={() => {
                      setAlertName(item.name);
                      setAlertContent(item.message);
                      setEditingId(item.id);
                    }}
                  >
                    <Ionicons name="create-outline" size={20} color="#007BFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ backgroundColor: '#ffe0e0', borderRadius: 20, padding: 6 }}
                    onPress={() => deleteAlert(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
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

  card: {
    marginTop: 60,
    marginVertical: 16,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
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