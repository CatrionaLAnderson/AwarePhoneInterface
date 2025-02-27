import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchContactsWithRestrictions, toggleContactRestriction } from "@/services/ContactService";

const ContactRestrictions = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const previousRouteName =
    navigation.getState().routes[navigation.getState().index - 1]?.name || "Back";

  useEffect(() => {
    const loadContacts = async () => {
      setLoading(true);
      const fetchedContacts = await fetchContactsWithRestrictions();
      setContacts(fetchedContacts);
      setLoading(false);
    };

    loadContacts();
  }, []);

  const handleToggle = async (contactId, isBlocked) => {
    const success = await toggleContactRestriction(contactId, isBlocked);

    if (success) {
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === contactId ? { ...contact, isBlocked: isBlocked } : contact
        )
      );
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.itemText}>{item.name || "Unknown Contact"}</Text>
        {item.phoneNumber ? <Text style={styles.phoneText}>{item.phoneNumber}</Text> : null}
      </View>
      <Switch value={item.isBlocked} onValueChange={(value) => handleToggle(item.id, value)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Restrictions</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="blue" />
        <Text style={styles.backButtonText}>{previousRouteName}</Text>
      </TouchableOpacity>

      <View style={styles.contactSelection}>
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : contacts.length === 0 ? (
          <Text style={styles.noContactsText}>No contacts found.</Text>
        ) : (
          <FlatList data={contacts} renderItem={renderItem} keyExtractor={(item) => item.id} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
    paddingLeft: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 60,
    paddingBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    left: 10,
  },
  backButtonText: {
    fontSize: 18,
    marginLeft: 5,
    color: 'blue',
  },
  contactSelection: {
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
  noContactsText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
  },
});

export default ContactRestrictions;