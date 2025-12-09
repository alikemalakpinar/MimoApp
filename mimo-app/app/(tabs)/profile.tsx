// app/(tabs)/profile.tsx - INSTAGRAM-STYLE FULL PROFILE WITH ANIMATIONS
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  Animated,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius, Shadows, useThemeStore } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';
import { useGamification } from '../../shared/store/gamification';

const { width } = Dimensions.get('window');
const imageSize = (width - 2) / 3;

const MOCK_USER = {
  name: 'Ayşe Yılmaz',
  username: '@ayseyilmaz',
  initials: 'AY',
  bio: '🌿 Mental sağlık yolculuğum\n✨ Mindfulness & Yoga\n📝 Her gün günlük yazma alışkanlığım',
  posts: 24,
  followers: 156,
  following: 89,
  website: 'ora.app/ayseyilmaz',
};

const HIGHLIGHTS = [
  { id: '1', title: 'Mood', icon: 'heart', color: '#FFE8DC', gradient: ['#FFE8DC', '#FFCFBD'] },
  { id: '2', title: 'Günlük', icon: 'book', color: '#E8F4FF', gradient: ['#E8F4FF', '#C8E4FF'] },
  { id: '3', title: 'Yoga', icon: 'activity', color: '#E8F8F0', gradient: ['#E8F8F0', '#C8F0E0'] },
  { id: '4', title: 'Terapim', icon: 'message-circle', color: '#FFF5E8', gradient: ['#FFF5E8', '#FFE8C8'] },
];

const MY_POSTS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', likes: 42, comments: 5 },
  { id: '2', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400', likes: 38, comments: 3 },
  { id: '3', image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400', likes: 51, comments: 8 },
  { id: '4', image: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=400', likes: 29, comments: 2 },
  { id: '5', image: 'https://images.unsplash.com/photo-1502781252888-9143ba7f074e?w=400', likes: 67, comments: 12 },
  { id: '6', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400', likes: 45, comments: 6 },
  { id: '7', image: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=400', likes: 33, comments: 4 },
  { id: '8', image: 'https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=400', likes: 56, comments: 9 },
  { id: '9', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400', likes: 41, comments: 7 },
];

// Animated Post Thumbnail Component
const PostThumbnail: React.FC<{
  post: typeof MY_POSTS[0];
  onPress: () => void;
}> = ({ post, onPress }) => {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.postThumbnail}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%', height: '100%' }}>
        <Image
          source={{ uri: post.image }}
          style={styles.thumbnailImage}
          resizeMode="cover"
        />
        <Animated.View style={[styles.postOverlay, { opacity: overlayOpacity }]}>
          <View style={styles.postStat}>
            <Feather name="heart" size={16} color="#FFFFFF" />
            <Text style={styles.postStatText}>{post.likes}</Text>
          </View>
          <View style={styles.postStat}>
            <Feather name="message-circle" size={16} color="#FFFFFF" />
            <Text style={styles.postStatText}>{post.comments}</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

// Animated Stat Component
const AnimatedStat: React.FC<{
  value: number;
  label: string;
  onPress?: () => void;
}> = ({ value, label, onPress }) => {
  const countAnim = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    Animated.timing(countAnim, {
      toValue: value,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    countAnim.addListener(({ value: v }) => {
      setDisplayValue(Math.floor(v));
    });

    return () => countAnim.removeAllListeners();
  }, [value]);

  return (
    <TouchableOpacity style={styles.stat} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.statNumber}>{displayValue}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function Profile() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [selectedTab, setSelectedTab] = useState<'grid' | 'list'>('grid');
  const { isDarkMode } = useThemeStore();
  const { totalPoints, getCurrentLevel, currentStreak } = useGamification();
  const currentLevel = getCurrentLevel();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
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

  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, borderBottomColor: colors.divider }]}>
        <Text style={[styles.username, { color: colors.textPrimary }]}>{MOCK_USER.username}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => router.push('/create-post')}
            style={styles.headerButton}
          >
            <Feather name="plus-square" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(patient)/settings')}
            style={styles.headerButton}
          >
            <Feather name="settings" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info */}
        <Animated.View
          style={[
            styles.profileSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.profileRow}>
            {/* Avatar with Level Ring */}
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[currentLevel.color, colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarRing}
              >
                <View style={[styles.avatarLarge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.avatarText}>{MOCK_USER.initials}</Text>
                </View>
              </LinearGradient>
              {/* Level Badge */}
              <View style={[styles.levelBadge, { backgroundColor: currentLevel.color }]}>
                <Text style={styles.levelBadgeText}>{currentLevel.level}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <AnimatedStat value={MOCK_USER.posts} label="paylaşım" />
              <AnimatedStat value={MOCK_USER.followers} label="takipçi" />
              <AnimatedStat value={MOCK_USER.following} label="takip" />
            </View>
          </View>

          <Text style={[styles.name, { color: colors.textPrimary }]}>{MOCK_USER.name}</Text>
          <Text style={[styles.bio, { color: colors.textSecondary }]}>{MOCK_USER.bio}</Text>

          {/* Gamification Stats */}
          <View style={styles.gamificationRow}>
            <View style={[styles.gamificationBadge, { backgroundColor: colors.cardGold }]}>
              <Feather name="star" size={14} color={colors.gold} />
              <Text style={[styles.gamificationText, { color: colors.gold }]}>{totalPoints} puan</Text>
            </View>
            <View style={[styles.gamificationBadge, { backgroundColor: colors.cardAccent }]}>
              <Text style={styles.fireEmoji}>🔥</Text>
              <Text style={[styles.gamificationText, { color: colors.accent }]}>{currentStreak} gün seri</Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: colors.surfaceAlt }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.editButtonText, { color: colors.textPrimary }]}>Profili düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: colors.surfaceAlt }]}
              activeOpacity={0.8}
            >
              <Feather name="share-2" size={16} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.achievementsButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
              onPress={() => router.push('/(patient)/achievements')}
            >
              <Feather name="award" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Story Highlights */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.highlightsContainer, { borderBottomColor: colors.divider }]}
            contentContainerStyle={styles.highlightsContent}
          >
            <TouchableOpacity style={styles.highlightItem} activeOpacity={0.8}>
              <View style={[styles.highlightAdd, { borderColor: colors.border }]}>
                <Feather name="plus" size={24} color={colors.textSecondary} />
              </View>
              <Text style={[styles.highlightLabel, { color: colors.textSecondary }]}>Yeni</Text>
            </TouchableOpacity>
            {HIGHLIGHTS.map((highlight) => (
              <TouchableOpacity key={highlight.id} style={styles.highlightItem} activeOpacity={0.8}>
                <LinearGradient
                  colors={highlight.gradient}
                  style={styles.highlightCircle}
                >
                  <Feather name={highlight.icon as any} size={24} color={colors.textPrimary} />
                </LinearGradient>
                <Text style={[styles.highlightLabel, { color: colors.textSecondary }]}>{highlight.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Tabs */}
        <View style={[styles.tabs, { borderBottomColor: colors.divider }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'grid' && { borderBottomColor: colors.textPrimary }
            ]}
            onPress={() => setSelectedTab('grid')}
          >
            <Feather
              name="grid"
              size={24}
              color={selectedTab === 'grid' ? colors.textPrimary : colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'list' && { borderBottomColor: colors.textPrimary }
            ]}
            onPress={() => setSelectedTab('list')}
          >
            <Feather
              name="bookmark"
              size={24}
              color={selectedTab === 'list' ? colors.textPrimary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        <Animated.View style={[styles.postsGrid, { opacity: fadeAnim }]}>
          {MY_POSTS.map((post) => (
            <PostThumbnail
              key={post.id}
              post={post}
              onPress={() => router.push(`/post/${post.id}`)}
            />
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },

  username: {
    fontSize: 20,
    fontWeight: '700',
  },

  headerRight: {
    flexDirection: 'row',
    gap: Spacing.md,
  },

  headerButton: {
    padding: Spacing.xs,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  profileSection: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.xxl,
  },

  avatarRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    padding: 3,
  },

  avatarLarge: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  levelBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  stat: {
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },

  statLabel: {
    fontSize: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },

  bio: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },

  gamificationRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  gamificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.pill,
    gap: Spacing.xs,
  },

  gamificationText: {
    fontSize: 12,
    fontWeight: '600',
  },

  fireEmoji: {
    fontSize: 12,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  editButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },

  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  shareButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  achievementsButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  highlightsContainer: {
    borderBottomWidth: 1,
  },

  highlightsContent: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    gap: Spacing.lg,
  },

  highlightItem: {
    alignItems: 'center',
    width: 72,
  },

  highlightAdd: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },

  highlightCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },

  highlightLabel: {
    fontSize: 11,
  },

  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },

  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
  },

  postThumbnail: {
    width: imageSize,
    height: imageSize,
    position: 'relative',
  },

  thumbnailImage: {
    width: '100%',
    height: '100%',
  },

  postOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },

  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  postStatText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
