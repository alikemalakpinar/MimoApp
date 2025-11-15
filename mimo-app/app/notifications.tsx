// app/notifications.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'appointment',
    title: 'Randevu Yakınıyor',
    message: 'Dr. Elif Yılmaz ile randevunuz 1 saat sonra başlıyor.',
    time: '30 dk önce',
    read: false,
    icon: 'calendar',
    color: Colors.light.primary,
  },
  {
    id: '2',
    type: 'mood',
    title: 'Günlük Check-in',
    message: 'Bugünün ruh hali kayıdını yapmadın. Nasıl hissediyorsun?',
    time: '2 saat önce',
    read: false,
    icon: 'heart',
    color: Colors.light.secondary,
  },
  {
    id: '3',
    type: 'message',
    title: 'Yeni Mesaj',
    message: 'Dr. Mehmet Kaya sana bir mesaj gönderdi.',
    time: '1 gün önce',
    read: true,
    icon: 'message-circle',
    color: Colors.light.info,
  },
  {
    id: '4',
    type: 'community',
    title: 'Topluluk Güncelleme',
    message: 'Paylaşımına 5 yeni yorum geldi.',
    time: '2 gün önce',
    read: true,
    icon: 'users',
    color: Colors.light.accent,
  },
];

export default function Notifications() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bildirimler</Text>
        <TouchableOpacity style={styles.markAllButton}>
          <Feather name="check-circle" size={20} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_NOTIFICATIONS.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              !notification.read && styles.notificationCardUnread,
            ]}
          >
            <View style={[
              styles.iconContainer,
              { backgroundColor: notification.color + '15' },
            ]}>
              <Feather 
                name={notification.icon as any} 
                size={20} 
                color={notification.color} 
              />
            </View>
            
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                {!notification.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  backButton: {
    padding: Spacing.xs,
  },

  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
  },

  markAllButton: {
    padding: Spacing.xs,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  notificationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },

  notificationCardUnread: {
    backgroundColor: Colors.light.primary + '05',
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  notificationContent: {
    flex: 1,
  },

  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },

  notificationTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
    flex: 1,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary,
  },

  notificationMessage: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
    lineHeight: Typography.sm * 1.5,
    marginBottom: Spacing.xs,
  },

  notificationTime: {
    fontSize: Typography.xs,
    color: Colors.light.textLight,
  },
});
