import React from "react";
import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import DrunkModeSetting from "../screens/DrunkModeSetting";

export default function Index() {
  return (
    <div>
      <HomeScreen />
      <SettingScreen navigation={{}} />
      <DrunkModeSetting navigation={{}}/>
    </div>
  );
}
