// ORA - UNIFIED DESIGN SYSTEM
// "from now, find yourself"

import { Colors, withOpacity } from './colors';
import { Spacing, space } from './spacing';
import { Typography } from './typography';
import { Shadows } from './shadows';
import { BorderRadius } from './borderRadius';

// App Constants
export const AppConfig = {
  name: 'Ora',
  tagline: 'from now, find yourself',
  taglineTR: 'şimdiden, kendini keşfet',
  version: '1.0.0',
};

// Theme interface
export interface Theme {
  colors: typeof Colors.light;
  spacing: typeof Spacing;
  typography: typeof Typography;
  shadows: typeof Shadows;
  borderRadius: typeof BorderRadius;
  gradients: typeof Colors.gradients;
}

// Create theme function
export const createTheme = (isDark: boolean = false): Theme => ({
  colors: isDark ? Colors.dark : Colors.light,
  spacing: Spacing,
  typography: Typography,
  shadows: Shadows,
  borderRadius: BorderRadius,
  gradients: Colors.gradients,
});

// Default exports
export { Colors, Spacing, Typography, Shadows, BorderRadius, withOpacity, space };

// Theme hook - now connected to Zustand store
export { useThemeStore } from '../store/theme';

export const useTheme = () => {
  // Import dynamically to avoid circular dependencies
  const { useThemeStore } = require('../store/theme');
  const isDark = useThemeStore((state: { isDark: boolean }) => state.isDark);
  return createTheme(isDark);
};

// Common style helpers
export const CommonStyles = {
  // Container styles
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  // Card styles
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.cardPadding,
    ...Shadows.sm,
  },

  cardElevated: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.cardPadding,
    ...Shadows.md,
  },

  // Button base styles
  buttonPrimary: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.button,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...Shadows.primary,
  },

  buttonSecondary: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.button,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  buttonGhost: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.button,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  // Input styles
  input: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.input,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: Typography.base,
    color: Colors.light.textPrimary,
  },

  inputFocused: {
    borderColor: Colors.light.primary,
    ...Shadows.primary,
  },

  // Row and flex helpers
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },

  rowBetween: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },

  center: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  // Glass effect
  glass: {
    backgroundColor: Colors.light.glass,
    borderWidth: 1,
    borderColor: Colors.light.glassBorder,
  },
};
