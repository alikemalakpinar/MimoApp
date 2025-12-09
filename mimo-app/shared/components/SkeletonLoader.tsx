// shared/components/SkeletonLoader.tsx - Enhanced Skeleton Loading with Dark Mode
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius } from '../theme';
import { useThemeStore } from '../store/themeStore';

const { width } = Dimensions.get('window');

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

// Base Skeleton component with shimmer effect
export const Skeleton: React.FC<SkeletonProps> = ({
  width: w = '100%',
  height = 20,
  borderRadius = BorderRadius.sm,
  style,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const shimmerColors = isDarkMode
    ? ['transparent', 'rgba(255,255,255,0.1)', 'transparent']
    : ['transparent', 'rgba(255,255,255,0.4)', 'transparent'];

  return (
    <View
      style={[
        styles.skeleton,
        {
          width: w,
          height,
          borderRadius,
          backgroundColor: colors.border,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          { transform: [{ translateX }] },
        ]}
      >
        <LinearGradient
          colors={shimmerColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

// Card Skeleton
export const CardSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }, style]}>
      <Skeleton width={60} height={60} borderRadius={30} />
      <View style={styles.cardContent}>
        <Skeleton width="70%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="50%" height={12} />
      </View>
    </View>
  );
};

// Post Skeleton
export const PostSkeleton: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.postCard, { backgroundColor: colors.surface }]}>
      <View style={styles.postHeader}>
        <Skeleton width={44} height={44} borderRadius={22} />
        <View style={styles.postHeaderContent}>
          <Skeleton width={120} height={14} style={{ marginBottom: 6 }} />
          <Skeleton width={80} height={10} />
        </View>
      </View>
      <View style={styles.postBody}>
        <Skeleton width="100%" height={14} style={{ marginBottom: 8 }} />
        <Skeleton width="90%" height={14} style={{ marginBottom: 8 }} />
        <Skeleton width="60%" height={14} />
      </View>
      <View style={styles.postFooter}>
        <Skeleton width={60} height={24} borderRadius={12} />
        <Skeleton width={60} height={24} borderRadius={12} />
        <Skeleton width={60} height={24} borderRadius={12} />
      </View>
    </View>
  );
};

// Journey Card Skeleton - For wellness journey feed
export const JourneyCardSkeleton: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.journeyCard, { backgroundColor: colors.surface }]}>
      <View style={styles.journeyHeader}>
        <Skeleton width={48} height={48} borderRadius={24} />
        <View style={styles.journeyHeaderContent}>
          <Skeleton width={100} height={12} style={{ marginBottom: 6 }} />
          <Skeleton width={60} height={10} />
        </View>
        <Skeleton width={60} height={24} borderRadius={12} />
      </View>
      <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="80%" height={16} style={{ marginBottom: 12 }} />
      <View style={styles.journeyTags}>
        <Skeleton width={70} height={24} borderRadius={12} />
        <Skeleton width={80} height={24} borderRadius={12} />
        <Skeleton width={60} height={24} borderRadius={12} />
      </View>
    </View>
  );
};

// Milestone Skeleton - For wellness milestones
export const MilestoneSkeleton: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.milestoneCard, { backgroundColor: colors.surface }]}>
      <View style={styles.milestoneLeft}>
        <Skeleton width={4} height={60} borderRadius={2} />
      </View>
      <View style={styles.milestoneContent}>
        <Skeleton width={32} height={32} borderRadius={16} style={{ marginBottom: 8 }} />
        <Skeleton width={100} height={14} style={{ marginBottom: 4 }} />
        <Skeleton width={60} height={10} />
      </View>
      <Skeleton width={40} height={40} borderRadius={20} />
    </View>
  );
};

// Conversation Skeleton - For chat/messaging
export const ConversationSkeleton: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.conversationCard, { backgroundColor: colors.surface }]}>
      <View style={styles.conversationAvatar}>
        <Skeleton width={56} height={56} borderRadius={28} />
        <View style={[styles.statusDot, { backgroundColor: colors.surface }]}>
          <Skeleton width={12} height={12} borderRadius={6} />
        </View>
      </View>
      <View style={styles.conversationContent}>
        <Skeleton width={140} height={14} style={{ marginBottom: 6 }} />
        <Skeleton width="100%" height={12} style={{ marginBottom: 4 }} />
        <Skeleton width={80} height={10} />
      </View>
      <View style={styles.conversationMeta}>
        <Skeleton width={40} height={10} style={{ marginBottom: 8 }} />
        <Skeleton width={20} height={20} borderRadius={10} />
      </View>
    </View>
  );
};

// Wellness Insight Skeleton
export const InsightSkeleton: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.insightCard, { backgroundColor: colors.surface }]}>
      <View style={styles.insightHeader}>
        <Skeleton width={40} height={40} borderRadius={12} />
        <View style={styles.insightHeaderContent}>
          <Skeleton width={100} height={12} style={{ marginBottom: 4 }} />
          <Skeleton width={140} height={16} />
        </View>
      </View>
      <View style={styles.insightChart}>
        <Skeleton width="100%" height={100} borderRadius={BorderRadius.lg} />
      </View>
      <View style={styles.insightFooter}>
        <Skeleton width={80} height={24} borderRadius={12} />
        <Skeleton width={80} height={24} borderRadius={12} />
      </View>
    </View>
  );
};

// Profile Header Skeleton
export const ProfileHeaderSkeleton: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.profileHeader, { backgroundColor: colors.surface }]}>
      <View style={styles.profileAvatarSection}>
        <Skeleton width={100} height={100} borderRadius={50} />
        <View style={styles.profileBadge}>
          <Skeleton width={24} height={24} borderRadius={12} />
        </View>
      </View>
      <Skeleton width={150} height={20} style={{ marginBottom: 8, alignSelf: 'center' }} />
      <Skeleton width={100} height={14} style={{ marginBottom: 16, alignSelf: 'center' }} />
      <View style={styles.profileStats}>
        <View style={styles.profileStat}>
          <Skeleton width={40} height={18} style={{ marginBottom: 4 }} />
          <Skeleton width={60} height={12} />
        </View>
        <View style={styles.profileStat}>
          <Skeleton width={40} height={18} style={{ marginBottom: 4 }} />
          <Skeleton width={60} height={12} />
        </View>
        <View style={styles.profileStat}>
          <Skeleton width={40} height={18} style={{ marginBottom: 4 }} />
          <Skeleton width={60} height={12} />
        </View>
      </View>
    </View>
  );
};

// Test Card Skeleton
export const TestCardSkeleton: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.testCard, { backgroundColor: colors.surface }]}>
      <Skeleton width={44} height={44} borderRadius={22} style={{ marginBottom: 12 }} />
      <Skeleton width="80%" height={14} />
    </View>
  );
};

// Story Skeleton
export const StorySkeleton: React.FC = () => (
  <View style={styles.story}>
    <Skeleton width={68} height={68} borderRadius={34} />
    <Skeleton width={50} height={10} style={{ marginTop: 6 }} />
  </View>
);

// Therapist Card Skeleton
export const TherapistSkeleton: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.therapistCard, { backgroundColor: colors.surface }]}>
      <Skeleton width={56} height={56} borderRadius={28} />
      <View style={styles.therapistContent}>
        <Skeleton width={140} height={16} style={{ marginBottom: 6 }} />
        <Skeleton width={100} height={12} style={{ marginBottom: 8 }} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Skeleton width={60} height={18} borderRadius={9} />
          <Skeleton width={60} height={18} borderRadius={9} />
        </View>
      </View>
      <Skeleton width={40} height={40} borderRadius={20} />
    </View>
  );
};

// Full Screen Loading
export const FullScreenLoader: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.fullScreen, { backgroundColor: colors.background }]}>
      <View style={styles.fullScreenContent}>
        <Skeleton width={80} height={80} borderRadius={40} style={{ marginBottom: 20 }} />
        <Skeleton width={200} height={20} style={{ marginBottom: 12 }} />
        <Skeleton width={150} height={14} />
      </View>
    </View>
  );
};

// Feed Loading (Journey)
export const FeedLoader: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.feedLoader, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.feedHeader}>
        <Skeleton width={100} height={24} borderRadius={12} />
        <Skeleton width={40} height={40} borderRadius={20} />
      </View>
      {/* Milestones */}
      <MilestoneSkeleton />
      <MilestoneSkeleton />
      {/* Journey Cards */}
      <JourneyCardSkeleton />
      <JourneyCardSkeleton />
    </View>
  );
};

// Chat Loading
export const ChatLoader: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.chatLoader, { backgroundColor: colors.background }]}>
      <ConversationSkeleton />
      <ConversationSkeleton />
      <ConversationSkeleton />
      <ConversationSkeleton />
    </View>
  );
};

// Profile Loading
export const ProfileLoader: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.profileLoader, { backgroundColor: colors.background }]}>
      <ProfileHeaderSkeleton />
      <InsightSkeleton />
      <View style={styles.profileCards}>
        <CardSkeleton />
        <CardSkeleton />
      </View>
    </View>
  );
};

// Home Screen Loading
export const HomeLoader: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.homeLoader, { backgroundColor: colors.background }]}>
      {/* Mood Card */}
      <View style={styles.moodSkeleton}>
        <Skeleton width="100%" height={100} borderRadius={BorderRadius.xl} />
      </View>
      {/* Two Column */}
      <View style={styles.twoColumn}>
        <Skeleton width="48%" height={150} borderRadius={BorderRadius.xl} />
        <Skeleton width="48%" height={150} borderRadius={BorderRadius.xl} />
      </View>
      {/* Test Cards */}
      <View style={styles.testCardsRow}>
        {[1, 2, 3, 4].map(i => <TestCardSkeleton key={i} />)}
      </View>
      {/* List */}
      <CardSkeleton />
      <CardSkeleton />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.light.border,
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
  },
  cardContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  postCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  postHeaderContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  postBody: {
    marginBottom: Spacing.md,
  },
  postFooter: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  journeyCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  journeyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  journeyHeaderContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  journeyTags: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  milestoneLeft: {
    marginRight: Spacing.md,
  },
  milestoneContent: {
    flex: 1,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  conversationAvatar: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationContent: {
    flex: 1,
  },
  conversationMeta: {
    alignItems: 'flex-end',
  },
  insightCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  insightHeaderContent: {
    marginLeft: Spacing.md,
  },
  insightChart: {
    marginBottom: Spacing.md,
  },
  insightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileHeader: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  profileAvatarSection: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  profileBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  profileStat: {
    alignItems: 'center',
  },
  testCard: {
    width: 120,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  story: {
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  therapistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  therapistContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenContent: {
    alignItems: 'center',
  },
  feedLoader: {
    padding: Spacing.xl,
    flex: 1,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  chatLoader: {
    padding: Spacing.xl,
    flex: 1,
  },
  profileLoader: {
    padding: Spacing.xl,
    flex: 1,
  },
  profileCards: {
    marginTop: Spacing.md,
  },
  homeLoader: {
    padding: Spacing.xl,
  },
  moodSkeleton: {
    marginBottom: Spacing.xl,
  },
  twoColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  testCardsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  storiesRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
  },
});

export default {
  Skeleton,
  CardSkeleton,
  PostSkeleton,
  JourneyCardSkeleton,
  MilestoneSkeleton,
  ConversationSkeleton,
  InsightSkeleton,
  ProfileHeaderSkeleton,
  TestCardSkeleton,
  StorySkeleton,
  TherapistSkeleton,
  FullScreenLoader,
  FeedLoader,
  ChatLoader,
  ProfileLoader,
  HomeLoader,
};
