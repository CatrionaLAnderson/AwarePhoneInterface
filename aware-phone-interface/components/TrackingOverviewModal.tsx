import React, { useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { supabase } from "@/lib/supabase"; 
import Ionicons from "react-native-vector-icons/Ionicons";

interface TrackingEvent {
  id: string;
  event_type: string;
  event_detail: string;
  contact_name?: string;
  message_preview?: string;
  notification_content?: string;
  timestamp: string;
}

interface TrackingOverviewModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const TrackingOverviewModal: React.FC<TrackingOverviewModalProps> = ({ isVisible, onClose }) => {
  const [trackingData, setTrackingData] = useState<TrackingEvent[]>([]);
  const [duration, setDuration] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      // Get the most recent 'Drunk Mode activated' timestamp
      const { data: drunkModeActivatedData, error: activatedError } = await supabase
        .from("tracking_data")
        .select("*")
        .eq("event_type", "drunk_mode")
        .eq("event_detail", "activated")
        .order("timestamp", { ascending: false })
        .limit(1);  // Only get the most recent activation
  
      if (activatedError) {
        console.error("Error fetching Drunk Mode activation data:", activatedError);
        return;
      }
  
      // Get the most recent 'Drunk Mode deactivated' timestamp
      const { data: drunkModeDeactivatedData, error: deactivatedError } = await supabase
        .from("tracking_data")
        .select("*")
        .eq("event_type", "drunk_mode")
        .eq("event_detail", "deactivated")
        .order("timestamp", { ascending: false })
        .limit(1);  // Only get the most recent deactivation
  
      if (deactivatedError) {
        console.error("Error fetching Drunk Mode deactivation data:", deactivatedError);
        return;
      }
  
      // Fetch both message, phone call, and notification events during Drunk Mode
      const { data: messageData, error: messageError } = await supabase
        .from("tracking_data")
        .select("*")
        .or('event_type.eq.message,event_type.eq.phone_call,event_type.eq.notification_received')  // Include messages, phone calls, and notifications
        .gt("timestamp", drunkModeActivatedData[0]?.timestamp)  // Only after activation
        .lt("timestamp", drunkModeDeactivatedData[0]?.timestamp)  // Only before deactivation
        .order("timestamp", { ascending: true });  // Order chronologically
  
      if (messageError) {
        console.error("Error fetching message and phone call data:", messageError);
        return;
      }

      console.log("Fetched tracking data:", messageData);  // Debug log to check if notifications are present

      // Combine Drunk Mode, Message, Phone Call, and Notification events
      const allData = [
        ...drunkModeActivatedData,
        ...drunkModeDeactivatedData,
        ...messageData,  // Add both message, phone call, and notification events here
      ];

      if (drunkModeActivatedData && drunkModeActivatedData.length > 0 && drunkModeDeactivatedData && drunkModeDeactivatedData.length > 0) {
        const activationTimestamp = new Date(drunkModeActivatedData[0].timestamp);
        const deactivationTimestamp = new Date(drunkModeDeactivatedData[0].timestamp);
  
        // Calculate the difference between deactivation and activation timestamps
        const durationInMillis = deactivationTimestamp.getTime() - activationTimestamp.getTime();
        const hours = Math.floor(durationInMillis / 3600000); // 3600000 ms = 1 hour
        const minutes = Math.floor((durationInMillis % 3600000) / 60000); // 60000 ms = 1 minute
  
        setDuration(`${hours}h ${minutes}m`); // Set the duration in hours and minutes
        setTrackingData(allData);  // Set all data (Drunk Mode + Message + Phone Call + Notification events)
      }
    };
  
    if (isVisible) {
      fetchTrackingData();
    }
  }, [isVisible]);

  const renderItem = ({ item }: { item: TrackingEvent }) => {
    console.log("Rendering item:", item);  // Log each item to check if it's a notification event
    return (
      <View style={styles.item}>
        <View style={styles.eventHeader}>
          <Ionicons 
            name={item.event_type === "message" ? "chatbubble" :
                  item.event_type === "phone_call" ? "call" :
                  item.event_type === "notification_received" ? "notifications" : "notifications"} 
            size={20} 
            color="#007bff" 
          />
          <Text style={styles.eventType}>
            {item.event_type === "message"
              ? `Message to ${item.contact_name || "Unknown"}`
              : item.event_type === "phone_call"
              ? `Call to ${item.contact_name || "Unknown"}`
              : item.event_type === "notification_received"
              ? `Notification: ${item.notification_content || "Unknown"}`
              : item.event_detail === "activated"
              ? "Drunk Mode Activated"
              : item.event_detail === "deactivated"
              ? "Drunk Mode Deactivated"
              : item.event_detail}
          </Text>
        </View>
  
        {/* If it's a message or phone call, show the preview */}
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
  
        {/* Show notification content if exists */}
        {item.event_type === "notification_received" ? (
            <Text style={styles.messagePreview}>
                Notification: {item.notification_content || "No content available"}
            </Text>
            ) : null}
  
        <Text style={styles.timestamp}>Time: {new Date(item.timestamp).toLocaleString()}</Text>
      </View>
    );
  };


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Drunk Mode Activity</Text>
          {duration && (
            <Text style={styles.duration}>Duration: {duration}</Text>  
          )}
          <FlatList
            data={trackingData}
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