import React from "react";
import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import DrunkModeSetting from "../screens/DrunkModeSetting";
import AppRestrictions from "../screens/settingScreens/AppRestrictions";
import ContactRestrictions from "../screens/settingScreens/ContactRestrictions";
import Alerts from "../screens/settingScreens/Alerts";
import NotificationRestrictions from "../screens/settingScreens/NotificationRestrictions";

export default function Index() {
  return (
    <div>
      <HomeScreen />
      <SettingScreen navigation={{}} />
      <DrunkModeSetting navigation={{}}/>
      <AppRestrictions navigation={{}}/>
      <ContactRestrictions navigation={{}}/>
      <NotificationRestrictions navigation={{}}/>
      <Alerts navigation={{}}/>
    </div>
  );
}
