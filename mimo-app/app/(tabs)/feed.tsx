// app/(tabs)/feed.tsx - MY JOURNEY - UNIQUE WELLNESS TIMELINE
// "Yolculuğunuzu görselleştirin, ilerlemenizi kutlayın"
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { useThemeStore } from '../../shared/store/themeStore';
import { FeedLoader } from '../../shared/components/SkeletonLoader';

const { width } = Dimensions.get('window');

// Journey Timeline Data
const JOURNEY_MILESTONES = [
  {
    id: '1',
    type: 'mood',
    title: 'Bugünkü Mood',
    subtitle: 'Sakin ve odaklı',
    icon: 'sun',
    color: '#FFB347',
    gradient: ['#FFB347', '#FF6B6B'] as [string, string],
    value: 78,
    time: 'Şimdi',
    active: true,
  },
  {
    id: '2',
    type: 'meditation',
    title: 'Sabah Meditasyonu',
    subtitle: '10 dakika tamamlandı',
    icon: 'wind',
    color: '#7C5CE0',
    gradient: ['#7C5CE0', '#A18AFF'] as [string, string],
    value: 100,
    time: '08:30',
    active: false,
  },
  {
    id: '3',
    type: 'journal',
    title: 'Günlük Yazıldı',
    subtitle: '3 sayfa düşünce',
    icon: 'book-open',
    color: '#20B2AA',
    gradient: ['#20B2AA', '#5CD5CD'] as [string, string],
    value: 100,
    time: 'Dün',
    active: false,
  },
  {
    id: '4',
    type: 'therapy',
    title: 'Terapi Seansı',
    subtitle: 'Dr. Elif ile',
    icon: 'message-circle',
    color: '#6BB5FF',
    gradient: ['#6BB5FF', '#A18AFF'] as [string, string],
    value: 100,
    time: '3 gün önce',
    active: false,
  },
];

// Weekly Insights Data
const WEEKLY_INSIGHTS = [
  { day: 'Pzt', mood: 65, meditation: true },
  { day: 'Sal', mood: 72, meditation: true },
  { day: 'Çar', mood: 58, meditation: false },
  { day: 'Per', mood: 80, meditation: true },
  { day: 'Cum', mood: 85, meditation: true },
  { day: 'Cmt', mood: 78, meditation: true },
  { day: 'Paz', mood: 82, meditation: false },
];

// Achievement Badges
const RECENT_BADGES = [
  { id: '1', icon: '🌅', title: '7 Gün Seri', color: '#FFB347' },
  { id: '2', icon: '🧘', title: 'Mindful', color: '#7C5CE0' },
  { id: '3', icon: '📝', title: 'Hikaye Anlatıcı', color: '#20B2AA' },
];

// Recommended Activities
const RECOMMENDED = [
  {
    id: '1',
    title: 'Akşam Nefes Egzersizi',
    duration: '5 dk',
    icon: 'wind',
    gradient: ['#7C5CE0', '#A18AFF'] as [string, string],
    xp: 20,
  },
  {
    id: '2',
    title: 'Minnettar Günlük',
    duration: '10 dk',
    icon: 'heart',
    gradient: ['#FF6B6B', '#FFB347'] as [string, string],
    xp: 30,
  },
  {
    id: '3',
    title: 'Uyku Meditasyonu',
    duration: '15 dk',
    icon: 'moon',
    gradient: ['#6BB5FF', '#20B2AA'] as [string, string],
    xp: 40,
  },
];

// Animated Milestone Card
const MilestoneCard: React.FC<{
  milestone: typeof JOURNEY_MILESTONES[0];
  index: number;
  colors: typeof Colors.light;
}> = ({ milestone, index, colors }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(progressAnim, {
          toValue: milestone.value / 100,
          duration: 800,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <View style={[styles.milestoneCard, { backgroundColor: colors.surface }]}>
        <View style={styles.milestoneLeft}>
          {/* Timeline Line */}
          <View style={[styles.timelineLine, { backgroundColor: milestone.active ? milestone.color : colors.border }]} />
          {/* Icon Circle */}
          <LinearGradient
            colors={milestone.gradient}
            style={[styles.milestoneIcon, milestone.active && styles.milestoneIconActive]}
          >
            <Feather name={milestone.icon as any} size={18} color="#FFFFFF" />
          </LinearGradient>
        </View>

        <View style={styles.milestoneContent}>
          <View style={styles.milestoneHeader}>
            <View>
              <Text style={[styles.milestoneTitle, { color: colors.textPrimary }]}>{milestone.title}</Text>
              <Text style={[styles.milestoneSubtitle, { color: colors.textSecondary }]}>{milestone.subtitle}</Text>
            </View>
            <Text style={[styles.milestoneTime, { color: colors.textTertiary }]}>{milestone.time}</Text>
          </View>

          {milestone.active && (
            <View style={styles.milestoneProgress}>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    { backgroundColor: milestone.color, width: progressWidth },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: milestone.color }]}>{milestone.value}%</Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

// Weekly Insight Chart
const WeeklyChart: React.FC<{ data: typeof WEEKLY_INSIGHTS; colors: typeof Colors.light }> = ({ data, colors }) => {
  const maxMood = Math.max(...data.map(d => d.mood));

  return (
    <View style={styles.chartContainer}>
      {data.map((day, idx) => {
        const height = (day.mood / maxMood) * 60;
        return (
          <View key={idx} style={styles.chartBar}>
            <View style={[styles.barWrapper, { height: 60 }]}>
              <LinearGradient
                colors={day.meditation ? ['#7C5CE0', '#A18AFF'] : [colors.border, colors.border]}
                style={[styles.bar, { height }]}
              />
              {day.meditation && (
                <View style={[styles.meditationDot, { backgroundColor: '#20B2AA' }]} />
              )}
            </View>
            <Text style={[styles.chartLabel, { color: colors.textTertiary }]}>{day.day}</Text>
          </View>
        );
      })}
    </View>
  );
};

// Activity Card
const ActivityCard: React.FC<{
  activity: typeof RECOMMENDED[0];
  onPress: () => void;
}> = ({ activity, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={[styles.activityCard, { transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient
          colors={activity.gradient}
          style={styles.activityGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.activityIcon}>
            <Feather name={activity.icon as any} size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <View style={styles.activityMeta}>
            <View style={styles.activityDuration}>
              <Feather name="clock" size={12} color="rgba(255,255,255,0.8)" />
              <Text style={styles.activityDurationText}>{activity.duration}</Text>
            </View>
            <View style={styles.activityXP}>
              <Text style={styles.activityXPText}>+{activity.xp} XP</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function Feed() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1000);
  }, []);

  // Header opacity based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <FeedLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Floating Header */}
      <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
        <BlurView intensity={isDarkMode ? 40 : 80} style={styles.headerBlur}>
          <Text style={[styles.floatingHeaderTitle, { color: colors.textPrimary }]}>Yolculuğum</Text>
        </BlurView>
      </Animated.View>

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={[styles.heroGreeting, { color: colors.textSecondary }]}>Bugünkü Yolculuğun</Text>
              <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>Harika gidiyorsun!</Text>
            </View>
            <TouchableOpacity
              style={[styles.streakBadge, { backgroundColor: colors.cardAccent }]}
              onPress={() => router.push('/(patient)/achievements')}
            >
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={[styles.streakText, { color: colors.accent }]}>7 gün</Text>
            </TouchableOpacity>
          </View>

          {/* Today's Progress Ring */}
          <View style={[styles.progressRingCard, { backgroundColor: colors.surface }]}>
            <View style={styles.progressRingContainer}>
              <Svg width={120} height={120} viewBox="0 0 120 120">
                <Defs>
                  <RadialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
                    <Stop offset="0%" stopColor="#A18AFF" stopOpacity="0.3" />
                    <Stop offset="100%" stopColor="#7C5CE0" stopOpacity="0" />
                  </RadialGradient>
                </Defs>
                <Circle cx="60" cy="60" r="50" fill="url(#ringGlow)" />
                <Circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke={colors.border}
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <Circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="#7C5CE0"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${283 * 0.72} ${283 * 0.28}`}
                  transform="rotate(-90 60 60)"
                />
                <Circle cx="60" cy="60" r="35" fill={colors.surface} />
              </Svg>
              <View style={styles.progressRingCenter}>
                <Text style={[styles.progressRingValue, { color: colors.textPrimary }]}>72%</Text>
                <Text style={[styles.progressRingLabel, { color: colors.textSecondary }]}>tamamlandı</Text>
              </View>
            </View>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={[styles.progressStatValue, { color: colors.primary }]}>3/4</Text>
                <Text style={[styles.progressStatLabel, { color: colors.textSecondary }]}>Görev</Text>
              </View>
              <View style={[styles.progressDivider, { backgroundColor: colors.border }]} />
              <View style={styles.progressStat}>
                <Text style={[styles.progressStatValue, { color: colors.secondary }]}>45dk</Text>
                <Text style={[styles.progressStatLabel, { color: colors.textSecondary }]}>Mindful</Text>
              </View>
              <View style={[styles.progressDivider, { backgroundColor: colors.border }]} />
              <View style={styles.progressStat}>
                <Text style={[styles.progressStatValue, { color: colors.accent }]}>+120</Text>
                <Text style={[styles.progressStatLabel, { color: colors.textSecondary }]}>XP</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Journey Timeline */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Zaman Çizelgesi</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/journal')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Tümü</Text>
            </TouchableOpacity>
          </View>

          {JOURNEY_MILESTONES.map((milestone, index) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              index={index}
              colors={colors}
            />
          ))}
        </View>

        {/* Weekly Insights */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitlePadded, { color: colors.textPrimary }]}>Haftalık Bakış</Text>
          <View style={[styles.insightCard, { backgroundColor: colors.surface }]}>
            <View style={styles.insightHeader}>
              <View>
                <Text style={[styles.insightTitle, { color: colors.textPrimary }]}>Mood Trendi</Text>
                <Text style={[styles.insightSubtitle, { color: colors.textSecondary }]}>Son 7 gün</Text>
              </View>
              <View style={[styles.trendBadge, { backgroundColor: colors.cardSecondary }]}>
                <Feather name="trending-up" size={14} color={colors.secondary} />
                <Text style={[styles.trendText, { color: colors.secondary }]}>+12%</Text>
              </View>
            </View>
            <WeeklyChart data={WEEKLY_INSIGHTS} colors={colors} />
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#7C5CE0' }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>Mood Skoru</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#20B2AA' }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>Meditasyon</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Badges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Son Rozetler</Text>
            <TouchableOpacity onPress={() => router.push('/(patient)/achievements')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Tümü</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
            {RECENT_BADGES.map((badge) => (
              <View key={badge.id} style={[styles.badgeCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.badgeIcon, { backgroundColor: badge.color + '20' }]}>
                  <Text style={styles.badgeEmoji}>{badge.icon}</Text>
                </View>
                <Text style={[styles.badgeTitle, { color: colors.textPrimary }]}>{badge.title}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.badgeCard, styles.moreBadges, { backgroundColor: colors.surfaceAlt }]}
              onPress={() => router.push('/(patient)/achievements')}
            >
              <Feather name="plus" size={24} color={colors.textSecondary} />
              <Text style={[styles.badgeTitle, { color: colors.textSecondary }]}>+12 daha</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Recommended Activities */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitlePadded, { color: colors.textPrimary }]}>Önerilen Aktiviteler</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activitiesScroll}>
            {RECOMMENDED.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onPress={() => router.push(`/activity/${activity.id}`)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={[styles.quickActionsCard, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push('/(tabs)/journal/new')}
            >
              <LinearGradient
                colors={['#7C5CE0', '#A18AFF']}
                style={styles.quickActionIcon}
              >
                <Feather name="edit-3" size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>Günlük Yaz</Text>
            </TouchableOpacity>

            <View style={[styles.quickActionDivider, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push('/mood-check')}
            >
              <LinearGradient
                colors={['#FFB347', '#FF6B6B']}
                style={styles.quickActionIcon}
              >
                <Feather name="smile" size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>Mood Kaydet</Text>
            </TouchableOpacity>

            <View style={[styles.quickActionDivider, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push('/meditation')}
            >
              <LinearGradient
                colors={['#20B2AA', '#5CD5CD']}
                style={styles.quickActionIcon}
              >
                <Feather name="headphones" size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>Meditasyon</Text>
            </TouchableOpacity>
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.md,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
  },
  headerBlur: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  floatingHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  heroGreeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    gap: Spacing.xs,
  },
  streakEmoji: {
    fontSize: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressRingCard: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    ...Shadows.md,
  },
  progressRingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    position: 'relative',
  },
  progressRingCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  progressRingLabel: {
    fontSize: 12,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressStatLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  progressDivider: {
    width: 1,
    height: 30,
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
  },
  sectionTitlePadded: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  milestoneCard: {
    flexDirection: 'row',
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  milestoneLeft: {
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  timelineLine: {
    position: 'absolute',
    top: 44,
    bottom: -20,
    width: 2,
    borderRadius: 1,
  },
  milestoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneIconActive: {
    ...Shadows.primary,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  milestoneTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  milestoneSubtitle: {
    fontSize: 13,
  },
  milestoneTime: {
    fontSize: 12,
  },
  milestoneProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
  },
  insightCard: {
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  insightSubtitle: {
    fontSize: 13,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
    marginBottom: Spacing.md,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 24,
    borderRadius: 12,
  },
  meditationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: -10,
  },
  chartLabel: {
    fontSize: 11,
    marginTop: Spacing.xs,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
  },
  badgesScroll: {
    paddingLeft: Spacing.xl,
  },
  badgeCard: {
    width: 100,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginRight: Spacing.md,
    ...Shadows.sm,
  },
  moreBadges: {
    justifyContent: 'center',
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  activitiesScroll: {
    paddingLeft: Spacing.xl,
  },
  activityCard: {
    width: 160,
    marginRight: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  activityGradient: {
    padding: Spacing.lg,
    height: 140,
    justifyContent: 'space-between',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityDurationText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  activityXP: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  activityXPText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  quickActionsCard: {
    flexDirection: 'row',
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
});
