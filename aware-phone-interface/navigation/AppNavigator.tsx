import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import DrunkModeSetting from "../screens/DrunkModeSetting";
import AppRestrictions from "../screens/settingScreens/AppRestrictions";
import ContactRestrictions from "../screens/settingScreens/ContactRestrictions";
import NotificationRestrictions from "../screens/settingScreens/NotificationRestrictions";
import HealthRecommendations from "../screens/settingScreens/HealthRecommendations";
import SafetySettings from "../screens/settingScreens/SafetySettings";
import Alerts from "../screens/settingScreens/Alerts";
import PhoneApp from "../screens/PhoneApp";
import MessagingApp from "../screens/MessagingApp";
import ActivityOverview from "../screens/settingScreens/ActivityOverview";

// Create stack navigator
const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Settings" component={SettingScreen} />
    <Stack.Screen name="DrunkModeSetting" component={DrunkModeSetting} />
    <Stack.Screen name="AppRestrictions" component={AppRestrictions} />
    <Stack.Screen name="ContactRestrictions" component={ContactRestrictions} />
    <Stack.Screen name="NotificationRestrictions" component={NotificationRestrictions} />
    <Stack.Screen name="HealthRecommendations" component={HealthRecommendations} />
    <Stack.Screen name="SafetySettings" component={SafetySettings} />
    <Stack.Screen name="Alerts" component={Alerts} />
    <Stack.Screen name="Phone" component={PhoneApp} />
    <Stack.Screen name="Messages" component={MessagingApp} />
    <Stack.Screen name="ActivityOverview" component={ActivityOverview} />
  </Stack.Navigator>
);

export default AppNavigator;