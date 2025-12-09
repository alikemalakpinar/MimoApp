// app/(tabs)/_layout.tsx - PREMIUM 2026 TAB BAR WITH ANIMATIONS
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, useThemeStore } from '../../shared/theme';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

// Animated Tab Icon with ripple effect
interface AnimatedTabIconProps {
  name: string;
  color: string;
  focused: boolean;
  badge?: number;
  showDot?: boolean;
  label: string;
}

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({
  name,
  color,
  focused,
  badge,
  showDot,
  label,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const labelOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (focused) {
      // Trigger haptic feedback
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Bounce animation
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
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

      // Bounce up
      Animated.spring(bounceAnim, {
        toValue: -8,
        friction: 5,
        useNativeDriver: true,
      }).start();

      // Glow effect
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Show label
      Animated.timing(labelOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(bounceAnim, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }).start();

      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(labelOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [focused]);

  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        { transform: [{ translateY: bounceAnim }, { scale: scaleAnim }] },
      ]}
    >
      {/* Glow background for focused state */}
      {focused && (
        <Animated.View
          style={[
            styles.iconGlow,
            {
              opacity: glowAnim,
              backgroundColor: colors.primary + '30',
            },
          ]}
        />
      )}

      {/* Active indicator pill */}
      {focused && (
        <Animated.View style={[styles.activePill, { backgroundColor: colors.primary }]}>
          <LinearGradient
            colors={[colors.primary, isDarkMode ? '#8B5CF6' : '#6366F1']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
      )}

      {/* Icon */}
      <Feather
        name={name as any}
        size={focused ? 24 : 22}
        color={focused ? '#FFFFFF' : color}
      />

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <View style={styles.badge}>
          <LinearGradient
            colors={['#EF4444', '#F97316']}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
        </View>
      )}

      {/* Notification dot */}
      {showDot && (
        <View style={[styles.dot, { backgroundColor: colors.accent }]} />
      )}

      {/* Label */}
      <Animated.Text
        style={[
          styles.tabLabel,
          {
            opacity: labelOpacity,
            color: colors.primary,
          },
        ]}
      >
        {label}
      </Animated.Text>
    </Animated.View>
  );
};

// Center FAB Button for special action
const CenterFAB: React.FC<{
  focused: boolean;
  onPress?: () => void;
}> = ({ focused, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (focused) {
      Animated.spring(rotateAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(rotateAnim, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
  }, [focused]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.fabContainer}
    >
      <Animated.View
        style={[
          styles.fab,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <LinearGradient
          colors={isDarkMode ? ['#6366F1', '#8B5CF6'] : ['#6366F1', '#4F46E5']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Feather name="compass" size={26} color="#FFFFFF" />
          </Animated.View>
        </LinearGradient>
        {/* Glow effect */}
        <View style={[styles.fabGlow, { backgroundColor: isDarkMode ? '#6366F1' : '#4F46E5' }]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function TabsLayout() {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  // Mock notification counts
  const chatBadge = 3;
  const hasNewStory = true;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          height: Platform.OS === 'ios' ? 90 : 75,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 12,
          paddingHorizontal: 10,
          borderTopWidth: 0,
          backgroundColor: isDarkMode ? 'rgba(10,10,21,0.95)' : 'rgba(255,255,255,0.95)',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: isDarkMode ? 0.3 : 0.1,
          shadowRadius: 20,
          elevation: 20,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="home"
              color={color}
              focused={focused}
              label="Ana Sayfa"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="search"
              color={color}
              focused={focused}
              label="Keşfet"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CenterFAB focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="message-circle"
              color={color}
              focused={focused}
              badge={chatBadge}
              label="Mesajlar"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="user"
              color={color}
              focused={focused}
              label="Profil"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          href: null,
        }}
      />
      {/* Journal folder routes - hidden from tab bar but accessible */}
      <Tabs.Screen
        name="journal/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="journal/new"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 50,
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    top: -4,
  },
  activePill: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
    top: -4,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    top: -2,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    position: 'absolute',
    bottom: -16,
  },

  // Center FAB
  fabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 20,
    overflow: 'visible',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabGlow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    opacity: 0.2,
    top: -5,
    left: -5,
    zIndex: -1,
  },
});
