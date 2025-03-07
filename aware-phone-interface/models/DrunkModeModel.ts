// Represents the Drunk Mode state and prefrences of the user
// Stores whether Drunk Mode is active and the user preferences
export default class DrunkModeModel {
    private isDrunkModeActive: boolean; 
    private preferences: Record<string, any>;
  
    constructor() {
      this.isDrunkModeActive = false;  // Default state
      this.preferences = {};  // Default user preferences
    }
  
    toggleDrunkMode(): void {
      this.isDrunkModeActive = !this.isDrunkModeActive;
    }
  
    setPreferences(newPreferences: Record<string, any>): void {
      this.preferences = { ...this.preferences, ...newPreferences };
    }
  
    getStatus(): boolean {
      return this.isDrunkModeActive;
    }
  
    getPreferences(): Record<string, any> {
      return this.preferences;
    }
  }