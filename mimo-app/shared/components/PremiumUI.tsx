// shared/components/PremiumUI.tsx - Premium glassmorphism and visual effects
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';

const { width } = Dimensions.get('window');

// ============================================
// GLASSMORPHISM CARD
// ============================================
interface GlassCardProps {
  children: React.ReactNode;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: ViewStyle;
  borderRadius?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  intensity = 50,
  tint = 'light',
  style,
  borderRadius = BorderRadius.xl,
}) => {
  return (
    <View style={[styles.glassContainer, { borderRadius }, style]}>
      <BlurView
        intensity={intensity}
        tint={tint}
        style={[styles.glassBlur, { borderRadius }]}
      >
        <View style={[styles.glassContent, { borderRadius }]}>
          {children}
        </View>
      </BlurView>
      <View style={[styles.glassBorder, { borderRadius }]} />
    </View>
  );
};

// ============================================
// GLASSMORPHISM HEADER
// ============================================
interface GlassHeaderProps {
  title?: string;
  subtitle?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({
  title,
  subtitle,
  leftComponent,
  rightComponent,
  transparent = false,
}) => {
  return (
    <View style={styles.headerContainer}>
      {!transparent && (
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
      )}
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>{leftComponent}</View>
        <View style={styles.headerCenter}>
          {title && <Text style={styles.headerTitle}>{title}</Text>}
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.headerRight}>{rightComponent}</View>
      </View>
    </View>
  );
};

// ============================================
// GRADIENT BORDER CARD
// ============================================
interface GradientBorderCardProps {
  children: React.ReactNode;
  gradientColors?: string[];
  borderWidth?: number;
  style?: ViewStyle;
}

export const GradientBorderCard: React.FC<GradientBorderCardProps> = ({
  children,
  gradientColors = [Colors.light.primary, Colors.light.secondary],
  borderWidth = 2,
  style,
}) => {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientBorder, { padding: borderWidth }, style]}
    >
      <View style={styles.gradientBorderInner}>
        {children}
      </View>
    </LinearGradient>
  );
};

// ============================================
// SHIMMER EFFECT
// ============================================
interface ShimmerProps {
  width?: number | string;
  height?: number;
  style?: ViewStyle;
}

export const Shimmer: React.FC<ShimmerProps> = ({
  width: w = '100%',
  height = 20,
  style,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.shimmerContainer, { width: w, height }, style]}>
      <Animated.View
        style={[
          styles.shimmerEffect,
          { transform: [{ translateX }] },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

// ============================================
// GLOW EFFECT
// ============================================
interface GlowProps {
  color?: string;
  intensity?: number;
  size?: number;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Glow: React.FC<GlowProps> = ({
  color = Colors.light.primary,
  intensity = 0.5,
  size = 20,
  children,
  style,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.glowContainer, style]}>
      <Animated.View
        style={[
          styles.glowEffect,
          {
            backgroundColor: color,
            opacity: intensity,
            shadowColor: color,
            shadowRadius: size,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      {children}
    </View>
  );
};

// ============================================
// ANIMATED GRADIENT BACKGROUND
// ============================================
interface AnimatedGradientProps {
  colors?: string[][];
  duration?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  colors = [
    [Colors.light.primary, Colors.light.secondary],
    [Colors.light.secondary, Colors.light.accent],
    [Colors.light.accent, Colors.light.primary],
  ],
  duration = 3000,
  style,
  children,
}) => {
  const colorIndex = useRef(0);
  const animValue = useRef(new Animated.Value(0)).current;
  const [currentColors, setCurrentColors] = React.useState(colors[0]);

  useEffect(() => {
    const animate = () => {
      Animated.timing(animValue, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      }).start(() => {
        colorIndex.current = (colorIndex.current + 1) % colors.length;
        setCurrentColors(colors[colorIndex.current]);
        animValue.setValue(0);
        animate();
      });
    };
    animate();
  }, []);

  return (
    <LinearGradient
      colors={currentColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[StyleSheet.absoluteFill, style]}
    >
      {children}
    </LinearGradient>
  );
};

// ============================================
// FLOATING ACTION BUTTON
// ============================================
interface FABProps {
  icon: React.ReactNode;
  onPress: () => void;
  color?: string;
  size?: number;
  style?: ViewStyle;
}

export const FloatingActionButton: React.FC<FABProps> = ({
  icon,
  onPress,
  color = Colors.light.primary,
  size = 56,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View
      style={[
        styles.fab,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          borderRadius: size / 2,
          shadowColor: color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: shadowAnim,
          shadowRadius: 8,
          elevation: 8,
        }}
      />
      <View
        style={styles.fabContent}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
      >
        {icon}
      </View>
    </Animated.View>
  );
};

// ============================================
// PREMIUM BADGE
// ============================================
interface PremiumBadgeProps {
  type?: 'gold' | 'silver' | 'bronze' | 'diamond';
  size?: 'small' | 'medium' | 'large';
}

const badgeConfig = {
  gold: { colors: ['#FFD700', '#FFA500'], icon: '👑', label: 'Premium' },
  silver: { colors: ['#C0C0C0', '#A0A0A0'], icon: '⭐', label: 'Plus' },
  bronze: { colors: ['#CD7F32', '#8B4513'], icon: '🏆', label: 'Pro' },
  diamond: { colors: ['#B9F2FF', '#00CED1'], icon: '💎', label: 'VIP' },
};

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  type = 'gold',
  size = 'medium',
}) => {
  const config = badgeConfig[type];
  const sizeMap = { small: 20, medium: 28, large: 36 };
  const fontSize = sizeMap[size];

  return (
    <LinearGradient
      colors={config.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.premiumBadge,
        {
          paddingVertical: fontSize / 4,
          paddingHorizontal: fontSize / 2,
          borderRadius: fontSize,
        },
      ]}
    >
      <Text style={{ fontSize: fontSize * 0.6 }}>{config.icon}</Text>
      <Text style={[styles.premiumBadgeText, { fontSize: fontSize * 0.4 }]}>
        {config.label}
      </Text>
    </LinearGradient>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  // Glass Card
  glassContainer: {
    overflow: 'hidden',
  },
  glassBlur: {
    overflow: 'hidden',
  },
  glassContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: Spacing.lg,
  },
  glassBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Glass Header
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.glassBorder,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },

  // Gradient Border
  gradientBorder: {
    borderRadius: BorderRadius.xl,
  },
  gradientBorderInner: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl - 2,
    overflow: 'hidden',
  },

  // Shimmer
  shimmerContainer: {
    backgroundColor: Colors.light.border,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  shimmerEffect: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
  },

  // Glow
  glowContainer: {
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 100,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 100,
    right: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  fabContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Premium Badge
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  premiumBadgeText: {
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default {
  GlassCard,
  GlassHeader,
  GradientBorderCard,
  Shimmer,
  Glow,
  AnimatedGradient,
  FloatingActionButton,
  PremiumBadge,
};
