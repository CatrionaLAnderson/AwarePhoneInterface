import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export default function NotificationHandler() {
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Listen for notifications while the app is open
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log("🔔 Notification received:", notification);
    });

    // Handle when user taps a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("📲 User tapped notification:", response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return null; // This component doesn’t render anything
}

// Request notification permissions
async function registerForPushNotificationsAsync() {
  if (Platform.OS === "ios") {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("⚠️ Please enable notifications in Settings.");
      return;
    }
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
}