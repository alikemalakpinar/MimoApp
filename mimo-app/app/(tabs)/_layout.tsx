// app/(tabs)/_layout.tsx - INSTAGRAM-STYLE NAVIGATION
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../shared/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.textPrimary,
        tabBarInactiveTintColor: Colors.light.textSecondary,
        tabBarStyle: {
          height: 85,
          paddingBottom: 30,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: Colors.light.divider,
          backgroundColor: Colors.light.surface,
          elevation: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="search" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="plus-square" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="message-circle" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
