import { supabase } from "@/lib/supabase"; // Adjust the path if needed

// Fetch all apps with their notification mute status
export const fetchAppsWithNotificationStatus = async () => {
  const { data: appsData, error: appsError } = await supabase
    .from("apps")
    .select("id, app_name");

  if (appsError) {
    console.error("Error fetching apps:", appsError);
    return [];
  }

  const { data: notificationsData, error: notificationsError } = await supabase
    .from("notifications")
    .select("app_id, is_muted");

  if (notificationsError) {
    console.error("Error fetching notifications:", notificationsError);
    return [];
  }

  return appsData.map((app) => {
    const notification = notificationsData.find((n) => n.app_id === app.id);
    return {
      id: app.id,
      name: app.app_name,
      isMuted: notification ? notification.is_muted : false, // Default to false if missing
    };
  });
};

// Toggle mute/unmute for a specific app's notifications
export const toggleNotificationMute = async (appId: string, currentValue: boolean) => {
  console.log("Toggling mute status for:", appId, "New Status:", !currentValue);

  const { data: existingEntry, error: fetchError } = await supabase
    .from("notifications")
    .select("id")
    .eq("app_id", appId)
    .maybeSingle();

  if (fetchError) {
    console.error("Error checking existing notification restriction:", fetchError);
    return false;
  }

  if (existingEntry) {
    const { error: updateError } = await supabase
      .from("notifications")
      .update({ is_muted: !currentValue })
      .eq("app_id", appId);

    if (updateError) {
      console.error("Error updating notification restriction:", updateError);
      return false;
    }
  } else {
    const { error: insertError } = await supabase
      .from("notifications")
      .insert([{ app_id: appId, is_muted: !currentValue }]);

    if (insertError) {
      console.error("Error inserting new notification restriction:", insertError);
      return false;
    }
  }

  return true;
};