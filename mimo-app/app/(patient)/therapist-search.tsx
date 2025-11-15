// app/(patient)/therapist-search.tsx - MINIMAL REDESIGN
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

const SPECIALTIES = ['Tümü', 'Anksiyete', 'Depresyon', 'İlişki', 'Travma'];

const MOCK_THERAPISTS = [
  {
    id: '1',
    name: 'Dr. Elif Yılmaz',
    title: 'Klinik Psikolog',
    experience: 8,
    rating: 4.9,
    price: 750,
    available: true,
  },
  {
    id: '2',
    name: 'Dr. Mehmet Kaya',
    title: 'Psikiyatrist',
    experience: 12,
    rating: 4.8,
    price: 850,
    available: false,
  },
  {
    id: '3',
    name: 'Dr. Ayşe Demir',
    title: 'Psikolojik Danışman',
    experience: 5,
    rating: 4.7,
    price: 650,
    available: true,
  },
];

export default function TherapistSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Tümü');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terapist Ara</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="İsim veya uzmanlık ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.textSecondary}
          />
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {SPECIALTIES.map((specialty) => (
          <TouchableOpacity
            key={specialty}
            style={[
              styles.filterChip,
              selectedSpecialty === specialty && styles.filterChipActive,
            ]}
            onPress={() => setSelectedSpecialty(specialty)}
          >
            <Text style={[
              styles.filterChipText,
              selectedSpecialty === specialty && styles.filterChipTextActive,
            ]}>
              {specialty}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_THERAPISTS.map((therapist) => (
          <TouchableOpacity
            key={therapist.id}
            style={styles.therapistCard}
            onPress={() => router.push(`/(patient)/therapist/${therapist.id}`)}
          >
            <View style={styles.therapistHeader}>
              <View style={styles.therapistAvatar}>
                <Feather name="user" size={24} color={Colors.light.primary} />
              </View>
              <View style={styles.therapistInfo}>
                <Text style={styles.therapistName}>{therapist.name}</Text>
                <Text style={styles.therapistTitle}>{therapist.title}</Text>
              </View>
              {therapist.available && (
                <View style={styles.availableBadge}>
                  <View style={styles.availableDot} />
                </View>
              )}
            </View>

            <View style={styles.therapistStats}>
              <View style={styles.stat}>
                <Feather name="star" size={14} color="#FFB84D" />
                <Text style={styles.statText}>{therapist.rating}</Text>
              </View>
              <View style={styles.stat}>
                <Feather name="briefcase" size={14} color={Colors.light.textSecondary} />
                <Text style={styles.statText}>{therapist.experience} yıl</Text>
              </View>
              <View style={styles.stat}>
                <Feather name="credit-card" size={14} color={Colors.light.textSecondary} />
                <Text style={styles.statText}>{therapist.price}₺</Text>
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
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  searchContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
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

  filterScroll: {
    marginBottom: Spacing.lg,
  },

  filterContainer: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },

  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
  },

  filterChipActive: {
    backgroundColor: Colors.light.textPrimary,
  },

  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  filterChipTextActive: {
    color: Colors.light.surface,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },

  therapistCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },

  therapistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  therapistAvatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  therapistInfo: {
    flex: 1,
  },

  therapistName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },

  therapistTitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },

  availableBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.secondary,
  },

  therapistStats: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },

  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },

  statText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
});
