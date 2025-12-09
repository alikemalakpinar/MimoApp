// shared/components/SkeletonLoader.tsx - Skeleton loading components
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius } from '../theme';

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

  return (
    <View
      style={[
        styles.skeleton,
        { width: w, height, borderRadius },
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
          colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

// Card Skeleton
export const CardSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.card, style]}>
    <Skeleton width={60} height={60} borderRadius={30} />
    <View style={styles.cardContent}>
      <Skeleton width="70%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="50%" height={12} />
    </View>
  </View>
);

// Post Skeleton
export const PostSkeleton: React.FC = () => (
  <View style={styles.postCard}>
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

// Test Card Skeleton
export const TestCardSkeleton: React.FC = () => (
  <View style={styles.testCard}>
    <Skeleton width={44} height={44} borderRadius={22} style={{ marginBottom: 12 }} />
    <Skeleton width="80%" height={14} />
  </View>
);

// Story Skeleton
export const StorySkeleton: React.FC = () => (
  <View style={styles.story}>
    <Skeleton width={68} height={68} borderRadius={34} />
    <Skeleton width={50} height={10} style={{ marginTop: 6 }} />
  </View>
);

// Therapist Card Skeleton
export const TherapistSkeleton: React.FC = () => (
  <View style={styles.therapistCard}>
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

// Full Screen Loading
export const FullScreenLoader: React.FC = () => (
  <View style={styles.fullScreen}>
    <View style={styles.fullScreenContent}>
      <Skeleton width={80} height={80} borderRadius={40} style={{ marginBottom: 20 }} />
      <Skeleton width={200} height={20} style={{ marginBottom: 12 }} />
      <Skeleton width={150} height={14} />
    </View>
  </View>
);

// Feed Loading
export const FeedLoader: React.FC = () => (
  <View style={styles.feedLoader}>
    {/* Stories */}
    <View style={styles.storiesRow}>
      {[1, 2, 3, 4, 5].map(i => <StorySkeleton key={i} />)}
    </View>
    {/* Posts */}
    <PostSkeleton />
    <PostSkeleton />
    <PostSkeleton />
  </View>
);

// Home Screen Loading
export const HomeLoader: React.FC = () => (
  <View style={styles.homeLoader}>
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
  },
  storiesRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
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
});

export default {
  Skeleton,
  CardSkeleton,
  PostSkeleton,
  TestCardSkeleton,
  StorySkeleton,
  TherapistSkeleton,
  FullScreenLoader,
  FeedLoader,
  HomeLoader,
};
