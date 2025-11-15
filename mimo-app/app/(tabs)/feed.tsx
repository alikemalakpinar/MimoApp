// app/(tabs)/feed.tsx - ULTRA RICH SOCIAL FEED
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
  { id: '1', user: 'Sen', avatar: 'AY', hasStory: false, isYou: true },
  { id: '2', user: 'Dr. Elif', avatar: 'EY', hasStory: true, verified: true },
  { id: '3', user: 'Zeynep', avatar: 'ZA', hasStory: true },
  { id: '4', user: 'Mehmet', avatar: 'MK', hasStory: true },
  { id: '5', user: 'Ayşe', avatar: 'AD', hasStory: true },
];

const FEED_POSTS = [
  {
    id: '1',
    author: 'Dr. Elif Yılmaz',
    authorAvatar: 'EY',
    userType: 'therapist',
    time: '2 saat önce',
    content: 'Günlük 5 dakikalık nefes egzersizinin stres üzerine inanılmaz etkisi var. Danışanlarımla denedik, gerçekten işe yarıyor! 🌿\n\nDenemenizi öneririm:',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    likes: 234,
    comments: 45,
    shares: 12,
    isLiked: false,
    tags: ['nefes-egzersizi', 'mindfulness', 'stres-yönetimi'],
  },
  {
    id: '2',
    author: 'Zeynep Arslan',
    authorAvatar: 'ZA',
    userType: 'user',
    time: '5 saat önce',
    content: '3 haftadır meditasyon yapıyorum ve hayatım değişti! Daha sakin, daha odaklı hissediyorum. Kendime ayırdığım bu 10 dakika bile çok şey değiştirdi. ✨',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800',
    likes: 189,
    comments: 23,
    shares: 8,
    isLiked: true,
    tags: ['meditasyon', 'self-care'],
  },
  {
    id: '3',
    author: 'Mehmet Kaya',
    authorAvatar: 'MK',
    userType: 'user',
    time: '1 gün önce',
    content: 'Bugün terapistimle çok verimli bir seans yaptık. Açıklıkla konuşabilmek çok rahatlatıcı. Kendime ayırdığım bu zamana değdi. Mental sağlığım önceliklerimden biri artık.',
    likes: 156,
    comments: 18,
    shares: 5,
    isLiked: false,
    tags: ['terapi', 'mental-sağlık', 'kişisel-gelişim'],
  },
];

export default function Feed() {
  const router = useRouter();
  const [likedPosts, setLikedPosts] = useState<string[]>(['2']);

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
          <TouchableOpacity onPress={() => router.push('/emergency')}>
            <Feather name="alert-circle" size={24} color="#FF8A80" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/chat')}>
            <Feather name="message-circle" size={24} color={Colors.light.textPrimary} />
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
          style={styles.storiesContainer}
          contentContainerStyle={styles.storiesContent}
        >
          {STORIES.map((story) => (
            <TouchableOpacity key={story.id} style={styles.storyItem}>
              <View style={[
                styles.storyAvatar,
                story.hasStory && styles.storyAvatarActive,
                story.isYou && !story.hasStory && styles.storyAvatarAdd,
              ]}>
                {story.isYou && !story.hasStory ? (
                  <Feather name="plus" size={20} color={Colors.light.textPrimary} />
                ) : (
                  <Text style={styles.storyInitials}>{story.avatar}</Text>
                )}
                {story.verified && (
                  <View style={styles.storyVerified}>
                    <Feather name="check" size={8} color={Colors.light.surface} />
                  </View>
                )}
              </View>
              <Text style={styles.storyName} numberOfLines={1}>{story.user}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Feed */}
        {FEED_POSTS.map((post) => {
          const isLiked = likedPosts.includes(post.id);
          
          return (
            <View key={post.id} style={styles.postCard}>
              {/* Post Header */}
              <TouchableOpacity
                style={styles.postHeader}
                onPress={() => router.push(`/user/${post.id}`)}
              >
                <View style={styles.authorInfo}>
                  <View style={[
                    styles.authorAvatar,
                    post.userType === 'therapist' && styles.therapistAvatar,
                  ]}>
                    <Text style={styles.authorAvatarText}>{post.authorAvatar}</Text>
                  </View>
                  <View>
                    <View style={styles.authorNameRow}>
                      <Text style={styles.authorName}>{post.author}</Text>
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

              {/* Content */}
              <Text style={styles.postContent}>{post.content}</Text>

              {/* Image */}
              {post.image && (
                <TouchableOpacity
                  style={styles.imageContainer}
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
              <View style={styles.tagsContainer}>
                {post.tags.map((tag, idx) => (
                  <TouchableOpacity key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
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
                      size={24}
                      color={isLiked ? '#FF8A80' : Colors.light.textPrimary}
                      fill={isLiked ? '#FF8A80' : 'transparent'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push(`/post/${post.id}`)}
                  >
                    <Feather name="message-circle" size={24} color={Colors.light.textPrimary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="send" size={24} color={Colors.light.textPrimary} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                  <Feather name="bookmark" size={24} color={Colors.light.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Likes */}
              <TouchableOpacity onPress={() => console.log('Show likes')}>
                <Text style={styles.likesText}>
                  {post.likes + (isLiked ? 1 : 0)} beğeni
                </Text>
              </TouchableOpacity>

              {/* View Comments */}
              {post.comments > 0 && (
                <TouchableOpacity onPress={() => router.push(`/post/${post.id}`)}>
                  <Text style={styles.viewComments}>
                    {post.comments} yorumun tümünü görüntüle
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
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
    gap: Spacing.lg,
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
    position: 'relative',
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

  storyVerified: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.light.secondary,
    borderWidth: 2,
    borderColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  storyName: {
    fontSize: 11,
    color: Colors.light.textSecondary,
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

  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  authorAvatar: {
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

  authorAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  authorName: {
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
    lineHeight: 21,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },

  imageContainer: {
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
  },

  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },

  actionsLeft: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },

  actionButton: {
    padding: 2,
  },

  likesText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
  },

  viewComments: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
});
