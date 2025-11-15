// app/(tabs)/home.tsx - SOCIAL FEED ANASAYFA
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';

const { width } = Dimensions.get('window');

const STORIES = [
  { id: '1', user: 'Sen', avatar: 'AY', hasStory: false, isAdd: true },
  { id: '2', user: 'Dr. Elif', avatar: 'EY', hasStory: true },
  { id: '3', user: 'Zeynep', avatar: 'ZA', hasStory: true },
  { id: '4', user: 'Mehmet', avatar: 'MK', hasStory: true },
];

const FEED_POSTS = [
  {
    id: '1',
    author: 'Zeynep Arslan',
    authorAvatar: 'ZA',
    userType: 'user',
    time: '2 saat önce',
    content: '3 haftadır düzenli meditasyon yapıyorum. Hayatımdaki en iyi değişikliklerden biri! ✨',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    likes: 42,
    comments: 8,
    isLiked: false,
    tags: ['meditasyon', 'mindfulness'],
  },
  {
    id: '2',
    author: 'Dr. Elif Yılmaz',
    authorAvatar: 'EY',
    userType: 'therapist',
    time: '5 saat önce',
    content: 'Günlük 5 dakikalık nefes egzersizinin önemi... 🌸',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800',
    likes: 156,
    comments: 23,
    isLiked: true,
    tags: ['mental-sağlık', 'nefes-egzersizi'],
  },
  {
    id: '3',
    author: 'Mehmet Kaya',
    authorAvatar: 'MK',
    userType: 'user',
    time: '1 gün önce',
    content: 'Bugün terapistimle çok verimli bir seans yaptık. Kendime ayırdığım zamana değdi!',
    likes: 89,
    comments: 12,
    isLiked: false,
    tags: ['terapi', 'kişisel-gelişim'],
  },
];

const QUICK_ACTIONS = [
  { icon: 'edit-3', label: 'Günlük', route: '/(tabs)/journal/new', color: '#FFE8DC' },
  { icon: 'heart', label: 'Mood', route: '/(patient)/mood/check-in', color: '#E8F8F0' },
  { icon: 'users', label: 'Topluluk', route: '/(tabs)/feed', color: '#E8F4FF' },
  { icon: 'calendar', label: 'Randevu', route: '/(tabs)/appointments', color: '#FFF5E8' },
];

export default function Home() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleLike = (postId: string) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Mimo</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/notifications')}
          >
            <Feather name="bell" size={22} color={Colors.light.textPrimary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/(tabs)/chat')}
          >
            <Feather name="message-circle" size={22} color={Colors.light.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Stories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.storiesContainer}
          contentContainerStyle={styles.storiesContent}
        >
          {STORIES.map((story) => (
            <TouchableOpacity key={story.id} style={styles.storyItem}>
              <View style={[
                styles.storyAvatar,
                story.hasStory && styles.storyAvatarActive,
                story.isAdd && styles.storyAvatarAdd,
              ]}>
                {story.isAdd ? (
                  <Feather name="plus" size={20} color={Colors.light.textPrimary} />
                ) : (
                  <Text style={styles.storyInitials}>{story.avatar}</Text>
                )}
              </View>
              <Text style={styles.storyName}>{story.user}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map((action, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.quickActionCard}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Feather name={action.icon as any} size={20} color={Colors.light.textPrimary} />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Feed */}
        {FEED_POSTS.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {/* Post Header */}
            <TouchableOpacity
              style={styles.postHeader}
              onPress={() => router.push(`/user/${post.id}`)}
            >
              <View style={styles.postAuthorInfo}>
                <View style={[
                  styles.postAvatar,
                  post.userType === 'therapist' && styles.therapistAvatar,
                ]}>
                  <Text style={styles.postAvatarText}>{post.authorAvatar}</Text>
                </View>
                <View>
                  <View style={styles.authorRow}>
                    <Text style={styles.postAuthor}>{post.author}</Text>
                    {post.userType === 'therapist' && (
                      <View style={styles.verifiedBadge}>
                        <Feather name="check" size={10} color={Colors.light.surface} />
                      </View>
                    )}
                  </View>
                  <Text style={styles.postTime}>{post.time}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Feather name="more-horizontal" size={20} color={Colors.light.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Post Content */}
            <Text style={styles.postContent}>{post.content}</Text>

            {/* Post Image */}
            {post.image && (
              <TouchableOpacity
                style={styles.postImageContainer}
                onPress={() => router.push(`/post/${post.id}`)}
              >
                <Image
                  source={{ uri: post.image }}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}

            {/* Tags */}
            {post.tags && (
              <View style={styles.tagsContainer}>
                {post.tags.map((tag, idx) => (
                  <TouchableOpacity key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Post Actions */}
            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLike(post.id)}
              >
                <Feather
                  name={likedPosts.includes(post.id) ? 'heart' : 'heart'}
                  size={22}
                  color={likedPosts.includes(post.id) ? '#FF8A80' : Colors.light.textPrimary}
                  fill={likedPosts.includes(post.id) ? '#FF8A80' : 'transparent'}
                />
                <Text style={styles.actionText}>
                  {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push(`/post/${post.id}`)}
              >
                <Feather name="message-circle" size={22} color={Colors.light.textPrimary} />
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="send" size={22} color={Colors.light.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Create Post FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/create-post')}
      >
        <Feather name="plus" size={24} color={Colors.light.surface} />
      </TouchableOpacity>
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
  },

  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    letterSpacing: -0.5,
  },

  headerRight: {
    flexDirection: 'row',
    gap: Spacing.md,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF8A80',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  storiesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },

  storiesContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },

  storyItem: {
    alignItems: 'center',
    width: 72,
  },

  storyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  storyAvatarActive: {
    borderColor: Colors.light.primary,
  },

  storyAvatarAdd: {
    borderStyle: 'dashed',
    borderColor: Colors.light.border,
  },

  storyInitials: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  storyName: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },

  quickActionsSection: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },

  quickActionsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.xs,
  },

  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },

  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  postCard: {
    backgroundColor: Colors.light.surface,
    marginBottom: Spacing.sm,
    paddingTop: Spacing.lg,
  },

  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },

  postAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },

  therapistAvatar: {
    backgroundColor: '#E8F8F0',
  },

  postAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  postAuthor: {
    fontSize: 14,
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

  postTime: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },

  postContent: {
    fontSize: 14,
    color: Colors.light.textPrimary,
    lineHeight: 20,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },

  postImageContainer: {
    marginBottom: Spacing.md,
  },

  postImage: {
    width: width,
    height: width * 0.75,
    backgroundColor: Colors.light.border,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },

  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },

  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  postActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  fab: {
    position: 'absolute',
    bottom: 100,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
});
