import { supabase } from "@/lib/supabase";

// Define a TypeScript interface for safety settings
interface SafetySettings {
  emergency_contact_id: string | null; // ID of the emergency contact
  designated_driver_id: string | null; // ID of the designated driver
  transport_mode: string | null; // Preferred transport mode (e.g., taxi, walk)
}

// Fetch Safety Settings
export const fetchSafetySettings = async (): Promise<SafetySettings> => {
  const { data, error } = await supabase
    .from("safety_settings")
    .select("*")
    .order("id", { ascending: false }) // Fetch the latest row
    .limit(1) // Only fetch one row
    .single(); // Return an object instead of an array

  if (error) {
    console.error("Error fetching safety settings:", error); // Log error if fetching fails
    return { emergency_contact_id: null, designated_driver_id: null, transport_mode: null }; // Return default values on error
  }

  return data; // Return the fetched safety settings
};

// Save Safety Settings
export const saveSafetySettings = async (
  emergencyContactId: string | null,
  driverId: string | null,
  transportMode: string | null
): Promise<boolean> => {
  const { error } = await supabase.from("safety_settings").upsert([
    {
      emergency_contact_id: emergencyContactId, // Save emergency contact ID
      designated_driver_id: driverId, // Save designated driver ID
      transport_mode: transportMode, // Save preferred transport mode
    },
  ]);

  if (error) {
    console.error("Error saving safety settings:", error); // Log error if saving fails
    return false; // Return false on error
  }

  return true; // Return true on success
};