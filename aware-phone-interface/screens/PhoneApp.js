import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, Modal 
} from 'react-native';
import { supabase } from '../lib/supabase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDrunkMode } from "../constants/DrunkModeContext"; // Import Drunk Mode context

const PhoneApp = ({ navigation }) => {
  const { isDrunkMode } = useDrunkMode(); // Use global drunk mode state

  const previousRouteName = navigation.getState().routes[navigation.getState().index - 1]?.name || 'Back';

  const [contacts, setContacts] = useState([]);
  const [restrictedContacts, setRestrictedContacts] = useState(new Set()); // Use a Set for fast lookup
  const [modalVisible, setModalVisible] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase.from('contacts').select('*');
      if (!error) {
        console.log("📞 Fetched Contacts:", data); // Debug log
        setContacts(data);
      }
    };

    const fetchRestrictedContacts = async () => {
      const { data, error } = await supabase
        .from('contact_restrictions')
        .select('contact_id, is_blocked');

      if (!error) {
        console.log("🚫 Fetched Restricted Contacts:", data); // Debug log

        // Filter only contacts where `is_blocked` is TRUE
        const blockedContacts = new Set(
          data.filter(contact => contact.is_blocked).map(contact => contact.contact_id)
        );

        setRestrictedContacts(blockedContacts);
      }
    };

    fetchContacts();
    fetchRestrictedContacts();
  }, []);

  const handleCallPress = (contact) => {
    setCurrentContact(contact);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => {
    const isRestricted = restrictedContacts.has(item.id) && isDrunkMode; // Only block if in Drunk Mode
    console.log(`🔍 Checking contact ${item.contact_name} (ID: ${item.id}):`, isRestricted ? "Restricted" : "Not Restricted"); // Debug log

    return (
      <View style={[styles.contactItem, isRestricted && styles.restricted]}>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.contact_name}</Text>
          <Text style={styles.phoneNumber}>{item.phone_number}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.callButton, isRestricted && styles.disabledButton]} 
          onPress={() => handleCallPress(item)} 
          disabled={isRestricted}
        >
          <Ionicons name="call" size={20} color={isRestricted ? '#999' : '#fff'} />
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

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      {/* Modal for Calling */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.callingText}>Calling {currentContact?.contact_name}...</Text>
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