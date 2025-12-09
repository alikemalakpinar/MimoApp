// shared/components/LiquidGlass.tsx - Apple Liquid Glass Design System (2025-2026)
// Revolutionary translucent surfaces with depth and dimension
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Circle, Rect, Ellipse } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { useThemeStore } from '../store/themeStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================
// LIQUID GLASS CARD - Primary container
// ============================================
interface LiquidGlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: 'subtle' | 'medium' | 'strong';
  tint?: 'light' | 'dark' | 'colored';
  color?: string;
  borderGlow?: boolean;
  onPress?: () => void;
  animated?: boolean;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  style,
  intensity = 'medium',
  tint = 'light',
  color,
  borderGlow = true,
  onPress,
  animated = false,
}) => {
  const { isDarkMode } = useThemeStore();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  const intensityMap = {
    subtle: isDarkMode ? 30 : 20,
    medium: isDarkMode ? 50 : 40,
    strong: isDarkMode ? 80 : 60,
  };

  const tintColors = {
    light: isDarkMode ? 'dark' : 'light',
    dark: 'dark',
    colored: isDarkMode ? 'dark' : 'light',
  };

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.8,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
    onPress?.();
  };

  const glassColor = color || (isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)');
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)';

  const CardContent = (
    <>
      <BlurView
        intensity={intensityMap[intensity]}
        tint={tintColors[tint] as 'light' | 'dark'}
        style={StyleSheet.absoluteFill}
      />

      {/* Inner glass effect */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: glassColor }]} />

      {/* Gradient overlay for depth */}
      <LinearGradient
        colors={[
          isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.4)',
          'transparent',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFill, { height: '50%' }]}
      />

      {/* Border glow */}
      {borderGlow && (
        <Animated.View
          style={[
            styles.liquidBorder,
            {
              borderColor,
              opacity: animated ? glowAnim : 0.7,
            },
          ]}
        />
      )}

      {/* Content */}
      <View style={styles.liquidContent}>{children}</View>
    </>
  );

  if (onPress) {
    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.liquidCard, style]}
        >
          {CardContent}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={[styles.liquidCard, style]}>
      {CardContent}
    </View>
  );
};

// ============================================
// LIQUID GLASS BUTTON
// ============================================
interface LiquidButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shineAnim = useRef(new Animated.Value(-1)).current;

  const sizeStyles = {
    small: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14 },
    medium: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16 },
    large: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 18 },
  };

  useEffect(() => {
    if (variant === 'primary' && !disabled) {
      Animated.loop(
        Animated.sequence([
          Animated.delay(3000),
          Animated.timing(shineAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(shineAnim, {
            toValue: -1,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [variant, disabled]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
    if (!disabled && !loading) onPress();
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          background: [colors.primary, colors.secondary],
          textColor: '#FFFFFF',
        };
      case 'secondary':
        return {
          background: [colors.surface, colors.surfaceAlt],
          textColor: colors.textPrimary,
        };
      case 'ghost':
        return {
          background: ['transparent', 'transparent'],
          textColor: colors.primary,
        };
    }
  };

  const buttonConfig = getButtonStyle();

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        fullWidth && { width: '100%' },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.liquidButton,
          {
            paddingVertical: sizeStyles[size].paddingVertical,
            paddingHorizontal: sizeStyles[size].paddingHorizontal,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {variant !== 'ghost' && (
          <LinearGradient
            colors={buttonConfig.background as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Glass overlay */}
        {variant === 'primary' && (
          <LinearGradient
            colors={['rgba(255,255,255,0.25)', 'transparent']}
            style={[StyleSheet.absoluteFill, { height: '50%' }]}
          />
        )}

        {/* Shine effect */}
        {variant === 'primary' && (
          <Animated.View
            style={[
              styles.shineEffect,
              {
                transform: [{
                  translateX: shineAnim.interpolate({
                    inputRange: [-1, 1],
                    outputRange: [-200, 200],
                  }),
                }],
              },
            ]}
          />
        )}

        {/* Border for secondary/ghost */}
        {variant !== 'primary' && (
          <View
            style={[
              styles.buttonBorder,
              { borderColor: variant === 'ghost' ? colors.primary : colors.border },
            ]}
          />
        )}

        <View style={styles.buttonContent}>
          {loading ? (
            <Animated.View style={styles.loadingSpinner}>
              <Feather name="loader" size={20} color={buttonConfig.textColor} />
            </Animated.View>
          ) : (
            <>
              {icon && (
                <Feather
                  name={icon as any}
                  size={sizeStyles[size].fontSize + 2}
                  color={buttonConfig.textColor}
                  style={{ marginRight: 8 }}
                />
              )}
              <Text
                style={[
                  styles.buttonText,
                  {
                    fontSize: sizeStyles[size].fontSize,
                    color: buttonConfig.textColor,
                  },
                ]}
              >
                {title}
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================
// LIQUID GLASS NAV BAR
// ============================================
interface LiquidNavBarProps {
  title?: string;
  subtitle?: string;
  leftAction?: {
    icon: string;
    onPress: () => void;
  };
  rightAction?: {
    icon: string;
    onPress: () => void;
    badge?: number;
  };
}

export const LiquidNavBar: React.FC<LiquidNavBarProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
}) => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={styles.navBarContainer}>
      <BlurView
        intensity={isDarkMode ? 60 : 80}
        tint={isDarkMode ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />

      {/* Gradient border at bottom */}
      <LinearGradient
        colors={[colors.primary + '30', colors.secondary + '30', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.navBarBorder}
      />

      <View style={styles.navBarContent}>
        {leftAction ? (
          <TouchableOpacity
            style={styles.navBarAction}
            onPress={leftAction.onPress}
          >
            <Feather name={leftAction.icon as any} size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.navBarAction} />
        )}

        <View style={styles.navBarCenter}>
          {title && (
            <Text style={[styles.navBarTitle, { color: colors.textPrimary }]}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={[styles.navBarSubtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>

        {rightAction ? (
          <TouchableOpacity
            style={styles.navBarAction}
            onPress={rightAction.onPress}
          >
            <Feather name={rightAction.icon as any} size={24} color={colors.textPrimary} />
            {rightAction.badge && rightAction.badge > 0 && (
              <View style={[styles.navBarBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.navBarBadgeText}>
                  {rightAction.badge > 99 ? '99+' : rightAction.badge}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.navBarAction} />
        )}
      </View>
    </View>
  );
};

// ============================================
// LIQUID GLASS BOTTOM SHEET
// ============================================
interface LiquidBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number | string;
  title?: string;
}

export const LiquidBottomSheet: React.FC<LiquidBottomSheetProps> = ({
  visible,
  onClose,
  children,
  height = '60%',
  title,
}) => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Backdrop */}
      <Animated.View
        style={[styles.sheetBackdrop, { opacity: fadeAnim }]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheetContainer,
          {
            height,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <BlurView
          intensity={isDarkMode ? 80 : 90}
          tint={isDarkMode ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />

        {/* Glass effect */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDarkMode
                ? 'rgba(30, 30, 40, 0.8)'
                : 'rgba(255, 255, 255, 0.85)',
            },
          ]}
        />

        {/* Handle */}
        <View style={styles.sheetHandle}>
          <View style={[styles.handleBar, { backgroundColor: colors.border }]} />
        </View>

        {/* Title */}
        {title && (
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>
              {title}
            </Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.sheetContent}>{children}</View>
      </Animated.View>
    </View>
  );
};

// ============================================
// LIQUID GLASS PILL / CHIP
// ============================================
interface LiquidPillProps {
  label: string;
  icon?: string;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
  size?: 'small' | 'medium';
}

export const LiquidPill: React.FC<LiquidPillProps> = ({
  label,
  icon,
  selected = false,
  onPress,
  color,
  size = 'medium',
}) => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const accentColor = color || colors.primary;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
    onPress?.();
  };

  const sizeStyles = {
    small: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 12 },
    medium: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14 },
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={[
          styles.liquidPill,
          {
            paddingVertical: sizeStyles[size].paddingVertical,
            paddingHorizontal: sizeStyles[size].paddingHorizontal,
            backgroundColor: selected
              ? accentColor + '20'
              : isDarkMode
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.05)',
            borderColor: selected ? accentColor : 'transparent',
          },
        ]}
      >
        {icon && (
          <Feather
            name={icon as any}
            size={sizeStyles[size].fontSize + 2}
            color={selected ? accentColor : colors.textSecondary}
            style={{ marginRight: 6 }}
          />
        )}
        <Text
          style={[
            styles.pillText,
            {
              fontSize: sizeStyles[size].fontSize,
              color: selected ? accentColor : colors.textSecondary,
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================
// LIQUID PROGRESS RING
// ============================================
interface LiquidProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}

export const LiquidProgressRing: React.FC<LiquidProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 10,
  color,
  children,
}) => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const progressColor = color || colors.primary;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: progress,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.progressRingContainer, { width: size, height: size }]}>
      {/* Background glow */}
      <View
        style={[
          styles.progressGlow,
          {
            width: size + 20,
            height: size + 20,
            borderRadius: (size + 20) / 2,
            backgroundColor: progressColor + '20',
          },
        ]}
      />

      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />

        {/* Glass effect on progress */}
        <Defs>
          <LinearGradient id="glassGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </LinearGradient>
        </Defs>
      </Svg>

      {/* Center content */}
      <View style={styles.progressCenter}>{children}</View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ============================================
// LIQUID GLASS INPUT
// ============================================
interface LiquidInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  maxLength?: number;
}

export const LiquidInput: React.FC<LiquidInputProps> = ({
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry,
  multiline,
  maxLength,
}) => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      colors.primary,
    ],
  });

  return (
    <Animated.View
      style={[
        styles.liquidInput,
        {
          backgroundColor: isDarkMode
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(0,0,0,0.03)',
          borderColor,
        },
      ]}
    >
      {icon && (
        <Feather
          name={icon as any}
          size={20}
          color={isFocused ? colors.primary : colors.textSecondary}
          style={{ marginRight: 12 }}
        />
      )}
      <TextInput
        style={[
          styles.inputText,
          { color: colors.textPrimary },
          multiline && { minHeight: 100, textAlignVertical: 'top' },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        maxLength={maxLength}
      />
    </Animated.View>
  );
};

// Need to import useState and TextInput
import { useState } from 'react';
import { TextInput } from 'react-native';

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  // Liquid Card
  liquidCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  liquidBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  liquidContent: {
    padding: Spacing.lg,
  },

  // Liquid Button
  liquidButton: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  buttonBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '700',
  },
  shineEffect: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ skewX: '-20deg' }],
  },
  loadingSpinner: {
    // Rotation animation would be added here
  },

  // Nav Bar
  navBarContainer: {
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
    overflow: 'hidden',
  },
  navBarBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  navBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  navBarAction: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  navBarCenter: {
    flex: 1,
    alignItems: 'center',
  },
  navBarTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  navBarSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  navBarBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  navBarBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Bottom Sheet
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: BorderRadius.bottomSheet,
    borderTopRightRadius: BorderRadius.bottomSheet,
    overflow: 'hidden',
  },
  sheetHandle: {
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  handleBar: {
    width: 36,
    height: 5,
    borderRadius: 3,
  },
  sheetHeader: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },

  // Liquid Pill
  liquidPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.pill,
    borderWidth: 1.5,
  },
  pillText: {
    fontWeight: '600',
  },

  // Progress Ring
  progressRingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressGlow: {
    position: 'absolute',
  },
  progressCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Liquid Input
  liquidInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
  },
});

export default {
  LiquidGlassCard,
  LiquidButton,
  LiquidNavBar,
  LiquidBottomSheet,
  LiquidPill,
  LiquidProgressRing,
  LiquidInput,
};
