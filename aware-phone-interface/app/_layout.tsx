import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { DrunkModeProvider } from "../constants/DrunkModeContext";
import AppNavigator from "../navigation/AppNavigator";
import * as Notifications from "expo-notifications";

export default function Layout() {
  useEffect(() => {
    // Configure notification settings
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  return (
    <DrunkModeProvider>
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <AppNavigator />
        </SafeAreaView>
      </PaperProvider>
    </DrunkModeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});