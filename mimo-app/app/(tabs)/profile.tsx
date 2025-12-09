// app/(tabs)/profile.tsx - ORA WELLNESS PROFILE
// "Yolculuğunuzun hikayesi, başarılarınızın vitrini"
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, RadialGradient, Stop, Path } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { useThemeStore } from '../../shared/store/themeStore';
import { ProfileLoader } from '../../shared/components/SkeletonLoader';

const { width } = Dimensions.get('window');

// Mock User Data
const USER_DATA = {
  name: 'Ayşe Yılmaz',
  initials: 'AY',
  memberSince: 'Mart 2024',
  level: 12,
  levelName: 'Mindful Explorer',
  totalXP: 2450,
  nextLevelXP: 3000,
  streak: 21,
  longestStreak: 35,
};

// Wellness Stats
const WELLNESS_STATS = {
  meditationMinutes: 245,
  journalEntries: 32,
  moodLogs: 89,
  testsCompleted: 8,
  therapySessions: 12,
};

// Achievement Categories
const ACHIEVEMENTS = [
  { id: '1', icon: '🌅', title: '7 Gün Seri', earned: true, color: '#FFB347' },
  { id: '2', icon: '🧘', title: '100 dk Meditasyon', earned: true, color: '#7C5CE0' },
  { id: '3', icon: '📝', title: '30 Günlük', earned: true, color: '#20B2AA' },
  { id: '4', icon: '🎯', title: 'İlk Test', earned: true, color: '#FF6B6B' },
  { id: '5', icon: '💎', title: 'Premium Üye', earned: true, color: '#6BB5FF' },
  { id: '6', icon: '🌟', title: 'Yıldız Kullanıcı', earned: false, color: '#A8B5C9' },
];

// Mood History (last 7 days)
const MOOD_HISTORY = [
  { day: 'Pzt', mood: 'happy', score: 85 },
  { day: 'Sal', mood: 'calm', score: 75 },
  { day: 'Çar', mood: 'anxious', score: 55 },
  { day: 'Per', mood: 'happy', score: 80 },
  { day: 'Cum', mood: 'grateful', score: 90 },
  { day: 'Cmt', mood: 'calm', score: 78 },
  { day: 'Paz', mood: 'happy', score: 88 },
];

// Level Progress Ring
const LevelRing: React.FC<{
  progress: number;
  level: number;
  size: number;
  colors: typeof Colors.light;
}> = ({ progress, level, size, colors }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="levelGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#A18AFF" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#7C5CE0" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={radius + 10} fill="url(#levelGlow)" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.border}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#7C5CE0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference * progress} ${circumference * (1 - progress)}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[styles.levelCenter, { width: size, height: size }]}>
        <Text style={[styles.levelNumber, { color: colors.textPrimary }]}>{level}</Text>
        <Text style={[styles.levelLabel, { color: colors.textSecondary }]}>seviye</Text>
      </View>
    </View>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  icon: string;
  value: number | string;
  label: string;
  color: string;
  colors: typeof Colors.light;
}> = ({ icon, value, label, color, colors }) => (
  <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
    <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
      <Feather name={icon as any} size={18} color={color} />
    </View>
    <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
  </View>
);

// Mood Bar
const MoodBar: React.FC<{
  data: typeof MOOD_HISTORY[0];
  maxScore: number;
  colors: typeof Colors.light;
}> = ({ data, maxScore, colors }) => {
  const height = (data.score / maxScore) * 50;
  const moodColors: Record<string, string> = {
    happy: '#FFB347',
    calm: '#7C5CE0',
    anxious: '#FF6B6B',
    grateful: '#20B2AA',
  };

  return (
    <View style={styles.moodBar}>
      <View style={[styles.moodBarWrapper, { height: 50 }]}>
        <LinearGradient
          colors={[moodColors[data.mood] || colors.primary, moodColors[data.mood] + '80' || colors.primary + '80']}
          style={[styles.moodBarFill, { height }]}
        />
      </View>
      <Text style={[styles.moodBarLabel, { color: colors.textTertiary }]}>{data.day}</Text>
    </View>
  );
};

export default function Profile() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, 800);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış',
          style: 'destructive',
          onPress: () => router.replace('/(auth)/welcome'),
        },
      ]
    );
  };

  const levelProgress = USER_DATA.totalXP / USER_DATA.nextLevelXP;
  const maxMoodScore = Math.max(...MOOD_HISTORY.map(m => m.score));

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <ProfileLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Profil</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.surfaceAlt }]}
            onPress={toggleTheme}
          >
            <Feather name={isDarkMode ? 'sun' : 'moon'} size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.surfaceAlt }]}
            onPress={() => router.push('/(patient)/settings')}
          >
            <Feather name="settings" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Hero */}
        <Animated.View
          style={[
            styles.heroSection,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <LinearGradient
            colors={isDarkMode ? ['#2D2640', '#1A2E2D'] : ['#F8F5FF', '#F0FFFE']}
            style={[styles.heroCard, { borderColor: colors.border }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroTop}>
              <View style={styles.avatarSection}>
                <LevelRing progress={levelProgress} level={USER_DATA.level} size={100} colors={colors} />
                <View style={[styles.avatarInner, { backgroundColor: colors.primary }]}>
                  <Text style={styles.avatarText}>{USER_DATA.initials}</Text>
                </View>
              </View>

              <View style={styles.heroInfo}>
                <Text style={[styles.userName, { color: colors.textPrimary }]}>{USER_DATA.name}</Text>
                <Text style={[styles.levelName, { color: colors.primary }]}>{USER_DATA.levelName}</Text>
                <View style={styles.xpContainer}>
                  <View style={[styles.xpBar, { backgroundColor: colors.border }]}>
                    <View style={[styles.xpFill, { width: `${levelProgress * 100}%` }]} />
                  </View>
                  <Text style={[styles.xpText, { color: colors.textSecondary }]}>
                    {USER_DATA.totalXP}/{USER_DATA.nextLevelXP} XP
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.streakSection}>
              <View style={[styles.streakCard, { backgroundColor: colors.surface }]}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <View>
                  <Text style={[styles.streakValue, { color: colors.textPrimary }]}>{USER_DATA.streak} gün</Text>
                  <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Mevcut seri</Text>
                </View>
              </View>
              <View style={[styles.streakCard, { backgroundColor: colors.surface }]}>
                <Text style={styles.streakEmoji}>🏆</Text>
                <View>
                  <Text style={[styles.streakValue, { color: colors.textPrimary }]}>{USER_DATA.longestStreak} gün</Text>
                  <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>En uzun seri</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Wellness Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Wellness İstatistikleri</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="headphones"
              value={`${WELLNESS_STATS.meditationMinutes}dk`}
              label="Meditasyon"
              color="#7C5CE0"
              colors={colors}
            />
            <StatCard
              icon="book-open"
              value={WELLNESS_STATS.journalEntries}
              label="Günlük"
              color="#20B2AA"
              colors={colors}
            />
            <StatCard
              icon="smile"
              value={WELLNESS_STATS.moodLogs}
              label="Mood Kaydı"
              color="#FFB347"
              colors={colors}
            />
            <StatCard
              icon="clipboard"
              value={WELLNESS_STATS.testsCompleted}
              label="Test"
              color="#FF6B6B"
              colors={colors}
            />
          </View>
        </View>

        {/* Mood Trend */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Mood Trendi</Text>
            <TouchableOpacity onPress={() => router.push('/(patient)/mood-history')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Detaylı</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.moodCard, { backgroundColor: colors.surface }]}>
            <View style={styles.moodChart}>
              {MOOD_HISTORY.map((data, idx) => (
                <MoodBar key={idx} data={data} maxScore={maxMoodScore} colors={colors} />
              ))}
            </View>
            <View style={styles.moodSummary}>
              <View style={[styles.moodAverage, { backgroundColor: colors.cardSecondary }]}>
                <Text style={[styles.moodAverageLabel, { color: colors.textSecondary }]}>Ortalama</Text>
                <Text style={[styles.moodAverageValue, { color: colors.secondary }]}>
                  {Math.round(MOOD_HISTORY.reduce((a, b) => a + b.score, 0) / MOOD_HISTORY.length)}%
                </Text>
              </View>
              <View style={[styles.moodAverage, { backgroundColor: colors.cardPrimary }]}>
                <Text style={[styles.moodAverageLabel, { color: colors.textSecondary }]}>En İyi</Text>
                <Text style={[styles.moodAverageValue, { color: colors.primary }]}>{maxMoodScore}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Rozetler</Text>
            <TouchableOpacity onPress={() => router.push('/(patient)/achievements')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Tümü</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
            {ACHIEVEMENTS.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  { backgroundColor: colors.surface, opacity: achievement.earned ? 1 : 0.5 },
                ]}
              >
                <View style={[styles.achievementIcon, { backgroundColor: achievement.color + '20' }]}>
                  <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                </View>
                <Text style={[styles.achievementTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                  {achievement.title}
                </Text>
                {achievement.earned && (
                  <View style={[styles.earnedBadge, { backgroundColor: colors.secondary }]}>
                    <Feather name="check" size={10} color="#FFFFFF" />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Hızlı Erişim</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/(patient)/settings')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.cardPrimary }]}>
                <Feather name="user" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>Hesap Ayarları</Text>
              <Feather name="chevron-right" size={18} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/(patient)/privacy')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.cardSecondary }]}>
                <Feather name="shield" size={20} color={colors.secondary} />
              </View>
              <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>Gizlilik</Text>
              <Feather name="chevron-right" size={18} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/(patient)/notifications')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.cardAccent }]}>
                <Feather name="bell" size={20} color={colors.accent} />
              </View>
              <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>Bildirimler</Text>
              <Feather name="chevron-right" size={18} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/(patient)/premium')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.cardGold }]}>
                <Feather name="star" size={20} color={colors.gold} />
              </View>
              <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>Ora Premium</Text>
              <View style={[styles.premiumBadge, { backgroundColor: colors.gold }]}>
                <Text style={styles.premiumBadgeText}>PRO</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.cardAccent }]}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={18} color={colors.accent} />
            <Text style={[styles.logoutText, { color: colors.accent }]}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>

        {/* Member Since */}
        <View style={styles.memberSection}>
          <Text style={[styles.memberText, { color: colors.textTertiary }]}>
            Ora ailesine {USER_DATA.memberSince}'dan beri üyesin
          </Text>
          <Text style={[styles.versionText, { color: colors.textTertiary }]}>v1.0.0</Text>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 120 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
  },
  heroSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  heroCard: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    borderWidth: 1,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarSection: {
    position: 'relative',
    marginRight: Spacing.lg,
  },
  avatarInner: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  levelCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 28,
    fontWeight: '800',
  },
  levelLabel: {
    fontSize: 11,
  },
  heroInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  levelName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  xpContainer: {
    gap: 6,
  },
  xpBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#7C5CE0',
    borderRadius: 3,
  },
  xpText: {
    fontSize: 12,
  },
  streakSection: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  streakCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  streakLabel: {
    fontSize: 11,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  statCard: {
    width: (width - Spacing.xl * 2 - Spacing.md) / 2,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  moodCard: {
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  moodChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  moodBar: {
    alignItems: 'center',
    flex: 1,
  },
  moodBarWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  moodBarFill: {
    width: 20,
    borderRadius: 10,
  },
  moodBarLabel: {
    fontSize: 11,
    marginTop: Spacing.xs,
  },
  moodSummary: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  moodAverage: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  moodAverageLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  moodAverageValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  achievementsScroll: {
    paddingLeft: Spacing.xl,
  },
  achievementCard: {
    width: 90,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginRight: Spacing.md,
    position: 'relative',
    ...Shadows.sm,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementTitle: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  earnedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  quickActionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  premiumBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
  },
  memberSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  memberText: {
    fontSize: 13,
  },
  versionText: {
    fontSize: 12,
  },
});
