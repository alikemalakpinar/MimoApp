// app/(tabs)/_layout.tsx - ANIMATED TAB BAR WITH BADGES
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform, Vibration } from 'react-native';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, useThemeStore } from '../../shared/theme';

// Badge component for notifications
interface BadgeProps {
  count?: number;
  visible?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ count, visible = false }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: visible ? 1 : 0,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible && count === undefined) return null;

  return (
    <Animated.View
      style={[
        styles.badge,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      {count !== undefined && count > 0 && (
        <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
      )}
    </Animated.View>
  );
};

// Animated tab icon component
interface AnimatedTabIconProps {
  name: string;
  color: string;
  focused: boolean;
  badge?: number;
  showDot?: boolean;
}

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({
  name,
  color,
  focused,
  badge,
  showDot,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.15,
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
    }
  }, [focused]);

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Feather name={name as any} size={26} color={color} />
      </Animated.View>
      {badge !== undefined && badge > 0 && (
        <Badge count={badge} visible={true} />
      )}
      {showDot && (
        <View style={[styles.dot, { backgroundColor: isDarkMode ? Colors.dark.accent : Colors.light.accent }]} />
      )}
      {focused && (
        <View
          style={[
            styles.activeIndicator,
            { backgroundColor: isDarkMode ? Colors.dark.primary : Colors.light.primary },
          ]}
        />
      )}
    </View>
  );
};

export default function TabsLayout() {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  // Mock notification counts (these would come from a store/context in a real app)
  const chatBadge = 3;
  const hasNewStory = true;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: colors.divider,
          backgroundColor: colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon name="search" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="compass"
              color={color}
              focused={focused}
              showDot={hasNewStory}
            />
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
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon name="user" color={color} focused={focused} />
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
    position: 'relative',
    width: 50,
    height: 40,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.light.surface,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    top: 0,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.light.surface,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
