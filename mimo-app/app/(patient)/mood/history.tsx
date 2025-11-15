// app/(patient)/mood/history.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-or';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Line, Circle, Text as SvgText } from 'react-native-svg';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../shared/theme';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MOCK_HISTORY = [
  { date: '2025-02-01', mood: 7, factors: ['sleep', 'exercise'] },
  { date: '2025-02-02', mood: 6, factors: ['social'] },
  { date: '2025-02-03', mood: 4, factors: ['work'] },
  { date: '2025-02-04', mood: 5, factors: ['sleep'] },
  { date: '2025-02-05', mood: 7, factors: ['exercise', 'social'] },
  { date: '2025-02-06', mood: 6, factors: ['sleep', 'weather'] },
  { date: '2025-02-07', mood: 7, factors: ['exercise'] },
];

const MOOD_EMOJIS: Record<number, string> = {
  1: '😭',
  2: '😞',
  3: '🙁',
  4: '😐',
  5: '🙂',
  6: '😊',
  7: '🤩',
};

export default function MoodHistory() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  const averageMood = (MOCK_HISTORY.reduce((sum, h) => sum + h.mood, 0) / MOCK_HISTORY.length).toFixed(1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ruh Hali Geçmişi</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(patient)/mood/check-in')}>
          <Feather name="plus" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Card */}
        <View style={styles.statsCard}>
          <LinearGradient
            colors={[Colors.light.primary, Colors.light.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statsGradient}
          >
            <Text style={styles.statsLabel}>Ortalama Ruh Halin</Text>
            <View style={styles.statsValueRow}>
              <Text style={styles.statsValue}>{averageMood}</Text>
              <Text style={styles.statsEmoji}>{MOOD_EMOJIS[Math.round(parseFloat(averageMood))]}</Text>
            </View>
            <Text style={styles.statsSubtext}>Son 7 gün</Text>
          </LinearGradient>
        </View>

        {/* Period Filter */}
        <View style={styles.periodFilter}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'week' && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'week' && styles.periodButtonTextActive,
            ]}>Haftalık</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'month' && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'month' && styles.periodButtonTextActive,
            ]}>Aylık</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'all' && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod('all')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'all' && styles.periodButtonTextActive,
            ]}>Tümü</Text>
          </TouchableOpacity>
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Ruh Hali Trendi</Text>
          <View style={styles.chartContainer}>
            <Svg width={width - Spacing.lg * 4} height={200}>
              {/* Grid lines */}
              {[1, 2, 3, 4, 5, 6, 7].map((y) => (
                <Line
                  key={y}
                  x1="0"
                  y1={200 - (y * 200) / 7}
                  x2={width - Spacing.lg * 4}
                  y2={200 - (y * 200) / 7}
                  stroke={Colors.light.border}
                  strokeWidth="1"
                />
              ))}
              
              {/* Line chart */}
              {MOCK_HISTORY.map((item, index) => {
                if (index === MOCK_HISTORY.length - 1) return null;
                const x1 = (index / (MOCK_HISTORY.length - 1)) * (width - Spacing.lg * 4);
                const y1 = 200 - (item.mood / 7) * 200;
                const x2 = ((index + 1) / (MOCK_HISTORY.length - 1)) * (width - Spacing.lg * 4);
                const y2 = 200 - (MOCK_HISTORY[index + 1].mood / 7) * 200;
                
                return (
                  <Line
                    key={index}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={Colors.light.primary}
                    strokeWidth="3"
                  />
                );
              })}
              
              {/* Points */}
              {MOCK_HISTORY.map((item, index) => {
                const x = (index / (MOCK_HISTORY.length - 1)) * (width - Spacing.lg * 4);
                const y = 200 - (item.mood / 7) * 200;
                
                return (
                  <Circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="6"
                    fill={Colors.light.primary}
                    stroke={Colors.light.surface}
                    strokeWidth="2"
                  />
                );
              })}
            </Svg>
          </View>
          <View style={styles.chartLabels}>
            {MOCK_HISTORY.map((item, index) => (
              <Text key={index} style={styles.chartLabel}>
                {new Date(item.date).getDate()}
              </Text>
            ))}
          </View>
        </View>

        {/* History List */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Günlük Kayı tlar</Text>
          {MOCK_HISTORY.reverse().map((item) => (
            <View key={item.date} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <Text style={styles.historyEmoji}>{MOOD_EMOJIS[item.mood]}</Text>
                <View>
                  <Text style={styles.historyDate}>
                    {new Date(item.date).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </Text>
                  <View style={styles.factorsRow}>
                    {item.factors.map((factor, idx) => (
                      <View key={idx} style={styles.factorTag}>
                        <Text style={styles.factorTagText}>{factor}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.historyScore}>{item.mood}/7</Text>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  backButton: {
    padding: Spacing.xs,
  },

  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
  },

  addButton: {
    padding: Spacing.xs,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  statsCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Shadows.lg,
  },

  statsGradient: {
    padding: Spacing.xl,
    alignItems: 'center',
  },

  statsLabel: {
    fontSize: Typography.base,
    color: Colors.light.surface + 'CC',
    marginBottom: Spacing.sm,
  },

  statsValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },

  statsValue: {
    fontSize: 64,
    fontWeight: Typography.bold,
    color: Colors.light.surface,
  },

  statsEmoji: {
    fontSize: 48,
  },

  statsSubtext: {
    fontSize: Typography.sm,
    color: Colors.light.surface + 'AA',
  },

  periodFilter: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  periodButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
  },

  periodButtonActive: {
    backgroundColor: Colors.light.primary,
  },

  periodButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.light.textSecondary,
  },

  periodButtonTextActive: {
    color: Colors.light.surface,
  },

  chartCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },

  chartTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.lg,
  },

  chartContainer: {
    marginBottom: Spacing.sm,
  },

  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
  },

  chartLabel: {
    fontSize: Typography.xs,
    color: Colors.light.textSecondary,
  },

  historySection: {
    marginTop: Spacing.lg,
  },

  historyTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },

  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  historyEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },

  historyDate: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  factorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },

  factorTag: {
    backgroundColor: Colors.light.primary + '10',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },

  factorTagText: {
    fontSize: 10,
    color: Colors.light.primary,
  },

  historyScore: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.light.primary,
  },
});
