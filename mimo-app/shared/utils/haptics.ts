// shared/utils/haptics.ts - Haptic feedback utilities
import { Platform, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

// Haptic feedback types
export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection';

// Trigger haptic feedback
export const haptic = async (type: HapticType = 'light'): Promise<void> => {
  try {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'selection':
        await Haptics.selectionAsync();
        break;
      default:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch (error) {
    // Fallback for devices without haptic support
    if (Platform.OS === 'android') {
      Vibration.vibrate(type === 'heavy' ? 50 : type === 'medium' ? 30 : 10);
    }
  }
};

// Shorthand functions
export const hapticLight = () => haptic('light');
export const hapticMedium = () => haptic('medium');
export const hapticHeavy = () => haptic('heavy');
export const hapticSuccess = () => haptic('success');
export const hapticWarning = () => haptic('warning');
export const hapticError = () => haptic('error');
export const hapticSelection = () => haptic('selection');

// Pattern vibration (for special effects)
export const hapticPattern = (pattern: number[] = [0, 50, 100, 50]): void => {
  if (Platform.OS === 'android') {
    Vibration.vibrate(pattern);
  } else {
    // iOS doesn't support patterns, use multiple haptics
    pattern.forEach((duration, index) => {
      if (index % 2 === 1 && duration > 0) {
        setTimeout(() => {
          haptic('light');
        }, pattern.slice(0, index).reduce((a, b) => a + b, 0));
      }
    });
  }
};

// Cancel ongoing vibration
export const cancelHaptic = (): void => {
  Vibration.cancel();
};

export default {
  haptic,
  hapticLight,
  hapticMedium,
  hapticHeavy,
  hapticSuccess,
  hapticWarning,
  hapticError,
  hapticSelection,
  hapticPattern,
  cancelHaptic,
};
