import { supabase } from "@/lib/supabase";
import "react-native-get-random-values";

type TrackingEvent = {
  event_type: string; // Type of event (e.g., message, phone call, drunk mode)
  event_detail: string; // Details about the event
  duration?: string; // Optional: Duration or timestamp of the event
  message_preview?: string; // Optional: Preview of the message
  notification_content?: string; // Optional: Content of the notification
  contact_name?: string; // Optional: Contact name for phone calls
  phone_number?: string; // Optional: Phone number for tracking
};

// Log a tracking event to the "tracking_data" table
export const logTrackingEvent = async (event: TrackingEvent) => {
  try {
    const { error } = await supabase.from("tracking_data").insert([event]); // Insert event into the database
    if (error) console.error("Error logging event:", error); // Log error if insertion fails
  } catch (err) {
    console.error("Unexpected error:", err); // Log unexpected errors
  }
};

// Log the start of a drunk mode session
export const startDrunkModeSession = async () => {
  const startTime = new Date().toISOString(); // Get the current timestamp

  await logTrackingEvent({
    event_type: "drunk_mode", // Event type
    event_detail: "activated", // Event detail
    duration: startTime, // Log the start time
  });
};

// Log the end of a drunk mode session
export const endDrunkModeSession = async () => {
  const endTime = new Date().toISOString(); // Get the current timestamp

  await logTrackingEvent({
    event_type: "drunk_mode", // Event type
    event_detail: "deactivated", // Event detail
    duration: endTime, // Log the end time
  });
};