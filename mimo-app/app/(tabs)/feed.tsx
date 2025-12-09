// app/(tabs)/feed.tsx - MY JOURNEY - ORA SOCIAL FEATURE
// "Yolculuğunuzu paylaşın, deneyimlerinizi keşfedin"
import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
  Animated,
  Modal,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows, AppConfig } from '../../shared/theme';
import { useThemeStore } from '../../shared/store/themeStore';

const { width } = Dimensions.get('window');

// Ora Mini Logo
const OraMiniLogo = ({ size = 32 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 120 120">
    <Defs>
      <RadialGradient id="miniLogoGlow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#A18AFF" stopOpacity="0.8" />
        <Stop offset="100%" stopColor="#7C5CE0" stopOpacity="0.3" />
      </RadialGradient>
    </Defs>
    <Circle cx="60" cy="60" r="45" fill="none" stroke="#7C5CE0" strokeWidth="6" />
    <Circle cx="60" cy="60" r="8" fill="#7C5CE0" />
    <Circle cx="60" cy="60" r="5" fill="#A18AFF" />
  </Svg>
);

// Stories data
const STORIES = [
  { id: '1', user: 'Sen', avatar: null, hasStory: false, isYou: true },
  { id: '2', user: 'Dr. Elif', avatar: 'EY', hasStory: true, verified: true, color: '#7C5CE0' },
  { id: '3', user: 'Zeynep', avatar: 'ZA', hasStory: true, color: '#20B2AA' },
  { id: '4', user: 'Mehmet', avatar: 'MK', hasStory: true, color: '#FF6B6B' },
  { id: '5', user: 'Ayşe', avatar: 'AD', hasStory: true, color: '#FFB347' },
  { id: '6', user: 'Dr. Can', avatar: 'CK', hasStory: true, verified: true, color: '#6BB5FF' },
];

// Journey Posts - Social feed content
const JOURNEY_POSTS = [
  {
    id: '1',
    author: 'Dr. Elif Yılmaz',
    authorAvatar: 'EY',
    avatarColor: '#7C5CE0',
    userType: 'therapist',
    time: '2 saat önce',
    content: 'Günlük 5 dakikalık nefes egzersizinin stres üzerine inanılmaz etkisi var. Danışanlarımla denedik, gerçekten işe yarıyor!\n\nDenemenizi öneririm: 4 saniye nefes al, 4 saniye tut, 4 saniye ver.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    likes: 234,
    comments: 45,
    saves: 89,
    isLiked: false,
    isSaved: false,
    hashtags: ['nefes-egzersizi', 'mindfulness', 'stres-yönetimi', 'anksiyete'],
    mood: 'calm',
  },
  {
    id: '2',
    author: 'Anonim Kullanıcı',
    authorAvatar: null,
    avatarColor: '#20B2AA',
    userType: 'anonymous',
    time: '5 saat önce',
    content: '3 haftadır meditasyon yapıyorum ve hayatım değişti! Daha sakin, daha odaklı hissediyorum. Kendime ayırdığım bu 10 dakika bile çok şey değiştirdi.\n\nTerk edilme korkusu testinden yüksek puan almıştım, ama şimdi daha iyi hissediyorum.',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800',
    likes: 189,
    comments: 23,
    saves: 45,
    isLiked: true,
    isSaved: true,
    hashtags: ['meditasyon', 'self-care', 'terk-edilme-korkusu', 'iyileşme-yolculuğu'],
    mood: 'grateful',
    testResult: {
      name: 'Terk Edilme Ölçeği',
      level: 'Orta',
      color: '#FFB347',
    },
  },
  {
    id: '3',
    author: 'Mehmet K.',
    authorAvatar: 'MK',
    avatarColor: '#FF6B6B',
    userType: 'user',
    time: '1 gün önce',
    content: 'Bugün terapistimle çok verimli bir seans yaptık. Açıklıkla konuşabilmek çok rahatlatıcı. Kendime ayırdığım bu zamana değdi.\n\nMental sağlığım artık önceliklerimden biri. Yardım istemek zayıflık değil, cesaret!',
    likes: 156,
    comments: 18,
    saves: 34,
    isLiked: false,
    isSaved: false,
    hashtags: ['terapi', 'mental-sağlık', 'kişisel-gelişim', 'cesaret'],
    mood: 'motivated',
  },
  {
    id: '4',
    author: 'Dr. Ayşe Demir',
    authorAvatar: 'AD',
    avatarColor: '#6BB5FF',
    userType: 'therapist',
    time: '2 gün önce',
    content: 'Şema terapisi hakkında sık sorulan sorular:\n\n1. Şemalar nedir? Çocukluktan gelen düşünce kalıplarıdır.\n2. Değiştirilebilir mi? Evet, farkındalık ve çalışmayla.\n3. Ne kadar sürer? Kişiye göre değişir.\n\nSorularınız için yazabilirsiniz!',
    likes: 312,
    comments: 67,
    saves: 156,
    isLiked: true,
    isSaved: true,
    hashtags: ['şema-terapisi', 'psikoloji', 'farkındalık', 'uzman-görüşü'],
    mood: 'calm',
  },
];

// Mood icons and colors
const getMoodConfig = (isDark: boolean): Record<string, { icon: string; color: string; label: string }> => {
  const colors = isDark ? Colors.dark : Colors.light;
  return {
    happy: { icon: 'smile', color: colors.moodHappy, label: 'Mutlu' },
    calm: { icon: 'coffee', color: colors.moodCalm, label: 'Sakin' },
    grateful: { icon: 'heart', color: colors.moodGrateful, label: 'Minnettar' },
    motivated: { icon: 'zap', color: colors.moodMotivated, label: 'Motive' },
    sad: { icon: 'cloud', color: colors.moodSad, label: 'Hüzünlü' },
    anxious: { icon: 'alert-circle', color: colors.moodAnxious, label: 'Endişeli' },
  };
};

export default function Feed() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const MOOD_CONFIG = getMoodConfig(isDarkMode);
  const [likedPosts, setLikedPosts] = useState<string[]>(['2', '4']);
  const [savedPosts, setSavedPosts] = useState<string[]>(['2', '4']);
  const [showShareTest, setShowShareTest] = useState(false);

  const handleLike = (postId: string) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  const handleSave = (postId: string) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter(id => id !== postId));
    } else {
      setSavedPosts([...savedPosts, postId]);
    }
  };

  const handleHashtagPress = (hashtag: string) => {
    // Navigate to hashtag search results
    router.push(`/(tabs)/search?hashtag=${hashtag}`);
  };

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    } as ViewStyle,
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
      backgroundColor: colors.surface,
    } as ViewStyle,
    headerTitle: {
      fontSize: 22,
      fontWeight: '700' as const,
      color: colors.textPrimary,
      letterSpacing: -0.5,
    } as TextStyle,
    emergencyButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.cardAccent,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    messageBadge: {
      position: 'absolute' as const,
      top: -4,
      right: -4,
      backgroundColor: colors.primary,
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 5,
    } as ViewStyle,
    storiesContainer: {
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    } as ViewStyle,
    storyName: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: 'center' as const,
    } as TextStyle,
    quickActions: {
      flexDirection: 'row' as const,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      gap: Spacing.sm,
      backgroundColor: colors.surface,
      marginBottom: Spacing.sm,
    } as ViewStyle,
    createPostText: {
      fontSize: 14,
      color: colors.textSecondary,
    } as TextStyle,
    createPostIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      ...Shadows.xs,
    } as ViewStyle,
    shareTestButton: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.lg,
      backgroundColor: colors.cardSecondary,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    postCard: {
      backgroundColor: colors.surface,
      marginBottom: Spacing.sm,
      paddingTop: Spacing.lg,
    } as ViewStyle,
    authorAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.sm,
    } as ViewStyle,
    authorName: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: colors.textPrimary,
    } as TextStyle,
    verifiedBadge: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    anonymousBadge: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    postTime: {
      fontSize: 12,
      color: colors.textTertiary,
    } as TextStyle,
    postMetaDot: {
      fontSize: 12,
      color: colors.textTertiary,
    } as TextStyle,
    testResultBadge: {
      flexDirection: 'row' as const,
      alignItems: 'center',
      marginHorizontal: Spacing.lg,
      marginBottom: Spacing.md,
      padding: Spacing.sm,
      backgroundColor: colors.cardGold,
      borderRadius: BorderRadius.md,
      gap: Spacing.sm,
    } as ViewStyle,
    testResultName: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: colors.textPrimary,
    } as TextStyle,
    postContent: {
      fontSize: 15,
      color: colors.textPrimary,
      lineHeight: 22,
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.md,
    } as TextStyle,
    postImage: {
      width: width,
      height: width * 0.65,
      backgroundColor: colors.border,
    } as ViewStyle,
    hashtag: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      backgroundColor: colors.cardPrimary,
      borderRadius: BorderRadius.pill,
    } as ViewStyle,
    hashtagText: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: colors.primary,
    } as TextStyle,
    actionCount: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.textSecondary,
    } as TextStyle,
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    } as ViewStyle,
    modalContent: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: BorderRadius.bottomSheet,
      borderTopRightRadius: BorderRadius.bottomSheet,
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.huge,
      paddingTop: Spacing.md,
    } as ViewStyle,
    modalHandle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginBottom: Spacing.xl,
    } as ViewStyle,
    modalTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.textPrimary,
      marginBottom: Spacing.sm,
    } as TextStyle,
    modalSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: Spacing.xl,
    } as TextStyle,
    testOption: {
      flexDirection: 'row' as const,
      alignItems: 'center',
      padding: Spacing.md,
      backgroundColor: colors.surfaceAlt,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.md,
      gap: Spacing.md,
    } as ViewStyle,
    testOptionName: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: colors.textPrimary,
      marginBottom: 2,
    } as TextStyle,
    testOptionDate: {
      fontSize: 12,
      color: colors.textSecondary,
    } as TextStyle,
    modalCloseText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.textSecondary,
    } as TextStyle,
    storyAvatarWrapper: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 2,
      borderColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.xs,
      position: 'relative' as const,
    } as ViewStyle,
    verifiedBadgeSmall: {
      position: 'absolute' as const,
      bottom: 0,
      right: 0,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: colors.secondary,
      borderWidth: 2,
      borderColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
  }), [isDarkMode, colors]);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header */}
      <View style={dynamicStyles.header}>
        <View style={styles.headerLeft}>
          <OraMiniLogo size={32} />
          <Text style={dynamicStyles.headerTitle}>My Journey</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('/emergency')}
          >
            <View style={dynamicStyles.emergencyButton}>
              <Feather name="alert-circle" size={20} color={colors.accent} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('/(tabs)/chat')}
          >
            <Feather name="message-circle" size={24} color={colors.textPrimary} />
            <View style={dynamicStyles.messageBadge}>
              <Text style={styles.messageBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={dynamicStyles.storiesContainer}
          contentContainerStyle={styles.storiesContent}
        >
          {STORIES.map((story) => (
            <TouchableOpacity key={story.id} style={styles.storyItem}>
              <View
                style={[
                  dynamicStyles.storyAvatarWrapper,
                  story.hasStory && { borderColor: story.color || colors.primary },
                ]}
              >
                {story.isYou ? (
                  <View style={styles.addStoryButton}>
                    <LinearGradient
                      colors={Colors.gradients.primary as [string, string]}
                      style={styles.addStoryGradient}
                    >
                      <Feather name="plus" size={16} color="#FFFFFF" />
                    </LinearGradient>
                  </View>
                ) : (
                  <View style={[styles.storyAvatar, { backgroundColor: story.color }]}>
                    <Text style={styles.storyInitials}>{story.avatar}</Text>
                  </View>
                )}
                {story.verified && (
                  <View style={dynamicStyles.verifiedBadgeSmall}>
                    <Feather name="check" size={8} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <Text style={dynamicStyles.storyName} numberOfLines={1}>
                {story.user}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <View style={dynamicStyles.quickActions}>
          <TouchableOpacity
            style={styles.createPostButton}
            onPress={() => router.push('/create-post')}
          >
            <LinearGradient
              colors={isDarkMode ? ['#2D2640', '#1A2E2D'] : ['#F8F5FF', '#F0FFFE']}
              style={styles.createPostGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={dynamicStyles.createPostIcon}>
                <Feather name="edit-3" size={18} color={colors.primary} />
              </View>
              <Text style={dynamicStyles.createPostText}>Yolculuğunuzu paylaşın...</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={dynamicStyles.shareTestButton}
            onPress={() => setShowShareTest(true)}
          >
            <Feather name="share-2" size={18} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Feed Posts */}
        {JOURNEY_POSTS.map((post) => {
          const isLiked = likedPosts.includes(post.id);
          const isSaved = savedPosts.includes(post.id);
          const moodConfig = MOOD_CONFIG[post.mood];

          return (
            <View key={post.id} style={dynamicStyles.postCard}>
              {/* Post Header */}
              <TouchableOpacity
                style={styles.postHeader}
                onPress={() => post.userType !== 'anonymous' && router.push(`/user/${post.id}`)}
              >
                <View style={styles.authorInfo}>
                  {post.authorAvatar ? (
                    <View style={[dynamicStyles.authorAvatar, { backgroundColor: post.avatarColor }]}>
                      <Text style={styles.authorAvatarText}>{post.authorAvatar}</Text>
                    </View>
                  ) : (
                    <View style={[dynamicStyles.authorAvatar, { backgroundColor: colors.border }]}>
                      <Feather name="user" size={18} color={colors.textSecondary} />
                    </View>
                  )}
                  <View style={styles.authorDetails}>
                    <View style={styles.authorNameRow}>
                      <Text style={dynamicStyles.authorName}>{post.author}</Text>
                      {post.userType === 'therapist' && (
                        <View style={dynamicStyles.verifiedBadge}>
                          <Feather name="check" size={10} color="#FFFFFF" />
                        </View>
                      )}
                      {post.userType === 'anonymous' && (
                        <View style={dynamicStyles.anonymousBadge}>
                          <Feather name="eye-off" size={10} color={colors.textSecondary} />
                        </View>
                      )}
                    </View>
                    <View style={styles.postMeta}>
                      <Text style={dynamicStyles.postTime}>{post.time}</Text>
                      {moodConfig && (
                        <>
                          <Text style={dynamicStyles.postMetaDot}>•</Text>
                          <View style={[styles.moodBadge, { backgroundColor: moodConfig.color + '20' }]}>
                            <Feather name={moodConfig.icon as any} size={10} color={moodConfig.color} />
                            <Text style={[styles.moodText, { color: moodConfig.color }]}>
                              {moodConfig.label}
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                  </View>
                </View>
                <TouchableOpacity>
                  <Feather name="more-horizontal" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </TouchableOpacity>

              {/* Test Result Badge (if shared) */}
              {post.testResult && (
                <TouchableOpacity style={dynamicStyles.testResultBadge}>
                  <View style={[styles.testResultIcon, { backgroundColor: post.testResult.color + '20' }]}>
                    <Feather name="clipboard" size={14} color={post.testResult.color} />
                  </View>
                  <View style={styles.testResultInfo}>
                    <Text style={dynamicStyles.testResultName}>{post.testResult.name}</Text>
                    <Text style={[styles.testResultLevel, { color: post.testResult.color }]}>
                      {post.testResult.level} Seviye
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={colors.textTertiary} />
                </TouchableOpacity>
              )}

              {/* Content */}
              <Text style={dynamicStyles.postContent}>{post.content}</Text>

              {/* Image */}
              {post.image && (
                <TouchableOpacity
                  style={styles.imageContainer}
                  onPress={() => router.push(`/post/${post.id}`)}
                >
                  <Image
                    source={{ uri: post.image }}
                    style={dynamicStyles.postImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}

              {/* Hashtags */}
              <View style={styles.hashtagsContainer}>
                {post.hashtags.map((tag, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={dynamicStyles.hashtag}
                    onPress={() => handleHashtagPress(tag)}
                  >
                    <Text style={dynamicStyles.hashtagText}>#{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Actions */}
              <View style={styles.actionsRow}>
                <View style={styles.actionsLeft}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleLike(post.id)}
                  >
                    <Feather
                      name="heart"
                      size={22}
                      color={isLiked ? colors.accent : colors.textPrimary}
                      fill={isLiked ? colors.accent : 'none'}
                    />
                    <Text style={[dynamicStyles.actionCount, isLiked && { color: colors.accent }]}>
                      {post.likes + (isLiked && !post.isLiked ? 1 : 0)}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push(`/post/${post.id}`)}
                  >
                    <Feather name="message-circle" size={22} color={colors.textPrimary} />
                    <Text style={dynamicStyles.actionCount}>{post.comments}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="send" size={22} color={colors.textPrimary} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleSave(post.id)}
                >
                  <Feather
                    name="bookmark"
                    size={22}
                    color={isSaved ? colors.primary : colors.textPrimary}
                    fill={isSaved ? colors.primary : 'none'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Share Test Modal */}
      <Modal
        visible={showShareTest}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShareTest(false)}
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.modalHandle} />
            <Text style={dynamicStyles.modalTitle}>Test Sonucunu Paylaş</Text>
            <Text style={dynamicStyles.modalSubtitle}>
              Tamamladığınız testlerin sonuçlarını toplulukla anonim olarak paylaşabilirsiniz.
            </Text>

            <TouchableOpacity style={dynamicStyles.testOption}>
              <View style={[styles.testOptionIcon, { backgroundColor: colors.cardPrimary }]}>
                <Feather name="user" size={20} color={colors.primary} />
              </View>
              <View style={styles.testOptionInfo}>
                <Text style={dynamicStyles.testOptionName}>Terk Edilme Ölçeği</Text>
                <Text style={dynamicStyles.testOptionDate}>2 gün önce tamamlandı</Text>
              </View>
              <Feather name="share-2" size={18} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={dynamicStyles.testOption}>
              <View style={[styles.testOptionIcon, { backgroundColor: colors.cardSecondary }]}>
                <Feather name="heart" size={20} color={colors.secondary} />
              </View>
              <View style={styles.testOptionInfo}>
                <Text style={dynamicStyles.testOptionName}>Duygusal Yoksunluk Ölçeği</Text>
                <Text style={dynamicStyles.testOptionDate}>1 hafta önce tamamlandı</Text>
              </View>
              <Feather name="share-2" size={18} color={colors.secondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowShareTest(false)}
            >
              <Text style={dynamicStyles.modalCloseText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    backgroundColor: Colors.light.surface,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    letterSpacing: -0.5,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  headerButton: {
    position: 'relative',
  },

  emergencyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.cardAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },

  messageBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },

  messageBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  storiesContainer: {
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },

  storiesContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },

  storyItem: {
    alignItems: 'center',
    width: 70,
  },

  storyAvatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    position: 'relative',
  },

  storyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  storyInitials: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  addStoryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },

  addStoryGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  verifiedBadgeSmall: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.light.secondary,
    borderWidth: 2,
    borderColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  storyName: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },

  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.light.surface,
    marginBottom: Spacing.sm,
  },

  createPostButton: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },

  createPostGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },

  createPostIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.xs,
  },

  createPostText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },

  shareTestButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  postCard: {
    backgroundColor: Colors.light.surface,
    marginBottom: Spacing.sm,
    paddingTop: Spacing.lg,
  },

  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },

  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },

  authorAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  authorDetails: {
    flex: 1,
  },

  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },

  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  anonymousBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  postTime: {
    fontSize: 12,
    color: Colors.light.textTertiary,
  },

  postMetaDot: {
    fontSize: 12,
    color: Colors.light.textTertiary,
  },

  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },

  moodText: {
    fontSize: 10,
    fontWeight: '600',
  },

  testResultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: Colors.light.cardGold,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },

  testResultIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  testResultInfo: {
    flex: 1,
  },

  testResultName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  testResultLevel: {
    fontSize: 11,
    fontWeight: '500',
  },

  postContent: {
    fontSize: 15,
    color: Colors.light.textPrimary,
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },

  imageContainer: {
    marginBottom: Spacing.md,
  },

  postImage: {
    width: width,
    height: width * 0.65,
    backgroundColor: Colors.light.border,
  },

  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },

  hashtag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: Colors.light.cardPrimary,
    borderRadius: BorderRadius.pill,
  },

  hashtagText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },

  actionsLeft: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  actionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.light.overlay,
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: Colors.light.surface,
    borderTopLeftRadius: BorderRadius.bottomSheet,
    borderTopRightRadius: BorderRadius.bottomSheet,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
    paddingTop: Spacing.md,
  },

  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.border,
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
  },

  modalSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },

  testOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.light.surfaceAlt,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },

  testOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  testOptionInfo: {
    flex: 1,
  },

  testOptionName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },

  testOptionDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },

  modalCloseButton: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
  },

  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
});
