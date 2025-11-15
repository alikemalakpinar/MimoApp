// app/resources/index.tsx - RESOURCES HUB
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';

const CATEGORIES = ['Tümü', 'Makaleler', 'Videolar', 'Podcastler', 'E-Kitaplar'];

const RESOURCES = [
  {
    id: '1',
    title: 'Anksiyete ile Başa Çıkma Stratejileri',
    type: 'Makale',
    duration: '5 dk okuma',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    author: 'Dr. Elif Yılmaz',
  },
  {
    id: '2',
    title: 'Mindfulness Meditasyon Temelleri',
    type: 'Video',
    duration: '12 dk',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400',
    author: 'Mimo Academy',
  },
  {
    id: '3',
    title: 'Mental Sağlık Podcast',
    type: 'Podcast',
    duration: '45 dk',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400',
    author: 'Dr. Mehmet Kaya',
  },
];

export default function ResourcesHub() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kaynaklar</Text>
        <TouchableOpacity>
          <Feather name="bookmark" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map((category) => (
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
        {RESOURCES.map((resource) => (
          <TouchableOpacity key={resource.id} style={styles.resourceCard}>
            <Image source={{ uri: resource.image }} style={styles.resourceImage} />
            <View style={styles.resourceOverlay}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{resource.type}</Text>
              </View>
            </View>
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceTitle}>{resource.title}</Text>
              <View style={styles.resourceMeta}>
                <Feather name="clock" size={14} color={Colors.light.textSecondary} />
                <Text style={styles.metaText}>{resource.duration}</Text>
                <Text style={styles.metaSeparator}>•</Text>
                <Text style={styles.metaText}>{resource.author}</Text>
              </View>
            </View>
          </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
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
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },

  resourceCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },

  resourceImage: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.light.border,
  },

  resourceOverlay: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
  },

  typeBadge: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },

  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  resourceInfo: {
    padding: Spacing.lg,
  },

  resourceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },

  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  metaText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },

  metaSeparator: {
    fontSize: 12,
    color: Colors.light.textLight,
  },
});
