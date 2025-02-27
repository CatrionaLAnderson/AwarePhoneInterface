import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase"; // Adjust path if necessary

// Create the context
const DrunkModeContext = createContext({
  isDrunkMode: false,
  toggleDrunkMode: () => {},
});

// Provider component
export const DrunkModeProvider = ({ children }) => {
  const [isDrunkMode, setIsDrunkMode] = useState(false);

  useEffect(() => {
    const loadDrunkModeStatus = async () => {
      const storedStatus = await AsyncStorage.getItem("drunkMode");
  
      // Fetch latest status from Supabase
      const { data, error } = await supabase.from("drunk_mode_status").select("is_active").single();
  
      if (error) {
        console.error("Error fetching drunk mode:", error);
        setIsDrunkMode(storedStatus ? JSON.parse(storedStatus) : false); // Fallback to local storage
      } else {
        setIsDrunkMode(data.is_active); // Use Supabase value
      }
    };
  
    loadDrunkModeStatus();
  }, []);

  const toggleDrunkMode = async () => {
    const newStatus = !isDrunkMode;
    setIsDrunkMode(newStatus);
    await AsyncStorage.setItem("drunkMode", JSON.stringify(newStatus));
  
    // Fetch existing row from Supabase (ensure we update instead of inserting)
    const { data: existingEntry, error: fetchError } = await supabase
      .from("drunk_mode_status")
      .select("id")
      .maybeSingle(); // Fetch the row if it exists
  
    if (fetchError) {
      console.error("Error checking drunk mode status:", fetchError);
      return;
    }
  
    if (existingEntry) {
      // ✅ UPDATE existing row (Use actual UUID)
      const { error: updateError } = await supabase
        .from("drunk_mode_status")
        .update({ is_active: newStatus })
        .eq("id", existingEntry.id); // Use real UUID from Supabase
  
      if (updateError) {
        console.error("Error updating drunk mode:", updateError);
      }
    } else {
      //  INSERT if no row exists
      const { error: insertError } = await supabase
        .from("drunk_mode_status")
        .insert([{ is_active: newStatus }]);
  
      if (insertError) {
        console.error("Error inserting drunk mode:", insertError);
      }
    }
  };

  return (
    <DrunkModeContext.Provider value={{ isDrunkMode, toggleDrunkMode }}>
      {children}
    </DrunkModeContext.Provider>
  );
};

// Custom hook for easy access
export const useDrunkMode = () => useContext(DrunkModeContext);