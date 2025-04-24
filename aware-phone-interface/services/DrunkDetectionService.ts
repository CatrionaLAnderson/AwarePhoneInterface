import { Accelerometer } from 'expo-sensors';
import { Alert } from 'react-native';

// This should come from your actual global state or context
const isDrunkModeActive = true; // Replace with real check

type DetectionOptions = {
  typoScore: number; // Score based on typing errors
};

class DrunkDetectionService {
  private shakeScore = 0;
  private typoScore = 0;
  private timeScore = 0;
  private subscription: any;
  private detectionTriggered = false;

  // Call this when you want to start monitoring
  startDetection({ typoScore }: DetectionOptions) {
    if (!isDrunkModeActive) {
      console.log("⛔ Drunk detection skipped — Drunk Mode is not active");
      return;
    }
  
    console.log("🟢 Drunk detection started with typoScore:", typoScore);
  
    if (this.detectionTriggered) return;
  
    this.typoScore = typoScore;
    this.timeScore = this.getTimeScore();
    this.shakeScore = 0;
    this.detectionTriggered = false;
  
    this.subscribeToAccelerometer();
    this.evaluateScore(); // Initial check
  }

  private getTimeScore(): number {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const isWeekendNight = (day === 5 || day === 6) && (hour >= 20 || hour <= 5);
    return isWeekendNight ? 2 : 0;
  }

  private evaluateScore() {
    const totalScore = this.typoScore + this.timeScore + this.shakeScore;
    console.log("🔍 Evaluating score:", {
      typo: this.typoScore,
      time: this.timeScore,
      shake: this.shakeScore,
      total: totalScore,
    });
  
    if (totalScore >= 3 && !this.detectionTriggered) {
      console.log("🚨 DRUNK DETECTION TRIGGERED");
      this.detectionTriggered = true;
      Alert.alert("Are you drunk?", "Maybe turn on your drunk mode to keep you safe :)");
      this.unsubscribe();
    }
  }

  private subscribeToAccelerometer() {
    this.unsubscribe(); // Ensure no duplicates

    try {
      this.subscription = Accelerometer.addListener(({ x, y, z }) => {
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        if (magnitude > 1.5) { // slightly more sensitive
          this.shakeScore = Math.min(this.shakeScore + 1, 3);
          this.evaluateScore(); // Re-check score each time a shake is detected
        }
      });
      Accelerometer.setUpdateInterval(300);
    } catch (error) {
      console.error("Accelerometer subscription failed:", error);
    }
  }

  private unsubscribe() {
    if (this.subscription && typeof this.subscription.remove === 'function') {
      this.subscription.remove();
      this.subscription = null;
    }
  }
}

export default new DrunkDetectionService();