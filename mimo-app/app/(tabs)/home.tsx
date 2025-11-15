// app/(tabs)/home.tsx - MINIMAL & CLEAN REDESIGN
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';

const MOCK_USER = {
  name: 'Ayşe',
  initials: 'AY',
};

const TODAY_TASKS = [
  { id: '1', title: 'Günlüğünü yaz', icon: 'edit-3', completed: false },
  { id: '2', title: 'Mood check-in', icon: 'heart', completed: true },
  { id: '3', title: '15 dk meditasyon', icon: 'clock', completed: false },
];

const UPCOMING_SESSION = {
  therapist: 'Dr. Elif Yılmaz',
  date: '08 Mar 2025',
  time: '14:00',
};

export default function Home() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Merhaba,</Text>
          <Text style={styles.userName}>{MOCK_USER.name}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Feather name="bell" size={22} color={Colors.light.textPrimary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={styles.profileInitials}>{MOCK_USER.initials}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Calendar/Notification Card */}
        {UPCOMING_SESSION && (
          <View style={styles.notificationCard}>
            <View style={styles.notificationLeft}>
              <View style={styles.notificationIcon}>
                <Feather name="calendar" size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Yaklaşan randevu</Text>
                <Text style={styles.notificationText}>
                  {UPCOMING_SESSION.therapist} • {UPCOMING_SESSION.time}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.notificationArrow}
              onPress={() => router.push('/(tabs)/appointments')}
            >
              <Feather name="chevron-right" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Mood Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood Tracking</Text>
          <View style={styles.moodCard}>
            <View style={styles.moodWeek}>
              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, index) => (
                <View key={day} style={styles.moodDay}>
                  <Text style={styles.moodDayLabel}>{day}</Text>
                  <View style={[
                    styles.moodIndicator,
                    index < 5 && styles.moodIndicatorFilled,
                  ]} />
                </View>
              ))}
            </View>
            <TouchableOpacity 
              style={styles.moodButton}
              onPress={() => router.push('/(patient)/mood/check-in')}
            >
              <Text style={styles.moodButtonText}>Ruh halini kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Günlük görevler</Text>
            <Text style={styles.sectionSubtitle}>2/3 tamamlandı</Text>
          </View>
          <View style={styles.tasksCard}>
            {TODAY_TASKS.map((task) => (
              <TouchableOpacity key={task.id} style={styles.taskItem}>
                <View style={styles.taskLeft}>
                  <View style={[
                    styles.taskCheckbox,
                    task.completed && styles.taskCheckboxCompleted,
                  ]}>
                    {task.completed && (
                      <Feather name="check" size={14} color={Colors.light.surface} />
                    )}
                  </View>
                  <View style={styles.taskIcon}>
                    <Feather name={task.icon as any} size={16} color={Colors.light.textSecondary} />
                  </View>
                  <Text style={[
                    styles.taskTitle,
                    task.completed && styles.taskTitleCompleted,
                  ]}>
                    {task.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı erişim</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/(tabs)/journal/new')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFE8DC' }]}>
                <Feather name="edit-3" size={22} color="#FF9982" />
              </View>
              <Text style={styles.quickActionLabel}>Günlük yaz</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/(patient)/therapist-search')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#E8F4FF' }]}>
                <Feather name="search" size={22} color={Colors.light.primary} />
              </View>
              <Text style={styles.quickActionLabel}>Terapist ara</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/(tabs)/feed')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#E8F8F0' }]}>
                <Feather name="users" size={22} color={Colors.light.secondary} />
              </View>
              <Text style={styles.quickActionLabel}>Topluluk</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/(patient)/mood/history')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFF5E8' }]}>
                <Feather name="bar-chart-2" size={22} color="#FFB84D" />
              </View>
              <Text style={styles.quickActionLabel}>Raporlar</Text>
            </TouchableOpacity>
          </View>
        </View>

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
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  greeting: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },

  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    letterSpacing: -0.5,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF8A80',
  },

  profileButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileInitials: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.surface,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },

  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xxl,
    ...Shadows.sm,
  },

  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  notificationContent: {
    flex: 1,
  },

  notificationTitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },

  notificationText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  notificationArrow: {
    padding: Spacing.xs,
  },

  section: {
    marginBottom: Spacing.xxl,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  moodCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  moodWeek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },

  moodDay: {
    alignItems: 'center',
  },

  moodDayLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },

  moodIndicator: {
    width: 8,
    height: 32,
    borderRadius: 4,
    backgroundColor: Colors.light.border,
  },

  moodIndicatorFilled: {
    backgroundColor: Colors.light.primary,
  },

  moodButton: {
    backgroundColor: Colors.light.background,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },

  moodButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  tasksCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },

  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },

  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },

  taskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  taskCheckboxCompleted: {
    backgroundColor: Colors.light.secondary,
    borderColor: Colors.light.secondary,
  },

  taskIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  taskTitle: {
    fontSize: 15,
    color: Colors.light.textPrimary,
    flex: 1,
  },

  taskTitleCompleted: {
    color: Colors.light.textSecondary,
    textDecorationLine: 'line-through',
  },

  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },

  quickActionCard: {
    width: '48%',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.sm,
  },

  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    textAlign: 'center',
  },
});
