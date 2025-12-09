// app/(tabs)/journal/index.tsx - ORA JOURNAL SCREEN
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows, AppConfig } from '../../../shared/theme';

const { width } = Dimensions.get('window');

// Mock journal entries
const JOURNAL_ENTRIES = [
  {
    id: '1',
    date: new Date(2024, 11, 9),
    mood: 'happy',
    title: 'Bugün harika geçti',
    content: 'Sabah meditasyon yaptım ve gün boyunca enerjik hissettim...',
    tags: ['meditasyon', 'enerji', 'mutluluk'],
  },
  {
    id: '2',
    date: new Date(2024, 11, 8),
    mood: 'calm',
    title: 'Sakin bir gün',
    content: 'Nefes egzersizleri yaptım, kitap okudum...',
    tags: ['nefes', 'okuma', 'dinlenme'],
  },
  {
    id: '3',
    date: new Date(2024, 11, 7),
    mood: 'anxious',
    title: 'Biraz kaygılıydım',
    content: 'İş toplantısı öncesi kaygı hissettim ama atlatttım...',
    tags: ['kaygı', 'başarı', 'iş'],
  },
  {
    id: '4',
    date: new Date(2024, 11, 6),
    mood: 'grateful',
    title: 'Minnettar hissediyorum',
    content: 'Ailemle güzel vakit geçirdim, çok şanslıyım...',
    tags: ['aile', 'minnettarlık', 'sevgi'],
  },
];

const MOOD_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  happy: { icon: 'smile', color: Colors.light.moodHappy, label: 'Mutlu' },
  calm: { icon: 'coffee', color: Colors.light.moodCalm, label: 'Sakin' },
  anxious: { icon: 'alert-circle', color: Colors.light.moodAnxious, label: 'Kaygılı' },
  sad: { icon: 'cloud-rain', color: Colors.light.moodSad, label: 'Üzgün' },
  grateful: { icon: 'heart', color: Colors.light.moodGrateful, label: 'Minnettar' },
  energetic: { icon: 'zap', color: Colors.light.moodEnergetic, label: 'Enerjik' },
};

const PROMPTS = [
  'Bugün neler hissediyorsun?',
  'En çok neye minnettar hissediyorsun?',
  'Bugün kendine nasıl iyi baktın?',
  'Hangi düşünceler aklından geçiyor?',
  'Bugünkü en büyük başarın ne oldu?',
];

const formatDate = (date: Date) => {
  const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
};

export default function Journal() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentPrompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const [streak, setStreak] = useState(7);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const navigateToNewEntry = () => {
    router.push('/(tabs)/journal/new');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View>
          <Text style={styles.headerTitle}>Günlük</Text>
          <Text style={styles.headerSubtitle}>Düşüncelerini kaydet</Text>
        </View>
        <TouchableOpacity style={styles.calendarButton}>
          <Feather name="calendar" size={22} color={Colors.light.textPrimary} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Streak Card */}
        <Animated.View style={[styles.streakCard, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={Colors.gradients.warm as [string, string]}
            style={styles.streakGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.streakContent}>
              <View style={styles.streakIconContainer}>
                <Feather name="zap" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.streakTextContainer}>
                <Text style={styles.streakNumber}>{streak} Gün</Text>
                <Text style={styles.streakLabel}>Seri!</Text>
              </View>
            </View>
            <Text style={styles.streakMessage}>
              Harika gidiyorsun! Günlük tutma serisini koru.
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Quick Prompt */}
        <TouchableOpacity
          style={styles.promptCard}
          onPress={navigateToNewEntry}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#F8F5FF', '#FFFFFF']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.promptHeader}>
            <Feather name="edit-3" size={20} color={Colors.light.primary} />
            <Text style={styles.promptLabel}>Bugünün sorusu</Text>
          </View>
          <Text style={styles.promptText}>{currentPrompt}</Text>
          <View style={styles.promptAction}>
            <Text style={styles.promptActionText}>Yazmaya başla</Text>
            <Feather name="arrow-right" size={16} color={Colors.light.primary} />
          </View>
        </TouchableOpacity>

        {/* Recent Entries */}
        <View style={styles.entriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Son Yazılar</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Tümü</Text>
            </TouchableOpacity>
          </View>

          {JOURNAL_ENTRIES.map((entry, index) => {
            const mood = MOOD_CONFIG[entry.mood];
            return (
              <Animated.View
                key={entry.id}
                style={{
                  opacity: fadeAnim,
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20 * (index + 1), 0],
                    }),
                  }],
                }}
              >
                <TouchableOpacity style={styles.entryCard} activeOpacity={0.85}>
                  <View style={styles.entryHeader}>
                    <View style={[styles.moodBadge, { backgroundColor: mood.color + '20' }]}>
                      <Feather name={mood.icon as any} size={14} color={mood.color} />
                      <Text style={[styles.moodLabel, { color: mood.color }]}>{mood.label}</Text>
                    </View>
                    <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                  </View>
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                  <Text style={styles.entryContent} numberOfLines={2}>
                    {entry.content}
                  </Text>
                  <View style={styles.entryTags}>
                    {entry.tags.slice(0, 3).map((tag, i) => (
                      <View key={i} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Writing Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Yazma İpuçları</Text>
          <View style={styles.tipsList}>
            {[
              { icon: 'clock', text: 'Her gün aynı saatte yaz' },
              { icon: 'heart', text: 'Duygularını yargılamadan yaz' },
              { icon: 'target', text: 'Küçük detaylara odaklan' },
            ].map((tip, i) => (
              <View key={i} style={styles.tipItem}>
                <View style={styles.tipIcon}>
                  <Feather name={tip.icon as any} size={16} color={Colors.light.secondary} />
                </View>
                <Text style={styles.tipText}>{tip.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={navigateToNewEntry}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={Colors.gradients.primary as [string, string]}
          style={styles.fabGradient}
        >
          <Feather name="plus" size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },
  streakCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  streakGradient: {
    padding: Spacing.xl,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  streakIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  streakTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  streakLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  streakMessage: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  promptCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
    ...Shadows.sm,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  promptLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promptText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    lineHeight: 28,
    marginBottom: Spacing.lg,
  },
  promptAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  promptActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  entriesSection: {
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
  entryCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  entryDate: {
    fontSize: 12,
    color: Colors.light.textTertiary,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  entryContent: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  entryTags: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  tag: {
    backgroundColor: Colors.light.background,
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.pill,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  tipsSection: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.sm,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },
  tipsList: {
    gap: Spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.secondary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    ...Shadows.primary,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
