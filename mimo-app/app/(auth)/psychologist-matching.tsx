// app/(auth)/psychologist-matching.tsx - MINIMAL REDESIGN
import React, { useState, useEffect } from 'react';
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
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MATCHED_THERAPISTS = [
  {
    id: '1',
    name: 'Dr. Elif Yılmaz',
    title: 'Klinik Psikolog',
    matchScore: 95,
    experience: 8,
    rating: 4.9,
    price: 750,
  },
  {
    id: '2',
    name: 'Dr. Mehmet Kaya',
    title: 'Psikiyatrist',
    matchScore: 92,
    experience: 12,
    rating: 4.8,
    price: 850,
  },
];

export default function PsychologistMatching() {
  const router = useRouter();
  const [isMatching, setIsMatching] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsMatching(false), 2500);
  }, []);

  if (isMatching) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.matchingContainer}>
          <View style={styles.matchingIcon}>
            <Feather name="zap" size={40} color={Colors.light.primary} />
          </View>
          <Text style={styles.matchingTitle}>Size uygun terapistleri buluyoruz</Text>
          <Text style={styles.matchingSubtitle}>
            Yanıtlarınıza göre en iyi eşleşmeler hazırlanıyor...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Size Özel Eşleşmeler</Text>
        <Text style={styles.headerSubtitle}>{MATCHED_THERAPISTS.length} terapist bulundu</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MATCHED_THERAPISTS.map((therapist) => (
          <View key={therapist.id} style={styles.therapistCard}>
            <View style={styles.matchBadge}>
              <Feather name="zap" size={12} color="#FFB84D" />
              <Text style={styles.matchBadgeText}>{therapist.matchScore}% eşleşme</Text>
            </View>

            <View style={styles.therapistContent}>
              <View style={styles.therapistAvatar}>
                <Feather name="user" size={28} color={Colors.light.primary} />
              </View>
              <Text style={styles.therapistName}>{therapist.name}</Text>
              <Text style={styles.therapistTitle}>{therapist.title}</Text>
              
              <View style={styles.statsRow}>
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
            </View>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => router.replace('/(tabs)/home')}
            >
              <Text style={styles.selectButtonText}>Profili İncele</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace('/(tabs)/home')}
        >
          <Text style={styles.skipButtonText}>Atla, sonra seçerim</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  matchingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
  },

  matchingIcon: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.xxl,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },

  matchingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },

  matchingSubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
    letterSpacing: -0.5,
  },

  headerSubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
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
    padding: Spacing.xxl,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },

  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF5E8',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: 4,
    marginBottom: Spacing.lg,
  },

  matchBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFB84D',
  },

  therapistContent: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  therapistAvatar: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.xl,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  therapistName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  therapistTitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
  },

  statsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },

  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  statText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  selectButton: {
    backgroundColor: Colors.light.textPrimary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },

  selectButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.surface,
  },

  skipButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },

  skipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
});
