import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Card, Title, Paragraph, List, Button } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SafetySettings = ({navigation}) => {
  const previousRouteName =
    navigation.getState().routes[navigation.getState().index - 1]?.name || "Back";

  const [contacts, setContacts] = useState([]);
  const [selectedEmergencyContact, setSelectedEmergencyContact] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [transportMode, setTransportMode] = useState(null);
  const transportOptions = [
    { label: 'Public Transport', value: 'public' },
    { label: 'Private Transport', value: 'private' },
  ];

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase.from('contacts').select('*');
      if (error) {
        console.error('Error fetching contacts:', error);
      } else {
        setContacts(data.map((contact) => ({
          label: contact.contact_name,
          value: contact.id,
        })));
      }
    };
    fetchContacts();
  }, []);

  const saveSettings = async () => {
    const { error } = await supabase.from('safety_settings').upsert([
      {
        emergency_contact_id: selectedEmergencyContact,
        designated_driver_id: selectedDriver,
        transport_mode: transportMode,
      },
    ]);
    if (error) {
      Alert.alert('Error', 'Failed to save safety settings.');
    } else {
      Alert.alert('Success', 'Safety settings saved successfully!');
    }
  };

  return (
    <ScrollView style={styles.container}>

    {/* Back Button & Title */}
    <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
              >
        <Ionicons name="arrow-back" size={24} color="blue" />
        <Text style={styles.backButtonText}>{`${previousRouteName}`}</Text>
    </TouchableOpacity>

    {/* Header Card */}
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Ionicons name="shield-outline" size={50} style={styles.icon} />
              <Title style={styles.title}>Safety</Title>
              <Paragraph style={styles.paragraph}>
                Please input the details below to improve your safety
              </Paragraph>
            </Card.Content>
          </Card>


      <Text style={styles.label}>Select Emergency Contact</Text>
      <Dropdown
        data={contacts}
        labelField="label"
        valueField="value"
        value={selectedEmergencyContact}
        onChange={(item) => setSelectedEmergencyContact(item.value)}
        placeholder="Choose a contact"
        style={styles.dropdown}
      />

      <Text style={styles.label}>Select Designated Driver</Text>
      <Dropdown
        data={contacts}
        labelField="label"
        valueField="value"
        value={selectedDriver}
        onChange={(item) => setSelectedDriver(item.value)}
        placeholder="Choose a contact"
        style={styles.dropdown}
      />

      <Text style={styles.label}>Select Transport Mode</Text>
      <Dropdown
        data={transportOptions}
        labelField="label"
        valueField="value"
        value={transportMode}
        onChange={(item) => setTransportMode(item.value)}
        placeholder="Choose transport mode"
        style={styles.dropdown}
      />

      <Button mode="contained" onPress={saveSettings} style={styles.button}>
        Save Settings
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
      },
      card: {
        marginTop: 60,
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
      backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 10,
      },
      backButtonText: {
        fontSize: 18,
        marginLeft: 5,
        color: 'blue',
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
      },
      button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
      },
      resultText: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: 'bold',
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
      },
      infoCard: {
        marginVertical: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
      },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  dropdown: {
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'blue',
  },
});

export default SafetySettings;
