import { supabase } from "@/lib/supabase"; 

// Define App Type
interface App {
  id: string;
  name: string;
  colour: string;
  icon: string;
  isRestricted?: boolean;
}

// Fetch all apps from "apps" table (only once on Home Screen load)
export const fetchAllApps = async (): Promise<App[]> => {
  const { data, error } = await supabase
    .from("apps")
    .select("id, app_name, colour, icon");

  if (error) {
    console.error("Error fetching apps:", error);
    return [];
  }

  return data.map((app) => ({
    id: app.id,
    name: app.app_name,
    colour: app.colour || "#707B7C",
    icon: app.icon || "help",
  }));
};

// Fetch ONLY app restrictions and merge with existing apps
export const fetchAppRestrictions = async (existingApps: App[]): Promise<App[]> => {
  const { data, error } = await supabase
    .from("app_restrictions")
    .select("app_id, is_restricted");

  if (error) {
    console.error("Error fetching app restrictions:", error);
    return existingApps; // Return previous apps if an error occurs
  }

  // Merge restriction data with existing apps
  return existingApps.map((app) => ({
    ...app,
    isRestricted: data.find((restriction) => restriction.app_id === app.id)?.is_restricted || false,
  }));
};

export const toggleAppRestriction = async (appId: string, isRestricted: boolean) => {
  console.log("Toggling restriction for:", appId, "New Status:", isRestricted);

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
    const { error: updateError } = await supabase
      .from("app_restrictions")
      .update({ is_restricted: isRestricted })
      .eq("app_id", appId);

    if (updateError) {
      console.error("Error updating app restriction:", updateError);
      return false;
    }
  } else {
    const { error: insertError } = await supabase
      .from("app_restrictions")
      .insert([{ app_id: appId, is_restricted: isRestricted }]);

    if (insertError) {
      console.error("Error inserting new restriction:", insertError);
      return false;
    }
  }

  return true;
};

//Correctly export `subscribeToAppRestrictions`
export const subscribeToAppRestrictions = (callback: () => void) => {
  const subscription = supabase
    .channel("realtime_app_restrictions") // Give a unique name
    .on("postgres_changes", { event: "*", schema: "public", table: "app_restrictions" }, callback)
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};