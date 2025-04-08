import AsyncStorage from "@react-native-async-storage/async-storage";

class DrunkModeService {
  // Toggle the drunk mode state and store it in AsyncStorage
  // @param isActive - Boolean indicating whether drunk mode is active or not
  static async toggleDrunkMode(isActive: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem("drunkMode", JSON.stringify(isActive)); // Save drunk mode state
    } catch (error) {
      console.error("Error saving drunk mode state:", error); // Log error if saving fails
    }
  }

  // Retrieve the stored drunk mode status from AsyncStorage
  // @returns A boolean indicating whether drunk mode is active
  static async getDrunkModeStatus(): Promise<boolean> {
    try {
      const storedStatus = await AsyncStorage.getItem("drunkMode"); // Retrieve drunk mode state
      return storedStatus ? JSON.parse(storedStatus) : false; // Parse and return the state, default to false
    } catch (error) {
      console.error("Error retrieving drunk mode state:", error); // Log error if retrieval fails
      return false; // Default to false if there's an error
    }
  }
}

export default DrunkModeService;