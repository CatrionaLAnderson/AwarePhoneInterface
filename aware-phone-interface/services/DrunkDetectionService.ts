import { Accelerometer } from 'expo-sensors';
import { Alert } from 'react-native';

type DetectionOptions = {
  typoScore: number; // Score based on typing errors
};

class DrunkDetectionService {
  private shakeScore = 0; // Tracks shake intensity
  private subscription: any; // Accelerometer subscription
  private detectionInProgress = false; // Prevents multiple detections at once

  // Start drunk detection process
  startDetection({ typoScore }: DetectionOptions) {
    if (this.detectionInProgress) {
      return; // Exit if detection is already in progress
    }

    this.detectionInProgress = true;
    this.shakeScore = 0; // Reset shake score
    const timeScore = this.getTimeScore(); // Get score based on time
    this.subscribeToAccelerometer(); // Start listening to accelerometer data

    // Stop detection after 5 seconds
    setTimeout(() => {
      this.unsubscribe(); // Stop accelerometer subscription
      const totalScore = timeScore + typoScore + this.shakeScore; // Calculate total score

      // Trigger alert if total score exceeds threshold
      if (totalScore >= 3) {
        setTimeout(() => {
          Alert.alert("Are you drunk?", "Maybe turn on your drunk mode to keep you safe :)");
        }, 0);
      }

      this.detectionInProgress = false; // Reset detection flag
    }, 5000); // Wait 5 seconds for shake data
  }

  // Calculate score based on time (higher score for weekend nights)
  private getTimeScore(): number {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 5 = Friday, 6 = Saturday
    const isWeekendNight = (day === 5 || day === 6) && (hour >= 20 || hour <= 5); // Weekend night condition
    return isWeekendNight ? 2 : 0; // Return 2 for weekend nights, 0 otherwise
  }

  // Subscribe to accelerometer to detect shakes
  private subscribeToAccelerometer() {
    this.unsubscribe(); // Ensure no duplicate subscriptions
    try {
      this.subscription = Accelerometer.addListener(({ x, y, z }) => {
        const magnitude = Math.sqrt(x * x + y * y + z * z); // Calculate shake magnitude
        if (magnitude > 1.8) {
          this.shakeScore = Math.min(this.shakeScore + 1, 3); // Increment shake score, cap at 3
        }
      });
      Accelerometer.setUpdateInterval(300); // Set update interval to 300ms
    } catch (error) {
      console.error("Accelerometer subscription failed:", error);
    }
  }

  // Unsubscribe from accelerometer
  private unsubscribe() {
    if (this.subscription && typeof this.subscription.remove === 'function') {
      this.subscription.remove(); // Remove subscription
      this.subscription = null; // Reset subscription
    }
  }
}

export default new DrunkDetectionService();