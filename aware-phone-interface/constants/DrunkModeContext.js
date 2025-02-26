import React, { createContext, useState, useEffect, useContext } from "react";
import DrunkModeService from "../services/DrunkModeService"; // Import service

// Create the context
const DrunkModeContext = createContext();

// Create a provider component
export const DrunkModeProvider = ({ children }) => {
  const [isDrunkMode, setIsDrunkMode] = useState(false);

  // Load Drunk Mode status from storage on app start
  useEffect(() => {
    const loadDrunkModeStatus = async () => {
      const status = await DrunkModeService.getDrunkModeStatus();
      setIsDrunkMode(status);
    };
    loadDrunkModeStatus();
  }, []);

  // Toggle Drunk Mode and persist the change
  const toggleDrunkMode = async () => {
    const newStatus = !isDrunkMode;
    setIsDrunkMode(newStatus);
    await DrunkModeService.toggleDrunkMode(newStatus);
  };

  return (
    <DrunkModeContext.Provider value={{ isDrunkMode, toggleDrunkMode }}>
      {children}
    </DrunkModeContext.Provider>
  );
};

// Create a custom hook for easier access
export const useDrunkMode = () => useContext(DrunkModeContext);