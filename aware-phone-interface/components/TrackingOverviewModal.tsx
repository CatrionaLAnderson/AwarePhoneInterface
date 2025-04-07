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
  timestamp: string;
}

interface TrackingOverviewModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const getIconName = (item: TrackingEvent) => {
  if (item.event_type === "message") return "chatbubble";
  if (item.event_type === "phone_call") return "call";
  if (item.event_detail === "activated") return "checkmark-circle";
  if (item.event_detail === "deactivated") return "close-circle";
  return "alert-circle";
};

const TrackingOverviewModal: React.FC<TrackingOverviewModalProps> = ({ isVisible, onClose }) => {
  const [trackingData, setTrackingData] = useState<TrackingEvent[]>([]);
  const [duration, setDuration] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
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
  
        // Get activation and deactivation timestamps
        const activationTimestamp = new Date(drunkModeActivatedData[0].timestamp).toISOString();
        const deactivationTimestamp = new Date(drunkModeDeactivatedData[0].timestamp).toISOString();

        // Fetch message and phone call events during Drunk Mode
        const { data: messageData, error: messageError } = await supabase
          .from("tracking_data")
          .select("*")
          .or('event_type.eq.message,event_type.eq.phone_call')  // Include messages and phone calls
          .gt("timestamp", activationTimestamp)  // After activation
          .lt("timestamp", deactivationTimestamp)  // Before deactivation
          .order("timestamp", { ascending: true });  // Ensure ordering by timestamp
  
        if (messageError) {
          console.error("Error fetching message and phone call data:", messageError);
          return;
        }
  
        // Combine Drunk Mode, Message, and Phone Call events
        const allData = [
          ...drunkModeActivatedData,
          ...drunkModeDeactivatedData,
          ...messageData, 
        ];
  
        if (drunkModeActivatedData && drunkModeActivatedData.length > 0 && drunkModeDeactivatedData && drunkModeDeactivatedData.length > 0) {
          // Calculate the difference between deactivation and activation timestamps
          const durationInMillis = new Date(drunkModeDeactivatedData[0].timestamp).getTime() - new Date(drunkModeActivatedData[0].timestamp).getTime();
          const hours = Math.floor(durationInMillis / 3600000); // 3600000 ms = 1 hour
          const minutes = Math.floor((durationInMillis % 3600000) / 60000); // 60000 ms = 1 minute
  
          setDuration(`${hours}h ${minutes}m`); // Set the duration in hours and minutes
          setTrackingData(allData);  // Set all data (Drunk Mode + Message + Phone Call events)
        }
      } catch (err) {
        console.error("Error fetching tracking data:", err);
      }
    };
  
    if (isVisible) {
      fetchTrackingData();
    }
  }, [isVisible]);

  const renderItem = ({ item }: { item: TrackingEvent }) => {
    return (
      <View style={styles.item}>
        <View style={styles.eventHeader}>
          <Ionicons 
            name={getIconName(item)}
            size={20} 
            color="#007bff" 
          />
          <Text style={styles.eventType}>
            {item.event_type === "message"
              ? `Message to ${item.contact_name || "Unknown"}`
              : item.event_type === "phone_call"
              ? `Call to ${item.contact_name || "Unknown"}`
              : item.event_detail === "activated"
              ? "Drunk Mode Activated"
              : item.event_detail === "deactivated"
              ? "Drunk Mode Deactivated"
              : item.event_detail}
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