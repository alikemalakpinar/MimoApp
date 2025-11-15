// app/(tabs)/profile.tsx
import React, { useState } from 'react';
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
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOCK_USER = {
  name: 'Ayşe Yılmaz',
  email: 'ayse@email.com',
  phone: '+90 555 123 4567',
  memberSince: 'Ocak 2025',
  avatar: '👩',
};

const MENU_ITEMS = [
  {
    section: 'Hesap',
    items: [
      { icon: 'user', label: 'Profil Bilgilerim', route: '/profile/edit' },
      { icon: 'credit-card', label: 'Ödeme Yöntemi', route: '/profile/payment' },
      { icon: 'file-text', label: 'Seans Geçmişim', route: '/profile/history' },
      { icon: 'heart', label: 'Ruh Hali Raporlarım', route: '/profile/mood-reports' },
    ],
  },
  {
    section: 'Tercihler',
    items: [
      { icon: 'bell', label: 'Bildirim Ayarları', route: '/profile/notifications' },
      { icon: 'lock', label: 'Gizlilik ve Güvenlik', route: '/profile/privacy' },
      { icon: 'moon', label: 'Koyu Mod', route: '/profile/theme', toggle: true },
    ],
  },
  {
    section: 'Destek',
    items: [
      { icon: 'help-circle', label: 'Yardım Merkezi', route: '/help' },
      { icon: 'message-square', label: 'Geri Bildirim Gönder', route: '/feedback' },
      { icon: 'shield', label: 'Kullanım Şartları', route: '/(legal)/terms' },
      { icon: 'info', label: 'Gizlilik Politikası', route: '/(legal)/privacy' },
    ],
  },
];

export default function Profile() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: () => {
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Feather name="settings" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{MOCK_USER.avatar}</Text>
          </View>
          <Text style={styles.userName}>{MOCK_USER.name}</Text>
          <Text style={styles.userEmail}>{MOCK_USER.email}</Text>
          <Text style={styles.memberSince}>Üye: {MOCK_USER.memberSince}</Text>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <Feather name="edit-2" size={16} color={Colors.light.primary} />
            <Text style={styles.editProfileText}>Profili Düzenle</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Toplam Seans</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Haftalık Takip</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>Memnuniyet</Text>
          </View>
        </View>

        {/* Menu Sections */}
        {MENU_ITEMS.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex !== section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={() => {
                    if (item.toggle) {
                      setDarkMode(!darkMode);
                    } else {
                      // router.push(item.route);
                      console.log('Navigate to', item.route);
                    }
                  }}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.menuIcon, { backgroundColor: Colors.light.primary + '15' }]}>
                      <Feather name={item.icon as any} size={20} color={Colors.light.primary} />
                    </View>
                    <Text style={styles.menuItemText}>{item.label}</Text>
                  </View>
                  {item.toggle ? (
                    <View
                      style={[
                        styles.toggle,
                        darkMode && styles.toggleActive,
                      ]}
                    >
                      <View style={[
                        styles.toggleThumb,
                        darkMode && styles.toggleThumbActive,
                      ]} />
                    </View>
                  ) : (
                    <Feather name="chevron-right" size={20} color={Colors.light.textLight} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color={Colors.light.error} />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Versiyon 1.0.0</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  headerTitle: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  profileCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },

  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  avatar: {
    fontSize: 40,
  },

  userName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  userEmail: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },

  memberSince: {
    fontSize: Typography.sm,
    color: Colors.light.textLight,
    marginBottom: Spacing.md,
  },

  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary + '10',
    gap: Spacing.xs,
  },

  editProfileText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.light.primary,
  },

  statsContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },

  statBox: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },

  statNumber: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.primary,
    marginBottom: Spacing.xs,
  },

  statLabel: {
    fontSize: Typography.xs,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },

  menuSection: {
    marginBottom: Spacing.lg,
  },

  sectionTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },

  menuCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },

  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },

  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  menuItemText: {
    fontSize: Typography.base,
    color: Colors.light.textPrimary,
  },

  toggle: {
    width: 48,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.border,
    padding: 2,
    justifyContent: 'center',
  },

  toggleActive: {
    backgroundColor: Colors.light.primary,
  },

  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
  },

  toggleThumbActive: {
    alignSelf: 'flex-end',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.error + '10',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },

  logoutText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.error,
  },

  version: {
    fontSize: Typography.xs,
    color: Colors.light.textLight,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
