// shared/store/theme.ts - Theme state management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
}

interface ThemeActions {
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  updateSystemTheme: () => void;
}

const getSystemTheme = (): boolean => {
  return Appearance.getColorScheme() === 'dark';
};

export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set, get) => ({
      mode: 'system',
      isDark: getSystemTheme(),

      setMode: (mode: ThemeMode) => {
        let isDark: boolean;
        switch (mode) {
          case 'dark':
            isDark = true;
            break;
          case 'light':
            isDark = false;
            break;
          case 'system':
          default:
            isDark = getSystemTheme();
            break;
        }
        set({ mode, isDark });
      },

      toggleTheme: () => {
        const currentMode = get().mode;
        if (currentMode === 'system') {
          // If system, switch to opposite of current
          set({ mode: get().isDark ? 'light' : 'dark', isDark: !get().isDark });
        } else {
          // Toggle between light and dark
          set({ mode: currentMode === 'dark' ? 'light' : 'dark', isDark: currentMode !== 'dark' });
        }
      },

      updateSystemTheme: () => {
        const { mode } = get();
        if (mode === 'system') {
          set({ isDark: getSystemTheme() });
        }
      },
    }),
    {
      name: 'ora-theme',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Listen to system theme changes
Appearance.addChangeListener(({ colorScheme }) => {
  useThemeStore.getState().updateSystemTheme();
});
