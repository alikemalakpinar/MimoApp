// app/user/[id].tsx - INSTAGRAM-LIKE USER PROFILE
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const imageSize = (width - 2) / 3;

const MOCK_USER = {
  name: 'Zeynep Arslan',
  username: '@zeyneparslan',
  avatar: 'ZA',
  bio: '🌿 Mindfulness • Yoga • Self-care\nPaylaşımlarım kişisel deneyimlerimdir',
  posts: 24,
  followers: 156,
  following: 89,
  isFollowing: false,
  userType: 'user',
};

const MOCK_POSTS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', likes: 42 },
  { id: '2', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400', likes: 38 },
  { id: '3', image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400', likes: 51 },
  { id: '4', image: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=400', likes: 29 },
  { id: '5', image: 'https://images.unsplash.com/photo-1502781252888-9143ba7f074e?w=400', likes: 67 },
  { id: '6', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400', likes: 45 },
];

export default function UserProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isFollowing, setIsFollowing] = useState(MOCK_USER.isFollowing);
  const [selectedTab, setSelectedTab] = useState<'posts' | 'saved'>('posts');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{MOCK_USER.username}</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Feather name="more-vertical" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarText}>{MOCK_USER.avatar}</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{MOCK_USER.posts}</Text>
                <Text style={styles.statLabel}>Paylaşım</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{MOCK_USER.followers}</Text>
                <Text style={styles.statLabel}>Takipçi</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{MOCK_USER.following}</Text>
                <Text style={styles.statLabel}>Takip</Text>
              </View>
            </View>
          </View>

          <Text style={styles.name}>{MOCK_USER.name}</Text>
          <Text style={styles.bio}>{MOCK_USER.bio}</Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, !isFollowing && styles.actionBtnPrimary]}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <Text style={[
                styles.actionBtnText,
                !isFollowing && styles.actionBtnTextPrimary,
              ]}>
                {isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Feather name="message-circle" size={16} color={Colors.light.textPrimary} />
              <Text style={styles.actionBtnText}>Mesaj</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'posts' && styles.tabActive]}
            onPress={() => setSelectedTab('posts')}
          >
            <Feather
              name="grid"
              size={22}
              color={selectedTab === 'posts' ? Colors.light.textPrimary : Colors.light.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'saved' && styles.tabActive]}
            onPress={() => setSelectedTab('saved')}
          >
            <Feather
              name="bookmark"
              size={22}
              color={selectedTab === 'saved' ? Colors.light.textPrimary : Colors.light.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsGrid}>
          {MOCK_POSTS.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.postThumbnail}
              onPress={() => router.push(`/post/${post.id}`)}
            >
              <Image
                source={{ uri: post.image }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
              <View style={styles.thumbnailOverlay}>
                <Feather name="heart" size={16} color={Colors.light.surface} />
                <Text style={styles.thumbnailLikes}>{post.likes}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  avatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.xxl,
  },

  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.primary,
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
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },

  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  bio: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.background,
    gap: Spacing.xs,
  },

  actionBtnPrimary: {
    backgroundColor: Colors.light.textPrimary,
  },

  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  actionBtnTextPrimary: {
    color: Colors.light.surface,
  },

  tabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
  },

  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },

  tabActive: {
    borderBottomColor: Colors.light.textPrimary,
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
    backgroundColor: Colors.light.border,
  },

  thumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    opacity: 0,
  },

  thumbnailLikes: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.surface,
  },
});
