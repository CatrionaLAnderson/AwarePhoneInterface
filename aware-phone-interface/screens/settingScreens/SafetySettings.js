import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Card, Title, Paragraph, Button } from "react-native-paper";
import { fetchAllContacts } from "@/services/ContactService";
import { fetchSafetySettings, saveSafetySettings } from "@/services/safetyService"; // Import fetch & save functions
import Ionicons from "react-native-vector-icons/Ionicons";

const SafetySettings = ({ navigation }) => {
  const previousRouteName =
    navigation.getState().routes[navigation.getState().index - 1]?.name || "Back";

  const [contacts, setContacts] = useState([]);
  const [selectedEmergencyContact, setSelectedEmergencyContact] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [transportMode, setTransportMode] = useState(null);
  const [loading, setLoading] = useState(true);

  const transportOptions = [
    { label: "Public Transport", value: "public" },
    { label: "Private Transport", value: "private" },
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Fetch contacts
      const fetchedContacts = await fetchAllContacts();
      const formattedContacts = fetchedContacts.map((contact) => ({
        label: contact.name,
        value: contact.id,
      }));
      setContacts(formattedContacts);

      // Fetch saved safety settings
      const safetySettings = await fetchSafetySettings();

      if (safetySettings) {
        setSelectedEmergencyContact(safetySettings.emergency_contact_id);
        setSelectedDriver(safetySettings.designated_driver_id);
        setTransportMode(safetySettings.transport_mode);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const handleSaveSettings = async () => {
    const success = await saveSafetySettings(selectedEmergencyContact, selectedDriver, transportMode);

    if (success) {
      Alert.alert("Success", "Safety settings saved successfully!");
    } else {
      Alert.alert("Error", "Failed to save safety settings.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="blue" />
        <Text style={styles.backButtonText}>{`${previousRouteName}`}</Text>
      </TouchableOpacity>

      {/* Header Card */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Ionicons name="shield-outline" size={50} style={styles.icon} />
          <Title style={styles.title}>Safety</Title>
          <Paragraph style={styles.paragraph}>
            Please input the details below to improve your safety.
          </Paragraph>
        </Card.Content>
      </Card>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <>
          {/* Emergency Contact Dropdown */}
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

          {/* Designated Driver Dropdown */}
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

          {/* Transport Mode Dropdown */}
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

          <Button mode="contained" onPress={handleSaveSettings} style={styles.button}>
            Save Settings
          </Button>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  card: {
    marginTop: 60,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  cardContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    textAlign: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 10,
  },
  backButtonText: {
    fontSize: 18,
    marginLeft: 5,
    color: "blue",
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  dropdown: {
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "blue",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});

export default SafetySettings;