// app/(tabs)/feed.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOCK_POSTS = [
  {
    id: '1',
    author: 'Anonim',
    avatar: '👩',
    mood: 'happy',
    content: 'Bugün 10 dakikalık meditasyon yaptım ve kendimi çok daha sakin hissediyorum! 🧘‍♀️ Sizler de denemelisiniz.',
    likes: 24,
    comments: 5,
    timeAgo: '2 saat önce',
    tags: ['meditasyon', 'mindfulness'],
  },
  {
    id: '2',
    author: 'Anonim',
    avatar: '👨',
    mood: 'motivated',
    content: '3 hafta oldu terapiye başlayarak. En iyi kararım oldu! Kendimi çok daha iyi anlıyorum artık. 💪',
    likes: 42,
    comments: 12,
    timeAgo: '5 saat önce',
    tags: ['terapi', 'kişisel-gelişim'],
  },
  {
    id: '3',
    author: 'Anonim',
    avatar: '👩',
    mood: 'grateful',
    content: 'Her gün 3 şey için minnettar oluyorum. Küçük şeyler bile hayatı güzelleştiriyor. 🌻',
    likes: 38,
    comments: 8,
    timeAgo: '1 gün önce',
    tags: ['minnetdarlık', 'pozitiflik'],
  },
];

const MOOD_COLORS: Record<string, string> = {
  happy: Colors.light.secondary,
  motivated: Colors.light.accent,
  grateful: Colors.light.primaryLight,
  sad: Colors.light.info,
};

export default function Feed() {
  const router = useRouter();
  const [newPost, setNewPost] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Topluluk</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="filter" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      {/* New Post Input */}
      <View style={styles.newPostContainer}>
        <View style={styles.newPostCard}>
          <TextInput
            style={styles.newPostInput}
            placeholder="Duygu ve düşüncelerini paylaş..."
            placeholderTextColor={Colors.light.textLight}
            value={newPost}
            onChangeText={setNewPost}
            multiline
          />
          <View style={styles.newPostActions}>
            <TouchableOpacity style={styles.emojiButton}>
              <Text style={styles.emojiButtonText}>😊</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postButton}>
              <Text style={styles.postButtonText}>Paylaş</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_POSTS.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <LinearGradient
              colors={[MOOD_COLORS[post.mood] + '15', 'transparent']}
              style={styles.postGradient}
            />
            
            <View style={styles.postHeader}>
              <View style={styles.authorInfo}>
                <Text style={styles.authorAvatar}>{post.avatar}</Text>
                <View>
                  <Text style={styles.authorName}>{post.author}</Text>
                  <Text style={styles.timeAgo}>{post.timeAgo}</Text>
                </View>
              </View>
              <View style={[
                styles.moodIndicator,
                { backgroundColor: MOOD_COLORS[post.mood] },
              ]} />
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            {post.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {post.tags.map((tag, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="heart" size={20} color={Colors.light.textSecondary} />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="message-circle" size={20} color={Colors.light.textSecondary} />
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="share-2" size={20} color={Colors.light.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  headerTitle: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
  },

  filterButton: {
    padding: Spacing.xs,
  },

  newPostContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },

  newPostCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },

  newPostInput: {
    fontSize: Typography.base,
    color: Colors.light.textPrimary,
    minHeight: 60,
    marginBottom: Spacing.sm,
  },

  newPostActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  emojiButton: {
    padding: Spacing.xs,
  },

  emojiButtonText: {
    fontSize: 24,
  },

  postButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
  },

  postButtonText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  postCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.md,
  },

  postGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },

  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  authorAvatar: {
    fontSize: 32,
    marginRight: Spacing.sm,
  },

  authorName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  timeAgo: {
    fontSize: Typography.xs,
    color: Colors.light.textLight,
  },

  moodIndicator: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
  },

  postContent: {
    fontSize: Typography.base,
    color: Colors.light.textPrimary,
    lineHeight: Typography.base * 1.6,
    marginBottom: Spacing.md,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },

  tag: {
    backgroundColor: Colors.light.primary + '10',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },

  tagText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.light.primary,
  },

  postActions: {
    flexDirection: 'row',
    gap: Spacing.xl,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },

  actionText: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
  },
});
