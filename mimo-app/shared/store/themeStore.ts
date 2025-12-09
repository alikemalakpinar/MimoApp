// shared/store/themeStore.ts - Theme state management with Zustand
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  // Current theme mode setting
  themeMode: ThemeMode;

  // Computed dark mode state (resolved from system if needed)
  isDarkMode: boolean;

  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;

  // Initialize theme from system
  initializeTheme: () => void;
}

// Get system color scheme
const getSystemTheme = (): boolean => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: 'system',
      isDarkMode: getSystemTheme(),

      setThemeMode: (mode: ThemeMode) => {
        const isDark = mode === 'system' ? getSystemTheme() : mode === 'dark';
        set({ themeMode: mode, isDarkMode: isDark });
      },

      toggleTheme: () => {
        const { themeMode, isDarkMode } = get();

        if (themeMode === 'system') {
          // If system, switch to opposite of current
          set({ themeMode: isDarkMode ? 'light' : 'dark', isDarkMode: !isDarkMode });
        } else {
          // Toggle between light and dark
          const newMode = themeMode === 'light' ? 'dark' : 'light';
          set({ themeMode: newMode, isDarkMode: newMode === 'dark' });
        }
      },

      initializeTheme: () => {
        const { themeMode } = get();
        if (themeMode === 'system') {
          set({ isDarkMode: getSystemTheme() });
        }
      },
    }),
    {
      name: 'ora-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ themeMode: state.themeMode }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Recompute isDarkMode after rehydration
          const isDark = state.themeMode === 'system'
            ? getSystemTheme()
            : state.themeMode === 'dark';
          state.isDarkMode = isDark;
        }
      },
    }
  )
);

// Listen for system theme changes
Appearance.addChangeListener(({ colorScheme }) => {
  const state = useThemeStore.getState();
  if (state.themeMode === 'system') {
    useThemeStore.setState({ isDarkMode: colorScheme === 'dark' });
  }
});

// Export theme colors helper
export const getThemeColors = (isDarkMode: boolean) => {
  if (isDarkMode) {
    return {
      background: '#0A0A0F',
      surface: '#1A1A24',
      surfaceElevated: '#252532',
      primary: '#A18AFF',
      secondary: '#7C5CE0',
      textPrimary: '#FFFFFF',
      textSecondary: '#A0A0B0',
      textTertiary: '#6B6B7B',
      border: '#2A2A3A',
      success: '#4ADE80',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA',
    };
  }

  return {
    background: '#FAFBFC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    primary: '#7C5CE0',
    secondary: '#A18AFF',
    textPrimary: '#1A1A2E',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  };
};

export default useThemeStore;
