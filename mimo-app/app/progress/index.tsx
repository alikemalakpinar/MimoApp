// app/progress/index.tsx - PROGRESS DASHBOARD
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';

const { width } = Dimensions.get('window');

const STATS = {
  totalSessions: 12,
  journalEntries: 24,
  moodAverage: 6.2,
  streak: 7,
  meditationMinutes: 180,
};

const MOOD_CHART_DATA = [
  { day: 'Pzt', value: 6 },
  { day: 'Sal', value: 5 },
  { day: 'Çar', value: 7 },
  { day: 'Per', value: 4 },
  { day: 'Cum', value: 6 },
  { day: 'Cmt', value: 7 },
  { day: 'Paz', value: 6 },
];

const MILESTONES = [
  { id: '1', title: 'İlk Seans', date: '1 Şubat', icon: 'check-circle', color: Colors.light.secondary },
  { id: '2', title: '7 Gün Streak', date: '7 Şubat', icon: 'zap', color: '#FFB84D' },
  { id: '3', title: '10 Günlük', date: '15 Şubat', icon: 'book', color: Colors.light.primary },
];

export default function ProgressDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>İlerleme Raporum</Text>
        <TouchableOpacity>
          <Feather name="share-2" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#E8F4FF' }]}>
            <Feather name="calendar" size={24} color={Colors.light.primary} />
            <Text style={styles.statNumber}>{STATS.totalSessions}</Text>
            <Text style={styles.statLabel}>Toplam Seans</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#E8F8F0' }]}>
            <Feather name="book" size={24} color={Colors.light.secondary} />
            <Text style={styles.statNumber}>{STATS.journalEntries}</Text>
            <Text style={styles.statLabel}>Günlük</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFF5E8' }]}>
            <Feather name="zap" size={24} color="#FFB84D" />
            <Text style={styles.statNumber}>{STATS.streak}</Text>
            <Text style={styles.statLabel}>Gün Streak</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFE8DC' }]}>
            <Feather name="clock" size={24} color="#FF9982" />
            <Text style={styles.statNumber}>{STATS.meditationMinutes}</Text>
            <Text style={styles.statLabel}>dk Meditasyon</Text>
          </View>
        </View>

        {/* Mood Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Haftalık Mood Trend</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartContainer}>
              {MOOD_CHART_DATA.map((item, idx) => {
                const height = (item.value / 7) * 120;
                return (
                  <View key={idx} style={styles.barContainer}>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { height }]} />
                    </View>
                    <Text style={styles.barLabel}>{item.day}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.averageRow}>
              <Text style={styles.averageLabel}>Ortalama:</Text>
              <Text style={styles.averageValue}>{STATS.moodAverage}/7</Text>
            </View>
          </View>
        </View>

        {/* Milestones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kilometre Taşları</Text>
          {MILESTONES.map((milestone, idx) => (
            <View key={milestone.id} style={styles.milestoneCard}>
              <View style={[styles.milestoneIcon, { backgroundColor: milestone.color + '20' }]}>
                <Feather name={milestone.icon as any} size={20} color={milestone.color} />
              </View>
              <View style={styles.milestoneContent}>
                <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                <Text style={styles.milestoneDate}>{milestone.date}</Text>
              </View>
              {idx === 0 && (
                <View style={styles.recentBadge}>
                  <Text style={styles.recentBadgeText}>Yeni</Text>
                </View>
              )}
            </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },

  statCard: {
    width: (width - Spacing.xl * 2 - Spacing.md) / 2,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginVertical: Spacing.sm,
  },

  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },

  section: {
    marginBottom: Spacing.xxl,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  chartCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    ...Shadows.sm,
  },

  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: Spacing.lg,
  },

  barContainer: {
    alignItems: 'center',
    flex: 1,
  },

  barTrack: {
    width: 12,
    height: 120,
    backgroundColor: Colors.light.border,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },

  barFill: {
    width: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 6,
  },

  barLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },

  averageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },

  averageLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },

  averageValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.primary,
  },

  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    ...Shadows.xs,
  },

  milestoneIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  milestoneContent: {
    flex: 1,
  },

  milestoneTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },

  milestoneDate: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  recentBadge: {
    backgroundColor: Colors.light.secondary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },

  recentBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.secondary,
  },
});
