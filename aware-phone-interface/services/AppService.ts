import { supabase } from "@/lib/supabase"; // Adjust the path if needed

export const fetchAppsWithRestrictions = async () => {
  const { data, error } = await supabase
    .from("apps")
    .select("id, app_name, app_restrictions (is_restricted)");

  if (error) {
    console.error("Error fetching apps:", error);
    return [];
  }

  return data.map((app) => ({
    id: app.id,
    name: app.app_name,
    isRestricted: app.app_restrictions?.[0]?.is_restricted || false,
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