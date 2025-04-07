import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard 
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDrunkMode } from "@/constants/DrunkModeContext";
import { fetchContactsWithRestrictions } from "@/services/ContactService";
import { sendMessage, logMessageTrackingEvent } from "@/services/communicationService";
import DrunkDetectionService from "@/services/DrunkDetectionService";

const MessagingApp = ({ navigation }) => {
  const { isDrunkMode } = useDrunkMode();
  const previousRouteName = navigation.getState().routes[navigation.getState().index - 1]?.name || "Back";

  const [contacts, setContacts] = useState([]);
  const [restrictedContacts, setRestrictedContacts] = useState(new Set());
  const [currentContact, setCurrentContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [previousText, setPreviousText] = useState("");
  const [typoScore, setTypoScore] = useState(0);

  useEffect(() => {
    const loadContacts = async () => {
      const fetchedContacts = await fetchContactsWithRestrictions();
      setContacts(fetchedContacts);  // Store the contacts in state
    
      const blockedContacts = new Set(
        fetchedContacts.filter((contact) => contact.isBlocked).map((contact) => contact.id)
      );
      setRestrictedContacts(blockedContacts);
    };

    loadContacts();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const openChat = (contact) => {
    setCurrentContact({
      ...contact,
      contact_name: contact.name, // Add contact_name property here
    });  
    setMessages([
      { id: 1, text: "Hey! How are you?", sender: "them", timestamp: "10:00 AM" },
      { id: 2, text: "I'm good! You?", sender: "me", timestamp: "10:02 AM" },
    ]);
  };

  const handleSendMessage = async () => {
    console.log(currentContact);  // Log currentContact to verify if contact_name exists
    
    const updatedMessages = sendMessage(message, messages, isDrunkMode);
    const correctedMessage = updatedMessages[updatedMessages.length - 1]?.text || message;
    setMessages(updatedMessages);
    setMessage("");
  
    // Fetch contact name directly from currentContact (using `name` instead of `contact_name`)
    if (currentContact?.name) {
      await logMessageTrackingEvent(currentContact.name, correctedMessage);
    } else {
      console.error("❌ No contact name found for the message event.");
    }
  };

  const renderContactItem = ({ item }) => {
    const isRestricted = restrictedContacts.has(item.id) && isDrunkMode;
  
    return (
      <TouchableOpacity
        style={[styles.contactItem, isRestricted && styles.restricted]}
        onPress={() => openChat(item)}
        disabled={isRestricted}
      >
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
        </View>
        <Ionicons name="chatbubble" size={20} color={isRestricted ? "#999" : "#007bff"} />
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="blue" />
        <Text style={styles.backButtonText}>{previousRouteName}</Text>
      </TouchableOpacity>

      <Text style={styles.header}>{currentContact ? `Chat with ${currentContact.name}` : "Messages"}</Text>

      {currentContact ? (
        <>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.messageBubble, item.sender === "me" ? styles.myMessage : styles.theirMessage]}>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingVertical: 10 }}
            keyboardShouldPersistTaps="handled"
          />

          <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerRaised]}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={message}
              onChangeText={(text) => {
                setMessage(text);

                const backspaceUsed = previousText.length > text.length;
                const repeatedLetters = /(.)\1{2,}/.test(text);
                let score = 0;
                if (backspaceUsed) score += 1;
                if (repeatedLetters) score += 1;
                setTypoScore(score);
                setPreviousText(text);
                
                if (text.length > 5) {
                  DrunkDetectionService.startDetection({ typoScore: score });
                }
              }}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <FlatList data={contacts} keyExtractor={(item) => item.id.toString()} renderItem={renderContactItem} />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: "500",
  },
  phoneNumber: {
    fontSize: 14,
    color: "#666",
  },
  restricted: {
    backgroundColor: "#f8d7da",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: "blue",
    marginLeft: 5,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    maxWidth: "75%",
    alignSelf: "flex-start",
  },
  myMessage: {
    backgroundColor: "#007bff",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#e5e5ea",
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
  },
  timestamp: {
    fontSize: 12,
    color: "#ddd",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    backgroundColor: "#fff",
  },
  inputContainerRaised: {
    marginBottom: 60, // Moves up when keyboard appears
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: "500",
  },
  phoneNumber: {
    fontSize: 14,
    color: "#666",
  },
  restricted: {
    backgroundColor: "#f8d7da", // Light red for restricted contacts
  },
  designatedDriver: {
    backgroundColor: "#FFD700", // Gold background for designated driver
  },
  callButton: {
    backgroundColor: "#28a745", // Green button
    padding: 10,
    borderRadius: 50,
  },
  disabledButton: {
    backgroundColor: "#ccc", // Greyed out if restricted
  },
});

export default MessagingApp;