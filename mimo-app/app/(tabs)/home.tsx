// app/(tabs)/home.tsx - ORA PREMIUM HOME SCREEN
// "from now, find yourself"
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows, AppConfig } from '../../shared/theme';

const { width } = Dimensions.get('window');

// Ora Mini Logo
const OraLogoMini = ({ size = 32 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 120 120">
    <Defs>
      <RadialGradient id="miniGlow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#A18AFF" stopOpacity="0.8" />
        <Stop offset="100%" stopColor="#7C5CE0" stopOpacity="0.3" />
      </RadialGradient>
    </Defs>
    <Circle cx="60" cy="60" r="50" fill="url(#miniGlow)" opacity="0.3" />
    <Circle cx="60" cy="60" r="40" fill="none" stroke="#7C5CE0" strokeWidth="6" />
    <Circle cx="60" cy="60" r="8" fill="#7C5CE0" />
    <Circle cx="60" cy="60" r="5" fill="#A18AFF" />
  </Svg>
);

const MOOD_WEEK = [
  { day: 'Pzt', mood: 'happy', filled: true },
  { day: 'Sal', mood: 'neutral', filled: true },
  { day: 'Çar', mood: 'happy', filled: true },
  { day: 'Per', mood: 'sad', filled: true },
  { day: 'Cum', mood: 'happy', filled: true },
  { day: 'Cmt', mood: 'happy', filled: true },
  { day: 'Paz', mood: 'neutral', filled: false },
];

const MOOD_ICONS: Record<string, any> = {
  happy: 'smile',
  neutral: 'meh',
  sad: 'frown',
};

const MOOD_COLORS: Record<string, string> = {
  happy: Colors.light.moodHappy,
  neutral: Colors.light.moodNeutral,
  sad: Colors.light.moodSad,
};

const FEATURED_TESTS = [
  {
    id: 'beck-depression',
    name: 'Beck Depresyon',
    icon: 'cloud-rain',
    gradient: ['#FF6B6B', '#FFA07A'],
  },
  {
    id: 'big-five',
    name: 'Big Five',
    icon: 'star',
    gradient: ['#20B2AA', '#5CD5CD'],
  },
  {
    id: 'schema-abandonment',
    name: 'Terk Edilme',
    icon: 'user-x',
    gradient: ['#7C5CE0', '#A18AFF'],
  },
  {
    id: 'love-languages',
    name: 'Sevgi Dilleri',
    icon: 'heart',
    gradient: ['#FFB347', '#FFD89B'],
  },
];

const DAILY_EXERCISES = [
  {
    id: '1',
    title: 'Günlük Düşünceler',
    subtitle: 'Bugünkü düşüncelerinizi yazın',
    icon: 'edit-3',
    color: Colors.light.primary,
    bgColor: Colors.light.primary + '15',
  },
  {
    id: '2',
    title: 'Nefes Egzersizi',
    subtitle: '5 dakikalık rahatlama',
    icon: 'wind',
    color: Colors.light.secondary,
    bgColor: Colors.light.secondary + '15',
  },
  {
    id: '3',
    title: 'Günlük Olumlama',
    subtitle: 'Pozitif düşünceler',
    icon: 'sun',
    color: Colors.light.gold,
    bgColor: Colors.light.gold + '15',
  },
];

const MY_THERAPISTS = [
  {
    id: '1',
    name: 'Dr. Elif Yılmaz',
    title: 'Klinik Psikolog',
    avatar: 'EY',
    color: Colors.light.primary + '20',
    specialties: ['#Depresyon', '#Kaygı'],
  },
  {
    id: '2',
    name: 'Dr. Mehmet Kaya',
    title: 'Psikiyatrist',
    avatar: 'MK',
    color: Colors.light.secondary + '20',
    specialties: ['#BağlanmaStilleri', '#İlişkiler'],
  },
];

const JOURNAL_DAYS = [
  { date: 1, filled: false },
  { date: 2, filled: true },
  { date: 3, filled: true },
  { date: 4, filled: true },
  { date: 5, filled: false },
  { date: 6, filled: false },
  { date: 7, filled: false },
  { date: 8, filled: true },
];

export default function Home() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const oraScore = 80;
  const journalProgress = 47;
  const totalJournalDays = 365;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (oraScore / 100) * circumference;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <OraLogoMini size={36} />
          <Text style={styles.logoText}>{AppConfig.name}</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('/create-post')}
          >
            <Feather name="plus" size={22} color={Colors.light.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('/notifications')}
          >
            <Feather name="bell" size={22} color={Colors.light.textPrimary} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Animated.View style={[styles.greetingSection, { opacity: fadeAnim }]}>
          <Text style={styles.greeting}>Merhaba, Ayşe</Text>
          <Text style={styles.title}>Bugün nasıl hissediyorsun?</Text>
        </Animated.View>

        {/* Mood Tracking */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Haftalık Ruh Halin</Text>
            <TouchableOpacity onPress={() => router.push('/(patient)/mood/history')}>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.moodCard}>
            <View style={styles.moodWeek}>
              {MOOD_WEEK.map((day, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.moodDayItem}
                  onPress={() => router.push('/(patient)/mood/check-in')}
                >
                  <View style={[
                    styles.moodIcon,
                    day.filled && {
                      backgroundColor: MOOD_COLORS[day.mood] + '20',
                      borderColor: MOOD_COLORS[day.mood],
                    },
                  ]}>
                    {day.filled ? (
                      <Feather
                        name={MOOD_ICONS[day.mood]}
                        size={18}
                        color={MOOD_COLORS[day.mood]}
                      />
                    ) : (
                      <Feather name="plus" size={16} color={Colors.light.textTertiary} />
                    )}
                  </View>
                  <Text style={[
                    styles.moodDayLabel,
                    !day.filled && styles.moodDayLabelInactive,
                  ]}>{day.day}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Ora Score & Journey Progress */}
        <View style={styles.twoColumnSection}>
          {/* Ora Score */}
          <TouchableOpacity
            style={styles.halfCard}
            onPress={() => router.push('/progress')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#F8F5FF', '#FFFFFF']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={styles.cardTitle}>Ora Skoru</Text>
            <View style={styles.circularProgress}>
              <Svg width="100" height="100">
                <Circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={Colors.light.border}
                  strokeWidth="8"
                  fill="transparent"
                />
                <Circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={Colors.light.primary}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </Svg>
              <View style={styles.scoreCenter}>
                <Text style={styles.scoreNumber}>{oraScore}</Text>
                <Text style={styles.scoreLabel}>Sağlıklı</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* My Journey Progress */}
          <TouchableOpacity
            style={styles.halfCard}
            onPress={() => router.push('/(tabs)/feed')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#F0FFFE', '#FFFFFF']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={styles.cardTitle}>My Journey</Text>
            <View style={styles.journalCalendar}>
              {JOURNAL_DAYS.map((day, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.calendarDot,
                    day.filled && styles.calendarDotFilled,
                  ]}
                />
              ))}
            </View>
            <View style={styles.journalProgress}>
              <Text style={styles.journalNumber}>{journalProgress}</Text>
              <Text style={styles.journalTotal}>/{totalJournalDays}</Text>
            </View>
            <Text style={styles.journalLabel}>gün paylaşıldı</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Tests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Psikolojik Testler</Text>
            <TouchableOpacity onPress={() => router.push('/tests')}>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testsContainer}
          >
            {FEATURED_TESTS.map((test) => (
              <TouchableOpacity
                key={test.id}
                style={styles.testCard}
                onPress={() => router.push(`/tests/${test.id}`)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={test.gradient as [string, string]}
                  style={styles.testGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.testIconContainer}>
                    <Feather name={test.icon as any} size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.testName}>{test.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Daily Exercises */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Günlük Egzersizlerin</Text>
          <View style={styles.exercisesGrid}>
            {DAILY_EXERCISES.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseCard}
                activeOpacity={0.8}
              >
                <View style={[styles.exerciseIconContainer, { backgroundColor: exercise.bgColor }]}>
                  <Feather name={exercise.icon as any} size={24} color={exercise.color} />
                </View>
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                  <Text style={styles.exerciseSubtitle}>{exercise.subtitle}</Text>
                </View>
                <View style={styles.exerciseAction}>
                  <Feather name="chevron-right" size={20} color={Colors.light.textSecondary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* My Therapists */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Uzmanlarım</Text>
            <TouchableOpacity onPress={() => router.push('/(patient)/therapist-search')}>
              <Text style={styles.seeAllText}>Uzman Bul</Text>
            </TouchableOpacity>
          </View>
          {MY_THERAPISTS.map((therapist) => (
            <TouchableOpacity
              key={therapist.id}
              style={styles.therapistCard}
              onPress={() => router.push(`/(patient)/therapist/${therapist.id}`)}
              activeOpacity={0.85}
            >
              <View style={[styles.therapistAvatar, { backgroundColor: therapist.color }]}>
                <Text style={styles.therapistAvatarText}>{therapist.avatar}</Text>
              </View>
              <View style={styles.therapistInfo}>
                <Text style={styles.therapistName}>{therapist.name}</Text>
                <Text style={styles.therapistTitle}>{therapist.title}</Text>
                <View style={styles.therapistSpecialties}>
                  {therapist.specialties.map((spec, idx) => (
                    <Text key={idx} style={styles.specialtyTag}>{spec}</Text>
                  ))}
                </View>
              </View>
              <View style={styles.therapistAction}>
                <Feather name="message-circle" size={20} color={Colors.light.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity
              style={styles.accessCard}
              onPress={() => router.push('/meditation')}
            >
              <LinearGradient
                colors={['#7C5CE0', '#A18AFF']}
                style={styles.accessGradient}
              >
                <Feather name="headphones" size={28} color="#FFFFFF" />
                <Text style={styles.accessCardText}>Meditasyon</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accessCard}
              onPress={() => router.push('/breathing')}
            >
              <LinearGradient
                colors={['#20B2AA', '#5CD5CD']}
                style={styles.accessGradient}
              >
                <Feather name="wind" size={28} color="#FFFFFF" />
                <Text style={styles.accessCardText}>Nefes</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accessCard}
              onPress={() => router.push('/affirmations')}
            >
              <LinearGradient
                colors={['#FFB347', '#FFD89B']}
                style={styles.accessGradient}
              >
                <Feather name="heart" size={28} color="#FFFFFF" />
                <Text style={styles.accessCardText}>Olumlama</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accessCard}
              onPress={() => router.push('/emergency')}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FFA07A']}
                style={styles.accessGradient}
              >
                <Feather name="alert-circle" size={28} color="#FFFFFF" />
                <Text style={styles.accessCardText}>Acil Yardım</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* More Features */}
        <View style={styles.section}>
          <View style={styles.featuresList}>
            <TouchableOpacity
              style={styles.featureItem}
              onPress={() => router.push('/progress')}
            >
              <View style={styles.featureLeft}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.light.primary + '15' }]}>
                  <Feather name="trending-up" size={20} color={Colors.light.primary} />
                </View>
                <Text style={styles.featureText}>İlerleme Raporun</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureItem}
              onPress={() => router.push('/achievements')}
            >
              <View style={styles.featureLeft}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.light.gold + '15' }]}>
                  <Feather name="award" size={20} color={Colors.light.gold} />
                </View>
                <Text style={styles.featureText}>Başarılarım</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureItem}
              onPress={() => router.push('/group-sessions')}
            >
              <View style={styles.featureLeft}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.light.secondary + '15' }]}>
                  <Feather name="users" size={20} color={Colors.light.secondary} />
                </View>
                <Text style={styles.featureText}>Grup Seansları</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureItem, { borderBottomWidth: 0 }]}
              onPress={() => router.push('/resources')}
            >
              <View style={styles.featureLeft}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.light.accent + '15' }]}>
                  <Feather name="book-open" size={20} color={Colors.light.accent} />
                </View>
                <Text style={styles.featureText}>Kaynaklar</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Tagline */}
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>{AppConfig.tagline}</Text>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    letterSpacing: -1,
  },

  headerRight: {
    flexDirection: 'row',
    gap: Spacing.md,
  },

  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },

  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.light.accent,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  greetingSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },

  greeting: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    letterSpacing: -0.5,
  },

  section: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  moodCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  moodWeek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  moodDayItem: {
    alignItems: 'center',
  },

  moodIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  moodDayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  moodDayLabelInactive: {
    color: Colors.light.textTertiary,
  },

  twoColumnSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },

  halfCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  circularProgress: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scoreCenter: {
    position: 'absolute',
    alignItems: 'center',
  },

  scoreNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.primary,
  },

  scoreLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },

  journalCalendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.md,
  },

  calendarDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.border,
  },

  calendarDotFilled: {
    backgroundColor: Colors.light.secondary,
  },

  journalProgress: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  journalNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.secondary,
  },

  journalTotal: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },

  journalLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },

  testsContainer: {
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },

  testCard: {
    width: 120,
    height: 140,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },

  testGradient: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },

  testIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  testName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  exercisesGrid: {
    gap: Spacing.md,
  },

  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  exerciseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  exerciseContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },

  exerciseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },

  exerciseSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  exerciseAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  therapistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },

  therapistAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  therapistAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  therapistInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },

  therapistName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },

  therapistTitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },

  therapistSpecialties: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },

  specialtyTag: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  therapistAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },

  accessCard: {
    width: (width - Spacing.xl * 2 - Spacing.md) / 2,
    height: 100,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.md,
  },

  accessGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  accessCardText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  featuresList: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },

  featureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  featureText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  taglineContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },

  tagline: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.light.textTertiary,
    fontStyle: 'italic',
    letterSpacing: 1,
  },
});
