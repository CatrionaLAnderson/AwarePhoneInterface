import AsyncStorage from "@react-native-async-storage/async-storage";

class DrunkModeService {
  static async toggleDrunkMode(isActive) {
    await AsyncStorage.setItem("drunkMode", JSON.stringify(isActive));
  }

  static async getDrunkModeStatus() {
    const storedStatus = await AsyncStorage.getItem("drunkMode");
    return storedStatus ? JSON.parse(storedStatus) : false;
  }
}

export default DrunkModeService;