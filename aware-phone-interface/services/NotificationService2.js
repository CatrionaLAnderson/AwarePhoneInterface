import * as Notifications from "expo-notifications";
import { logTrackingEvent } from "./GlobalTracking";

// Send a notification immediately and log it for tracking
export const sendNotification = async (title, body) => {
  // Send notification immediately
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null, // Send immediately
  });

  // Log the notification event
  await logTrackingEvent({
    event_type: "notification_received",
    event_detail: title,
    notification_content: body,
    timestamp: new Date().toISOString(),
  });
};

// Schedule a time-based notification and log it
export const scheduleTimedNotification = async (title, body, seconds) => {
  // Schedule the notification
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds, repeats: false }, // Send after the given time
  });

  // Log the notification event
  await logTrackingEvent({
    event_type: "notification_received",
    event_detail: title,
    notification_content: body,
    timestamp: new Date().toISOString(),
  });
};

// Message Auto-Correct Trigger Notification and log it
export const notifyAutoCorrectUsage = async () => {
  // Schedule the auto-correct notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Drunk Mode Auto-Correct",
      body: "📝Oops! We fixed that for you. Wanna check?",
    },
    trigger: null, // Send immediately
  });

  // Log the notification event
  await logTrackingEvent({
    event_type: "notification_received",
    event_detail: "Drunk Mode Auto-Correct Triggered",
    notification_content: "📝Oops! We fixed that for you. Wanna check?",
    timestamp: new Date().toISOString(),
  });
};

// Scheduled Auto-Correct Reminder and log it
export const scheduleAutoCorrectReminder = async () => {
  // Schedule the reminder notification
  await scheduleTimedNotification(
    "Wallet & Keys Reminder",
    "👜 Drunk Mode here! Do you have your phone, keys, and wallet? Triple-check before moving!",
    300
  );
};