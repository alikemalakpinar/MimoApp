// app/(tabs)/_layout.tsx - MODERN BOTTOM NAV (LIKE INSTAGRAM)
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
        tabBarLabelStyle: {
          fontSize: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="home" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Ara',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="search" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Randevular',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="calendar" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Mesajlar',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="message-circle" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="user" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
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
