
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DrunkModeModel from "../models/DrunkModeModel";

//custom hook to manage the drunk mode state
export default function useDrunkModeViewModel() {
  const [drunkMode, setDrunkMode] = useState(new DrunkModeModel());

  useEffect(() => {
    // Load Drunk Mode state from storage
    const loadState = async () => {
      const savedState = await AsyncStorage.getItem("drunkMode");
      if (savedState !== null) {
        const isActive = JSON.parse(savedState);
        const model = new DrunkModeModel();
        if (isActive) model.toggleDrunkMode();
        setDrunkMode(model);
      }
    };

    loadState();
  }, []);

  //Function to toggle the drunk mode
  const toggleDrunkMode = async () => {
    drunkMode.toggleDrunkMode(); //toggle state in model
    setDrunkMode(new DrunkModeModel()); //update state in the UI

    // Save state in storage
    await AsyncStorage.setItem("drunkMode", JSON.stringify(drunkMode.getStatus()));
  };

  return {
    isDrunkModeActive: drunkMode.getStatus(),
    toggleDrunkMode,
  };
}