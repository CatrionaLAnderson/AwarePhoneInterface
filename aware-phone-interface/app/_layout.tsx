import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from '../screens/HomeScreen';
import SettingScreen from '../screens/SettingScreen';
import DrunkModeSetting from '../screens/DrunkModeSetting';
import AppRestrictions from  '../screens/settingScreens/AppRestrictions';
import ContactRestrictions from  '../screens/settingScreens/ContactRestrictions';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingScreen} />
          <Stack.Screen name="DrunkModeSetting" component={DrunkModeSetting} />
          <Stack.Screen name="AppRestrictions" component={AppRestrictions} />
          <Stack.Screen name="ContactRestrictions" component={ContactRestrictions} />
        </Stack.Navigator>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});