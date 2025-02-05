import React, { createContext, useState, useContext } from "react";

// Create the context
const DrunkModeContext = createContext();

// Create a provider component
export const DrunkModeProvider = ({ children }) => {
  const [isDrunkMode, setIsDrunkMode] = useState(false);

  const toggleDrunkMode = () => {
    setIsDrunkMode((prev) => !prev);
  };

  return (
    <DrunkModeContext.Provider value={{ isDrunkMode, toggleDrunkMode }}>
      {children}
    </DrunkModeContext.Provider>
  );
};

// Create a custom hook for easier access
export const useDrunkMode = () => useContext(DrunkModeContext);