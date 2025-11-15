// app/(tabs)/profile.tsx - INSTAGRAM-LIKE PROFILE
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
  bio: '🌸 Mindfulness & Yoga\n✨ Mental sağlık yolculuğum',
  posts: 24,
  followers: 156,
  following: 89,
};

const MY_POSTS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', likes: 42 },
  { id: '2', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400', likes: 38 },
  { id: '3', image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400', likes: 51 },
  { id: '4', image: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=400', likes: 29 },
  { id: '5', image: 'https://images.unsplash.com/photo-1502781252888-9143ba7f074e?w=400', likes: 67 },
  { id: '6', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400', likes: 45 },
];

export default function Profile() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'posts' | 'saved'>('posts');

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
          <View style={styles.profileHeader}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarText}>{MOCK_USER.initials}</Text>
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

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Profili Düzenle</Text>
          </TouchableOpacity>
        </View>

        {/* Story Highlights */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.highlightsContainer}
          contentContainerStyle={styles.highlightsContent}
        >
          <View style={styles.highlightItem}>
            <View style={styles.highlightCircle}>
              <Feather name="plus" size={24} color={Colors.light.textSecondary} />
            </View>
            <Text style={styles.highlightLabel}>Yeni</Text>
          </View>
          <View style={styles.highlightItem}>
            <View style={styles.highlightCircle}>
              <Feather name="heart" size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.highlightLabel}>Mood</Text>
          </View>
          <View style={styles.highlightItem}>
            <View style={styles.highlightCircle}>
              <Feather name="coffee" size={20} color={Colors.light.secondary} />
            </View>
            <Text style={styles.highlightLabel}>Günlük</Text>
          </View>
        </ScrollView>

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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },

  profileCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.xxxl,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },

  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.surface,
  },

  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  userEmail: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xxl,
    ...Shadows.sm,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },

  statDivider: {
    width: 1,
    backgroundColor: Colors.light.border,
  },

  menuSection: {
    marginBottom: Spacing.lg,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },

  menuCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.xs,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },

  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },

  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  menuItemText: {
    fontSize: 15,
    color: Colors.light.textPrimary,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE8E6',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF8A80',
  },

  version: {
    fontSize: 12,
    color: Colors.light.textLight,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
