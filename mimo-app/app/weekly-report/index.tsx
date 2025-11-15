// app/weekly-report/index.tsx - WEEKLY INSIGHTS REPORT
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
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';

const { width } = Dimensions.get('window');

const WEEKLY_STATS = {
  period: '8 - 14 Şubat 2025',
  moodAverage: 6.5,
  moodTrend: 'up',
  sessionsCompleted: 2,
  journalEntries: 5,
  meditationMinutes: 45,
  tasksCompleted: 12,
  tasksTotal: 15,
};

const INSIGHTS = [
  {
    id: '1',
    type: 'positive',
    title: 'Mükemmel İlerleme! 🎉',
    description: 'Ruh hali ortalaman geçen haftaya göre %15 arttı. Harika iş çıkarıyorsun!',
    icon: 'trending-up',
    color: Colors.light.secondary,
  },
  {
    id: '2',
    type: 'suggestion',
    title: 'Günlük Yazma',
    description: 'Haftanın 5 günü günlük yazdın. Hedefine çok yakınsın!',
    icon: 'book',
    color: Colors.light.primary,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Uyku Düzeni',
    description: 'Uyku saatlerin tutarsız. Düzenli uyku, ruh halini olumlu etkiler.',
    icon: 'moon',
    color: '#FFB84D',
  },
];

export default function WeeklyReport() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Haftalık Rapor</Text>
        <TouchableOpacity>
          <Feather name="share-2" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Card */}
        <View style={styles.periodCard}>
          <Feather name="calendar" size={24} color={Colors.light.primary} />
          <Text style={styles.periodText}>{WEEKLY_STATS.period}</Text>
        </View>

        {/* Overall Mood */}
        <View style={styles.moodCard}>
          <View style={styles.moodHeader}>
            <Text style={styles.cardTitle}>Ortalama Ruh Halin</Text>
            <Feather
              name={WEEKLY_STATS.moodTrend === 'up' ? 'trending-up' : 'trending-down'}
              size={24}
              color={WEEKLY_STATS.moodTrend === 'up' ? Colors.light.secondary : '#FF8A80'}
            />
          </View>
          <Text style={styles.moodNumber}>{WEEKLY_STATS.moodAverage}</Text>
          <Text style={styles.moodLabel}>/ 7.0</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Feather name="video" size={24} color={Colors.light.primary} />
            <Text style={styles.statNumber}>{WEEKLY_STATS.sessionsCompleted}</Text>
            <Text style={styles.statLabel}>Seans</Text>
          </View>
          <View style={styles.statBox}>
            <Feather name="book" size={24} color={Colors.light.secondary} />
            <Text style={styles.statNumber}>{WEEKLY_STATS.journalEntries}</Text>
            <Text style={styles.statLabel}>Günlük</Text>
          </View>
          <View style={styles.statBox}>
            <Feather name="clock" size={24} color="#FFB84D" />
            <Text style={styles.statNumber}>{WEEKLY_STATS.meditationMinutes}</Text>
            <Text style={styles.statLabel}>dk</Text>
          </View>
          <View style={styles.statBox}>
            <Feather name="check-circle" size={24} color="#7BC8A8" />
            <Text style={styles.statNumber}>
              {WEEKLY_STATS.tasksCompleted}/{WEEKLY_STATS.tasksTotal}
            </Text>
            <Text style={styles.statLabel}>Görev</Text>
          </View>
        </View>

        {/* AI Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yapay Zeka İçgörüleri</Text>
          {INSIGHTS.map((insight) => (
            <View
              key={insight.id}
              style={[
                styles.insightCard,
                { borderLeftColor: insight.color },
              ]}
            >
              <View style={[styles.insightIcon, { backgroundColor: insight.color + '20' }]}>
                <Feather name={insight.icon as any} size={20} color={insight.color} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightDescription}>{insight.description}</Text>
              </View>
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

  periodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
    ...Shadows.xs,
  },

  periodText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  moodCard: {
    backgroundColor: Colors.light.primary,
    padding: Spacing.xxxl,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    ...Shadows.md,
  },

  moodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.surface,
  },

  moodNumber: {
    fontSize: 64,
    fontWeight: '700',
    color: Colors.light.surface,
  },

  moodLabel: {
    fontSize: 20,
    color: Colors.light.surface,
    opacity: 0.7,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },

  statBox: {
    width: (width - Spacing.xl * 2 - Spacing.md) / 2,
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.xs,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginVertical: Spacing.sm,
  },

  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },

  section: {
    marginBottom: Spacing.lg,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  insightCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderLeftWidth: 4,
    marginBottom: Spacing.md,
    ...Shadows.xs,
  },

  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  insightContent: {
    flex: 1,
  },

  insightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  insightDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 19,
  },
});
