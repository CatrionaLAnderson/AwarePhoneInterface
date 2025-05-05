//The purpose of this code is to detect signs of intoxication (e.g., based on typing errors, device shaking, and time of day) 
// and prompt the user to enable a "Drunk Mode" for safety. It uses accelerometer data and scoring logic to evaluate the likelihood of intoxication.
import { Accelerometer } from 'expo-sensors';
import { Alert } from 'react-native';

type DetectionOptions = {
  typoScore: number;
  shakeSensitivity?: number;
  isDrunkMode: boolean;
  toggleDrunkMode: () => void;
};

class DrunkDetectionService {
  private shakeScore = 0;
  private typoScore = 0;
  private timeScore = 0;
  private subscription: any;
  private detectionTriggered = false;
  private decayInterval: any;

  startDetection({ typoScore, shakeSensitivity = 1.1, isDrunkMode, toggleDrunkMode }: DetectionOptions) {
    if (isDrunkMode) {
      console.log(" Detection skipped — Drunk Mode is already active");
      return;
    }

    if (this.detectionTriggered) return;

    console.log("Drunk detection started with typoScore:", typoScore);
    this.typoScore = Math.min(typoScore, 3);
    this.timeScore = this.getTimeScore();
    this.shakeScore = 0;
    this.detectionTriggered = false;

    this.subscribeToAccelerometer(shakeSensitivity, toggleDrunkMode);
    this.startShakeDecay();
    this.evaluateScore(toggleDrunkMode); // Pass toggleDrunkMode into evaluate
  }

  stopDetection() {
    console.log("Drunk detection stopped");
    this.unsubscribe();
    clearInterval(this.decayInterval);
    this.shakeScore = 0;
    this.detectionTriggered = false;
  }

  private getTimeScore(): number {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const isLateNight = hour >= 22 || hour <= 5;
    const isWeekend = day === 5 || day === 6;
    if (isWeekend && isLateNight) return 2;
    if (isLateNight) return 1;
    return 0;
  }

  private evaluateScore(toggleDrunkMode: () => void) {
    const weightedTypo = Math.min(this.typoScore, 3) * 0.6;
    const weightedShake = Math.min(this.shakeScore, 3) * 0.3;
    const weightedTime = Math.min(this.timeScore, 2) * 0.1;
  
    let totalScore = weightedTypo + weightedShake + weightedTime;
  
    // Bonus for high typo + shake together
    if (this.typoScore >= 2 && this.shakeScore >= 2) {
      totalScore += 0.5;
    }
  
    console.log("🔍 Evaluating score:", {
      typoScore: this.typoScore,
      shakeScore: this.shakeScore,
      timeScore: this.timeScore,
      totalWeightedScore: totalScore.toFixed(2),
    });
  
    if (totalScore >= 1.5 && !this.detectionTriggered) {
      console.log("DRUNK DETECTION TRIGGERED (improved scoring)");
      this.detectionTriggered = true;
      this.showDrunkModePrompt(toggleDrunkMode);
      this.stopDetection();
    }
  }

  private subscribeToAccelerometer(sensitivity: number, toggleDrunkMode: () => void) {
    this.unsubscribe();

    try {
      this.subscription = Accelerometer.addListener(({ x, y, z }) => {
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        if (magnitude > sensitivity) {
          this.shakeScore = Math.min(this.shakeScore + 1, 3);
          console.log("Shake detected! Shake score:", this.shakeScore);
          this.evaluateScore(toggleDrunkMode); // Pass correct toggle function
        }
      });
      Accelerometer.setUpdateInterval(300);
    } catch (error) {
      console.error("Accelerometer subscription failed:", error);
    }
  }

  private startShakeDecay() {
    this.decayInterval = setInterval(() => {
      if (this.shakeScore > 0) {
        this.shakeScore -= 1;
        console.log("⚡ Shake score decayed:", this.shakeScore);
      }
    }, 5000);
  }

  private showDrunkModePrompt(toggleDrunkMode: () => void) {
    Alert.alert(
      "Are you drunk?",
      "It seems like you might be intoxicated. Would you like to turn on Drunk Mode to stay safe?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Turn on Drunk Mode", onPress: () => toggleDrunkMode() },
      ]
    );
  }

  private unsubscribe() {
    if (this.subscription && typeof this.subscription.remove === 'function') {
      this.subscription.remove();
      this.subscription = null;
    }
  }
}

export default new DrunkDetectionService();