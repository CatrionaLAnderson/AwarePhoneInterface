import { supabase } from "@/lib/supabase";

// Define a TypeScript interface for safety settings
interface SafetySettings {
  emergency_contact_id: string | null;
  designated_driver_id: string | null;
  transport_mode: string | null;
}

// Fetch Safety Settings
export const fetchSafetySettings = async (): Promise<SafetySettings> => {
  const { data, error } = await supabase
    .from("safety_settings")
    .select("*")
    .order("id", { ascending: false }) // ✅ Ensures latest row is selected
    .limit(1) // ✅ Only fetch one row
    .single(); // ✅ Ensures we return an object, not an array

  if (error) {
    console.error("Error fetching safety settings:", error);
    return { emergency_contact_id: null, designated_driver_id: null, transport_mode: null };
  }

  return data;
};

// Save Safety Settings
export const saveSafetySettings = async (
  emergencyContactId: string | null,
  driverId: string | null,
  transportMode: string | null
): Promise<boolean> => {
  const { error } = await supabase.from("safety_settings").upsert([
    {
      emergency_contact_id: emergencyContactId,
      designated_driver_id: driverId,
      transport_mode: transportMode,
    },
  ]);

  if (error) {
    console.error("Error saving safety settings:", error);
    return false;
  }
  
  return true;
};