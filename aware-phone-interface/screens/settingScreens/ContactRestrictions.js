import React, { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet, TouchableOpacity, Switch, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchContactsWithRestrictions, toggleContactRestriction } from "@/services/ContactService";
import { Card, Title, Paragraph, List } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ContactRestrictions = ({ navigation }) => {
  const [contacts, setContacts] = useState([]); // State for storing contacts and their restriction status
  const [loading, setLoading] = useState(true); // Loading state to manage fetch process

  const previousRouteName = navigation.getState().routes[navigation.getState().index - 1]?.name || "Back";

  // Fetch contacts and their restriction status on component mount
  useEffect(() => {
    const loadContacts = async () => {
      setLoading(true);
      const fetchedContacts = await fetchContactsWithRestrictions();
      setContacts(fetchedContacts); // Store contacts with their restriction status
      setLoading(false); // Update loading state
    };

    loadContacts();
  }, []);

  // Toggle the restriction status for a contact
  const handleToggle = async (contactId, isBlocked) => {
    const success = await toggleContactRestriction(contactId, isBlocked); // Update restriction status in DB

    if (success) {
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === contactId ? { ...contact, isBlocked: isBlocked } : contact
        )
      );
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="blue" />
        <Text style={styles.backButtonText}>{previousRouteName}</Text>
      </TouchableOpacity>

      {/* Header Card */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Icon name="contacts" size={50} style={styles.icon} />
          <Title style={styles.title}>Contact Restrictions</Title>
          <Paragraph style={styles.paragraph}>
            Select which contacts you want to receive/block when Drunk Mode is enabled.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Loading or Contact List */}
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : contacts.length === 0 ? (
        <Text style={styles.noDataText}>No contacts found.</Text>
      ) : (
        <View style={styles.listSection}>
          <List.Section>
            {contacts.map((contact) => (
              <List.Item
                key={contact.id}
                title={contact.name || "Unknown Contact"}
                description={contact.phoneNumber || "No phone number"}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
                style={styles.listItem}
                right={() => (
                  <Switch
                    value={contact.isBlocked} // Toggle contact restriction status
                    onValueChange={(value) => handleToggle(contact.id, value)} // Update restriction status
                  />
                )}
              />
            ))}
          </List.Section>
        </View>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
    paddingLeft: 15,
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
  loadingText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: 'gray',
  },
  listSection: {
    marginVertical: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listItem: {
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  listTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
  listDescription: {
    color: 'gray',
    fontSize: 14,
  },
});

export default ContactRestrictions;