// app/meditation/index.tsx - MEDITATION LIBRARY
import React from 'react';
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

const CATEGORIES = [
  { id: 'all', label: 'Tümü', icon: 'grid' },
  { id: 'sleep', label: 'Uyku', icon: 'moon' },
  { id: 'stress', label: 'Stres', icon: 'zap' },
  { id: 'anxiety', label: 'Anksiyete', icon: 'heart' },
  { id: 'focus', label: 'Odaklanma', icon: 'target' },
];

const MEDITATIONS = [
  {
    id: '1',
    title: 'Flower Meditation',
    duration: '6:20',
    voice: 'Ofosu',
    category: 'stress',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    color: '#F5E8E0',
  },
  {
    id: '2',
    title: 'Deep Sleep Journey',
    duration: '15:00',
    voice: 'Sarah',
    category: 'sleep',
    image: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=400',
    color: '#E0ECFF',
  },
  {
    id: '3',
    title: 'Anxiety Relief',
    duration: '10:00',
    voice: 'Michael',
    category: 'anxiety',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400',
    color: '#E8F8F0',
  },
  {
    id: '4',
    title: 'Focus Boost',
    duration: '8:30',
    voice: 'Emma',
    category: 'focus',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400',
    color: '#FFF5E8',
  },
];

export default function MeditationLibrary() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredMeditations = selectedCategory === 'all'
    ? MEDITATIONS
    : MEDITATIONS.filter(m => m.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meditasyon</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="sliders" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Feather
              name={category.icon as any}
              size={16}
              color={
                selectedCategory === category.id
                  ? Colors.light.surface
                  : Colors.light.textPrimary
              }
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive,
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredMeditations.map((meditation) => (
          <TouchableOpacity
            key={meditation.id}
            style={styles.meditationCard}
            onPress={() => router.push(`/meditation/${meditation.id}`)}
          >
            <View style={[styles.meditationImage, { backgroundColor: meditation.color }]}>
              <Image
                source={{ uri: meditation.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.playOverlay}>
                <View style={styles.playButton}>
                  <Feather name="play" size={24} color={Colors.light.surface} />
                </View>
              </View>
            </View>
            <View style={styles.meditationInfo}>
              <Text style={styles.meditationTitle}>{meditation.title}</Text>
              <View style={styles.meditationMeta}>
                <View style={styles.metaItem}>
                  <Feather name="clock" size={14} color={Colors.light.textSecondary} />
                  <Text style={styles.metaText}>{meditation.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Feather name="mic" size={14} color={Colors.light.textSecondary} />
                  <Text style={styles.metaText}>{meditation.voice}</Text>
                </View>
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

  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoriesScroll: {
    marginBottom: Spacing.lg,
  },

  categoriesContainer: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },

  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    gap: Spacing.xs,
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

  progressCard: {
    backgroundColor: Colors.light.primary,
    padding: Spacing.xxl,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    ...Shadows.sm,
  },

  progressTitle: {
    fontSize: 14,
    color: Colors.light.surface,
    opacity: 0.8,
    marginBottom: Spacing.sm,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },

  progressNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.light.surface,
  },

  progressTotal: {
    fontSize: 20,
    color: Colors.light.surface,
    opacity: 0.7,
  },

  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.light.surface + '30',
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.surface,
  },

  achievementCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    ...Shadows.xs,
  },

  achievementCardLocked: {
    opacity: 0.6,
  },

  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  achievementIconLocked: {
    backgroundColor: Colors.light.border + '40',
  },

  achievementContent: {
    flex: 1,
  },

  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },

  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  achievementDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
  },

  textLocked: {
    color: Colors.light.textLight,
  },

  unlockedDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  miniProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.light.border,
    borderRadius: 3,
    overflow: 'hidden',
  },

  miniProgressFill: {
    height: '100%',
  },

  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },

  meditationCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },

  meditationImage: {
    width: '100%',
    height: 200,
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
  },

  meditationInfo: {
    padding: Spacing.lg,
  },

  meditationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
  },

  meditationMeta: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  metaText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
});
