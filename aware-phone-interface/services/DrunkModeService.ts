import AsyncStorage from "@react-native-async-storage/async-storage";

class DrunkModeService {
  /**
   * Toggles the drunk mode state and stores it in AsyncStorage.
   * @param isActive - Boolean indicating whether drunk mode is active or not.
   */
  static async toggleDrunkMode(isActive: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem("drunkMode", JSON.stringify(isActive));
    } catch (error) {
      console.error("Error saving drunk mode state:", error);
    }
  }

  /**
   * Retrieves the stored drunk mode status from AsyncStorage.
   * @returns A boolean indicating whether drunk mode is active.
   */
  static async getDrunkModeStatus(): Promise<boolean> {
    try {
      const storedStatus = await AsyncStorage.getItem("drunkMode");
      return storedStatus ? JSON.parse(storedStatus) : false;
    } catch (error) {
      console.error("Error retrieving drunk mode state:", error);
      return false; // Default to false if there's an error
    }
  }
}

export default DrunkModeService;