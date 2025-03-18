import { fuzzyCorrectWord } from "./fuzzyMatching";
import { notifyAutoCorrectUsage } from "./NotificationService2"; // Import notification function

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