// app/(tabs)/search.tsx - SEARCH PAGE (USERS & THERAPISTS)
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

const SEARCH_CATEGORIES = ['Tümü', 'Terapistler', 'Kullanıcılar', 'Paylaşımlar'];

const MOCK_RESULTS = {
  therapists: [
    {
      id: 't1',
      name: 'Dr. Elif Yılmaz',
      title: 'Klinik Psikolog',
      avatar: 'EY',
      rating: 4.9,
      verified: true,
    },
    {
      id: 't2',
      name: 'Dr. Mehmet Kaya',
      title: 'Psikiyatrist',
      avatar: 'MK',
      rating: 4.8,
      verified: true,
    },
  ],
  users: [
    {
      id: 'u1',
      name: 'Zeynep Arslan',
      username: '@zeyneparslan',
      avatar: 'ZA',
      followers: 156,
    },
    {
      id: 'u2',
      name: 'Ahmet Demir',
      username: '@ahmetd',
      avatar: 'AD',
      followers: 89,
    },
  ],
};

export default function Search() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Keşfet</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Terapist, kullanıcı veya konu ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.textSecondary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={18} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {SEARCH_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive,
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Therapists */}
        {(selectedCategory === 'Tümü' || selectedCategory === 'Terapistler') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terapistler</Text>
            {MOCK_RESULTS.therapists.map((therapist) => (
              <TouchableOpacity
                key={therapist.id}
                style={styles.resultCard}
                onPress={() => router.push(`/(patient)/therapist/${therapist.id}`)}
              >
                <View style={styles.resultLeft}>
                  <View style={[styles.resultAvatar, { backgroundColor: '#E8F8F0' }]}>
                    <Text style={[styles.resultAvatarText, { color: Colors.light.secondary }]}>
                      {therapist.avatar}
                    </Text>
                  </View>
                  <View>
                    <View style={styles.nameRow}>
                      <Text style={styles.resultName}>{therapist.name}</Text>
                      {therapist.verified && (
                        <View style={styles.verifiedBadge}>
                          <Feather name="check" size={10} color={Colors.light.surface} />
                        </View>
                      )}
                    </View>
                    <Text style={styles.resultSubtitle}>{therapist.title}</Text>
                    <View style={styles.ratingRow}>
                      <Feather name="star" size={12} color="#FFB84D" />
                      <Text style={styles.ratingText}>{therapist.rating}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followButtonText}>Profil</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Users */}
        {(selectedCategory === 'Tümü' || selectedCategory === 'Kullanıcılar') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kullanıcılar</Text>
            {MOCK_RESULTS.users.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={styles.resultCard}
                onPress={() => router.push(`/user/${user.id}`)}
              >
                <View style={styles.resultLeft}>
                  <View style={styles.resultAvatar}>
                    <Text style={styles.resultAvatarText}>{user.avatar}</Text>
                  </View>
                  <View>
                    <Text style={styles.resultName}>{user.name}</Text>
                    <Text style={styles.resultSubtitle}>{user.username}</Text>
                    <Text style={styles.resultSubtitle}>{user.followers} takipçi</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followButtonText}>Takip Et</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
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

  searchContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    ...Shadows.xs,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.textPrimary,
  },

  categoriesScroll: {
    marginBottom: Spacing.lg,
  },

  categoriesContainer: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },

  categoryChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
  },

  categoryChipActive: {
    backgroundColor: Colors.light.textPrimary,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  categoryTextActive: {
    color: Colors.light.surface,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  section: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    ...Shadows.xs,
  },

  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  resultAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  resultAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },

  resultName: {
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

  resultSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  followButton: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },

  followButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
});
