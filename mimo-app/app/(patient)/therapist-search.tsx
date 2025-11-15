// app/(patient)/therapist-search.tsx
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
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const SPECIALTIES = [
  'Tümü', 'Anksiyete', 'Depresyon', 'Travma', 'İlişki', 'Kariyer', 'Uyku',
];

const MOCK_THERAPISTS = [
  {
    id: '1',
    name: 'Dr. Elif Yılmaz',
    title: 'Klinik Psikolog',
    specialties: ['Anksiyete', 'Depresyon', 'Travma'],
    experience: 8,
    rating: 4.9,
    reviewCount: 127,
    price: 750,
    avatar: '👩‍⚕️',
    available: true,
    nextAvailable: 'Bugün, 14:00',
  },
  {
    id: '2',
    name: 'Dr. Mehmet Kaya',
    title: 'Psikiyatrist',
    specialties: ['Stres Yönetimi', 'İlişki Problemleri'],
    experience: 12,
    rating: 4.8,
    reviewCount: 203,
    price: 850,
    avatar: '👨‍⚕️',
    available: true,
    nextAvailable: 'Yarın, 10:00',
  },
  {
    id: '3',
    name: 'Ayşe Demir',
    title: 'Psikolojik Danışman',
    specialties: ['Kişisel Gelişim', 'Kariyer Koçluğu'],
    experience: 5,
    rating: 4.7,
    reviewCount: 89,
    price: 650,
    avatar: '👩‍💼',
    available: false,
    nextAvailable: '15 Şubat',
  },
];

export default function TherapistSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Tümü');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'experience'>('rating');

  const filteredTherapists = MOCK_THERAPISTS.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'Tümü' || 
      therapist.specialties.some(s => s.includes(selectedSpecialty));
    return matchesSearch && matchesSpecialty;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terapist Ara</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="sliders" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color={Colors.light.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Terapist adı ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.textLight}
          />
        </View>
      </View>

      {/* Specialty Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.specialtyScroll}
        contentContainerStyle={styles.specialtyContainer}
      >
        {SPECIALTIES.map((specialty) => (
          <TouchableOpacity
            key={specialty}
            style={[
              styles.specialtyChip,
              selectedSpecialty === specialty && styles.specialtyChipActive,
            ]}
            onPress={() => setSelectedSpecialty(specialty)}
          >
            <Text style={[
              styles.specialtyText,
              selectedSpecialty === specialty && styles.specialtyTextActive,
            ]}>
              {specialty}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filteredTherapists.length} terapist bulundu</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortText}>Sırala</Text>
          <Feather name="chevron-down" size={16} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      {/* Therapist List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTherapists.map((therapist) => (
          <TouchableOpacity
            key={therapist.id}
            style={styles.therapistCard}
            onPress={() => router.push(`/(patient)/therapist/${therapist.id}`)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.therapistInfo}>
                <Text style={styles.avatar}>{therapist.avatar}</Text>
                <View style={styles.therapistDetails}>
                  <Text style={styles.therapistName}>{therapist.name}</Text>
                  <Text style={styles.therapistTitle}>{therapist.title}</Text>
                  <View style={styles.ratingContainer}>
                    <Feather name="star" size={14} color={Colors.light.accent} />
                    <Text style={styles.ratingText}>{therapist.rating}</Text>
                    <Text style={styles.reviewCount}>({therapist.reviewCount})</Text>
                  </View>
                </View>
              </View>
              {therapist.available && (
                <View style={styles.availableBadge}>
                  <View style={styles.availableDot} />
                  <Text style={styles.availableText}>Müsait</Text>
                </View>
              )}
            </View>

            <View style={styles.specialtiesRow}>
              {therapist.specialties.map((specialty, idx) => (
                <View key={idx} style={styles.specialtyTag}>
                  <Text style={styles.specialtyTagText}>{specialty}</Text>
                </View>
              ))}
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.experienceTag}>
                <Feather name="briefcase" size={14} color={Colors.light.primary} />
                <Text style={styles.experienceText}>{therapist.experience} yıl deneyim</Text>
              </View>
              <View style={styles.priceTag}>
                <Text style={styles.priceText}>{therapist.price}₺</Text>
                <Text style={styles.priceLabel}>/seans</Text>
              </View>
            </View>

            <View style={styles.nextAvailable}>
              <Feather name="clock" size={14} color={Colors.light.textSecondary} />
              <Text style={styles.nextAvailableText}>İlk müsait: {therapist.nextAvailable}</Text>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  backButton: {
    padding: Spacing.xs,
  },

  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
  },

  filterButton: {
    padding: Spacing.xs,
  },

  searchContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    ...Shadows.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.light.textPrimary,
    paddingVertical: Spacing.xs,
  },

  specialtyScroll: {
    marginBottom: Spacing.md,
  },

  specialtyContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },

  specialtyChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },

  specialtyChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },

  specialtyText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.light.textSecondary,
  },

  specialtyTextActive: {
    color: Colors.light.surface,
  },

  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },

  resultsCount: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.light.textPrimary,
  },

  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },

  sortText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.light.primary,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  therapistCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },

  therapistInfo: {
    flexDirection: 'row',
    flex: 1,
  },

  avatar: {
    fontSize: 48,
    marginRight: Spacing.md,
  },

  therapistDetails: {
    flex: 1,
  },

  therapistName: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  therapistTitle: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },

  ratingText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
  },

  reviewCount: {
    fontSize: Typography.xs,
    color: Colors.light.textLight,
  },

  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.secondary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },

  availableDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.secondary,
  },

  availableText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.light.secondary,
  },

  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },

  specialtyTag: {
    backgroundColor: Colors.light.primary + '10',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },

  specialtyTagText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.light.primary,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  experienceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },

  experienceText: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
  },

  priceTag: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  priceText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.light.primary,
  },

  priceLabel: {
    fontSize: Typography.xs,
    color: Colors.light.textSecondary,
    marginLeft: Spacing.xs,
  },

  nextAvailable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    gap: Spacing.xs,
  },

  nextAvailableText: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
  },
});
