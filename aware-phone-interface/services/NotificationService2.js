import * as Notifications from "expo-notifications";
import { logTrackingEvent } from "./GlobalTracking";
import { supabase } from "../lib/supabase";

// Send a notification immediately and log it for tracking
export const sendNotification = async (title, body) => {
  // Send notification immediately
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null, // Send immediately
  });

  // Log the notification event
  await logTrackingEvent({
    event_type: "notification_received", // Event type
    event_detail: title, // Notification title
    notification_content: body, // Notification body
    timestamp: new Date().toISOString(), // Current timestamp
  });
};

// Trigger all saved drunk mode alerts and log them
export const triggerDrunkModeAlerts = async () => {
  try {
    const { data, error } = await supabase.from("timed_alerts").select("*");

    if (error) {
      console.error("❌ Failed to fetch saved alerts:", error); // Log error if fetching fails
      return;
    }

    // Schedule notifications for each alert
    data.forEach((alert) => {
      Notifications.scheduleNotificationAsync({
        content: {
          title: alert.name,
          body: alert.message,
        },
        trigger: null, // Send immediately
      });

      // Log the notification event
      logTrackingEvent({
        event_type: "notification_received",
        event_detail: alert.name,
        notification_content: alert.message,
        timestamp: new Date().toISOString(),
      });
    });
  } catch (err) {
    console.error("❌ Error triggering drunk mode alerts:", err); // Log unexpected errors
  }
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

// Notify when auto-correct is triggered and log it
export const notifyAutoCorrectUsage = async () => {
  // Send the auto-correct notification
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

// Schedule a reminder for auto-correct and log it
export const scheduleAutoCorrectReminder = async () => {
  // Schedule the reminder notification
  await scheduleTimedNotification(
    "Wallet & Keys Reminder",
    "👜 Drunk Mode here! Do you have your phone, keys, and wallet? Triple-check before moving!",
    300 // Reminder after 5 minutes
  );
};

// Fetch all alerts from the database
export const fetchAlertsFromDB = async () => {
  const { data, error } = await supabase.from("timed_alerts").select("*");
  if (error) {
    console.error("❌ Error fetching alerts:", error); // Log error if fetching fails
    return [];
  }
  return data; // Return fetched alerts
};

// Add or update an alert in the database
export const addOrUpdateAlert = async (alertName, alertContent, id = null) => {
  if (id) {
    // Update an existing alert
    const { data, error } = await supabase
      .from("timed_alerts")
      .update({ name: alertName, message: alertContent })
      .eq("id", id)
      .select();

    if (error) {
      console.error("❌ Error updating alert:", error); // Log error if update fails
      return null;
    }

    return data[0]; // Return updated alert
  } else {
    // Add a new alert
    const { data, error } = await supabase
      .from("timed_alerts")
      .insert([{ name: alertName, message: alertContent }])
      .select();

    if (error) {
      console.error("❌ Error adding alert:", error); // Log error if insertion fails
      return null;
    }

    return data[0]; // Return newly added alert
  }
};

// Delete an alert by its ID
export const deleteAlertFromDB = async (id) => {
  const { error } = await supabase.from("timed_alerts").delete().eq("id", id);
  if (error) {
    console.error("❌ Error deleting alert:", error); // Log error if deletion fails
    return false; // Return false on error
  }
  return true; // Return true on success
};