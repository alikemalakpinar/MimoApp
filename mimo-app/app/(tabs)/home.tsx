// app/(tabs)/home.tsx - ULTRA PREMIUM VERSION
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';

const { width } = Dimensions.get('window');

const MOCK_USER = {
  name: 'Ayşe',
  avatar: '👩',
  greeting: 'Günaydın',
};

const QUICK_MOODS = [
  { emoji: '😊', label: 'Mutlu', value: 'happy', color: Colors.light.secondary },
  { emoji: '😌', label: 'Sakin', value: 'calm', color: Colors.light.primaryLight },
  { emoji: '😔', label: 'Üzgün', value: 'sad', color: Colors.light.info },
  { emoji: '😰', label: 'Stresli', value: 'stressed', color: Colors.light.warning },
  { emoji: '😴', label: 'Yorgun', value: 'tired', color: Colors.light.textLight },
];

const UPCOMING_SESSION = {
  therapist: 'Dr. Elif Yılmaz',
  avatar: '👩‍⚕️',
  date: 'Bugün',
  time: '14:00',
  type: 'video',
  status: 'confirmed',
};

const DAILY_TASKS = [
  { id: '1', title: 'Sabah meditasyonu', completed: true, icon: '🧘‍♀️' },
  { id: '2', title: 'Günlük yaz', completed: false, icon: '📝' },
  { id: '3', title: 'Su tüketimi (2L)', completed: false, icon: '💧' },
  { id: '4', title: '15 dk yürüyüş', completed: true, icon: '🚶‍♀️' },
];

const INSIGHTS = [
  {
    id: '1',
    title: 'Ruh hali trendlerin iyileşiyor 📈',
    description: 'Son 7 günde mood skorun %12 arttı',
    color: Colors.light.secondary,
  },
  {
    id: '2',
    title: 'Düzenli uyku uyarısı 😴',
    description: 'Uyku düzenine dikkat et, ruh halini etkiliyor',
    color: Colors.light.info,
  },
];

export default function Home() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Animated Gradient Background */}
      <LinearGradient
        colors={[Colors.light.primary + '08', Colors.light.background, Colors.light.secondary + '05']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Premium Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View>
            <Text style={styles.greeting}>{MOCK_USER.greeting},</Text>
            <Text style={styles.userName}>{MOCK_USER.name} 👋</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <LinearGradient
              colors={[Colors.light.primary, Colors.light.primaryLight]}
              style={styles.profileGradient}
            >
              <Text style={styles.profileAvatar}>{MOCK_USER.avatar}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Mood Check */}
        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Feather name="heart" size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Bugün nasıl hissediyorsun?</Text>
          </View>
          
          <BlurView intensity={20} tint="light" style={styles.moodCard}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.moodContainer}
            >
              {QUICK_MOODS.map((mood) => (
                <TouchableOpacity
                  key={mood.value}
                  style={[
                    styles.moodButton,
                    selectedMood === mood.value && { 
                      backgroundColor: mood.color + '20',
                      borderColor: mood.color,
                    },
                  ]}
                  onPress={() => {
                    setSelectedMood(mood.value);
                    router.push('/(patient)/mood/check-in');
                  }}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </BlurView>
        </Animated.View>

        {/* Upcoming Session - Hero Card */}
        {UPCOMING_SESSION && (
          <Animated.View
            style={[
              styles.section,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <TouchableOpacity 
              style={styles.sessionHeroCard}
              onPress={() => router.push('/(tabs)/appointments')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[Colors.light.primary, Colors.light.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sessionGradient}
              >
                <View style={styles.sessionContent}>
                  <View style={styles.sessionLeft}>
                    <View style={styles.sessionBadge}>
                      <Feather name="video" size={16} color={Colors.light.surface} />
                      <Text style={styles.sessionBadgeText}>Yaklaşan</Text>
                    </View>
                    <Text style={styles.sessionTherapist}>{UPCOMING_SESSION.therapist}</Text>
                    <View style={styles.sessionTimeRow}>
                      <Feather name="clock" size={14} color={Colors.light.surface} />
                      <Text style={styles.sessionTime}>
                        {UPCOMING_SESSION.date} • {UPCOMING_SESSION.time}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.sessionRight}>
                    <Text style={styles.sessionAvatar}>{UPCOMING_SESSION.avatar}</Text>
                    <TouchableOpacity style={styles.joinButton}>
                      <Text style={styles.joinButtonText}>Katıl</Text>
                      <Feather name="arrow-right" size={16} color={Colors.light.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Daily Tasks */}
        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Feather name="check-square" size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Günlük Görevler</Text>
            <View style={styles.progressBadge}>
              <Text style={styles.progressText}>
                {DAILY_TASKS.filter(t => t.completed).length}/{DAILY_TASKS.length}
              </Text>
            </View>
          </View>

          <View style={styles.tasksCard}>
            {DAILY_TASKS.map((task) => (
              <TouchableOpacity key={task.id} style={styles.taskItem}>
                <View style={styles.taskLeft}>
                  <View style={[
                    styles.taskCheckbox,
                    task.completed && styles.taskCheckboxCompleted,
                  ]}>
                    {task.completed && (
                      <Feather name="check" size={14} color={Colors.light.surface} />
                    )}
                  </View>
                  <Text style={styles.taskIcon}>{task.icon}</Text>
                  <Text style={[
                    styles.taskTitle,
                    task.completed && styles.taskTitleCompleted,
                  ]}>
                    {task.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Insights */}
        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Feather name="zap" size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>İçgörüler</Text>
          </View>

          {INSIGHTS.map((insight) => (
            <View key={insight.id} style={[
              styles.insightCard,
              { borderLeftColor: insight.color },
            ]}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Quick Actions Grid */}
        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Feather name="grid" size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
          </View>

          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/(tabs)/journal/new')}
            >
              <LinearGradient
                colors={[Colors.light.accent + '20', Colors.light.accent + '10']}
                style={styles.quickActionGradient}
              >
                <Feather name="edit-3" size={24} color={Colors.light.accent} />
              </LinearGradient>
              <Text style={styles.quickActionLabel}>Günlük Yaz</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/(patient)/therapist-search')}
            >
              <LinearGradient
                colors={[Colors.light.primary + '20', Colors.light.primary + '10']}
                style={styles.quickActionGradient}
              >
                <Feather name="search" size={24} color={Colors.light.primary} />
              </LinearGradient>
              <Text style={styles.quickActionLabel}>Terapist Ara</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/(tabs)/feed')}
            >
              <LinearGradient
                colors={[Colors.light.secondary + '20', Colors.light.secondary + '10']}
                style={styles.quickActionGradient}
              >
                <Feather name="users" size={24} color={Colors.light.secondary} />
              </LinearGradient>
              <Text style={styles.quickActionLabel}>Topluluk</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/(patient)/mood/history')}
            >
              <LinearGradient
                colors={[Colors.light.info + '20', Colors.light.info + '10']}
                style={styles.quickActionGradient}
              >
                <Feather name="bar-chart-2" size={24} color={Colors.light.info} />
              </LinearGradient>
              <Text style={styles.quickActionLabel}>Mood Raporu</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Emergency Support */}
        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity style={styles.emergencyCard}>
            <View style={styles.emergencyIconContainer}>
              <Feather name="phone" size={24} color={Colors.light.error} />
            </View>
            <View style={styles.emergencyContent}>
              <Text style={styles.emergencyTitle}>Acil Destek</Text>
              <Text style={styles.emergencyDescription}>
                7/24 kriz desteği için buraya tıklayın
              </Text>
            </View>
            <Feather name="chevron-right" size={24} color={Colors.light.textLight} />
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },

  greeting: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },

  userName: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
  },

  profileButton: {
    borderRadius: BorderRadius.full,
    ...Shadows.md,
  },

  profileGradient: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileAvatar: {
    fontSize: 28,
  },

  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },

  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    flex: 1,
  },

  progressBadge: {
    backgroundColor: Colors.light.primary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },

  progressText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.light.primary,
  },

  moodCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.md,
  },

  moodContainer: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },

  moodButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.surface + 'CC',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 90,
  },

  moodEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },

  moodLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.light.textPrimary,
  },

  sessionHeroCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },

  sessionGradient: {
    padding: Spacing.xl,
  },

  sessionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  sessionLeft: {
    flex: 1,
  },

  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.surface + '30',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },

  sessionBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
  },

  sessionTherapist: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.light.surface,
    marginBottom: Spacing.sm,
  },

  sessionTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },

  sessionTime: {
    fontSize: Typography.base,
    color: Colors.light.surface + 'DD',
  },

  sessionRight: {
    alignItems: 'center',
    gap: Spacing.md,
  },

  sessionAvatar: {
    fontSize: 48,
  },

  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },

  joinButtonText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.light.primary,
  },

  tasksCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Shadows.sm,
  },

  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },

  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },

  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  taskCheckboxCompleted: {
    backgroundColor: Colors.light.secondary,
    borderColor: Colors.light.secondary,
  },

  taskIcon: {
    fontSize: 20,
  },

  taskTitle: {
    fontSize: Typography.base,
    color: Colors.light.textPrimary,
    flex: 1,
  },

  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.light.textLight,
  },

  insightCard: {
    backgroundColor: Colors.light.surface,
    borderLeftWidth: 4,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },

  insightTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  insightDescription: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
    lineHeight: Typography.sm * 1.5,
  },

  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },

  quickAction: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    alignItems: 'center',
  },

  quickActionGradient: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  quickActionLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.light.textPrimary,
    textAlign: 'center',
  },

  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.error + '10',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.error + '20',
  },

  emergencyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  emergencyContent: {
    flex: 1,
  },

  emergencyTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.light.error,
    marginBottom: Spacing.xs,
  },

  emergencyDescription: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
  },
});
