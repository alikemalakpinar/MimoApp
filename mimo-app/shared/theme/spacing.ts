// ORA - PREMIUM SPACING SYSTEM
// 4px tabanlı tutarlı boşluk sistemi

export const Spacing = {
  // Base spacing scale (4px increments)
  none: 0,
  '0.5': 2,
  '1': 4,
  '1.5': 6,
  '2': 8,
  '2.5': 10,
  '3': 12,
  '3.5': 14,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '9': 36,
  '10': 40,
  '11': 44,
  '12': 48,
  '14': 56,
  '16': 64,
  '20': 80,
  '24': 96,
  '32': 128,

  // Semantic aliases (daha okunabilir)
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  huge: 64,
  massive: 80,

  // Component-specific spacing
  screenPadding: 20,
  screenPaddingLarge: 24,
  cardPadding: 20,
  cardPaddingSmall: 16,
  cardPaddingLarge: 24,
  buttonPadding: 16,
  inputPadding: 16,
  listItemPadding: 16,
  sectionGap: 32,
  itemGap: 12,
  iconGap: 8,

  // Layout spacing
  headerHeight: 56,
  tabBarHeight: 84,
  bottomSafeArea: 34,
  statusBarHeight: 44,
};

// Spacing helper function
export const space = (multiplier: number): number => multiplier * 4;
