// app/(patient)/achievements.tsx - ACHIEVEMENTS & BADGES SCREEN
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import {
  LevelProgressBar,
  StreakDisplay,
  BadgeGrid,
  DailyChallengeCard,
} from '../../shared/components/Gamification';
import { useGamification, BADGES, Badge } from '../../shared/store/gamification';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', label: 'Tümü', icon: 'grid' },
  { id: 'journal', label: 'Günlük', icon: 'edit-3' },
  { id: 'mood', label: 'Ruh Hali', icon: 'smile' },
  { id: 'tests', label: 'Testler', icon: 'clipboard' },
  { id: 'therapy', label: 'Terapi', icon: 'users' },
  { id: 'mindfulness', label: 'Farkındalık', icon: 'sun' },
  { id: 'social', label: 'Sosyal', icon: 'share-2' },
];

export default function Achievements() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { totalPoints, unlockedBadges, getCurrentLevel, currentStreak, longestStreak } =
    useGamification();

  const currentLevel = getCurrentLevel();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredBadges =
    selectedCategory === 'all'
      ? BADGES
      : BADGES.filter((b) => b.category === selectedCategory);

  const unlockedCount = unlockedBadges.length;
  const totalBadges = BADGES.length;
  const progressPercent = Math.round((unlockedCount / totalBadges) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Başarılar</Text>
        <View style={styles.headerRight}>
          <StreakDisplay size="small" />
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Level Card */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <LevelProgressBar />
        </Animated.View>

        {/* Stats Overview */}
        <Animated.View style={[styles.statsRow, { opacity: fadeAnim }]}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.light.primary + '20', Colors.light.primary + '05']}
              style={styles.statGradient}
            >
              <Feather name="award" size={24} color={Colors.light.primary} />
              <Text style={styles.statNumber}>{unlockedCount}</Text>
              <Text style={styles.statLabel}>Rozet</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.light.gold + '20', Colors.light.gold + '05']}
              style={styles.statGradient}
            >
              <Feather name="star" size={24} color={Colors.light.gold} />
              <Text style={styles.statNumber}>{totalPoints}</Text>
              <Text style={styles.statLabel}>Puan</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['#FF6B6B20', '#FF6B6B05']}
              style={styles.statGradient}
            >
              <Text style={styles.fireIcon}>🔥</Text>
              <Text style={styles.statNumber}>{currentStreak}</Text>
              <Text style={styles.statLabel}>Gün Seri</Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Daily Challenge */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.sectionTitle}>Günlük Görev</Text>
          <DailyChallengeCard />
        </Animated.View>

        {/* Progress Overview */}
        <Animated.View style={[styles.progressCard, { opacity: fadeAnim }]}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Rozet İlerlemesi</Text>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressSubtext}>
            {totalBadges - unlockedCount} rozet daha açılabilir
          </Text>
        </Animated.View>

        {/* Category Filter */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.sectionTitle}>Rozetler</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContent}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Feather
                  name={cat.icon as any}
                  size={14}
                  color={
                    selectedCategory === cat.id
                      ? '#FFFFFF'
                      : Colors.light.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === cat.id && styles.categoryTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Badge Grid */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <BadgeGrid category={selectedCategory === 'all' ? undefined : (selectedCategory as Badge['category'])} />
        </Animated.View>

        {/* Streak Info */}
        <Animated.View style={[styles.streakSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Seri İstatistikleri</Text>
          <StreakDisplay size="large" />
        </Animated.View>

        {/* Tips */}
        <Animated.View style={[styles.tipsCard, { opacity: fadeAnim }]}>
          <View style={styles.tipsHeader}>
            <Feather name="zap" size={18} color={Colors.light.gold} />
            <Text style={styles.tipsTitle}>Puan Kazanma İpuçları</Text>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipBullet} />
            <Text style={styles.tipText}>Her gün günlük yazarak seri oluştur</Text>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipBullet} />
            <Text style={styles.tipText}>Psikolojik testleri tamamla</Text>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipBullet} />
            <Text style={styles.tipText}>Toplulukta aktif ol ve destek paylaş</Text>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipBullet} />
            <Text style={styles.tipText}>Günlük görevleri kaçırma</Text>
          </View>
        </Animated.View>
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  headerRight: {
    minWidth: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
  },
  statGradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.textPrimary,
    marginTop: Spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  fireIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },
  progressCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: Spacing.sm,
  },
  categoryScroll: {
    marginBottom: Spacing.lg,
    marginHorizontal: -Spacing.xl,
  },
  categoryContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.pill,
    gap: Spacing.xs,
    ...Shadows.sm,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  streakSection: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  tipsCard: {
    backgroundColor: Colors.light.gold + '10',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.gold,
  },
  tipText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    flex: 1,
  },
});
