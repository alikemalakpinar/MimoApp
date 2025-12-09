// shared/components/WellnessQuests.tsx - Gamified Wellness Challenge System
// "Turn your mental health journey into an adventure"
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Svg, { Circle, Path, Defs, RadialGradient, Stop, G } from 'react-native-svg';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { useThemeStore } from '../store/themeStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// TYPES
// ============================================
interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'special' | 'journey';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  xpReward: number;
  coinReward?: number;
  icon: string;
  progress: number;
  maxProgress: number;
  timeLeft?: string;
  isCompleted: boolean;
  isLocked?: boolean;
  requiredLevel?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface UserStats {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  totalXp: number;
  streakDays: number;
  questsCompleted: number;
  achievementsEarned: number;
  coins: number;
}

// ============================================
// DIFFICULTY CONFIG
// ============================================
const DIFFICULTY_CONFIG = {
  easy: { color: '#10B981', label: 'Kolay', icon: 'star' },
  medium: { color: '#F59E0B', label: 'Orta', icon: 'star' },
  hard: { color: '#EF4444', label: 'Zor', icon: 'star' },
  epic: { color: '#8B5CF6', label: 'Epik', icon: 'zap' },
};

const RARITY_CONFIG = {
  common: { color: '#6B7280', bgColor: '#F3F4F6', label: 'Yaygın' },
  rare: { color: '#3B82F6', bgColor: '#EFF6FF', label: 'Nadir' },
  epic: { color: '#8B5CF6', bgColor: '#F5F3FF', label: 'Epik' },
  legendary: { color: '#F59E0B', bgColor: '#FFFBEB', label: 'Efsanevi' },
};

// ============================================
// XP PROGRESS BAR
// ============================================
interface XpProgressBarProps {
  currentXp: number;
  xpToNextLevel: number;
  level: number;
}

export const XpProgressBar: React.FC<XpProgressBarProps> = ({
  currentXp,
  xpToNextLevel,
  level,
}) => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const progress = (currentXp / xpToNextLevel) * 100;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(progressAnim, {
        toValue: progress,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, [progress]);

  return (
    <View style={styles.xpContainer}>
      {/* Level Badge */}
      <View style={styles.levelBadgeContainer}>
        <LinearGradient
          colors={['#7C5CE0', '#A18AFF']}
          style={styles.levelBadge}
        >
          <Text style={styles.levelNumber}>{level}</Text>
        </LinearGradient>
        <Animated.View
          style={[
            styles.levelGlow,
            { opacity: glowAnim },
          ]}
        />
      </View>

      {/* Progress Bar */}
      <View style={styles.xpBarContainer}>
        <View style={[styles.xpBarTrack, { backgroundColor: colors.border }]}>
          <Animated.View
            style={[
              styles.xpBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={['#7C5CE0', '#A18AFF', '#C4B5FD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <View style={styles.xpLabels}>
          <Text style={[styles.xpText, { color: colors.textSecondary }]}>
            {currentXp} / {xpToNextLevel} XP
          </Text>
          <Text style={[styles.levelUpText, { color: colors.primary }]}>
            Seviye {level + 1}'e kaldı
          </Text>
        </View>
      </View>
    </View>
  );
};

// ============================================
// QUEST CARD
// ============================================
interface QuestCardProps {
  quest: Quest;
  onPress: () => void;
  onClaim?: () => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onPress,
  onClaim,
}) => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const difficulty = DIFFICULTY_CONFIG[quest.difficulty];
  const progress = (quest.progress / quest.maxProgress) * 100;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: progress,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={quest.isLocked}
        style={[
          styles.questCard,
          { backgroundColor: colors.surface },
          quest.isLocked && styles.questCardLocked,
        ]}
      >
        {/* Background gradient for completed */}
        {quest.isCompleted && (
          <LinearGradient
            colors={[colors.primary + '10', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Left section */}
        <View style={styles.questLeft}>
          {/* Icon */}
          <View
            style={[
              styles.questIcon,
              {
                backgroundColor: quest.isCompleted
                  ? colors.primary + '20'
                  : difficulty.color + '20',
              },
            ]}
          >
            {quest.isLocked ? (
              <Feather name="lock" size={24} color={colors.textTertiary} />
            ) : quest.isCompleted ? (
              <Feather name="check" size={24} color={colors.primary} />
            ) : (
              <Feather
                name={quest.icon as any}
                size={24}
                color={difficulty.color}
              />
            )}
          </View>

          {/* Content */}
          <View style={styles.questContent}>
            <View style={styles.questHeader}>
              <Text
                style={[
                  styles.questTitle,
                  { color: quest.isLocked ? colors.textTertiary : colors.textPrimary },
                ]}
                numberOfLines={1}
              >
                {quest.title}
              </Text>
              {/* Difficulty badge */}
              <View style={[styles.difficultyBadge, { backgroundColor: difficulty.color + '20' }]}>
                <Feather name={difficulty.icon as any} size={10} color={difficulty.color} />
              </View>
            </View>

            <Text
              style={[styles.questDescription, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {quest.description}
            </Text>

            {/* Progress bar */}
            {!quest.isCompleted && !quest.isLocked && (
              <View style={styles.questProgress}>
                <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: difficulty.color,
                        width: progressAnim.interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                  {quest.progress}/{quest.maxProgress}
                </Text>
              </View>
            )}

            {/* Locked message */}
            {quest.isLocked && quest.requiredLevel && (
              <Text style={[styles.lockedText, { color: colors.textTertiary }]}>
                Seviye {quest.requiredLevel} gerekli
              </Text>
            )}
          </View>
        </View>

        {/* Right section - Rewards */}
        <View style={styles.questRight}>
          {quest.isCompleted && quest.progress === quest.maxProgress ? (
            <TouchableOpacity
              style={[styles.claimButton, { backgroundColor: colors.primary }]}
              onPress={onClaim}
            >
              <Text style={styles.claimText}>Al</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.rewardContainer}>
              <View style={styles.rewardItem}>
                <Text style={[styles.rewardAmount, { color: colors.primary }]}>
                  +{quest.xpReward}
                </Text>
                <Text style={[styles.rewardLabel, { color: colors.textTertiary }]}>XP</Text>
              </View>
              {quest.coinReward && (
                <View style={styles.rewardItem}>
                  <Text style={[styles.rewardAmount, { color: '#F59E0B' }]}>
                    +{quest.coinReward}
                  </Text>
                  <Feather name="star" size={12} color="#F59E0B" />
                </View>
              )}
              {quest.timeLeft && (
                <Text style={[styles.timeLeft, { color: colors.textTertiary }]}>
                  {quest.timeLeft}
                </Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================
// DAILY STREAK DISPLAY
// ============================================
interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  weekProgress: boolean[]; // 7 days, true = completed
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  currentStreak,
  longestStreak,
  weekProgress,
}) => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const flameAnim = useRef(new Animated.Value(1)).current;

  const DAYS = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flameAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(flameAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.streakContainer, { backgroundColor: colors.surface }]}>
      <LinearGradient
        colors={['#FF6B6B20', 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      {/* Streak count */}
      <View style={styles.streakMain}>
        <Animated.View
          style={[
            styles.streakFlame,
            { transform: [{ scale: flameAnim }] },
          ]}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FFB347']}
            style={styles.flameGradient}
          >
            <Feather name="zap" size={32} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>
        <View style={styles.streakInfo}>
          <Text style={[styles.streakNumber, { color: colors.textPrimary }]}>
            {currentStreak}
          </Text>
          <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
            Gün Seri
          </Text>
        </View>
      </View>

      {/* Week progress */}
      <View style={styles.weekProgress}>
        {DAYS.map((day, index) => (
          <View key={index} style={styles.dayItem}>
            <View
              style={[
                styles.dayCircle,
                weekProgress[index]
                  ? { backgroundColor: '#FF6B6B' }
                  : { backgroundColor: colors.border },
              ]}
            >
              {weekProgress[index] && (
                <Feather name="check" size={12} color="#FFFFFF" />
              )}
            </View>
            <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Best streak */}
      <View style={styles.bestStreak}>
        <Feather name="award" size={14} color={colors.textTertiary} />
        <Text style={[styles.bestStreakText, { color: colors.textTertiary }]}>
          En iyi: {longestStreak} gün
        </Text>
      </View>
    </View>
  );
};

// ============================================
// ACHIEVEMENT BADGE
// ============================================
interface AchievementBadgeProps {
  achievement: Achievement;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  onPress,
  size = 'medium',
}) => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const rarity = RARITY_CONFIG[achievement.rarity];
  const isEarned = !!achievement.earnedAt;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;

  const sizeConfig = {
    small: { badge: 48, icon: 20, fontSize: 10 },
    medium: { badge: 64, icon: 28, fontSize: 12 },
    large: { badge: 80, icon: 36, fontSize: 14 },
  };

  useEffect(() => {
    if (isEarned && achievement.rarity === 'legendary') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(shineAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isEarned, achievement.rarity]);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
    onPress?.();
  };

  const config = sizeConfig[size];

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.achievementBadge,
          {
            width: config.badge,
            height: config.badge,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Background */}
        <View
          style={[
            styles.badgeBackground,
            {
              backgroundColor: isEarned ? rarity.bgColor : colors.border,
              borderColor: isEarned ? rarity.color : 'transparent',
            },
          ]}
        >
          {/* Shine effect for legendary */}
          {isEarned && achievement.rarity === 'legendary' && (
            <Animated.View
              style={[
                styles.legendaryShine,
                {
                  opacity: shineAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.3, 0.8, 0.3],
                  }),
                },
              ]}
            />
          )}

          {/* Icon */}
          <Feather
            name={achievement.icon as any}
            size={config.icon}
            color={isEarned ? rarity.color : colors.textTertiary}
          />

          {/* Lock overlay */}
          {!isEarned && (
            <View style={styles.lockOverlay}>
              <Feather name="lock" size={config.icon / 2} color={colors.textTertiary} />
            </View>
          )}
        </View>

        {/* Progress indicator */}
        {!isEarned && achievement.progress !== undefined && (
          <View style={styles.progressIndicator}>
            <Text style={[styles.progressIndicatorText, { fontSize: config.fontSize - 2 }]}>
              {Math.round((achievement.progress! / achievement.maxProgress!) * 100)}%
            </Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

// ============================================
// LEVEL UP CELEBRATION
// ============================================
interface LevelUpCelebrationProps {
  newLevel: number;
  rewards: { xp?: number; coins?: number; achievement?: string };
  onClose: () => void;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
  newLevel,
  rewards,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const particleAnims = useRef(
    Array.from({ length: 12 }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    // Main animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Particle explosions
    particleAnims.forEach((particle, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 150;

      Animated.parallel([
        Animated.timing(particle.x, {
          toValue: Math.cos(angle) * distance,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: Math.sin(angle) * distance,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 800,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.celebrationOverlay}>
      {/* Particles */}
      {particleAnims.map((particle, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              backgroundColor: i % 2 === 0 ? '#FFD700' : '#7C5CE0',
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}

      {/* Level badge */}
      <Animated.View
        style={[
          styles.levelUpBadge,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: spin },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['#FFD700', '#FFA500', '#FF8C00']}
          style={styles.levelUpGradient}
        >
          <Text style={styles.levelUpNumber}>{newLevel}</Text>
          <Text style={styles.levelUpLabel}>SEVİYE</Text>
        </LinearGradient>
      </Animated.View>

      {/* Rewards */}
      <View style={styles.rewardsSection}>
        <Text style={styles.congratsText}>Tebrikler!</Text>
        <Text style={styles.rewardsTitle}>Ödüllerin:</Text>
        <View style={styles.rewardsList}>
          {rewards.xp && (
            <View style={styles.rewardBadge}>
              <Text style={styles.rewardBadgeText}>+{rewards.xp} XP</Text>
            </View>
          )}
          {rewards.coins && (
            <View style={[styles.rewardBadge, { backgroundColor: '#FFD700' }]}>
              <Text style={styles.rewardBadgeText}>+{rewards.coins} 💎</Text>
            </View>
          )}
        </View>
      </View>

      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Harika!</Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  // XP Progress Bar
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  levelBadgeContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  levelNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  levelGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 30,
    backgroundColor: '#7C5CE0',
    opacity: 0.3,
  },
  xpBarContainer: {
    flex: 1,
  },
  xpBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '600',
  },
  levelUpText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Quest Card
  questCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  questCardLocked: {
    opacity: 0.6,
  },
  questLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  questIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  questContent: {
    flex: 1,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  difficultyBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.xs,
  },
  questDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  questProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  lockedText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  questRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: Spacing.md,
  },
  rewardContainer: {
    alignItems: 'flex-end',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  rewardAmount: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 4,
  },
  rewardLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  timeLeft: {
    fontSize: 11,
    marginTop: Spacing.xs,
  },
  claimButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.pill,
  },
  claimText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Streak Display
  streakContainer: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  streakMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  streakFlame: {
    marginRight: Spacing.md,
  },
  flameGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakInfo: {},
  streakNumber: {
    fontSize: 32,
    fontWeight: '800',
  },
  streakLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  weekProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  dayItem: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  bestStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestStreakText: {
    fontSize: 12,
    marginLeft: 4,
  },

  // Achievement Badge
  achievementBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  legendaryShine: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFD700',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressIndicator: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: '#374151',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  progressIndicatorText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Level Up Celebration
  celebrationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  levelUpBadge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  levelUpGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelUpNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  levelUpLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  rewardsSection: {
    marginTop: Spacing.xxl,
    alignItems: 'center',
  },
  congratsText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  rewardsTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: Spacing.md,
  },
  rewardsList: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  rewardBadge: {
    backgroundColor: '#7C5CE0',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.pill,
  },
  rewardBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  closeButton: {
    marginTop: Spacing.xxl,
    backgroundColor: '#FFFFFF',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.pill,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
});

export default {
  XpProgressBar,
  QuestCard,
  StreakDisplay,
  AchievementBadge,
  LevelUpCelebration,
};
