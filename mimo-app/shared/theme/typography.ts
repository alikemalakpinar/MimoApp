// ORA - PREMIUM TYPOGRAPHY SYSTEM
// Modern, okunabilir ve duygusal tipografi

export const Typography = {
  // Font Sizes - Daha zengin bir ölçek
  tiny: 10,
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
  '7xl': 56,
  display: 64,

  // Font Weights
  thin: '100' as const,
  extraLight: '200' as const,
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
  black: '900' as const,

  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: -1.5,
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },

  // Preset Text Styles
  styles: {
    // Display - Büyük başlıklar
    displayLarge: {
      fontSize: 64,
      fontWeight: '700' as const,
      lineHeight: 1.1,
      letterSpacing: -2,
    },
    displayMedium: {
      fontSize: 48,
      fontWeight: '700' as const,
      lineHeight: 1.15,
      letterSpacing: -1.5,
    },
    displaySmall: {
      fontSize: 40,
      fontWeight: '700' as const,
      lineHeight: 1.2,
      letterSpacing: -1,
    },

    // Headings
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 1.25,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 1.3,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 1.35,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    h5: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    h6: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 1.5,
      letterSpacing: 0,
    },

    // Body Text
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400' as const,
      lineHeight: 1.6,
      letterSpacing: 0,
    },
    bodyMedium: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 1.5,
      letterSpacing: 0,
    },

    // Labels & Buttons
    labelLarge: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 1.25,
      letterSpacing: 0.5,
    },
    labelMedium: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 1.25,
      letterSpacing: 0.25,
    },
    labelSmall: {
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: 1.25,
      letterSpacing: 0.5,
    },

    // Captions & Small Text
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 1.4,
      letterSpacing: 0.25,
    },
    overline: {
      fontSize: 10,
      fontWeight: '600' as const,
      lineHeight: 1.5,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as const,
    },

    // Special Styles
    quote: {
      fontSize: 20,
      fontWeight: '300' as const,
      lineHeight: 1.6,
      letterSpacing: 0,
      fontStyle: 'italic' as const,
    },
    code: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 1.5,
      letterSpacing: 0,
      fontFamily: 'monospace',
    },
  },
};
