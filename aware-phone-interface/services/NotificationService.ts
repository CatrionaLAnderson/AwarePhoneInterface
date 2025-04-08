import { supabase } from "@/lib/supabase"; // Adjust the path if needed

// Fetch all apps with their notification mute status
export const fetchAppsWithNotificationStatus = async () => {
  const { data: appsData, error: appsError } = await supabase
    .from("apps")
    .select("id, app_name"); // Fetch app IDs and names

  if (appsError) {
    console.error("Error fetching apps:", appsError); // Log error if fetching apps fails
    return []; // Return an empty array on error
  }

  const { data: notificationsData, error: notificationsError } = await supabase
    .from("notifications")
    .select("app_id, is_muted"); // Fetch notification mute statuses

  if (notificationsError) {
    console.error("Error fetching notifications:", notificationsError); // Log error if fetching notifications fails
    return []; // Return an empty array on error
  }

  // Merge app data with notification mute statuses
  return appsData.map((app) => {
    const notification = notificationsData.find((n) => n.app_id === app.id); // Find matching notification entry
    return {
      id: app.id,
      name: app.app_name,
      isMuted: notification ? notification.is_muted : false, // Default to false if no entry exists
    };
  });
};

// Toggle mute/unmute for a specific app's notifications
export const toggleNotificationMute = async (appId: string, currentValue: boolean) => {
  console.log("Toggling mute status for:", appId, "New Status:", !currentValue);

  // Check if a notification entry already exists
  const { data: existingEntry, error: fetchError } = await supabase
    .from("notifications")
    .select("id")
    .eq("app_id", appId)
    .maybeSingle();

  if (fetchError) {
    console.error("Error checking existing notification restriction:", fetchError); // Log error if fetching fails
    return false; // Return false on error
  }

  if (existingEntry) {
    // Update existing mute status
    const { error: updateError } = await supabase
      .from("notifications")
      .update({ is_muted: !currentValue })
      .eq("app_id", appId);

    if (updateError) {
      console.error("Error updating notification restriction:", updateError); // Log error if update fails
      return false; // Return false on error
    }
  } else {
    // Insert new mute status
    const { error: insertError } = await supabase
      .from("notifications")
      .insert([{ app_id: appId, is_muted: !currentValue }]);

    if (insertError) {
      console.error("Error inserting new notification restriction:", insertError); // Log error if insertion fails
      return false; // Return false on error
    }
  }

  return true; // Return true on success
};