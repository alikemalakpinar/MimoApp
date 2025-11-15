// app/(patient)/therapist/[id].tsx - MINIMAL REDESIGN
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '../../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOCK_THERAPIST = {
  name: 'Dr. Elif Yılmaz',
  title: 'Klinik Psikolog',
  experience: 8,
  rating: 4.9,
  reviews: 127,
  price: 750,
  about: 'Mental sağlık alanında 8 yıllık deneyime sahip klinik psikologum. Özellikle anksiyete, depresyon ve travma üzerine çalışıyorum.',
  specialties: ['Anksiyete', 'Depresyon', 'Travma', 'EMDR'],
  education: [
    'Klinik Psikoloji Doktorası',
    'Psikoloji Lisans - Boğaziçi',
  ],
};

const REVIEWS = [
  {
    id: '1',
    author: 'A.Y.',
    rating: 5,
    comment: 'Çok anlayışlı ve yardımsever.',
    date: '2 hafta önce',
  },
  {
    id: '2',
    author: 'M.K.',
    rating: 5,
    comment: 'Harika bir terapist!',
    date: '1 ay önce',
  },
];

export default function TherapistDetail() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'about' | 'reviews'>('about');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <Feather name="heart" size={22} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatarLarge}>
            <Feather name="user" size={40} color={Colors.light.primary} />
          </View>
          <Text style={styles.therapistName}>{MOCK_THERAPIST.name}</Text>
          <Text style={styles.therapistTitle}>{MOCK_THERAPIST.title}</Text>
          
          <View style={styles.ratingRow}>
            <Feather name="star" size={16} color="#FFB84D" />
            <Text style={styles.ratingText}>{MOCK_THERAPIST.rating}</Text>
            <Text style={styles.reviewsText}>({MOCK_THERAPIST.reviews} değerlendirme)</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.miniStat}>
              <Feather name="briefcase" size={16} color={Colors.light.textSecondary} />
              <Text style={styles.miniStatText}>{MOCK_THERAPIST.experience} yıl</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'about' && styles.tabActive]}
            onPress={() => setSelectedTab('about')}
          >
            <Text style={[styles.tabText, selectedTab === 'about' && styles.tabTextActive]}>
              Hakkında
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'reviews' && styles.tabActive]}
            onPress={() => setSelectedTab('reviews')}
          >
            <Text style={[styles.tabText, selectedTab === 'reviews' && styles.tabTextActive]}>
              Yorumlar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {selectedTab === 'about' ? (
          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hakkında</Text>
              <Text style={styles.aboutText}>{MOCK_THERAPIST.about}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Uzmanlık Alanları</Text>
              <View style={styles.specialtiesGrid}>
                {MOCK_THERAPIST.specialties.map((specialty, idx) => (
                  <View key={idx} style={styles.specialtyChip}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Eğitim</Text>
              {MOCK_THERAPIST.education.map((edu, idx) => (
                <View key={idx} style={styles.listItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.listItemText}>{edu}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            {REVIEWS.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewStars}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Feather
                        key={idx}
                        name="star"
                        size={12}
                        color={idx < review.rating ? '#FFB84D' : Colors.light.border}
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <Text style={styles.reviewAuthor}>{review.author}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Book Button */}
      <SafeAreaView>
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Seans</Text>
            <Text style={styles.price}>{MOCK_THERAPIST.price}₺</Text>
          </View>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => router.push('/(patient)/appointment/slot-select')}
          >
            <Text style={styles.bookButtonText}>Randevu Al</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },

  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.xxl,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  therapistName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  therapistTitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.sm,
  },

  ratingText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  reviewsText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  statsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },

  miniStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },

  miniStatText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },

  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingHorizontal: Spacing.xl,
  },

  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },

  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.textPrimary,
  },

  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },

  tabTextActive: {
    color: Colors.light.textPrimary,
    fontWeight: '600',
  },

  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },

  section: {
    marginBottom: Spacing.xxl,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  aboutText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },

  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  specialtyChip: {
    backgroundColor: '#E8F4FF',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },

  specialtyText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },

  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.primary,
    marginTop: 7,
    marginRight: Spacing.sm,
  },

  listItemText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },

  reviewCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    ...Shadows.xs,
  },

  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },

  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },

  reviewDate: {
    fontSize: 12,
    color: Colors.light.textLight,
  },

  reviewComment: {
    fontSize: 14,
    color: Colors.light.textPrimary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },

  reviewAuthor: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
    gap: Spacing.lg,
  },

  priceContainer: {
    flex: 1,
  },

  priceLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },

  price: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  bookButton: {
    flex: 1,
    backgroundColor: Colors.light.textPrimary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },

  bookButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.surface,
  },
});
