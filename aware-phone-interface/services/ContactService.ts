import { supabase } from "@/lib/supabase"; 

// Fetch all contacts from the "contacts" table (without restrictions)
export const fetchAllContacts = async () => {
  const { data, error } = await supabase
    .from("contacts")
    .select("id, contact_name, phone_number"); // Select relevant fields

  if (error) {
    console.error("Error fetching contacts:", error);
    return []; // Return an empty array on error
  }

  // Map database fields to a simplified contact object
  return data.map((contact) => ({
    id: contact.id,
    name: contact.contact_name,
    phoneNumber: contact.phone_number,
  }));
};

// Fetch contacts with restriction data (e.g., blocked status)
export const fetchContactsWithRestrictions = async () => {
  const { data, error } = await supabase
    .from("contacts")
    .select("id, contact_name, phone_number, contact_restrictions (is_blocked)"); // Include restriction data

  if (error) {
    console.error("Error fetching contacts:", error);
    return []; // Return an empty array on error
  }

  // Map database fields to a contact object with restriction status
  return data.map((contact) => ({
    id: contact.id,
    name: contact.contact_name,
    phoneNumber: contact.phone_number,
    isBlocked: contact.contact_restrictions?.[0]?.is_blocked ?? false, // Default to false if no restriction exists
  }));
};

// Toggle restriction status for a specific contact
export const toggleContactRestriction = async (contactId: string, isBlocked: boolean) => {
  console.log("Toggling restriction for:", contactId, "New Status:", isBlocked);

  // Check if a restriction entry already exists
  const { data: existingEntry, error: fetchError } = await supabase
    .from("contact_restrictions")
    .select("id")
    .eq("contact_id", contactId)
    .maybeSingle();

  if (fetchError) {
    console.error("Error checking existing restriction:", fetchError);
    return false; // Return false on error
  }

  if (existingEntry) {
    // Update existing restriction
    const { error: updateError } = await supabase
      .from("contact_restrictions")
      .update({ is_blocked: isBlocked })
      .eq("contact_id", contactId);

    if (updateError) {
      console.error("Error updating contact restriction:", updateError);
      return false; // Return false on error
    }
  } else {
    // Insert new restriction
    const { error: insertError } = await supabase
      .from("contact_restrictions")
      .insert([{ contact_id: contactId, is_blocked: isBlocked }]);

    if (insertError) {
      console.error("Error inserting new restriction:", insertError);
      return false; // Return false on error
    }
  }

  return true; // Return true on success
};