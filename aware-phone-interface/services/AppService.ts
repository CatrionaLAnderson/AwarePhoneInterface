import { supabase } from "@/lib/supabase"; 

// Define App Type
interface App {
  id: string;
  name: string;
  colour: string;
  icon: string;
  isRestricted?: boolean; // Indicates if the app is restricted
}

// Fetch all apps from the "apps" table
export const fetchAllApps = async (): Promise<App[]> => {
  const { data, error } = await supabase
    .from("apps")
    .select("id, app_name, colour, icon");

  if (error) {
    console.error("Error fetching apps:", error);
    return [];
  }

  // Map database fields to App interface
  return data.map((app) => ({
    id: app.id,
    name: app.app_name,
    colour: app.colour || "#707B7C", // Default colour if none provided
    icon: app.icon || "help", // Default icon if none provided
  }));
};

// Fetch app restrictions and merge with existing apps
export const fetchAppRestrictions = async (existingApps: App[]): Promise<App[]> => {
  const { data, error } = await supabase
    .from("app_restrictions")
    .select("app_id, is_restricted");

  if (error) {
    console.error("Error fetching app restrictions:", error);
    return existingApps; // Return existing apps if an error occurs
  }

  // Merge restriction data with existing apps
  return existingApps.map((app) => ({
    ...app,
    isRestricted: data.find((restriction) => restriction.app_id === app.id)?.is_restricted || false,
  }));
};

// Toggle restriction status for a specific app
export const toggleAppRestriction = async (appId: string, isRestricted: boolean) => {
  console.log("Toggling restriction for:", appId, "New Status:", isRestricted);

  // Check if a restriction entry already exists
  const { data: existingEntry, error: fetchError } = await supabase
    .from("app_restrictions")
    .select("id")
    .eq("app_id", appId)
    .maybeSingle();

  if (fetchError) {
    console.error("Error checking existing restriction:", fetchError);
    return false;
  }

  if (existingEntry) {
    // Update existing restriction
    const { error: updateError } = await supabase
      .from("app_restrictions")
      .update({ is_restricted: isRestricted })
      .eq("app_id", appId);

    if (updateError) {
      console.error("Error updating app restriction:", updateError);
      return false;
    }
  } else {
    // Insert new restriction
    const { error: insertError } = await supabase
      .from("app_restrictions")
      .insert([{ app_id: appId, is_restricted: isRestricted }]);

    if (insertError) {
      console.error("Error inserting new restriction:", insertError);
      return false;
    }
  }

  return true; // Return success
};

// Subscribe to real-time updates for app restrictions
export const subscribeToAppRestrictions = (callback: () => void) => {
  const subscription = supabase
    .channel("realtime_app_restrictions") // Unique channel name
    .on("postgres_changes", { event: "*", schema: "public", table: "app_restrictions" }, callback)
    .subscribe();

  // Return a function to unsubscribe
  return () => {
    supabase.removeChannel(subscription);
  };
};