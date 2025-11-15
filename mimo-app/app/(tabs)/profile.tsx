// app/(tabs)/profile.tsx - INSTAGRAM-STYLE FULL PROFILE
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

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
  website: 'mimo.app/ayseyilmaz',
};

const HIGHLIGHTS = [
  { id: '1', title: 'Mood', icon: 'heart', color: '#FFE8DC' },
  { id: '2', title: 'Günlük', icon: 'book', color: '#E8F4FF' },
  { id: '3', title: 'Yoga', icon: 'activity', color: '#E8F8F0' },
  { id: '4', title: 'Terapim', icon: 'message-circle', color: '#FFF5E8' },
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

export default function Profile() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'grid' | 'list'>('grid');

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.username}>{MOCK_USER.username}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => router.push('/create-post')}>
            <Feather name="plus-square" size={24} color={Colors.light.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Feather name="menu" size={24} color={Colors.light.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileRow}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarText}>{MOCK_USER.initials}</Text>
            </View>
            <View style={styles.statsRow}>
              <TouchableOpacity style={styles.stat}>
                <Text style={styles.statNumber}>{MOCK_USER.posts}</Text>
                <Text style={styles.statLabel}>paylaşım</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stat}>
                <Text style={styles.statNumber}>{MOCK_USER.followers}</Text>
                <Text style={styles.statLabel}>takipçi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stat}>
                <Text style={styles.statNumber}>{MOCK_USER.following}</Text>
                <Text style={styles.statLabel}>takip</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.name}>{MOCK_USER.name}</Text>
          <Text style={styles.bio}>{MOCK_USER.bio}</Text>
          <Text style={styles.website}>{MOCK_USER.website}</Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Profili düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Feather name="share-2" size={16} color={Colors.light.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Story Highlights */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.highlightsContainer}
          contentContainerStyle={styles.highlightsContent}
        >
          <TouchableOpacity style={styles.highlightItem}>
            <View style={styles.highlightAdd}>
              <Feather name="plus" size={24} color={Colors.light.textSecondary} />
            </View>
            <Text style={styles.highlightLabel}>Yeni</Text>
          </TouchableOpacity>
          {HIGHLIGHTS.map((highlight) => (
            <TouchableOpacity key={highlight.id} style={styles.highlightItem}>
              <View style={[styles.highlightCircle, { backgroundColor: highlight.color }]}>
                <Feather name={highlight.icon as any} size={24} color={Colors.light.textPrimary} />
              </View>
              <Text style={styles.highlightLabel}>{highlight.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'grid' && styles.tabActive]}
            onPress={() => setSelectedTab('grid')}
          >
            <Feather
              name="grid"
              size={24}
              color={selectedTab === 'grid' ? Colors.light.textPrimary : Colors.light.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'list' && styles.tabActive]}
            onPress={() => setSelectedTab('list')}
          >
            <Feather
              name="list"
              size={24}
              color={selectedTab === 'list' ? Colors.light.textPrimary : Colors.light.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsGrid}>
          {MY_POSTS.map((post) => (
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
              <View style={styles.postOverlay}>
                <View style={styles.postStat}>
                  <Feather name="heart" size={14} color={Colors.light.surface} />
                  <Text style={styles.postStatText}>{post.likes}</Text>
                </View>
                <View style={styles.postStat}>
                  <Feather name="message-circle" size={14} color={Colors.light.surface} />
                  <Text style={styles.postStatText}>{post.comments}</Text>
                </View>
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

  username: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.textPrimary,
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

  profileSection: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  avatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.xxl,
  },

  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.surface,
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
    marginBottom: Spacing.xs,
  },

  website: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: Spacing.lg,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  editButton: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },

  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  shareButton: {
    width: 36,
    height: 36,
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  highlightsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
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
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.light.border,
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
    color: Colors.light.textSecondary,
  },

  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
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

  postOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    opacity: 0,
  },

  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  postStatText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.surface,
  },
});
