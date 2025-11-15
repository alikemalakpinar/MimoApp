// app/(auth)/psychologist-matching.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOCK_THERAPISTS = [
  {
    id: '1',
    name: 'Dr. Elif Yılmaz',
    title: 'Klinik Psikolog',
    specialties: ['Anksiyete', 'Depresyon', 'Travma'],
    experience: 8,
    rating: 4.9,
    price: 750,
    avatar: '👩‍⚕️',
    matchScore: 95,
  },
  {
    id: '2',
    name: 'Dr. Mehmet Kaya',
    title: 'Psikiyatrist',
    specialties: ['Stres Yönetimi', 'İlişki Problemleri'],
    experience: 12,
    rating: 4.8,
    price: 850,
    avatar: '👨‍⚕️',
    matchScore: 92,
  },
  {
    id: '3',
    name: 'Ayşe Demir',
    title: 'Psikolojik Danışman',
    specialties: ['Kişisel Gelişim', 'Kariyer Koçluğu'],
    experience: 5,
    rating: 4.7,
    price: 650,
    avatar: '👩‍💼',
    matchScore: 88,
  },
];

export default function PsychologistMatching() {
  const router = useRouter();
  const [isMatching, setIsMatching] = useState(true);
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    // Matching animasyonu
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // 3 saniye sonra sonuçları göster
    setTimeout(() => {
      setIsMatching(false);
    }, 3000);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleSelectTherapist = (therapistId: string) => {
    // Terapist seçildi, home'a yönlendir
    router.replace('/(tabs)/home');
  };

  if (isMatching) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.matchingContainer}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Feather name="loader" size={64} color={Colors.light.primary} />
          </Animated.View>
          <Text style={styles.matchingTitle}>Size Uygun Terapistleri Buluyoruz</Text>
          <Text style={styles.matchingSubtitle}>
            Yanıtlarınıza göre en uygun uzmanları eşleştiriyoruz...
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
        <Text style={styles.headerSubtitle}>
          {MOCK_THERAPISTS.length} terapist sizin için uygun
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_THERAPISTS.map((therapist, index) => (
          <View key={therapist.id} style={styles.therapistCard}>
            {/* Match Score Badge */}
            <View style={styles.matchBadge}>
              <Feather name="zap" size={12} color={Colors.light.accent} />
              <Text style={styles.matchBadgeText}>{therapist.matchScore}% Eşleşme</Text>
            </View>

            <View style={styles.therapistContent}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>{therapist.avatar}</Text>
              </View>

              <View style={styles.therapistInfo}>
                <Text style={styles.therapistName}>{therapist.name}</Text>
                <Text style={styles.therapistTitle}>{therapist.title}</Text>
                
                <View style={styles.specialtiesContainer}>
                  {therapist.specialties.map((specialty, idx) => (
                    <View key={idx} style={styles.specialtyChip}>
                      <Text style={styles.specialtyText}>{specialty}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <Feather name="star" size={14} color={Colors.light.accent} />
                    <Text style={styles.statText}>{therapist.rating}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Feather name="briefcase" size={14} color={Colors.light.primary} />
                    <Text style={styles.statText}>{therapist.experience} yıl</Text>
                  </View>
                  <View style={styles.stat}>
                    <Feather name="credit-card" size={14} color={Colors.light.secondary} />
                    <Text style={styles.statText}>{therapist.price}₺/seans</Text>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => handleSelectTherapist(therapist.id)}
            >
              <Text style={styles.selectButtonText}>Profili İncele</Text>
              <Feather name="arrow-right" size={18} color={Colors.light.surface} />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace('/(tabs)/home')}
        >
          <Text style={styles.skipButtonText}>Şimdilik Atla, Sonra Seçerim</Text>
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
    paddingHorizontal: Spacing.xl,
  },

  matchingTitle: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginTop: Spacing.xl,
    textAlign: 'center',
  },

  matchingSubtitle: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },

  headerTitle: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  headerSubtitle: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
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
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },

  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.accent + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },

  matchBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.light.accent,
    marginLeft: Spacing.xs,
  },

  therapistContent: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },

  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  avatar: {
    fontSize: 32,
  },

  therapistInfo: {
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
    marginBottom: Spacing.sm,
  },

  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },

  specialtyChip: {
    backgroundColor: Colors.light.secondary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },

  specialtyText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.light.secondary,
  },

  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },

  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },

  statText: {
    fontSize: Typography.xs,
    color: Colors.light.textSecondary,
  },

  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },

  selectButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
  },

  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
  },

  skipButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.light.textSecondary,
  },
});
