import { fuzzyCorrectWord } from "./fuzzyMatching";
import { notifyAutoCorrectUsage } from "./NotificationService2"; // Import notification function
import { logTrackingEvent } from "./GlobalTracking";

export interface Message {
  id: number;
  text: string;
  sender: "me" | "them";
  timestamp: string;
}

// Correct an entire message using fuzzy matching
export const correctDrunkMessage = (message: string): string => {
  const correctedMessage = message.split(" ").map(fuzzyCorrectWord).join(" ");

  // Notify if corrections were made
  if (correctedMessage !== message) {
    console.log("Drunk Mode Auto-Correct Triggered! Sending Notification...");
    notifyAutoCorrectUsage(); // Trigger the notification
  }

  return correctedMessage; // Return the corrected message
};

// Send a message (with optional drunk mode corrections)
export const sendMessage = (
  message: string,
  messages: Message[],
  isDrunkMode: boolean
): Message[] => {
  if (!message.trim()) return messages; // Ignore empty messages

  // Correct the message if drunk mode is active
  const correctedMessage = isDrunkMode ? correctDrunkMessage(message) : message;

  // Create a new message object
  const newMessage: Message = {
    id: messages.length + 1,
    text: correctedMessage,
    sender: "me",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  return [...messages, newMessage]; // Add the new message to the list
};

// Log a tracking event for a sent message
export const logMessageTrackingEvent = async (contactName: string, message: string) => {
  await logTrackingEvent({
    event_type: "message",
    event_detail: `Message to ${contactName || "Unknown"}`, // Log contact name
    message_preview: message.slice(0, 50), // Include a preview of the message
    contact_name: contactName || "Unknown", // Default to "Unknown" if no contact name
  });
};

// Log a tracking event for a phone call
export const logCallTrackingEvent = async (contactName: string) => {
  await logTrackingEvent({
    event_type: "phone_call",
    event_detail: `Call to ${contactName || "Unknown"}`, // Log contact name
    contact_name: contactName || "Unknown", // Default to "Unknown" if no contact name
  });
};