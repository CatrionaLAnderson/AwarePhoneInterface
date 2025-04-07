import { fuzzyCorrectWord } from "./fuzzyMatching";
import { notifyAutoCorrectUsage } from "./NotificationService2"; // Import notification function
import { logTrackingEvent } from "./GlobalTracking";

export interface Message {
  id: number;
  text: string;
  sender: "me" | "them";
  timestamp: string;
}

// Function to correct an entire message
export const correctDrunkMessage = (message: string): string => {
  const correctedMessage = message.split(" ").map(fuzzyCorrectWord).join(" ");

  // ✅ Send notification ONLY if corrections were made
  if (correctedMessage !== message) {
    console.log("🛑 Drunk Mode Auto-Correct Triggered! Sending Notification...");
    notifyAutoCorrectUsage(); // Trigger the notification
  }

  return correctedMessage;
};

// Function to send a message
export const sendMessage = (
  message: string,
  messages: Message[],
  isDrunkMode: boolean
): Message[] => {
  if (!message.trim()) return messages; // Ignore empty messages

  const correctedMessage = isDrunkMode ? correctDrunkMessage(message) : message;

  const newMessage: Message = {
    id: messages.length + 1,
    text: correctedMessage,
    sender: "me",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  return [...messages, newMessage];
};

export const logMessageTrackingEvent = async (contactName: string, message: string) => {
  await logTrackingEvent({
    event_type: "message",
    event_detail: `Message to ${contactName || "Unknown"}`,
    message_preview: message.slice(0, 50),
    contact_name: contactName || "Unknown",
  });
};

export const logCallTrackingEvent = async (contactName: string) => {
  await logTrackingEvent({
    event_type: "phone_call",
    event_detail: `Call to ${contactName || "Unknown"}`,
    contact_name: contactName || "Unknown",
  });
};