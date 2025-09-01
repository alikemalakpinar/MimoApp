import { Colors } from './colors';
import { Spacing } from './spacing';
import { Typography } from './typography';
import { Shadows } from './shadows';  
import { BorderRadius } from './borderRadius';

export interface Theme {
  colors: typeof Colors.light;
  spacing: typeof Spacing;
  typography: typeof Typography;
  shadows: typeof Shadows;
  borderRadius: typeof BorderRadius;
}

export const createTheme = (isDark: boolean = false): Theme => ({
  colors: isDark ? Colors.dark : Colors.light,
  spacing: Spacing,
  typography: Typography,
  shadows: Shadows,
  borderRadius: BorderRadius
});

// Default exports
export { Colors, Spacing, Typography, Shadows, BorderRadius };

// Tema hook'u için (ileride kullanacağız)
export const useTheme = () => {
  // Bu kısım daha sonra zustand store ile bağlanacak
  const isDark = false; // Şimdilik false, sonra store'dan gelecek
  return createTheme(isDark);
};