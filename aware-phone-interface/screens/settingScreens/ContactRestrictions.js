import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { supabase } from '../../lib/supabase'; // Import Supabase client

const ContactRestrictions = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const previousRouteName =
    navigation.getState().routes[navigation.getState().index - 1]?.name || 'Back';

    useEffect(() => {
      const fetchContactsWithRestrictions = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('contacts')
          .select('id, contact_name, phone_number, contact_restrictions (is_blocked)');
    
        console.log("Fetched Contacts:", data); // Add this line for debugging
    
        if (error) {
          console.error('Error fetching contacts:', error);
        } else {
          const formattedContacts = data.map((contact) => ({
            id: contact.id,
            name: contact.contact_name,
            phoneNumber: contact.phone_number,
            isBlocked: contact.contact_restrictions?.[0]?.is_blocked ?? false, 
          }));
          setContacts(formattedContacts);
        }
        setLoading(false);
      };
    
      fetchContactsWithRestrictions();
    }, []);

    const handleToggle = async (contactId, isBlocked) => {
      console.log('Toggling restriction for:', contactId, 'New Status:', isBlocked);
    
      // Check if restriction exists
      const { data: existingEntry, error: fetchError } = await supabase
        .from('contact_restrictions')
        .select('id')
        .eq('contact_id', contactId)
        .maybeSingle();
    
      if (fetchError) {
        console.error('Error checking existing restriction:', fetchError);
        return;
      }
    
      if (existingEntry) {
            // UPDATE if the row already exists
            const { error: updateError } = await supabase
              .from('contact_restrictions')
              .update({ is_blocked: isBlocked })
              .eq('contact_id', contactId);
        
            if (updateError) {
              console.error('Error updating contact restriction:', updateError);
            } else {
              console.log('Successfully updated restriction.');
            }
          } else {
            // INSERT if the row does not exist
            const { error: insertError } = await supabase
              .from('contact_restrictions')
              .insert([{ contact_id: contactId, is_blocked: isBlocked }]);
        
            if (insertError) {
              console.error('Error inserting new restriction:', insertError);
            } else {
              console.log('Successfully added new restriction.');
            }
          }
        };


        const renderItem = ({ item }) => (
          <View style={styles.item}>
            <View>
              {/* Ensure name and phoneNumber are not null */}
              <Text style={styles.itemText}>{item.name || 'Unknown Contact'}</Text>
              {item.phoneNumber ? (
                <Text style={styles.phoneText}>{item.phoneNumber}</Text>
              ) : null}
            </View>
            <Switch
              value={item.isBlocked}
              onValueChange={(value) => {
                handleToggle(item.id, value);
                setContacts((prevContacts) =>
                  prevContacts.map((contact) =>
                    contact.id === item.id ? { ...contact, isBlocked: value } : contact
                  )
                );
              }}
            />
          </View>
        );

  return (
    <View style={styles.container}>
      {/* Back Button & Title */}
      <Text style={styles.title}>Contact Restrictions</Text>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="blue" />
        <Text style={styles.backButtonText}>{previousRouteName}</Text>
      </TouchableOpacity>

      <View style={styles.contactSelection}>
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : contacts.length === 0 ? (
          <Text style={styles.noContactsText}>No contacts found.</Text>
        ) : (
          <FlatList
            data={contacts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
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