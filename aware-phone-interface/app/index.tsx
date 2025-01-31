import React from "react";
import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import DrunkModeSetting from "../screens/DrunkModeSetting";
import AppRestrictions from "../screens/settingScreens/AppRestrictions";
import ContactRestrictions from "../screens/settingScreens/ContactRestrictions";

export default function Index() {
  return (
    <div>
      <HomeScreen />
      <SettingScreen navigation={{}} />
      <DrunkModeSetting navigation={{}}/>
      <AppRestrictions navigation={{}}/>
      <ContactRestrictions navigation={{}}/>
    </div>
  );
}
