import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { DrunkModeProvider } from "../constants/DrunkModeContext"; // Provides Drunk Mode context globally
import AppNavigator from "../navigation/AppNavigator"; // Handles navigation between app screens
import * as Notifications from "expo-notifications"; // For configuring notifications

export default function Layout() {
  useEffect(() => {
    // Set notification behavior (alerts, sound, no badge)
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []); // Runs once when the component mounts

  return (
    <DrunkModeProvider> {/* Wrap the app in DrunkMode context */}
      <PaperProvider> {/* Provide Material Design components */}
        <SafeAreaView style={styles.container}> {/* Ensure content stays within safe area */}
          <AppNavigator /> {/* Main app navigation */}
        </SafeAreaView>
      </PaperProvider>
    </DrunkModeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container takes up full screen space
  },
});