// app/affirmations.tsx - DAILY AFFIRMATIONS
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../shared/theme';

const { width } = Dimensions.get('window');

const AFFIRMATIONS = [
  {
    id: '1',
    text: 'Bugün kendime karşı şefkatli olacağım.',
    category: 'Self-compassion',
    color: '#E8F8F0',
  },
  {
    id: '2',
    text: 'Hislerim geçerlidir ve onları kabul ediyorum.',
    category: 'Mindfulness',
    color: '#E8F4FF',
  },
  {
    id: '3',
    text: 'Her gün daha iyi bir versiyonum oluyorum.',
    category: 'Growth',
    color: '#FFF5E8',
  },
  {
    id: '4',
    text: 'Zihinsel sağlığım önceliklerimden biridir.',
    category: 'Self-care',
    color: '#FFE8DC',
  },
];

export default function Affirmations() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleNext = () => {
    if (currentIndex < AFFIRMATIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFavorited(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFavorited(false);
    }
  };

  const currentAffirmation = AFFIRMATIONS[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Günlük Olumlamalar</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Feather name="settings" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.dateCard}>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>

        <View style={[
          styles.affirmationCard,
          { backgroundColor: currentAffirmation.color },
        ]}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{currentAffirmation.category}</Text>
          </View>
          
          <Text style={styles.affirmationText}>
            “{currentAffirmation.text}”
          </Text>
          
          <View style={styles.pagination}>
            {AFFIRMATIONS.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.paginationDot,
                  idx === currentIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
          >
            <Feather
              name="chevron-left"
              size={28}
              color={currentIndex === 0 ? Colors.light.textLight : Colors.light.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => setIsFavorited(!isFavorited)}
          >
            <Feather
              name="heart"
              size={24}
              color={isFavorited ? '#FF8A80' : Colors.light.textSecondary}
              fill={isFavorited ? '#FF8A80' : 'transparent'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton}>
            <Feather name="share-2" size={24} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={handleNext}
            disabled={currentIndex === AFFIRMATIONS.length - 1}
          >
            <Feather
              name="chevron-right"
              size={28}
              color={
                currentIndex === AFFIRMATIONS.length - 1
                  ? Colors.light.textLight
                  : Colors.light.textPrimary
              }
            />
          </TouchableOpacity>
        </View>
      </View>
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
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
  },

  dateCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
    ...Shadows.xs,
  },

  dateText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },

  affirmationCard: {
    padding: Spacing.huge,
    borderRadius: BorderRadius.xxxl,
    minHeight: 300,
    justifyContent: 'center',
    marginBottom: Spacing.xxxl,
    ...Shadows.md,
  },

  categoryBadge: {
    alignSelf: 'center',
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.xxl,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },

  affirmationText: {
    fontSize: 26,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: Spacing.xxl,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
  },

  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.border,
  },

  paginationDotActive: {
    backgroundColor: Colors.light.textPrimary,
    width: 20,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xxl,
  },

  navButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  favoriteButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },

  shareButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
