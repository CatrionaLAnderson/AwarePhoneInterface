// Represents the Drunk Mode state and preferences of the user
// Stores whether Drunk Mode is active and the user preferences
export default class DrunkModeModel {
  private isDrunkModeActive: boolean; // Indicates if Drunk Mode is active
  private preferences: Record<string, any>; // Stores user preferences related to Drunk Mode

  constructor() {
    this.isDrunkModeActive = false;  // Default state: Drunk Mode is off initially
    this.preferences = {};  // Default preferences: empty object
  }

  // Toggles the Drunk Mode state between active and inactive
  toggleDrunkMode(): void {
    this.isDrunkModeActive = !this.isDrunkModeActive;
  }

  // Sets or updates user preferences related to Drunk Mode
  setPreferences(newPreferences: Record<string, any>): void {
    this.preferences = { ...this.preferences, ...newPreferences }; // Merge new preferences
  }

  // Gets the current status of Drunk Mode (true or false)
  getStatus(): boolean {
    return this.isDrunkModeActive;
  }

  // Gets the current user preferences related to Drunk Mode
  getPreferences(): Record<string, any> {
    return this.preferences;
  }
}