// app/post/[id].tsx - POST DETAIL WITH COMMENTS
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MOCK_POST = {
  id: '1',
  author: 'Zeynep Arslan',
  authorAvatar: 'ZA',
  time: '2 saat önce',
  content: '3 haftadır düzenli meditasyon yapıyorum. Hayatımdaki en iyi değişikliklerden biri! ✨',
  image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
  likes: 42,
  comments: 8,
  isLiked: false,
};

const MOCK_COMMENTS = [
  {
    id: '1',
    author: 'Mehmet K.',
    avatar: 'MK',
    content: 'Hangi uygulamayı kullanıyorsun? Önerisi olan var mı?',
    time: '1 saat önce',
    likes: 3,
  },
  {
    id: '2',
    author: 'Dr. Elif Yılmaz',
    avatar: 'EY',
    content: 'Harika! Düzenlilik çok önemli. Devam et! 👏',
    time: '30 dk önce',
    likes: 12,
    isTherapist: true,
  },
];

export default function PostDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Paylaşım</Text>
          <TouchableOpacity>
            <Feather name="more-horizontal" size={24} color={Colors.light.textPrimary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Post */}
          <View style={styles.postSection}>
            <TouchableOpacity
              style={styles.postAuthor}
              onPress={() => router.push(`/user/${id}`)}
            >
              <View style={styles.authorAvatar}>
                <Text style={styles.authorAvatarText}>{MOCK_POST.authorAvatar}</Text>
              </View>
              <View>
                <Text style={styles.authorName}>{MOCK_POST.author}</Text>
                <Text style={styles.postTime}>{MOCK_POST.time}</Text>
              </View>
            </TouchableOpacity>

            {MOCK_POST.image && (
              <Image source={{ uri: MOCK_POST.image }} style={styles.postImage} />
            )}

            <View style={styles.postContent}>
              <View style={styles.postActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setIsLiked(!isLiked)}
                >
                  <Feather
                    name="heart"
                    size={24}
                    color={isLiked ? '#FF8A80' : Colors.light.textPrimary}
                    fill={isLiked ? '#FF8A80' : 'transparent'}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Feather name="message-circle" size={24} color={Colors.light.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Feather name="send" size={24} color={Colors.light.textPrimary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.likesText}>
                {MOCK_POST.likes + (isLiked ? 1 : 0)} beğeni
              </Text>
              <Text style={styles.postContentText}>
                <Text style={styles.postAuthorName}>{MOCK_POST.author} </Text>
                {MOCK_POST.content}
              </Text>
            </View>
          </View>

          {/* Comments */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Yorumlar ({MOCK_COMMENTS.length})</Text>
            {MOCK_COMMENTS.map((comment) => (
              <View key={comment.id} style={styles.commentCard}>
                <TouchableOpacity
                  style={styles.commentAuthor}
                  onPress={() => router.push(`/user/${comment.id}`)}
                >
                  <View style={[
                    styles.commentAvatar,
                    comment.isTherapist && styles.therapistAvatar,
                  ]}>
                    <Text style={styles.commentAvatarText}>{comment.avatar}</Text>
                  </View>
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthorName}>{comment.author}</Text>
                      {comment.isTherapist && (
                        <View style={styles.verifiedBadge}>
                          <Feather name="check" size={8} color={Colors.light.surface} />
                        </View>
                      )}
                      <Text style={styles.commentTime}>• {comment.time}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.content}</Text>
                    <TouchableOpacity style={styles.commentLike}>
                      <Feather name="heart" size={12} color={Colors.light.textSecondary} />
                      <Text style={styles.commentLikes}>{comment.likes}</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        <SafeAreaView>
          <View style={styles.commentInputContainer}>
            <View style={styles.myAvatar}>
              <Text style={styles.myAvatarText}>AY</Text>
            </View>
            <TextInput
              style={styles.commentInput}
              placeholder="Yorum yaz..."
              value={comment}
              onChangeText={setComment}
              placeholderTextColor={Colors.light.textLight}
            />
            <TouchableOpacity style={styles.sendButton}>
              <Feather name="send" size={18} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  keyboardView: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  postSection: {
    backgroundColor: Colors.light.surface,
    marginBottom: Spacing.sm,
  },

  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
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

  authorAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
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

  postImage: {
    width: width,
    height: width,
    backgroundColor: Colors.light.border,
  },

  postContent: {
    padding: Spacing.lg,
  },

  postActions: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.sm,
  },

  actionButton: {
    padding: 2,
  },

  likesText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  postContentText: {
    fontSize: 14,
    color: Colors.light.textPrimary,
    lineHeight: 20,
  },

  postAuthorName: {
    fontWeight: '600',
  },

  commentsSection: {
    paddingHorizontal: Spacing.lg,
  },

  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.lg,
  },

  commentCard: {
    marginBottom: Spacing.lg,
  },

  commentAuthor: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },

  therapistAvatar: {
    backgroundColor: '#E8F8F0',
  },

  commentAvatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  commentContent: {
    flex: 1,
  },

  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },

  commentAuthorName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.light.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  commentTime: {
    fontSize: 12,
    color: Colors.light.textLight,
  },

  commentText: {
    fontSize: 13,
    color: Colors.light.textPrimary,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },

  commentLike: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  commentLikes: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },

  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
    gap: Spacing.sm,
  },

  myAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  myAvatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.surface,
  },

  commentInput: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    fontSize: 14,
    color: Colors.light.textPrimary,
  },

  sendButton: {
    padding: Spacing.xs,
  },
});
