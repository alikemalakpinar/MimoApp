// shared/utils/haptics.ts - Haptic feedback utilities
import { Platform, Vibration } from 'react-native';

// Haptic feedback types
export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection';

// Trigger haptic feedback using Vibration API (cross-platform)
export const haptic = async (type: HapticType = 'light'): Promise<void> => {
  try {
    // Use Vibration API as fallback
    const duration = type === 'heavy' ? 50 : type === 'medium' ? 30 : 10;
    Vibration.vibrate(duration);
  } catch (error) {
    // Silent fail for devices without vibration support
    console.log('Haptic feedback not available');
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
    // iOS - simple vibration
    Vibration.vibrate(50);
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
