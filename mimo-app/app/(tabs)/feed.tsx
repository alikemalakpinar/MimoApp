// app/(tabs)/feed.tsx - MINIMAL REDESIGN
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
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOCK_POSTS = [
  {
    id: '1',
    author: 'Anonim',
    initials: 'AN',
    content: 'Bugün 10 dakikalık meditasyon yaptım, kendimi çok sakin hissediyorum!',
    likes: 24,
    comments: 5,
    time: '2 saat önce',
    tags: ['meditasyon', 'mindfulness'],
  },
  {
    id: '2',
    author: 'Anonim',
    initials: 'AN',
    content: '3 hafta oldu terapiye başlayalı. En iyi kararım oldu!',
    likes: 42,
    comments: 12,
    time: '5 saat önce',
    tags: ['terapi'],
  },
];

export default function Feed() {
  const router = useRouter();
  const [newPost, setNewPost] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Topluluk</Text>
      </View>

      {/* New Post */}
      <View style={styles.newPostContainer}>
        <View style={styles.newPostCard}>
          <TextInput
            style={styles.newPostInput}
            placeholder="Düşüncelerini paylaş..."
            placeholderTextColor={Colors.light.textSecondary}
            value={newPost}
            onChangeText={setNewPost}
            multiline
          />
          <TouchableOpacity style={styles.postButton}>
            <Text style={styles.postButtonText}>Paylaş</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_POSTS.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.authorAvatar}>
                <Text style={styles.authorInitials}>{post.initials}</Text>
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{post.author}</Text>
                <Text style={styles.postTime}>{post.time}</Text>
              </View>
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
                <Feather name="heart" size={18} color={Colors.light.textSecondary} />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="message-circle" size={18} color={Colors.light.textSecondary} />
                <Text style={styles.actionText}>{post.comments}</Text>
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
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    letterSpacing: -0.5,
  },

  newPostContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },

  newPostCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.xs,
  },

  newPostInput: {
    fontSize: 15,
    color: Colors.light.textPrimary,
    minHeight: 60,
    marginBottom: Spacing.sm,
  },

  postButton: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.light.textPrimary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
  },

  postButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.surface,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },

  postCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },

  postHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },

  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#E8F8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },

  authorInitials: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.secondary,
  },

  authorInfo: {
    flex: 1,
  },

  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },

  postTime: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },

  postContent: {
    fontSize: 15,
    color: Colors.light.textPrimary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },

  tag: {
    backgroundColor: '#E8F4FF',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },

  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.primary,
  },

  postActions: {
    flexDirection: 'row',
    gap: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  actionText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
});
