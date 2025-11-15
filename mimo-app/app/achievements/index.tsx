// app/achievements/index.tsx - ACHIEVEMENTS & BADGES
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
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';

const ACHIEVEMENTS = [
  {
    id: '1',
    title: '7 Gün Streak',
    description: '7 gün üst üste mood kaydı',
    icon: 'zap',
    color: '#FFB84D',
    unlocked: true,
    date: '5 Şubat 2025',
  },
  {
    id: '2',
    title: 'İlk Seans',
    description: 'İlk terapini tamamladın',
    icon: 'award',
    color: Colors.light.secondary,
    unlocked: true,
    date: '1 Şubat 2025',
  },
  {
    id: '3',
    title: '30 Günlük Yolculuk',
    description: '30 gün boyunca aktif kullanım',
    icon: 'calendar',
    color: Colors.light.primary,
    unlocked: false,
    progress: 18,
    total: 30,
  },
  {
    id: '4',
    title: '10 Günlük',
    description: '10 günlük yazdın',
    icon: 'book',
    color: '#FFB6A3',
    unlocked: false,
    progress: 7,
    total: 10,
  },
  {
    id: '5',
    title: 'Meditasyon Ustası',
    description: '50 meditasyon tamamla',
    icon: 'heart',
    color: '#7BC8A8',
    unlocked: false,
    progress: 23,
    total: 50,
  },
  {
    id: '6',
    title: 'Topluluk Yıldızı',
    description: '100 beğeni al',
    icon: 'star',
    color: '#8BBEE8',
    unlocked: false,
    progress: 67,
    total: 100,
  },
];

export default function Achievements() {
  const router = useRouter();

  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Başarılar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Toplam İlerleme</Text>
          <View style={styles.progressRow}>
            <Text style={styles.progressNumber}>{unlockedCount}</Text>
            <Text style={styles.progressTotal}>/ {ACHIEVEMENTS.length}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              { width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` },
            ]} />
          </View>
        </View>

        {/* Achievements List */}
        {ACHIEVEMENTS.map((achievement) => (
          <View
            key={achievement.id}
            style={[
              styles.achievementCard,
              !achievement.unlocked && styles.achievementCardLocked,
            ]}
          >
            <View style={[
              styles.achievementIcon,
              { backgroundColor: achievement.color + '20' },
              !achievement.unlocked && styles.achievementIconLocked,
            ]}>
              <Feather
                name={achievement.icon as any}
                size={28}
                color={achievement.unlocked ? achievement.color : Colors.light.textLight}
              />
            </View>
            
            <View style={styles.achievementContent}>
              <View style={styles.achievementHeader}>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.unlocked && styles.textLocked,
                ]}>
                  {achievement.title}
                </Text>
                {achievement.unlocked && (
                  <Feather name="check-circle" size={20} color={achievement.color} />
                )}
              </View>
              <Text style={[
                styles.achievementDescription,
                !achievement.unlocked && styles.textLocked,
              ]}>
                {achievement.description}
              </Text>
              
              {achievement.unlocked ? (
                <Text style={styles.unlockedDate}>Kazanıldı: {achievement.date}</Text>
              ) : (
                <View style={styles.progressContainer}>
                  <View style={styles.miniProgressBar}>
                    <View style={[
                      styles.miniProgressFill,
                      {
                        width: `${(achievement.progress! / achievement.total!) * 100}%`,
                        backgroundColor: achievement.color,
                      },
                    ]} />
                  </View>
                  <Text style={styles.progressText}>
                    {achievement.progress}/{achievement.total}
                  </Text>
                </View>
              )}
            </View>
          </View>
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

  progressCard: {
    backgroundColor: Colors.light.primary,
    padding: Spacing.xxxl,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    ...Shadows.md,
  },

  progressTitle: {
    fontSize: 14,
    color: Colors.light.surface,
    opacity: 0.8,
    marginBottom: Spacing.sm,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.lg,
  },

  progressNumber: {
    fontSize: 56,
    fontWeight: '700',
    color: Colors.light.surface,
  },

  progressTotal: {
    fontSize: 24,
    color: Colors.light.surface,
    opacity: 0.7,
  },

  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.light.surface + '30',
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.surface,
    borderRadius: 4,
  },

  achievementCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    ...Shadows.xs,
  },

  achievementCardLocked: {
    opacity: 0.6,
  },

  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  achievementIconLocked: {
    backgroundColor: Colors.light.border + '40',
  },

  achievementContent: {
    flex: 1,
  },

  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },

  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  achievementDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
  },

  textLocked: {
    color: Colors.light.textLight,
  },

  unlockedDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  miniProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.light.border,
    borderRadius: 3,
    overflow: 'hidden',
  },

  miniProgressFill: {
    height: '100%',
    borderRadius: 3,
  },

  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
});
