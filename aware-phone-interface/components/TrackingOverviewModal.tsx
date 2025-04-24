import React, { useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { supabase } from "@/lib/supabase"; // Supabase client to interact with the database
import Ionicons from "react-native-vector-icons/Ionicons"; // For using icons in the UI

// Define the shape of the data for a tracking event
interface TrackingEvent {
  id: string;
  event_type: string;
  event_detail: string;
  contact_name?: string;
  message_preview?: string;
  notification_content?: string; 
  timestamp: string;
}

// Define props expected by the component
interface TrackingOverviewModalProps {
  isVisible: boolean; // Whether the modal is visible
  onClose: () => void; // Callback to close the modal
}

// Function to get appropriate icon name based on event type and details
const getIconName = (item: TrackingEvent) => {
  if (item.event_type === "message") return "chatbubble";
  if (item.event_type === "phone_call") return "call";
  if (item.event_type === "notification_received") return "notifications";
  if (item.event_detail === "activated") return "checkmark-circle";
  if (item.event_detail === "deactivated") return "close-circle";
  return "alert-circle"; // Default icon for other events
};

const TrackingOverviewModal: React.FC<TrackingOverviewModalProps> = ({ isVisible, onClose }) => {
  const [trackingData, setTrackingData] = useState<TrackingEvent[]>([]); // State to store tracking data
  const [duration, setDuration] = useState<string | null>(null); // State to store the duration of Drunk Mode

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        // Fetch the most recent Drunk Mode activation event
        const { data: drunkModeActivatedData, error: activatedError } = await supabase
          .from("tracking_data")
          .select("*")
          .eq("event_type", "drunk_mode")
          .eq("event_detail", "activated")
          .order("timestamp", { ascending: false })
          .limit(1);
  
        if (activatedError) {
          console.error("Error fetching Drunk Mode activation data:", activatedError);
          return;
        }
        console.log("Drunk Mode ACTIVATED Query Result:", drunkModeActivatedData);
        console.log("Activated error:", activatedError);
  
        // Fetch the most recent Drunk Mode deactivation event
        const { data: drunkModeDeactivatedData, error: deactivatedError } = await supabase
          .from("tracking_data")
          .select("*")
          .eq("event_type", "drunk_mode")
          .eq("event_detail", "deactivated")
          .order("timestamp", { ascending: false })
          .limit(1);
  
        if (deactivatedError) {
          console.error("Error fetching Drunk Mode deactivation data:", deactivatedError);
          return;
        }
        console.log("Drunk Mode DEACTIVATED Query Result:", drunkModeDeactivatedData);
        console.log("Deactivated error:", deactivatedError);
  
        // Guard clause for missing activation or deactivation data
        if (!drunkModeActivatedData?.length || !drunkModeDeactivatedData?.length) {
          console.warn("Missing activation or deactivation data. Skipping tracking data fetch.");
          return;
        }
        // Get the timestamps of activation and deactivation
        const activationTimestamp = new Date(drunkModeActivatedData[0].timestamp).toISOString();
        const deactivationBuffer = new Date(new Date(drunkModeDeactivatedData[0].timestamp).getTime() + 5000); // +5 seconds
        const deactivationTimestamp = deactivationBuffer.toISOString();

        // Fetch messages and phone calls that happened between activation and deactivation
        const { data: messageData, error: messageError } = await supabase
          .from("tracking_data")
          .select("*")
          .or('event_type.eq.message,event_type.eq.phone_call,event_type.eq.notification_received,event_type.eq.notification,event_type.eq.system_notification') // Include messages, phone calls, and notifications
          .gt("timestamp", activationTimestamp) // After activation
          .lt("timestamp", deactivationTimestamp) // Before deactivation
          .order("timestamp", { ascending: true });
        console.log("ALL messageData:", messageData);

        if (messageError) {
          console.error("Error fetching message and phone call data:", messageError);
          return;
        }
        console.log("Activated:", drunkModeActivatedData);
        console.log("Deactivated:", drunkModeDeactivatedData);
        console.log("Notifications in range:", messageData.filter(i => i.event_type === "notification_received"));
  
        // Combine Drunk Mode, message, and phone call data
        const allData = [
          ...drunkModeActivatedData,
          ...drunkModeDeactivatedData,
          ...messageData,
        ];
  
        if (drunkModeActivatedData && drunkModeDeactivatedData) {
          // Calculate the duration between activation and deactivation in hours and minutes
          const durationInMillis = new Date(drunkModeDeactivatedData[0].timestamp).getTime() - new Date(drunkModeActivatedData[0].timestamp).getTime();
          const hours = Math.floor(durationInMillis / 3600000);
          const minutes = Math.floor((durationInMillis % 3600000) / 60000);
  
          setDuration(`${hours}h ${minutes}m`); // Set the duration
          setTrackingData(allData); // Set all data for rendering
        }
      } catch (err) {
        console.error("Error fetching tracking data:", err);
      }
    };
  
    if (isVisible) {
      fetchTrackingData(); // Fetch tracking data when the modal is visible
    }
  }, [isVisible]);

  // Render each tracking event
  const renderItem = ({ item }: { item: TrackingEvent }) => {
    return (
      <View style={styles.item}>
        <View style={styles.eventHeader}>
          <Ionicons
            name={getIconName(item)} // Get appropriate icon based on event type
            size={20}
            color="#007bff"
          />
          <Text style={styles.eventType}>
            {String(
              item.event_type === "message"
                ? `Message to ${item.contact_name || "Unknown"}`
                : item.event_type === "phone_call"
                ? `Call to ${item.contact_name || "Unknown"}`
                : item.event_type === "notification_received"
                ? "Notification Received"
                : item.event_detail === "activated"
                ? "Drunk Mode Activated"
                : item.event_detail === "deactivated"
                ? "Drunk Mode Deactivated"
                : item.event_detail || ""
            )}
          </Text>
        </View>

        {item.event_type === "message" && item.message_preview && (
          <Text style={styles.messagePreview}>
            Message Preview: {item.message_preview}
          </Text>
        )}

        {item.event_type === "phone_call" && (
          <Text style={styles.messagePreview}>
            Phone call to: {item.contact_name}
          </Text>
        )}

        {item.event_type.includes("notification") && (
          <Text style={styles.messagePreview}>
            Notification: {item.notification_content || item.event_detail || "No details"}
          </Text>
        )}

        <Text style={styles.timestamp}>Time: {new Date(item.timestamp).toLocaleString()}</Text>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose} // Close modal when requested
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Drunk Mode Activity</Text>
          {duration && (
            <Text style={styles.duration}>Duration: {duration}</Text>
          )}
          <FlatList
            data={trackingData} // Display tracking data in a list
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "70%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  list: {
    marginTop: 10,
  },
  item: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  eventType: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#007bff",
  },
  messagePreview: {
    fontSize: 14,
    color: "#555",
  },
  duration: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 15,
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default TrackingOverviewModal;