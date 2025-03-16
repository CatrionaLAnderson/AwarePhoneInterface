import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { DrunkModeProvider } from "../constants/DrunkModeContext";
import AppNavigator from "../navigation/AppNavigator"; // Navigation logic

export default function Layout() {
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