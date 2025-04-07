import { Accelerometer } from 'expo-sensors';
import { Alert } from 'react-native';

type DetectionOptions = {
  typoScore: number;
};

class DrunkDetectionService {
  private shakeScore = 0;
  private subscription: any;
  private detectionInProgress = false;

  startDetection({ typoScore }: DetectionOptions) {
    if (this.detectionInProgress) {
      return;
    }

    this.detectionInProgress = true;
    this.shakeScore = 0;
    const timeScore = this.getTimeScore();
    this.subscribeToAccelerometer();

    setTimeout(() => {
      this.unsubscribe();
      const totalScore = timeScore + typoScore + this.shakeScore;

      if (totalScore >= 3) {
        setTimeout(() => {
          Alert.alert("Are you drunk?", "Maybe turn on your drunk mode to keep you safe :)");
        }, 0);
      }

      this.detectionInProgress = false;
    }, 5000); // wait 5 seconds for shake data
  }

  private getTimeScore(): number {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 5 = Friday, 6 = Saturday
    const isWeekendNight = (day === 5 || day === 6) && (hour >= 20 || hour <= 5);
    return isWeekendNight ? 2 : 0;
  }

  private subscribeToAccelerometer() {
    this.unsubscribe(); // Ensure no duplicate subscriptions
    try {
      this.subscription = Accelerometer.addListener(({ x, y, z }) => {
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        if (magnitude > 1.8) {
          this.shakeScore = Math.min(this.shakeScore + 1, 3); // Cap at 3
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