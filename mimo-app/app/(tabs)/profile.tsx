// app/(tabs)/profile.tsx - MINIMAL REDESIGN
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOCK_USER = {
  name: 'Ayşe Yılmaz',
  email: 'ayse@email.com',
  initials: 'AY',
};

const MENU_SECTIONS = [
  {
    title: 'Hesap',
    items: [
      { icon: 'user', label: 'Profil Bilgileri', route: '/profile/edit' },
      { icon: 'credit-card', label: 'Ödeme Yöntemi', route: '/profile/payment' },
      { icon: 'file-text', label: 'Seans Geçmişi', route: '/profile/history' },
    ],
  },
  {
    title: 'Tercihler',
    items: [
      { icon: 'bell', label: 'Bildirimler', route: '/notifications' },
      { icon: 'lock', label: 'Gizlilik', route: '/profile/privacy' },
    ],
  },
  {
    title: 'Destek',
    items: [
      { icon: 'help-circle', label: 'Yardım', route: '/help' },
      { icon: 'info', label: 'Hakkında', route: '/about' },
    ],
  },
];

export default function Profile() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış',
          style: 'destructive',
          onPress: () => router.replace('/(auth)/welcome'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{MOCK_USER.initials}</Text>
          </View>
          <Text style={styles.userName}>{MOCK_USER.name}</Text>
          <Text style={styles.userEmail}>{MOCK_USER.email}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Seans</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Günlük</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>Puan</Text>
          </View>
        </View>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section, idx) => (
          <View key={idx} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIdx) => (
                <TouchableOpacity
                  key={itemIdx}
                  style={[
                    styles.menuItem,
                    itemIdx < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={() => console.log('Navigate to', item.route)}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIcon}>
                      <Feather name={item.icon as any} size={18} color={Colors.light.textPrimary} />
                    </View>
                    <Text style={styles.menuItemText}>{item.label}</Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={Colors.light.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={18} color="#FF8A80" />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <Text style={styles.version}>v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    letterSpacing: -0.5,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },

  profileCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.xxxl,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },

  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.surface,
  },

  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  userEmail: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xxl,
    ...Shadows.sm,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },

  statDivider: {
    width: 1,
    backgroundColor: Colors.light.border,
  },

  menuSection: {
    marginBottom: Spacing.lg,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },

  menuCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.xs,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },

  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },

  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  menuItemText: {
    fontSize: 15,
    color: Colors.light.textPrimary,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE8E6',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF8A80',
  },

  version: {
    fontSize: 12,
    color: Colors.light.textLight,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
