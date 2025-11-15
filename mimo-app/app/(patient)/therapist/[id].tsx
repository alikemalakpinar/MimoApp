// app/(patient)/therapist/[id].tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOCK_THERAPIST = {
  id: '1',
  name: 'Dr. Elif Yılmaz',
  title: 'Klinik Psikolog',
  specialties: ['Anksiyete', 'Depresyon', 'Travma', 'EMDR'],
  experience: 8,
  rating: 4.9,
  reviewCount: 127,
  price: 750,
  avatar: '👩‍⚕️',
  languages: ['Türkçe', 'İngilizce'],
  education: [
    'Klinik Psikoloji Doktorası - İstanbul Üniversitesi',
    'Psikoloji Lisans - Boğaziçi Üniversitesi',
  ],
  certifications: ['EMDR Terapisti', 'Bilişsel Davranışçı Terapi'],
  about: 'Mental sağlık alanında 8 yıllık deneyime sahip klinik psikologum. Özellikle anksiyete, depresyon ve travma üzerine çalışıyorum. Danışanlarıma güvenli bir alan sunarak, onların kendi potansiyellerini keşfetmelerine yardımcı oluyorum.',
  sessionTypes: [
    { type: 'video', label: 'Görüntülü Görüşme', duration: '50 dk', price: 750 },
    { type: 'chat', label: 'Mesajlaşma', duration: 'Haftalık', price: 500 },
  ],
};

const MOCK_REVIEWS = [
  {
    id: '1',
    rating: 5,
    comment: 'Çok anlayışlı ve yardımsever bir terapist. Kendimi güvende hissediyorum.',
    author: 'A.Y.',
    date: '2 hafta önce',
  },
  {
    id: '2',
    rating: 5,
    comment: 'EMDR seansları gerçekten işe yaradı. Teşekkür ederim.',
    author: 'M.K.',
    date: '1 ay önce',
  },
];

export default function TherapistDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState<'about' | 'reviews'>('about');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <Feather name="heart" size={24} color={Colors.light.textLight} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Text style={styles.avatar}>{MOCK_THERAPIST.avatar}</Text>
          <Text style={styles.therapistName}>{MOCK_THERAPIST.name}</Text>
          <Text style={styles.therapistTitle}>{MOCK_THERAPIST.title}</Text>
          
          <View style={styles.ratingContainer}>
            <Feather name="star" size={16} color={Colors.light.accent} />
            <Text style={styles.ratingText}>{MOCK_THERAPIST.rating}</Text>
            <Text style={styles.reviewCount}>({MOCK_THERAPIST.reviewCount} değerlendirme)</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Feather name="briefcase" size={18} color={Colors.light.primary} />
              <Text style={styles.statText}>{MOCK_THERAPIST.experience} yıl</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="users" size={18} color={Colors.light.primary} />
              <Text style={styles.statText}>127 danışan</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="message-circle" size={18} color={Colors.light.primary} />
              <Text style={styles.statText}>2 dil</Text>
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
              Yorumlar ({MOCK_REVIEWS.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {selectedTab === 'about' ? (
          <View>
            {/* About */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hakkında</Text>
              <Text style={styles.aboutText}>{MOCK_THERAPIST.about}</Text>
            </View>

            {/* Specialties */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Uzmanlık Alanları</Text>
              <View style={styles.specialtiesContainer}>
                {MOCK_THERAPIST.specialties.map((specialty, idx) => (
                  <View key={idx} style={styles.specialtyChip}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Education */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Eğitim</Text>
              {MOCK_THERAPIST.education.map((edu, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Feather name="check-circle" size={16} color={Colors.light.secondary} />
                  <Text style={styles.listItemText}>{edu}</Text>
                </View>
              ))}
            </View>

            {/* Session Types */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Seans Türleri</Text>
              {MOCK_THERAPIST.sessionTypes.map((session, idx) => (
                <View key={idx} style={styles.sessionCard}>
                  <View style={styles.sessionInfo}>
                    <Feather 
                      name={session.type === 'video' ? 'video' : 'message-circle'} 
                      size={20} 
                      color={Colors.light.primary} 
                    />
                    <View style={styles.sessionDetails}>
                      <Text style={styles.sessionLabel}>{session.label}</Text>
                      <Text style={styles.sessionDuration}>{session.duration}</Text>
                    </View>
                  </View>
                  <Text style={styles.sessionPrice}>{session.price}₺</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            {MOCK_REVIEWS.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewRating}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Feather
                        key={idx}
                        name="star"
                        size={14}
                        color={idx < review.rating ? Colors.light.accent : Colors.light.border}
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <Text style={styles.reviewAuthor}>— {review.author}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Book Button */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Seans başına</Text>
          <Text style={styles.price}>{MOCK_THERAPIST.price}₺</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => router.push('/(patient)/appointment/slot-select')}
        >
          <Text style={styles.bookButtonText}>Randevu Al</Text>
          <Feather name="arrow-right" size={20} color={Colors.light.surface} />
        </TouchableOpacity>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  backButton: {
    padding: Spacing.xs,
  },

  favoriteButton: {
    padding: Spacing.xs,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  avatar: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },

  therapistName: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  therapistTitle: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },

  ratingText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
  },

  reviewCount: {
    fontSize: Typography.sm,
    color: Colors.light.textLight,
  },

  statsRow: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },

  statText: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
  },

  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingHorizontal: Spacing.lg,
  },

  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },

  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.primary,
  },

  tabText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.light.textSecondary,
  },

  tabTextActive: {
    color: Colors.light.primary,
    fontWeight: Typography.semibold,
  },

  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },

  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  aboutText: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
    lineHeight: Typography.base * 1.6,
  },

  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  specialtyChip: {
    backgroundColor: Colors.light.primary + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },

  specialtyText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.light.primary,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  listItemText: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.light.textPrimary,
    lineHeight: Typography.base * 1.4,
  },

  sessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },

  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  sessionDetails: {
    marginLeft: Spacing.md,
  },

  sessionLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  sessionDuration: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
  },

  sessionPrice: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.light.primary,
  },

  reviewCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },

  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  reviewRating: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },

  reviewDate: {
    fontSize: Typography.xs,
    color: Colors.light.textLight,
  },

  reviewComment: {
    fontSize: Typography.base,
    color: Colors.light.textPrimary,
    lineHeight: Typography.base * 1.5,
    marginBottom: Spacing.sm,
  },

  reviewAuthor: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    ...Shadows.lg,
  },

  priceContainer: {
    flex: 1,
  },

  priceLabel: {
    fontSize: Typography.xs,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },

  price: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.primary,
  },

  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },

  bookButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
  },
});
