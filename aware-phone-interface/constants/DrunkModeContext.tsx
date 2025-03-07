//Provides global state for drunk mode so any screen can access or update it without reloading data
import React, { createContext, useContext, useState, useEffect } from "react";
import useDrunkModeViewModel from "../viewmodels/DrunkModeViewModel";

// TypeScript Interface for drunk mode context
interface DrunkModeContextType {
  isDrunkMode: boolean;
  toggleDrunkMode: () => void;
}

const DrunkModeContext = createContext<DrunkModeContextType | undefined>(undefined);

export const DrunkModeProvider = ({ children }: { children: React.ReactNode }) => {
  const { isDrunkModeActive, toggleDrunkMode } = useDrunkModeViewModel();
  const [drunkMode, setDrunkMode] = useState(isDrunkModeActive);

  useEffect(() => {
    setDrunkMode(isDrunkModeActive);
  }, [isDrunkModeActive]);

  const handleToggle = () => {
    toggleDrunkMode();
    setDrunkMode((prev) => !prev);
  };

  return (
    <DrunkModeContext.Provider value={{ isDrunkMode: drunkMode, toggleDrunkMode: handleToggle }}>
      {children}
    </DrunkModeContext.Provider>
  );
};

export const useDrunkMode = (): DrunkModeContextType => {
  const context = useContext(DrunkModeContext);
  if (!context) {
    throw new Error("useDrunkMode must be used within a DrunkModeProvider");
  }
  return context;
};