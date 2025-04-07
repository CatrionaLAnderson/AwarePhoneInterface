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
    event_type: "notification_received",
    event_detail: title,
    notification_content: body,
    timestamp: new Date().toISOString(),
  });
};

export const triggerDrunkModeAlerts = async () => {
  try {
    const { data, error } = await supabase.from("timed_alerts").select("*");

    if (error) {
      console.error("❌ Failed to fetch saved alerts:", error);
      return;
    }

    data.forEach((alert) => {
      Notifications.scheduleNotificationAsync({
        content: {
          title: alert.name,
          body: alert.message,
        },
        trigger: null, 
      });

      logTrackingEvent({
        event_type: "notification_received",
        event_detail: alert.name,
        notification_content: alert.message,
        timestamp: new Date().toISOString(),
      });
    });
  } catch (err) {
    console.error("❌ Error triggering drunk mode alerts:", err);
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

// Fetch all alerts from Supabase
export const fetchAlertsFromDB = async () => {
  const { data, error } = await supabase.from("timed_alerts").select("*");
  if (error) {
    console.error("❌ Error fetching alerts:", error);
    return [];
  }
  return data;
};

// Add new alert or update existing alert
export const addOrUpdateAlert = async (alertName, alertContent, id = null) => {
  if (id) {
    const { data, error } = await supabase
      .from("timed_alerts")
      .update({ name: alertName, message: alertContent })
      .eq("id", id)
      .select();

    if (error) {
      console.error("❌ Error updating alert:", error);
      return null;
    }

    return data[0];
  } else {
    const { data, error } = await supabase
      .from("timed_alerts")
      .insert([{ name: alertName, message: alertContent }])
      .select();

    if (error) {
      console.error("❌ Error adding alert:", error);
      return null;
    }

    return data[0];
  }
};

// Delete alert by ID
export const deleteAlertFromDB = async (id) => {
  const { error } = await supabase.from("timed_alerts").delete().eq("id", id);
  if (error) {
    console.error("❌ Error deleting alert:", error);
    return false;
  }
  return true;
};