// shared/components/AnimatedUI.tsx - Animated UI components
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Vibration,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';

const { width, height } = Dimensions.get('window');

// ============================================
// ANIMATED LIKE BUTTON
// ============================================
interface LikeButtonProps {
  liked: boolean;
  count: number;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
}

export const AnimatedLikeButton: React.FC<LikeButtonProps> = ({
  liked,
  count,
  onPress,
  size = 'medium',
  showCount = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(liked ? 1 : 0)).current;
  const floatingHearts = useRef<Animated.Value[]>([]).current;

  const iconSize = size === 'small' ? 18 : size === 'large' ? 28 : 22;
  const fontSize = size === 'small' ? 12 : size === 'large' ? 16 : 14;

  const handlePress = () => {
    // Haptic feedback
    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }

    // Scale animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.8,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Heart fill animation
    Animated.spring(heartScale, {
      toValue: liked ? 0 : 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Create floating heart if liking
    if (!liked) {
      createFloatingHeart();
    }

    onPress();
  };

  const createFloatingHeart = () => {
    const floatAnim = new Animated.Value(0);
    floatingHearts.push(floatAnim);

    Animated.timing(floatAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      const index = floatingHearts.indexOf(floatAnim);
      if (index > -1) {
        floatingHearts.splice(index, 1);
      }
    });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={styles.likeButton}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Feather
            name={liked ? 'heart' : 'heart'}
            size={iconSize}
            color={liked ? Colors.light.accent : Colors.light.textSecondary}
            style={{ opacity: liked ? 0 : 1 }}
          />
          <Animated.View
            style={[
              styles.heartFill,
              {
                transform: [{ scale: heartScale }],
                opacity: heartScale,
              },
            ]}
          >
            <Feather name="heart" size={iconSize} color={Colors.light.accent} />
          </Animated.View>
        </Animated.View>
        {showCount && (
          <Text style={[styles.likeCount, { fontSize, color: liked ? Colors.light.accent : Colors.light.textSecondary }]}>
            {count}
          </Text>
        )}
      </TouchableOpacity>

      {/* Floating hearts */}
      {floatingHearts.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.floatingHeart,
            {
              opacity: anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 1, 0],
              }),
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -50],
                  }),
                },
                {
                  scale: anim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.5, 1.2, 0.8],
                  }),
                },
              ],
            },
          ]}
        >
          <Feather name="heart" size={16} color={Colors.light.accent} />
        </Animated.View>
      ))}
    </View>
  );
};

// ============================================
// TOAST NOTIFICATION
// ============================================
export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
}

const toastConfig = {
  success: { icon: 'check-circle', color: Colors.light.success, bgColor: Colors.light.successLight },
  error: { icon: 'x-circle', color: Colors.light.error, bgColor: Colors.light.errorLight },
  warning: { icon: 'alert-triangle', color: Colors.light.warning, bgColor: Colors.light.warningLight },
  info: { icon: 'info', color: Colors.light.info, bgColor: Colors.light.infoLight },
};

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide?.();
    });
  };

  if (!visible) return null;

  const config = toastConfig[type];

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          transform: [{ translateY }],
          opacity,
          backgroundColor: config.bgColor,
        },
      ]}
    >
      <Feather name={config.icon as any} size={20} color={config.color} />
      <Text style={[styles.toastText, { color: config.color }]}>{message}</Text>
      <TouchableOpacity onPress={hideToast}>
        <Feather name="x" size={18} color={config.color} />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Toast Context for global usage
import { createContext, useContext } from 'react';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// ============================================
// EMPTY STATE
// ============================================
interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: 'inbox' | 'search' | 'error' | 'empty';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.emptyContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.emptyIconContainer}>
        <Feather name={icon as any} size={48} color={Colors.light.textTertiary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {description && <Text style={styles.emptyDescription}>{description}</Text>}
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.emptyButton} onPress={onAction} activeOpacity={0.8}>
          <Text style={styles.emptyButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// ============================================
// ANIMATED BUTTON
// ============================================
interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [loading]);

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
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const buttonStyle = [
    styles.animatedButton,
    variant === 'primary' && styles.buttonPrimary,
    variant === 'secondary' && styles.buttonSecondary,
    variant === 'ghost' && styles.buttonGhost,
    size === 'small' && styles.buttonSmall,
    size === 'large' && styles.buttonLarge,
    disabled && styles.buttonDisabled,
  ];

  const textStyle = [
    styles.buttonText,
    variant === 'primary' && styles.buttonTextPrimary,
    variant === 'secondary' && styles.buttonTextSecondary,
    variant === 'ghost' && styles.buttonTextGhost,
    size === 'small' && styles.buttonTextSmall,
    size === 'large' && styles.buttonTextLarge,
    disabled && styles.buttonTextDisabled,
  ];

  const iconSize = size === 'small' ? 16 : size === 'large' ? 22 : 18;
  const iconColor = variant === 'primary' ? '#FFFFFF' : Colors.light.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
    >
      <Animated.View style={[buttonStyle, { transform: [{ scale: scaleAnim }] }]}>
        {loading ? (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Feather name="loader" size={iconSize} color={iconColor} />
          </Animated.View>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Feather name={icon as any} size={iconSize} color={disabled ? Colors.light.textTertiary : iconColor} style={{ marginRight: 8 }} />
            )}
            <Text style={textStyle}>{title}</Text>
            {icon && iconPosition === 'right' && (
              <Feather name={icon as any} size={iconSize} color={disabled ? Colors.light.textTertiary : iconColor} style={{ marginLeft: 8 }} />
            )}
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

// ============================================
// PULL TO REFRESH INDICATOR
// ============================================
interface PullIndicatorProps {
  progress: number;
  refreshing: boolean;
}

export const PullRefreshIndicator: React.FC<PullIndicatorProps> = ({ progress, refreshing }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (refreshing) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [refreshing]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scale = Math.min(progress, 1);

  return (
    <View style={styles.pullIndicator}>
      <Animated.View
        style={{
          transform: [
            { scale },
            { rotate: refreshing ? spin : `${progress * 360}deg` },
          ],
        }}
      >
        <Feather name="refresh-cw" size={24} color={Colors.light.primary} />
      </Animated.View>
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  // Like Button
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heartFill: {
    position: 'absolute',
  },
  likeCount: {
    fontWeight: '600',
  },
  floatingHeart: {
    position: 'absolute',
    top: -10,
    left: 0,
  },

  // Toast
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: Spacing.xl,
    right: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.md,
    ...Shadows.lg,
    zIndex: 9999,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.button,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Animated Button
  animatedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.button,
  },
  buttonPrimary: {
    backgroundColor: Colors.light.primary,
    ...Shadows.primary,
  },
  buttonSecondary: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonSmall: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  buttonLarge: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
  },
  buttonDisabled: {
    backgroundColor: Colors.light.border,
    shadowOpacity: 0,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: Colors.light.textPrimary,
  },
  buttonTextGhost: {
    color: Colors.light.primary,
  },
  buttonTextSmall: {
    fontSize: 13,
  },
  buttonTextLarge: {
    fontSize: 17,
  },
  buttonTextDisabled: {
    color: Colors.light.textTertiary,
  },

  // Pull Indicator
  pullIndicator: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default {
  AnimatedLikeButton,
  Toast,
  EmptyState,
  AnimatedButton,
  PullRefreshIndicator,
};
