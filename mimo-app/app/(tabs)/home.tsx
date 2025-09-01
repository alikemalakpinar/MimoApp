// app/(tabs)/home.tsx
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
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';

const { width } = Dimensions.get('window');

// Mock data - gerçek API'den gelecek
const mockUserData = {
  name: 'Ayşe',
  nextAppointment: {
    therapist: 'Dr. Mehmet Yılmaz',
    date: '15 Şubat',
    time: '14:00',
    type: 'Görüntülü Görüşme'
  },
  moodStreak: 7,
  totalSessions: 12,
  weeklyMoods: [
    { day: 'Pt', mood: '😊', value: 8 },
    { day: 'Sa', mood: '😐', value: 6 },
    { day: 'Ça', mood: '😊', value: 8 },
    { day: 'Pe', mood: '😔', value: 4 },
    { day: 'Cu', mood: '😊', value: 8 },
    { day: 'Ct', mood: '😊', value: 9 },
    { day: 'Pz', mood: '😊', value: 8 }
  ],
  recentArticles: [
    {
      id: 1,
      title: 'Stresle Başa Çıkma Yöntemleri',
      category: 'Stres Yönetimi',
      readTime: '5 dk',
      color: Colors.light.secondary
    },
    {
      id: 2,
      title: 'Uyku Kalitesini Artırmanın Yolları',
      category: 'Yaşam Tarzı',
      readTime: '7 dk',
      color: Colors.light.accent
    }
  ]
};

export default function Home() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const moods = [
    { emoji: '😊', label: 'Mutlu', value: 'happy' },
    { emoji: '😐', label: 'Normal', value: 'neutral' },
    { emoji: '😔', label: 'Üzgün', value: 'sad' },
    { emoji: '😰', label: 'Stresli', value: 'stressed' },
    { emoji: '😴', label: 'Yorgun', value: 'tired' }
  ];

  const handleMoodSelect = (moodValue: string) => {
    setSelectedMood(moodValue);
    // TODO: API'ye mood kaydedilecek
    console.log('Selected mood:', moodValue);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View>
            <Text style={styles.greeting}>Merhaba,</Text>
            <Text style={styles.userName}>{mockUserData.name} 👋</Text>
          </View>
          
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>A</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Daily Mood Tracker */}
        <Animated.View 
          style={[
            styles.moodSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Bugün nasıl hissediyorsunuz?</Text>
          
          <View style={styles.moodContainer}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                style={[
                  styles.moodButton,
                  selectedMood === mood.value && styles.moodButtonSelected
                ]}
                onPress={() => handleMoodSelect(mood.value)}
                activeOpacity={0.7}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[
                  styles.moodLabel,
                  selectedMood === mood.value && styles.moodLabelSelected
                ]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Weekly Mood Chart */}
        <Animated.View 
          style={[
            styles.chartSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Bu Haftaki Ruh Haliniz</Text>
            <Text style={styles.streakText}>
              🔥 {mockUserData.moodStreak} gün takip
            </Text>
          </View>
          
          <View style={styles.chartContainer}>
            {mockUserData.weeklyMoods.map((dayMood, index) => (
              <View key={index} style={styles.chartDay}>
                <View style={[
                  styles.chartBar,
                  { height: (dayMood.value / 10) * 80 }
                ]} />
                <Text style={styles.chartMood}>{dayMood.mood}</Text>
                <Text style={styles.chartDayLabel}>{dayMood.day}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Next Appointment */}
        <Animated.View 
          style={[
            styles.appointmentSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Yaklaşan Randevu</Text>
          
          <TouchableOpacity 
            style={styles.appointmentCard}
            onPress={() => router.push('/(tabs)/appointments')}
            activeOpacity={0.9}
          >
            <View style={styles.appointmentIcon}>
              <Text style={styles.appointmentEmoji}>👨‍⚕️</Text>
            </View>
            
            <View style={styles.appointmentInfo}>
              <Text style={styles.therapistName}>
                {mockUserData.nextAppointment.therapist}
              </Text>
              <Text style={styles.appointmentDetails}>
                {mockUserData.nextAppointment.date} • {mockUserData.nextAppointment.time}
              </Text>
              <Text style={styles.appointmentType}>
                {mockUserData.nextAppointment.type}
              </Text>
            </View>
            
            <TouchableOpacity style={styles.appointmentAction}>
              <Text style={styles.appointmentActionText}>Katıl</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View 
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{mockUserData.totalSessions}</Text>
              <Text style={styles.statLabel}>Toplam Seans</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{mockUserData.moodStreak}</Text>
              <Text style={styles.statLabel}>Günlük Takip</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Değerlendirme</Text>
            </View>
          </View>
        </Animated.View>

        {/* Recommended Articles */}
        <Animated.View 
          style={[
            styles.articlesSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.articleHeader}>
            <Text style={styles.sectionTitle}>Size Özel İçerikler</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.articlesContainer}
          >
            {mockUserData.recentArticles.map((article) => (
              <TouchableOpacity 
                key={article.id}
                style={styles.articleCard}
                activeOpacity={0.9}
              >
                <View style={[styles.articleIcon, { backgroundColor: article.color + '20' }]}>
                  <View style={[styles.articleIconInner, { backgroundColor: article.color }]} />
                </View>
                
                <View style={styles.articleContent}>
                  <Text style={styles.articleCategory}>{article.category}</Text>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <Text style={styles.articleReadTime}>📖 {article.readTime}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          style={[
            styles.quickActionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/(tabs)/appointments')}
            >
              <Text style={styles.quickActionIcon}>📅</Text>
              <Text style={styles.quickActionText}>Randevu Al</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/(tabs)/chat')}
            >
              <Text style={styles.quickActionIcon}>💬</Text>
              <Text style={styles.quickActionText}>Mesaj Gönder</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>🆘</Text>
              <Text style={styles.quickActionText}>Acil Destek</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>Raporlarım</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },

  greeting: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
  },

  userName: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
  },

  profileButton: {
    padding: Spacing.xs,
  },

  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },

  profileInitial: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.surface,
  },

  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  // Mood Tracker Styles
  moodSection: {
    marginBottom: Spacing.xl,
  },

  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },

  moodButton: {
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 50,
  },

  moodButtonSelected: {
    backgroundColor: Colors.light.primary + '20',
  },

  moodEmoji: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },

  moodLabel: {
    fontSize: Typography.xs,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },

  moodLabelSelected: {
    color: Colors.light.primary,
    fontWeight: Typography.semibold,
  },

  // Chart Styles
  chartSection: {
    marginBottom: Spacing.xl,
  },

  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  streakText: {
    fontSize: Typography.sm,
    color: Colors.light.accent,
    fontWeight: Typography.medium,
  },

  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },

  chartDay: {
    alignItems: 'center',
    flex: 1,
  },

  chartBar: {
    width: 16,
    backgroundColor: Colors.light.secondary,
    borderRadius: BorderRadius.xs,
    marginBottom: Spacing.sm,
  },

  chartMood: {
    fontSize: Typography.sm,
    marginBottom: Spacing.xs,
  },

  chartDayLabel: {
    fontSize: Typography.xs,
    color: Colors.light.textSecondary,
  },

  // Appointment Styles
  appointmentSection: {
    marginBottom: Spacing.xl,
  },

  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },

  appointmentIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  appointmentEmoji: {
    fontSize: 24,
  },

  appointmentInfo: {
    flex: 1,
  },

  therapistName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  appointmentDetails: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },

  appointmentType: {
    fontSize: Typography.xs,
    color: Colors.light.primary,
    fontWeight: Typography.medium,
  },

  appointmentAction: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },

  appointmentActionText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
  },

  // Stats Styles
  statsSection: {
    marginBottom: Spacing.xl,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statCard: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    ...Shadows.sm,
  },

  statNumber: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.primary,
    marginBottom: Spacing.xs,
  },

  statLabel: {
    fontSize: Typography.xs,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },

  // Articles Styles
  articlesSection: {
    marginBottom: Spacing.xl,
  },

  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  seeAllText: {
    fontSize: Typography.sm,
    color: Colors.light.primaryLight,
    fontWeight: Typography.medium,
  },

  articlesContainer: {
    paddingRight: Spacing.lg,
  },

  articleCard: {
    width: width * 0.7,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginRight: Spacing.md,
    ...Shadows.sm,
  },

  articleIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  articleIconInner: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.xs,
  },

  articleContent: {
    flex: 1,
  },

  articleCategory: {
    fontSize: Typography.xs,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },

  articleTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
    lineHeight: Typography.base * Typography.lineHeight.tight,
  },

  articleReadTime: {
    fontSize: Typography.xs,
    color: Colors.light.textLight,
  },

  // Quick Actions Styles
  quickActionsSection: {
    marginBottom: Spacing.xl,
  },

  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  quickActionButton: {
    width: (width - (Spacing.lg * 2) - Spacing.md) / 2,
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },

  quickActionIcon: {
    fontSize: 28,
    marginBottom: Spacing.sm,
  },

  quickActionText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.light.textPrimary,
    textAlign: 'center',
  },
});