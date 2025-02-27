import { supabase } from "../lib/supabase"; // Adjust path if needed

export const fetchContactsWithRestrictions = async () => {
  const { data, error } = await supabase
    .from("contacts")
    .select("id, contact_name, phone_number, contact_restrictions (is_blocked)");

  if (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }

  return data.map((contact) => ({
    id: contact.id,
    name: contact.contact_name,
    phoneNumber: contact.phone_number,
    isBlocked: contact.contact_restrictions?.[0]?.is_blocked ?? false,
  }));
};

export const toggleContactRestriction = async (contactId: string, isBlocked: boolean) => {
  console.log("Toggling restriction for:", contactId, "New Status:", isBlocked);

  const { data: existingEntry, error: fetchError } = await supabase
    .from("contact_restrictions")
    .select("id")
    .eq("contact_id", contactId)
    .maybeSingle();

  if (fetchError) {
    console.error("Error checking existing restriction:", fetchError);
    return false;
  }

  if (existingEntry) {
    const { error: updateError } = await supabase
      .from("contact_restrictions")
      .update({ is_blocked: isBlocked })
      .eq("contact_id", contactId);

    if (updateError) {
      console.error("Error updating contact restriction:", updateError);
      return false;
    }
  } else {
    const { error: insertError } = await supabase
      .from("contact_restrictions")
      .insert([{ contact_id: contactId, is_blocked: isBlocked }]);

    if (insertError) {
      console.error("Error inserting new restriction:", insertError);
      return false;
    }
  }

  return true;
};