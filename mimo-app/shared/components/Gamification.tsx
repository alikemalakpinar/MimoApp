// shared/components/Gamification.tsx - Gamification UI components
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { useGamification, Badge, BADGES, Level, LEVELS } from '../store/gamification';

const { width } = Dimensions.get('window');

// Level Progress Bar Component
export const LevelProgressBar: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { totalPoints, getCurrentLevel, getNextLevel, getLevelProgress } = useGamification();
  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progress = getLevelProgress();
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedProgress, {
      toValue: progress,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressWidth = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  if (compact) {
    return (
      <View style={styles.compactLevel}>
        <View style={[styles.levelBadgeSmall, { backgroundColor: currentLevel.color + '20' }]}>
          <Feather name={currentLevel.icon as any} size={14} color={currentLevel.color} />
        </View>
        <View style={styles.compactProgressContainer}>
          <View style={styles.compactProgressBar}>
            <Animated.View
              style={[styles.compactProgressFill, { width: progressWidth, backgroundColor: currentLevel.color }]}
            />
          </View>
          <Text style={styles.compactLevelText}>Seviye {currentLevel.level}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.levelContainer}>
      <LinearGradient
        colors={[currentLevel.color + '20', currentLevel.color + '05']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.levelCard}
      >
        <View style={styles.levelHeader}>
          <View style={[styles.levelBadge, { backgroundColor: currentLevel.color + '30' }]}>
            <Feather name={currentLevel.icon as any} size={24} color={currentLevel.color} />
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelLabel}>Seviye {currentLevel.level}</Text>
            <Text style={[styles.levelName, { color: currentLevel.color }]}>{currentLevel.name}</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Feather name="star" size={14} color={Colors.light.gold} />
            <Text style={styles.pointsText}>{totalPoints}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: progressWidth, backgroundColor: currentLevel.color },
              ]}
            />
          </View>
          {nextLevel && (
            <Text style={styles.progressText}>
              {nextLevel.minPoints - totalPoints} puan sonraki seviyeye
            </Text>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

// Streak Display Component
export const StreakDisplay: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'small' }) => {
  const { currentStreak, longestStreak } = useGamification();
  const fireAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (currentStreak > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fireAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
          Animated.timing(fireAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [currentStreak]);

  if (size === 'large') {
    return (
      <LinearGradient
        colors={['#FF6B6B20', '#FFD93D20']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.streakCardLarge}
      >
        <Animated.View style={[styles.fireIconLarge, { transform: [{ scale: fireAnim }] }]}>
          <Text style={styles.fireEmoji}>🔥</Text>
        </Animated.View>
        <View style={styles.streakInfoLarge}>
          <Text style={styles.streakNumberLarge}>{currentStreak}</Text>
          <Text style={styles.streakLabelLarge}>gün seri</Text>
        </View>
        <View style={styles.longestStreak}>
          <Feather name="award" size={14} color={Colors.light.gold} />
          <Text style={styles.longestStreakText}>En uzun: {longestStreak} gün</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.streakCard}>
      <Animated.View style={{ transform: [{ scale: fireAnim }] }}>
        <Text style={styles.fireEmojiSmall}>🔥</Text>
      </Animated.View>
      <Text style={styles.streakNumber}>{currentStreak}</Text>
      <Text style={styles.streakLabel}>gün</Text>
    </View>
  );
};

// Single Badge Component
interface BadgeCardProps {
  badge: Badge;
  unlocked: boolean;
  progress?: number;
  onPress?: () => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, unlocked, progress = 0, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(unlocked ? 1 : 0.95)).current;

  useEffect(() => {
    if (unlocked) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [unlocked]);

  const progressPercent = Math.min(100, (progress / badge.requirement) * 100);

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.badgeCard,
          !unlocked && styles.badgeCardLocked,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View
          style={[
            styles.badgeIconContainer,
            unlocked
              ? { backgroundColor: Colors.light.primary + '20' }
              : { backgroundColor: Colors.light.border },
          ]}
        >
          <Feather
            name={badge.icon as any}
            size={24}
            color={unlocked ? Colors.light.primary : Colors.light.textTertiary}
          />
        </View>
        <Text style={[styles.badgeName, !unlocked && styles.badgeNameLocked]} numberOfLines={2}>
          {badge.name}
        </Text>
        <Text style={styles.badgePoints}>+{badge.points} puan</Text>

        {!unlocked && (
          <View style={styles.badgeProgressContainer}>
            <View style={styles.badgeProgressBar}>
              <View style={[styles.badgeProgressFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.badgeProgressText}>
              {progress}/{badge.requirement}
            </Text>
          </View>
        )}

        {unlocked && (
          <View style={styles.unlockedBadge}>
            <Feather name="check-circle" size={14} color={Colors.light.secondary} />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

// Badge Grid Component
export const BadgeGrid: React.FC<{ category?: Badge['category'] }> = ({ category }) => {
  const { unlockedBadges, journalCount, moodCount, testCount, sessionCount, currentStreak } =
    useGamification();

  const getProgress = (badge: Badge): number => {
    switch (badge.id) {
      case 'first_journal':
        return journalCount;
      case 'journal_streak_7':
      case 'journal_streak_30':
      case 'mood_streak_14':
        return currentStreak;
      case 'first_mood':
      case 'mood_master':
        return moodCount;
      case 'first_test':
      case 'test_explorer':
      case 'test_master':
        return testCount;
      case 'first_session':
      case 'therapy_committed':
      case 'therapy_veteran':
        return sessionCount;
      default:
        return 0;
    }
  };

  const filteredBadges = category ? BADGES.filter((b) => b.category === category) : BADGES;

  return (
    <View style={styles.badgeGrid}>
      {filteredBadges.map((badge) => (
        <BadgeCard
          key={badge.id}
          badge={badge}
          unlocked={unlockedBadges.includes(badge.id)}
          progress={getProgress(badge)}
        />
      ))}
    </View>
  );
};

// Daily Challenge Card
export const DailyChallengeCard: React.FC = () => {
  const { dailyChallengeCompleted, completeDailyChallenge } = useGamification();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!dailyChallengeCompleted) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.02, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [dailyChallengeCompleted]);

  const challenges = [
    { icon: 'edit-3', text: 'Bugün günlük yaz', action: 'journal' },
    { icon: 'smile', text: 'Ruh halini kaydet', action: 'mood' },
    { icon: 'headphones', text: '5 dakika meditasyon yap', action: 'meditate' },
    { icon: 'heart', text: 'Birine destek mesajı gönder', action: 'support' },
  ];

  const todayChallenge = challenges[new Date().getDay() % challenges.length];

  return (
    <Animated.View style={[styles.challengeCard, { transform: [{ scale: pulseAnim }] }]}>
      <LinearGradient
        colors={
          dailyChallengeCompleted
            ? [Colors.light.secondary + '20', Colors.light.secondary + '10']
            : [Colors.light.primary + '20', Colors.light.primary + '10']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.challengeGradient}
      >
        <View style={styles.challengeHeader}>
          <View
            style={[
              styles.challengeIcon,
              {
                backgroundColor: dailyChallengeCompleted
                  ? Colors.light.secondary + '30'
                  : Colors.light.primary + '30',
              },
            ]}
          >
            <Feather
              name={dailyChallengeCompleted ? 'check' : (todayChallenge.icon as any)}
              size={20}
              color={dailyChallengeCompleted ? Colors.light.secondary : Colors.light.primary}
            />
          </View>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>Günlük Görev</Text>
            <Text style={styles.challengeText}>
              {dailyChallengeCompleted ? 'Tamamlandı! 🎉' : todayChallenge.text}
            </Text>
          </View>
          {!dailyChallengeCompleted && (
            <View style={styles.challengeReward}>
              <Feather name="star" size={12} color={Colors.light.gold} />
              <Text style={styles.challengeRewardText}>+30</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// Achievement Popup Component
interface AchievementPopupProps {
  badge: Badge | null;
  visible: boolean;
  onClose: () => void;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({ badge, visible, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && badge) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, badge]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      onClose();
    });
  };

  if (!visible || !badge) return null;

  return (
    <Animated.View style={[styles.popupOverlay, { opacity: opacityAnim }]}>
      <TouchableOpacity style={styles.popupBackdrop} onPress={handleClose} activeOpacity={1} />
      <Animated.View style={[styles.popupCard, { transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.popupGradient}
        >
          <Text style={styles.popupCongrats}>🎉 Tebrikler!</Text>
          <View style={styles.popupBadgeIcon}>
            <Feather name={badge.icon as any} size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.popupBadgeName}>{badge.name}</Text>
          <Text style={styles.popupBadgeDesc}>{badge.description}</Text>
          <View style={styles.popupPoints}>
            <Feather name="star" size={16} color={Colors.light.gold} />
            <Text style={styles.popupPointsText}>+{badge.points} puan kazandın!</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Level Progress
  levelContainer: {
    marginBottom: Spacing.lg,
  },
  levelCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  levelLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  levelName: {
    fontSize: 18,
    fontWeight: '700',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.gold + '20',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.gold,
  },
  progressContainer: {
    marginTop: Spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },

  // Compact Level
  compactLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  levelBadgeSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactProgressContainer: {
    flex: 1,
  },
  compactProgressBar: {
    height: 4,
    backgroundColor: Colors.light.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  compactProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  compactLevelText: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },

  // Streak
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
    ...Shadows.sm,
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  streakLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  fireEmojiSmall: {
    fontSize: 16,
  },
  streakCardLarge: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.md,
  },
  fireIconLarge: {
    marginBottom: Spacing.md,
  },
  fireEmoji: {
    fontSize: 48,
  },
  streakInfoLarge: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  streakNumberLarge: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.light.textPrimary,
  },
  streakLabelLarge: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  longestStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  longestStreakText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  // Badge Card
  badgeCard: {
    width: (width - Spacing.xl * 2 - Spacing.md * 2) / 3,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  badgeCardLocked: {
    opacity: 0.7,
  },
  badgeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  badgeName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    height: 28,
  },
  badgeNameLocked: {
    color: Colors.light.textTertiary,
  },
  badgePoints: {
    fontSize: 10,
    color: Colors.light.gold,
    fontWeight: '600',
  },
  badgeProgressContainer: {
    width: '100%',
    marginTop: Spacing.sm,
  },
  badgeProgressBar: {
    height: 3,
    backgroundColor: Colors.light.border,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  badgeProgressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 1.5,
  },
  badgeProgressText: {
    fontSize: 9,
    color: Colors.light.textTertiary,
    textAlign: 'center',
    marginTop: 2,
  },
  unlockedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },

  // Badge Grid
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },

  // Daily Challenge
  challengeCard: {
    marginBottom: Spacing.lg,
  },
  challengeGradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  challengeTitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  challengeText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  challengeReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.gold + '20',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  challengeRewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.gold,
  },

  // Achievement Popup
  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popupBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popupCard: {
    width: width * 0.8,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  popupGradient: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  popupCongrats: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: Spacing.lg,
  },
  popupBadgeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  popupBadgeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  popupBadgeDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  popupPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.pill,
    gap: Spacing.xs,
  },
  popupPointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default {
  LevelProgressBar,
  StreakDisplay,
  BadgeCard,
  BadgeGrid,
  DailyChallengeCard,
  AchievementPopup,
};
