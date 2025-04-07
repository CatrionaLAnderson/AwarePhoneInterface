import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, Modal 
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDrunkMode } from "@/constants/DrunkModeContext"; // Access Drunk Mode context
import { fetchContactsWithRestrictions } from "@/services/ContactService"; // Fetch contacts with restrictions
import { logCallTrackingEvent } from "@/services/communicationService"; // Log call tracking event

const PhoneApp = ({ navigation }) => {
  const { isDrunkMode } = useDrunkMode(); // Drunk Mode state

  const previousRouteName = navigation.getState().routes[navigation.getState().index - 1]?.name || "Back"; // Navigation state

  // State for contacts, restricted contacts, and modal visibility
  const [contacts, setContacts] = useState([]);
  const [restrictedContacts, setRestrictedContacts] = useState(new Set()); // Fast lookup for restricted contacts
  const [modalVisible, setModalVisible] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);

  // Fetch contacts and restrictions on initial load
  useEffect(() => {
    const loadContacts = async () => {
      const fetchedContacts = await fetchContactsWithRestrictions(); // Fetch contacts
      setContacts(fetchedContacts);

      // Filter out restricted contacts
      const blockedContacts = new Set(
        fetchedContacts.filter((contact) => contact.isBlocked).map((contact) => contact.id)
      );
      setRestrictedContacts(blockedContacts);
    };

    loadContacts();
  }, []);

  // Handle call press, show modal, and log event
  const handleCallPress = async (contact) => {
    setCurrentContact(contact); // Set current contact
    setModalVisible(true); // Show modal
    
    // Log the call event
    if (contact) {
      await logCallTrackingEvent(contact.name);
    }
  };

  // Render each contact item, apply restricted styles if necessary
  const renderItem = ({ item }) => {
    const isRestricted = restrictedContacts.has(item.id) && isDrunkMode; // Block calls if restricted in Drunk Mode
    console.log(`🔍 Checking contact ${item.name} (ID: ${item.id}):`, isRestricted ? "Restricted" : "Not Restricted"); // Debug log

    return (
      <View style={[styles.contactItem, isRestricted && styles.restricted]}>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.callButton, isRestricted && styles.disabledButton]} // Apply disabled styles if restricted
          onPress={() => handleCallPress(item)} 
          disabled={isRestricted}
        >
          <Ionicons name="call" size={20} color={isRestricted ? "#999" : "#fff"} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="blue" />
        <Text style={styles.backButtonText}>{previousRouteName}</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Phone</Text>

      {/* Render contacts list */}
      <FlatList data={contacts} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />

      {/* Modal for Calling */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.callingText}>Calling {currentContact?.name}...</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.exitButton}>
              <Text style={styles.exitButtonText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '500',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#666',
  },
  restricted: {
    backgroundColor: '#f8d7da', // Light red for restricted contacts
  },
  callButton: {
    backgroundColor: '#28a745', // Green button
    padding: 10,
    borderRadius: 50,
  },
  disabledButton: {
    backgroundColor: '#ccc', // Greyed out if restricted
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: 'blue',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  callingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  exitButton: {
    backgroundColor: '#dc3545', // Red button
    padding: 10,
    borderRadius: 5,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PhoneApp;