// app/(patient)/mood/history.tsx - MINIMAL REDESIGN
import React, { useState } from 'react';
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
import { Colors, Spacing, BorderRadius, Shadows } from '../../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOOD_HISTORY = [
  { date: '2025-02-07', day: 'Paz', mood: 7 },
  { date: '2025-02-06', day: 'Cmt', mood: 6 },
  { date: '2025-02-05', day: 'Cum', mood: 7 },
  { date: '2025-02-04', day: 'Per', mood: 5 },
  { date: '2025-02-03', day: 'Çar', mood: 4 },
  { date: '2025-02-02', day: 'Sal', mood: 6 },
  { date: '2025-02-01', day: 'Pzt', mood: 7 },
];

export default function MoodHistory() {
  const router = useRouter();
  const averageMood = (MOOD_HISTORY.reduce((sum, h) => sum + h.mood, 0) / MOOD_HISTORY.length).toFixed(1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood Geçmişi</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(patient)/mood/check-in')}
        >
          <Feather name="plus" size={20} color={Colors.light.surface} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Average Card */}
        <View style={styles.averageCard}>
          <Text style={styles.averageLabel}>Ortalama ruh halin</Text>
          <Text style={styles.averageValue}>{averageMood}</Text>
          <Text style={styles.averageSubtext}>Son 7 gün</Text>
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartBars}>
            {MOOD_HISTORY.map((item) => {
              const height = (item.mood / 7) * 100;
              return (
                <View key={item.date} style={styles.barContainer}>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${height}%` }]} />
                  </View>
                  <Text style={styles.barLabel}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* History List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Günlük kayıtlar</Text>
          {MOOD_HISTORY.reverse().map((item) => (
            <View key={item.date} style={styles.historyCard}>
              <View style={styles.historyLeft}>
                <View style={styles.moodCircle}>
                  <Text style={styles.moodValue}>{item.mood}</Text>
                </View>
                <Text style={styles.historyDate}>
                  {new Date(item.date).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </Text>
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  addButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },

  averageCard: {
    backgroundColor: Colors.light.primary,
    padding: Spacing.xxxl,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },

  averageLabel: {
    fontSize: 14,
    color: Colors.light.surface,
    opacity: 0.8,
    marginBottom: Spacing.sm,
  },

  averageValue: {
    fontSize: 56,
    fontWeight: '700',
    color: Colors.light.surface,
    marginBottom: Spacing.xs,
  },

  averageSubtext: {
    fontSize: 13,
    color: Colors.light.surface,
    opacity: 0.7,
  },

  chartCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.xxl,
    ...Shadows.sm,
  },

  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
  },

  barContainer: {
    alignItems: 'center',
    flex: 1,
  },

  barTrack: {
    width: 12,
    height: 100,
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

  section: {
    marginBottom: Spacing.lg,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    ...Shadows.xs,
  },

  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  moodCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  moodValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.primary,
  },

  historyDate: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
});
