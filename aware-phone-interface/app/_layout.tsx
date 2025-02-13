import React, { useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from '../screens/HomeScreen';
import SettingScreen from '../screens/SettingScreen';
import DrunkModeSetting from '../screens/DrunkModeSetting';
import AppRestrictions from '../screens/settingScreens/AppRestrictions';
import ContactRestrictions from '../screens/settingScreens/ContactRestrictions';
import NotificationRestrictions from '../screens/settingScreens/NotificationRestrictions';
import Alerts from '../screens/settingScreens/Alerts';
import { DrunkModeProvider } from '../constants/DrunkModeContext';
import * as Notifications from 'expo-notifications';

// Create stack navigator
const Stack = createStackNavigator();

// Configure notification behavior when app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Layout() {
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Listen for notifications received while the app is open
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notification received:', notification);
    });

    // Handle when user taps a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('📲 User tapped notification:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <DrunkModeProvider>
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Settings" component={SettingScreen} />
            <Stack.Screen name="DrunkModeSetting" component={DrunkModeSetting} />
            <Stack.Screen name="AppRestrictions" component={AppRestrictions} />
            <Stack.Screen name="ContactRestrictions" component={ContactRestrictions} />
            <Stack.Screen name="NotificationRestrictions" component={NotificationRestrictions} />
            <Stack.Screen name="Alerts" component={Alerts} />
          </Stack.Navigator>
        </SafeAreaView>
      </PaperProvider>
    </DrunkModeProvider>
  );
}

// Request notification permissions on startup
async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'ios') {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('⚠️ Please enable notifications in Settings.');
      return;
    }
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});