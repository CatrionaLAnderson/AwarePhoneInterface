import * as Notifications from "expo-notifications";

// Send a notification immediately
export const sendNotification = async (title, body) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null, // Send immediately
  });
};

// Schedule a time-based notification (No TypeScript!)
export const scheduleTimedNotification = async (title, body, seconds) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds, repeats: false }, // ✅ No TypeScript, just JavaScript
  });
};

// Message Auto-Correct Trigger Notification
export const notifyAutoCorrectUsage = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Drunk Mode Auto-Correct",
      body: "📝Oops! We fixed that for you. Wanna check?",
    },
    trigger: null, // Send immediately
  });
};

// Scheduled Auto-Correct Reminder
export const scheduleAutoCorrectReminder = async () => {
  await scheduleTimedNotification(
    "Wallet & Keys Reminder",
    "👜 Drunk Mode here! Do you have your phone, keys, and wallet? Triple-check before moving!",
    300
  );
};