import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DrunkModeModel from "../models/DrunkModeModel";

// Custom hook to manage the drunk mode state
export default function useDrunkModeViewModel() {
  const [drunkMode, setDrunkMode] = useState(new DrunkModeModel()); // Initialize drunk mode state

  useEffect(() => {
    // Load Drunk Mode state from storage
    const loadState = async () => {
      const savedState = await AsyncStorage.getItem("drunkMode"); // Retrieve saved state
      if (savedState !== null) {
        const isActive = JSON.parse(savedState); // Parse saved state
        const model = new DrunkModeModel();
        if (isActive) model.toggleDrunkMode(); // Activate drunk mode if saved state is active
        setDrunkMode(model); // Update state in the UI
      }
    };

    loadState(); // Load state on component mount
  }, []);

  // Function to toggle the drunk mode
  const toggleDrunkMode = async () => {
    drunkMode.toggleDrunkMode(); // Toggle state in the model
    setDrunkMode(new DrunkModeModel()); // Update state in the UI

    // Save state in storage
    await AsyncStorage.setItem("drunkMode", JSON.stringify(drunkMode.getStatus()));
  };

  // Function to activate drunk mode directly
  const activateDrunkMode = async () => {
    if (!drunkMode.getStatus()) {
      drunkMode.toggleDrunkMode(); // Activate drunk mode in the model
      setDrunkMode(new DrunkModeModel()); // Update state in the UI
      await AsyncStorage.setItem("drunkMode", JSON.stringify(true)); // Save active state
    }
  };

  return {
    isDrunkModeActive: drunkMode.getStatus(), // Check if drunk mode is active
    toggleDrunkMode, // Function to toggle drunk mode
    activateDrunkMode, // Function to activate drunk mode
  };
}