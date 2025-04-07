import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import {
  scheduleTimedNotification,
  scheduleAutoCorrectReminder,
} from "@/services/NotificationService2";
import { logTrackingEvent, startDrunkModeSession, endDrunkModeSession } from "../services/GlobalTracking";
import TrackingOverviewModal from "@/components/TrackingOverviewModal";
import { supabase } from "../lib/supabase";
import { sendNotification } from "@/services/NotificationService2";

// TypeScript Interface for drunk mode context
interface DrunkModeContextType {
  isDrunkMode: boolean;
  toggleDrunkMode: () => void;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const DrunkModeContext = createContext<DrunkModeContextType | undefined>(undefined);

export const DrunkModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [drunkMode, setDrunkMode] = useState(false); // Default to false
  const [showModal, setShowModal] = useState(false);

  // Load Drunk Mode state from AsyncStorage when app starts
  useEffect(() => {
    const loadDrunkModeState = async () => {
      try {
        const savedState = await AsyncStorage.getItem("drunkMode");
        if (savedState !== null) {
          setDrunkMode(JSON.parse(savedState));
        }
      } catch (error) {
        console.error("❌ Error loading Drunk Mode state:", error);
      }
    };
    loadDrunkModeState();
  }, []);

  // Save Drunk Mode state & handle notifications when it changes
  useEffect(() => {
    const updateDrunkMode = async () => {
      try {
        await AsyncStorage.setItem("drunkMode", JSON.stringify(drunkMode));
        console.log(`🔄 Drunk Mode: ${drunkMode ? "ON" : "OFF"}`);

        if (drunkMode) {
          await Notifications.cancelAllScheduledNotificationsAsync();
          scheduleTimedNotification("💧 Stay Hydrated!", "Water = good. Drink some!", 60); // 1 min
          scheduleAutoCorrectReminder(); // Auto-correct reminder after 5 min
          await startDrunkModeSession(); // Start tracking session
          await logTrackingEvent({ event_type: 'drunk_mode', event_detail: 'activated' });
          
          const { data, error } = await supabase.from('timed_alerts').select('*');
          if (error) {
            console.error('❌ Failed to fetch saved alerts:', error);
          } else {
            for (const alert of data) {
              await sendNotification(alert.name, alert.message);
            }
          }
        } else {
          await Notifications.cancelAllScheduledNotificationsAsync();
          await endDrunkModeSession(); // End tracking session
          await logTrackingEvent({ event_type: 'drunk_mode', event_detail: 'deactivated' });
          setShowModal(true); // Show the tracking overview modal
        }
      } catch (error) {
        console.error("❌ Error updating Drunk Mode state:", error);
      }
    };
    updateDrunkMode();
  }, [drunkMode]);

  // Toggle Drunk Mode
  const handleToggle = () => {
    setDrunkMode((prev) => !prev);
  };

  return (
    <DrunkModeContext.Provider value={{ isDrunkMode: drunkMode, toggleDrunkMode: handleToggle, showModal, setShowModal }}>
      {children}
      <TrackingOverviewModal isVisible={showModal} onClose={() => setShowModal(false)} />
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