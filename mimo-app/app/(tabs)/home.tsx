// app/(tabs)/home.tsx - ULTRA PREMIUM & RICH CONTENT
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';

const { width } = Dimensions.get('window');

const MOOD_WEEK = [
  { day: 'Pzt', mood: 'happy', filled: true },
  { day: 'Sal', mood: 'neutral', filled: true },
  { day: 'Çar', mood: 'happy', filled: true },
  { day: 'Per', mood: 'sad', filled: true },
  { day: 'Cum', mood: 'happy', filled: true },
  { day: 'Cmt', mood: 'happy', filled: true },
  { day: 'Paz', mood: 'neutral', filled: false },
];

const MOOD_ICONS: Record<string, any> = {
  happy: 'smile',
  neutral: 'meh',
  sad: 'frown',
};

const DAILY_TASKS = [
  {
    id: '1',
    title: 'Your Qualities',
    subtitle: 'List min 5 qualities you like/dislike',
    icon: 'clipboard',
    color: '#D4F1E8',
  },
  {
    id: '2',
    title: 'Quiz',
    subtitle: 'Take a 3 min quiz',
    icon: 'help-circle',
    color: '#E0ECFF',
  },
  {
    id: '3',
    title: 'Daily Goal',
    subtitle: 'Healthy Habit',
    icon: 'sun',
    color: '#FFF4E0',
  },
];

const MY_DOCTORS = [
  {
    id: '1',
    name: 'Dr. Elif Yılmaz',
    title: 'Psikolog',
    avatar: 'EY',
    color: '#FFE8DC',
  },
  {
    id: '2',
    name: 'Dr. Mehmet Kaya',
    title: 'Psikiyatrist',
    avatar: 'MK',
    color: '#E8F8F0',
  },
];

const JOURNAL_DAYS = [
  { date: 1, filled: false },
  { date: 2, filled: true },
  { date: 3, filled: true },
  { date: 4, filled: true },
  { date: 5, filled: false },
  { date: 6, filled: false },
  { date: 7, filled: false },
  { date: 8, filled: true },
];

export default function Home() {
  const router = useRouter();
  const freudScore = 80;
  const journalProgress = 47;
  const totalJournalDays = 365;

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (freudScore / 100) * circumference;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>AY</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => router.push('/create-post')}>
            <Feather name="plus" size={24} color={Colors.light.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/notifications')}>
            <Feather name="bell" size={24} color={Colors.light.textPrimary} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Merhaba, Ayşe</Text>
          <Text style={styles.title}>Bugün Olumlu</Text>
        </View>

        {/* Mood Tracking */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mood Tracking</Text>
            <TouchableOpacity onPress={() => router.push('/(patient)/mood/history')}>
              <Text style={styles.seeAllText}>Tümü</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.moodCard}>
            <View style={styles.moodWeek}>
              {MOOD_WEEK.map((day, idx) => (
                <View key={idx} style={styles.moodDayItem}>
                  <View style={[
                    styles.moodIcon,
                    day.filled && styles.moodIconFilled,
                  ]}>
                    {day.filled && (
                      <Feather
                        name={MOOD_ICONS[day.mood]}
                        size={16}
                        color={Colors.light.textPrimary}
                      />
                    )}
                  </View>
                  <Text style={styles.moodDayLabel}>{day.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Freud Score & Health Journal Row */}
        <View style={styles.twoColumnSection}>
          {/* Freud Score */}
          <View style={[styles.halfCard, { backgroundColor: '#F5F5F0' }]}>
            <Text style={styles.cardTitle}>Freud score</Text>
            <View style={styles.circularProgress}>
              <Svg width="100" height="100">
                <Circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={Colors.light.border}
                  strokeWidth="8"
                  fill="transparent"
                />
                <Circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={Colors.light.primary}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </Svg>
              <View style={styles.scoreCenter}>
                <Text style={styles.scoreNumber}>{freudScore}</Text>
                <Text style={styles.scoreLabel}>Healthy</Text>
              </View>
            </View>
          </View>

          {/* Health Journal */}
          <View style={[styles.halfCard, { backgroundColor: Colors.light.surface }]}>
            <Text style={styles.cardTitle}>Health journal</Text>
            <View style={styles.journalCalendar}>
              {JOURNAL_DAYS.map((day, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.calendarDot,
                    day.filled && styles.calendarDotFilled,
                  ]}
                />
              ))}
            </View>
            <View style={styles.journalProgress}>
              <Text style={styles.journalNumber}>{journalProgress}</Text>
              <Text style={styles.journalTotal}>/{totalJournalDays}</Text>
            </View>
          </View>
        </View>

        {/* Your Daily Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Günlük Görevlerin</Text>
          <View style={styles.tasksGrid}>
            {DAILY_TASKS.map((task) => (
              <TouchableOpacity key={task.id} style={styles.taskCard}>
                <View style={[styles.taskIconContainer, { backgroundColor: task.color }]}>
                  <Feather name={task.icon as any} size={24} color={Colors.light.textPrimary} />
                </View>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskSubtitle}>{task.subtitle}</Text>
                <Feather
                  name="chevron-right"
                  size={16}
                  color={Colors.light.textSecondary}
                  style={styles.taskArrow}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* My Doctors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terapistlerim</Text>
          {MY_DOCTORS.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={styles.doctorCard}
              onPress={() => router.push(`/(patient)/therapist/${doctor.id}`)}
            >
              <View style={[styles.doctorAvatar, { backgroundColor: doctor.color }]}>
                <Text style={styles.doctorAvatarText}>{doctor.avatar}</Text>
              </View>
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorTitle}>{doctor.title}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          ))}
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
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },

  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.surface,
  },

  headerRight: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },

  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.surface,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  greetingSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
  },

  greeting: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },

  title: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    letterSpacing: -1,
  },

  section: {
    paddingHorizontal: Spacing.xl,
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
  },

  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  moodCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    ...Shadows.sm,
  },

  moodWeek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  moodDayItem: {
    alignItems: 'center',
  },

  moodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },

  moodIconFilled: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },

  moodDayLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },

  twoColumnSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },

  halfCard: {
    flex: 1,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    ...Shadows.sm,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.lg,
  },

  circularProgress: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scoreCenter: {
    position: 'absolute',
    alignItems: 'center',
  },

  scoreNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  scoreLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },

  journalCalendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.lg,
  },

  calendarDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.border,
  },

  calendarDotFilled: {
    backgroundColor: Colors.light.primary,
  },

  journalProgress: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  journalNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  journalTotal: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },

  tasksGrid: {
    gap: Spacing.md,
  },

  taskCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    position: 'relative',
    ...Shadows.xs,
  },

  taskIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  taskSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  taskArrow: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
  },

  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    ...Shadows.xs,
  },

  doctorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  doctorAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  doctorInfo: {
    flex: 1,
  },

  doctorName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },

  doctorTitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
});
