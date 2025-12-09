// app/(tabs)/search.tsx - ORA DISCOVER PAGE - Unique Wellness Discovery
// "Keşfet" - AI-powered wellness discovery, healing circles, voice-first interaction
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { useThemeStore } from '../../shared/store/themeStore';

const { width } = Dimensions.get('window');

// Ora Logo Animation
const OraDiscoverLogo = ({ size = 48 }: { size?: number }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          <RadialGradient id="discoverGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#A18AFF" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#7C5CE0" stopOpacity="0.4" />
          </RadialGradient>
        </Defs>
        <Circle cx="60" cy="60" r="50" fill="url(#discoverGlow)" opacity="0.3" />
        <Circle cx="60" cy="60" r="35" fill="none" stroke="#7C5CE0" strokeWidth="4" />
        <Circle cx="60" cy="60" r="12" fill="#7C5CE0" />
        <Circle cx="60" cy="60" r="6" fill="#A18AFF" />
      </Svg>
    </Animated.View>
  );
};

// Live Healing Circle Preview
interface HealingCirclePreview {
  id: string;
  name: string;
  theme: string;
  icon: string;
  memberCount: number;
  isLive: boolean;
  gradient: string[];
}

const HEALING_CIRCLES: HealingCirclePreview[] = [
  { id: '1', name: 'Sakin Liman', theme: 'Kaygı Yönetimi', icon: '🌊', memberCount: 12, isLive: true, gradient: ['#8B7CF6', '#6366F1'] },
  { id: '2', name: 'Şifa Bahçesi', theme: 'Kayıp & Yas', icon: '🕊️', memberCount: 8, isLive: true, gradient: ['#F472B6', '#EC4899'] },
  { id: '3', name: 'Huzur Ormanı', theme: 'Stres Yönetimi', icon: '🌿', memberCount: 15, isLive: false, gradient: ['#34D399', '#10B981'] },
  { id: '4', name: 'Gece Sığınağı', theme: 'Uyku & Dinlenme', icon: '🌙', memberCount: 6, isLive: true, gradient: ['#A78BFA', '#7C3AED'] },
];

// Wellness Quest Preview
interface QuestPreview {
  id: string;
  title: string;
  xp: number;
  icon: string;
  color: string;
  progress: number;
}

const FEATURED_QUESTS: QuestPreview[] = [
  { id: '1', title: '7 Gün Meditasyon Serisi', xp: 500, icon: '🧘', color: '#8B7CF6', progress: 0.4 },
  { id: '2', title: 'Günlük Nefes Egzersizi', xp: 50, icon: '🌬️', color: '#34D399', progress: 0 },
  { id: '3', title: 'Minnettarlık Günlüğü', xp: 100, icon: '📝', color: '#FBBF24', progress: 0.7 },
];

// AI Recommended Content
interface ContentRecommendation {
  id: string;
  type: 'meditation' | 'article' | 'exercise' | 'story';
  title: string;
  duration?: string;
  icon: string;
  gradient: string[];
  reason: string;
}

const AI_RECOMMENDATIONS: ContentRecommendation[] = [
  { id: '1', type: 'meditation', title: 'Sabah Uyanış Meditasyonu', duration: '10 dk', icon: '🌅', gradient: ['#FFB347', '#FF6B6B'], reason: 'Sabah rutinin için ideal' },
  { id: '2', type: 'article', title: 'Kaygıyı Dost Edinmek', icon: '📖', gradient: ['#60A5FA', '#3B82F6'], reason: 'Son mood\'una göre önerildi' },
  { id: '3', type: 'exercise', title: '4-7-8 Nefes Tekniği', duration: '5 dk', icon: '🫁', gradient: ['#34D399', '#10B981'], reason: 'Stres seviyeni düşür' },
  { id: '4', type: 'story', title: 'Uyku Hikayesi: Yıldızlı Gece', duration: '15 dk', icon: '✨', gradient: ['#A78BFA', '#7C3AED'], reason: 'Bu gece için hazırlan' },
];

// Voice Quick Actions
const VOICE_ACTIONS = [
  { id: '1', phrase: 'Nasıl hissediyorum', icon: '🎭', action: 'mood' },
  { id: '2', phrase: 'Nefes egzersizi', icon: '🌬️', action: 'breathing' },
  { id: '3', phrase: 'Meditasyon başlat', icon: '🧘', action: 'meditation' },
  { id: '4', phrase: 'Seninle konuşalım', icon: '💬', action: 'chat' },
];

export default function Search() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const voicePulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isVoiceActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(voicePulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(voicePulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isVoiceActive]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header with Ora branding */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Keşfet</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Bugün kendini nasıl keşfedeceksin?
            </Text>
          </View>
          <OraDiscoverLogo size={44} />
        </View>

        {/* Voice-First Search */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={() => setIsVoiceActive(!isVoiceActive)}
          >
            <Animated.View style={{ transform: [{ scale: isVoiceActive ? voicePulseAnim : 1 }] }}>
              <LinearGradient
                colors={isVoiceActive ? ['#EF4444', '#DC2626'] : [colors.primary, colors.primaryLight || colors.secondary]}
                style={styles.voiceButtonGradient}
              >
                <Feather name={isVoiceActive ? 'mic' : 'mic'} size={20} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Ora'ya sor veya ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="sliders" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Voice Quick Actions */}
        {isVoiceActive && (
          <Animated.View style={styles.voiceActions}>
            <Text style={[styles.voiceHint, { color: colors.textSecondary }]}>
              Şunları deneyin:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {VOICE_ACTIONS.map((action) => (
                <TouchableOpacity key={action.id} style={[styles.voiceActionChip, { backgroundColor: colors.surface }]}>
                  <Text style={styles.voiceActionIcon}>{action.icon}</Text>
                  <Text style={[styles.voiceActionText, { color: colors.textPrimary }]}>
                    "{action.phrase}"
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Healing Circles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.liveDot} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Şifa Çemberleri
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.circlesScroll}>
            {HEALING_CIRCLES.map((circle) => (
              <TouchableOpacity key={circle.id} style={styles.circleCard}>
                <LinearGradient
                  colors={circle.gradient as [string, string]}
                  style={styles.circleGradient}
                >
                  {circle.isLive && (
                    <View style={styles.circleLiveBadge}>
                      <View style={styles.circleLiveDot} />
                      <Text style={styles.circleLiveText}>CANLI</Text>
                    </View>
                  )}
                  <Text style={styles.circleIcon}>{circle.icon}</Text>
                  <Text style={styles.circleName}>{circle.name}</Text>
                  <Text style={styles.circleTheme}>{circle.theme}</Text>
                  <View style={styles.circleMemberInfo}>
                    <Feather name="users" size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.circleMemberCount}>{circle.memberCount} kişi</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* AI Recommendations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.aiIcon}>✨</Text>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Ora Sana Özel Önerir
              </Text>
            </View>
          </View>

          <View style={styles.recommendationsGrid}>
            {AI_RECOMMENDATIONS.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.recommendationCard,
                  { backgroundColor: colors.surface },
                  index % 2 === 0 ? styles.recommendationLarge : styles.recommendationSmall,
                ]}
              >
                <LinearGradient
                  colors={item.gradient as [string, string]}
                  style={styles.recommendationGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.recommendationIcon}>{item.icon}</Text>
                </LinearGradient>
                <View style={styles.recommendationContent}>
                  <Text style={[styles.recommendationType, { color: colors.textSecondary }]}>
                    {item.type === 'meditation' ? 'Meditasyon' :
                     item.type === 'article' ? 'Makale' :
                     item.type === 'exercise' ? 'Egzersiz' : 'Hikaye'}
                  </Text>
                  <Text style={[styles.recommendationTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                    {item.title}
                  </Text>
                  {item.duration && (
                    <Text style={[styles.recommendationDuration, { color: colors.textSecondary }]}>
                      {item.duration}
                    </Text>
                  )}
                  <Text style={[styles.recommendationReason, { color: colors.primary }]} numberOfLines={1}>
                    {item.reason}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Wellness Quests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.questIcon}>🎯</Text>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Günlük Görevler
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Tümü</Text>
            </TouchableOpacity>
          </View>

          {FEATURED_QUESTS.map((quest) => (
            <TouchableOpacity
              key={quest.id}
              style={[styles.questCard, { backgroundColor: colors.surface }]}
            >
              <View style={[styles.questIconContainer, { backgroundColor: `${quest.color}20` }]}>
                <Text style={styles.questEmoji}>{quest.icon}</Text>
              </View>
              <View style={styles.questInfo}>
                <Text style={[styles.questTitle, { color: colors.textPrimary }]}>{quest.title}</Text>
                <View style={styles.questProgressContainer}>
                  <View style={[styles.questProgressBg, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.questProgressFill,
                        { width: `${quest.progress * 100}%`, backgroundColor: quest.color },
                      ]}
                    />
                  </View>
                  <Text style={[styles.questProgressText, { color: colors.textSecondary }]}>
                    {Math.round(quest.progress * 100)}%
                  </Text>
                </View>
              </View>
              <View style={styles.questReward}>
                <Text style={[styles.questXp, { color: quest.color }]}>+{quest.xp}</Text>
                <Text style={[styles.questXpLabel, { color: colors.textSecondary }]}>XP</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mood Insights */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.insightCard}>
            <LinearGradient
              colors={isDarkMode ? ['#2D2640', '#1A1A2E'] : ['#F8F5FF', '#FFFFFF']}
              style={styles.insightGradient}
            >
              <View style={styles.insightHeader}>
                <Text style={styles.insightIcon}>📊</Text>
                <View style={styles.insightTitleContainer}>
                  <Text style={[styles.insightTitle, { color: colors.textPrimary }]}>
                    Haftalık Mood Analizi
                  </Text>
                  <Text style={[styles.insightSubtitle, { color: colors.textSecondary }]}>
                    Biyometrik verilerinle birlikte
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color={colors.textSecondary} />
              </View>
              <View style={styles.insightPreview}>
                {['😌', '😊', '😐', '😊', '😌', '🙂', '😊'].map((emoji, i) => (
                  <View key={i} style={styles.insightDay}>
                    <Text style={styles.insightEmoji}>{emoji}</Text>
                    <Text style={[styles.insightDayLabel, { color: colors.textTertiary }]}>
                      {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][i]}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Access Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: Spacing.md }]}>
            Hızlı Erişim
          </Text>
          <View style={styles.quickAccessGrid}>
            {[
              { icon: '🧘', label: 'Meditasyon', color: '#8B7CF6' },
              { icon: '📝', label: 'Günlük', color: '#F472B6' },
              { icon: '🫁', label: 'Nefes', color: '#34D399' },
              { icon: '🎧', label: 'Sesler', color: '#60A5FA' },
              { icon: '🌙', label: 'Uyku', color: '#A78BFA' },
              { icon: '💪', label: 'Egzersiz', color: '#FBBF24' },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={[styles.quickAccessItem, { backgroundColor: colors.surface }]}>
                <View style={[styles.quickAccessIcon, { backgroundColor: `${item.color}20` }]}>
                  <Text style={styles.quickAccessEmoji}>{item.icon}</Text>
                </View>
                <Text style={[styles.quickAccessLabel, { color: colors.textPrimary }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  voiceButton: {
    marginRight: Spacing.sm,
  },
  voiceButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Spacing.sm,
  },
  filterButton: {
    padding: Spacing.sm,
  },
  voiceActions: {
    marginBottom: Spacing.md,
  },
  voiceHint: {
    fontSize: 12,
    marginBottom: Spacing.sm,
  },
  voiceActionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.sm,
  },
  voiceActionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  voiceActionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  aiIcon: {
    fontSize: 18,
  },
  questIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  circlesScroll: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  circleCard: {
    width: 140,
    height: 180,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  circleGradient: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'flex-end',
  },
  circleLiveBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  circleLiveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
    marginRight: 4,
  },
  circleLiveText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  circleIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  circleName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  circleTheme: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.sm,
  },
  circleMemberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  circleMemberCount: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  recommendationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  recommendationCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  recommendationLarge: {
    width: (width - Spacing.xl * 2 - Spacing.md) / 2,
    height: 180,
  },
  recommendationSmall: {
    width: (width - Spacing.xl * 2 - Spacing.md) / 2,
    height: 180,
  },
  recommendationGradient: {
    width: '100%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendationIcon: {
    fontSize: 32,
  },
  recommendationContent: {
    padding: Spacing.md,
    flex: 1,
  },
  recommendationType: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 4,
  },
  recommendationDuration: {
    fontSize: 11,
    marginBottom: 4,
  },
  recommendationReason: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  questCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    ...Shadows.xs,
  },
  questIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  questEmoji: {
    fontSize: 24,
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  questProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  questProgressBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  questProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  questProgressText: {
    fontSize: 11,
    fontWeight: '600',
    width: 35,
  },
  questReward: {
    alignItems: 'center',
  },
  questXp: {
    fontSize: 16,
    fontWeight: '700',
  },
  questXpLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  insightCard: {
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  insightGradient: {
    padding: Spacing.lg,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  insightTitleContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  insightSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  insightPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightDay: {
    alignItems: 'center',
  },
  insightEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  insightDayLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  quickAccessItem: {
    width: (width - Spacing.xl * 2 - Spacing.md * 2) / 3,
    aspectRatio: 1,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.xs,
  },
  quickAccessIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickAccessEmoji: {
    fontSize: 24,
  },
  quickAccessLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
