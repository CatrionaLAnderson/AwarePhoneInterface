import { supabase } from "@/lib/supabase"; // Adjust the path if needed

// Define an interface for TypeScript safety
interface App {
  id: string;
  name: string;
  isRestricted: boolean;
}

export const fetchAppsWithRestrictions = async (existingApps: App[] = []): Promise<App[]> => {
  const { data, error } = await supabase
    .from("app_restrictions")
    .select("app_id, is_restricted");

  if (error) {
    console.error("Error fetching app restrictions:", error);
    return existingApps; // If an error occurs, return the previous state
  }

  // ✅ Merge restrictions with existing apps (to avoid full refetch)
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