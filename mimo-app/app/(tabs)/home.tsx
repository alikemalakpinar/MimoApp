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
  useColorScheme,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Rect } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';

const { width } = Dimensions.get('window');

// Premium Component: Glassmorphism Card
const GlassCard: React.FC<{children: React.ReactNode}> = ({children}) => {
  const scheme = useColorScheme() ?? 'light';
  return (
    <View style={{ borderRadius: BorderRadius.lg, overflow: 'hidden' }}>
      <BlurView intensity={25} tint={scheme === 'dark' ? 'dark' : 'light'} style={{ padding: Spacing.lg }}>
        {children}
      </BlurView>
    </View>
  );
};

// Premium Component: Gradient Frame
const GradientFrame: React.FC<{children: React.ReactNode}> = ({children}) => {
  const scheme = useColorScheme() ?? 'light';
  const T = Colors[scheme];
  
  return (
    <View style={{ padding: 2, borderRadius: BorderRadius.lg, backgroundColor: 'transparent' }}>
      <LinearGradient
        colors={[T.primary, T.accent]}
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 1}}
        style={{ padding: 1, borderRadius: BorderRadius.lg }}
      >
        <View style={{ 
          backgroundColor: T.surface, 
          borderRadius: BorderRadius.lg, 
          padding: Spacing.lg 
        }}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
};

// Premium Component: Pressable with Scale Animation
const PressableScale: React.FC<any> = ({children, style, ...props}) => {
  const scale = useRef(new Animated.Value(1)).current;
  
  return (
    <Pressable
      {...props}
      onPressIn={() => 
        Animated.spring(scale, { 
          toValue: 0.97, 
          useNativeDriver: true 
        }).start()
      }
      onPressOut={() => 
        Animated.spring(scale, { 
          toValue: 1, 
          friction: 5, 
          useNativeDriver: true 
        }).start()
      }
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

// Premium Component: Animated SVG Chart
const AnimatedChart: React.FC<{data: any[]}> = ({data}) => {
  const scheme = useColorScheme() ?? 'light';
  const T = Colors[scheme];
  const animValues = useRef(data.map(() => new Animated.Value(0))).current;
  
  useEffect(() => {
    const animations = animValues.map((anim, index) => 
      Animated.timing(anim, {
        toValue: data[index].value,
        duration: 800,
        delay: index * 100,
        useNativeDriver: false,
      })
    );
    
    Animated.stagger(50, animations).start();
  }, []);

  const chartHeight = 100;
  const chartWidth = data.length * 28;

  return (
    <View style={styles.svgChartContainer}>
      <Svg width={chartWidth} height={chartHeight}>
        {data.map((dayMood, index) => {
          const height = (dayMood.value / 10) * 80;
          return (
            <Rect
              key={index}
              x={index * 28 + 6}
              y={chartHeight - height - 10}
              width={16}
              height={height}
              rx={4}
              fill={T.secondary}
            />
          );
        })}
      </Svg>
      
      <View style={styles.chartLabels}>
        {data.map((dayMood, index) => (
          <View key={index} style={styles.chartLabelItem}>
            <Text style={[styles.chartMood, { color: T.textPrimary }]}>
              {dayMood.mood}
            </Text>
            <Text style={[styles.chartDayLabel, { color: T.textSecondary }]}>
              {dayMood.day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

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
  ],
  communityPosts: [
    {
      id: 'p1',
      text: 'Bugün 10 dk nefes egzersizi yaptım, kendinize de zaman ayırın! 🌸',
      author: 'Anonim',
      supportCount: 12,
      mood: 'happy'
    },
    {
      id: 'p2', 
      text: '3. haftadır düzenli yürüyüş yapıyorum, küçük adımlar büyük değişim!',
      author: 'Anonim',
      supportCount: 8,
      mood: 'motivated'
    },
    {
      id: 'p3',
      text: 'Meditasyon uygulaması sayesinde uyku kalitem arttı ✨',
      author: 'Anonim', 
      supportCount: 15,
      mood: 'peaceful'
    }
  ],
  hasJournalToday: false,
  journalStreak: 4
};

export default function Home() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const T = Colors[scheme];
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  
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
    console.log('Selected mood:', moodValue);
  };

  const getMoodColor = (mood: string) => {
    const moodColors: Record<string, string> = {
      happy: T.secondary,
      motivated: T.accent,
      peaceful: T.primary,
      default: T.textSecondary
    };
    return moodColors[mood] || moodColors.default;
  };

  const sections = ['Özet', 'Topluluk', 'İçerikler'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: T.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      
      {/*  Gradient Background */}
      <LinearGradient
        colors={[T.primary + '08', T.background]}
        start={{x: 0.2, y: 0}} 
        end={{x: 0.8, y: 1}}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Section Tabs */}
      <View style={[styles.sectionTabs, { backgroundColor: T.surface + 'E6' }]}>
        <BlurView intensity={15} tint={scheme === 'dark' ? 'dark' : 'light'} style={styles.tabsContainer}>
          {sections.map((section, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabItem,
                activeSection === index && { backgroundColor: T.primary + '20' }
              ]}
              onPress={() => setActiveSection(index)}
            >
              <Text style={[
                styles.tabText,
                { color: activeSection === index ? T.primary : T.textSecondary }
              ]}>
                {section}
              </Text>
            </TouchableOpacity>
          ))}
        </BlurView>
      </View>
      
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
            <Text style={[styles.greeting, { color: T.textSecondary }]}>Merhaba,</Text>
            <Text style={[styles.userName, { color: T.textPrimary }]}>
              {mockUserData.name} 👋
            </Text>
          </View>
          
          <PressableScale style={styles.profileButton}>
            <View style={[styles.profileAvatar, { backgroundColor: T.primary }]}>
              <Text style={[styles.profileInitial, { color: T.surface }]}>A</Text>
            </View>
          </PressableScale>
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
          <View style={styles.sectionHeader}>
            <Feather name="heart" size={20} color={T.primary} />
            <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>
              Bugün nasıl hissediyorsunuz?
            </Text>
          </View>
          
          <GlassCard>
            <View style={styles.moodContainer}>
              {moods.map((mood) => (
                <PressableScale
                  key={mood.value}
                  style={[
                    styles.moodButton,
                    selectedMood === mood.value && { backgroundColor: T.primary + '20' }
                  ]}
                  onPress={() => handleMoodSelect(mood.value)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={[
                    styles.moodLabel,
                    { color: selectedMood === mood.value ? T.primary : T.textSecondary }
                  ]}>
                    {mood.label}
                  </Text>
                </PressableScale>
              ))}
            </View>

            {selectedMood && (
              <PressableScale 
                style={[styles.moodToJournalButton, { backgroundColor: T.primary }]}
                onPress={() => router.push(`/(tabs)/journal/new?prefillMood=${selectedMood}`)}
              >
                <Feather name="edit-3" size={16} color={T.surface} style={{ marginRight: 8 }} />
                <Text style={[styles.moodToJournalText, { color: T.surface }]}>
                  Günlüğe Aktar
                </Text>
              </PressableScale>
            )}
          </GlassCard>
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
          <View style={styles.sectionHeader}>
            <Feather name="trending-up" size={20} color={T.primary} />
            <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>
              Bu Haftaki Ruh Haliniz
            </Text>
            <Text style={[styles.streakText, { color: T.accent }]}>
              🔥 {mockUserData.moodStreak} gün takip
            </Text>
          </View>
          
          <View style={[styles.chartCard, { backgroundColor: T.surface }]}>
            <AnimatedChart data={mockUserData.weeklyMoods} />
          </View>
        </Animated.View>

        {/* Next Appointment - Premium Glass Card */}
        <Animated.View 
          style={[
            styles.appointmentSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Feather name="calendar" size={20} color={T.primary} />
            <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>
              Yaklaşan Randevu
            </Text>
          </View>
          
          <GradientFrame>
            <PressableScale 
              style={styles.appointmentContent}
              onPress={() => router.push('/(tabs)/appointments')}
            >
              <View style={[styles.appointmentIcon, { backgroundColor: T.primaryLight + '20' }]}>
                <Feather name="user" size={24} color={T.primary} />
              </View>
              
              <View style={styles.appointmentInfo}>
                <Text style={[styles.therapistName, { color: T.textPrimary }]}>
                  {mockUserData.nextAppointment.therapist}
                </Text>
                <Text style={[styles.appointmentDetails, { color: T.textSecondary }]}>
                  {mockUserData.nextAppointment.date} • {mockUserData.nextAppointment.time}
                </Text>
                <Text style={[styles.appointmentType, { color: T.primary }]}>
                  {mockUserData.nextAppointment.type}
                </Text>
              </View>
              
              <View style={[styles.appointmentAction, { backgroundColor: T.primary }]}>
                <Text style={[styles.appointmentActionText, { color: T.surface }]}>Katıl</Text>
              </View>
            </PressableScale>
          </GradientFrame>
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
            <PressableScale style={[styles.statCard, { backgroundColor: T.surface }]}>
              <Text style={[styles.statNumber, { color: T.primary }]}>
                {mockUserData.totalSessions}
              </Text>
              <Text style={[styles.statLabel, { color: T.textSecondary }]}>
                Toplam Seans
              </Text>
            </PressableScale>
            
            <PressableScale style={[styles.statCard, { backgroundColor: T.surface }]}>
              <Text style={[styles.statNumber, { color: T.primary }]}>
                {mockUserData.moodStreak}
              </Text>
              <Text style={[styles.statLabel, { color: T.textSecondary }]}>
                Günlük Takip
              </Text>
            </PressableScale>
            
            <PressableScale style={[styles.statCard, { backgroundColor: T.surface }]}>
              <Text style={[styles.statNumber, { color: T.primary }]}>4.8</Text>
              <Text style={[styles.statLabel, { color: T.textSecondary }]}>
                Değerlendirme
              </Text>
            </PressableScale>
          </View>
        </Animated.View>

        {/* Topluluktan Öne Çıkanlar */}
        <Animated.View 
          style={[
            styles.communitySection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Feather name="users" size={20} color={T.primary} />
            <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>
              Topluluktan Öne Çıkanlar
            </Text>
            <PressableScale onPress={() => router.push('/(tabs)/feed')}>
              <Text style={[styles.seeAllText, { color: T.primaryLight }]}>Tümünü Gör</Text>
            </PressableScale>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.communityContainer}
          >
            {mockUserData.communityPosts.map((post) => (
              <PressableScale 
                key={post.id}
                style={[styles.communityCard, { backgroundColor: T.surface }]}
                onPress={() => router.push('/(tabs)/feed')}
              >
                <LinearGradient
                  colors={[getMoodColor(post.mood), getMoodColor(post.mood) + '80']}
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  style={styles.communityMoodBar}
                />
                
                <Text style={[styles.communityText, { color: T.textPrimary }]} numberOfLines={3}>
                  {post.text}
                </Text>
                
                <View style={styles.communityFooter}>
                  <Text style={[styles.communityAuthor, { color: T.textSecondary }]}>
                    — {post.author}
                  </Text>
                  <View style={[styles.supportChip, { backgroundColor: T.primary + '15' }]}>
                    <Feather name="heart" size={12} color={T.primary} />
                    <Text style={[styles.communitySupportText, { color: T.primary }]}>
                      {post.supportCount}
                    </Text>
                  </View>
                </View>
              </PressableScale>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Günlük CTA Kartı - Premium */}
        <Animated.View 
          style={[
            styles.journalSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <GradientFrame>
            <PressableScale 
              style={styles.journalContent}
              onPress={() => router.push('/(tabs)/journal/new')}
            >
              <View style={[styles.appointmentIcon, { backgroundColor: T.accent + '20' }]}>
                <Feather name="edit-3" size={24} color={T.accent} />
              </View>
              
              <View style={styles.appointmentInfo}>
                <Text style={[styles.therapistName, { color: T.textPrimary }]}>
                  {mockUserData.hasJournalToday 
                    ? 'Günlüğüne Devam Et' 
                    : 'Bugünkü Günlüğünü Yaz'
                  }
                </Text>
                <Text style={[styles.appointmentDetails, { color: T.textSecondary }]}>
                  2–5 dk ayır, zihnini boşalt
                </Text>
                <Text style={[styles.appointmentType, { color: T.accent }]}>
                  🔥 {mockUserData.journalStreak} gün streak • 🔒 Kilitli paylaşım
                </Text>
              </View>
            </PressableScale>
          </GradientFrame>
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
          <View style={styles.sectionHeader}>
            <Feather name="book-open" size={20} color={T.primary} />
            <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>
              Size Özel İçerikler
            </Text>
            <PressableScale>
              <Text style={[styles.seeAllText, { color: T.primaryLight }]}>Tümünü Gör</Text>
            </PressableScale>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.articlesContainer}
          >
            {mockUserData.recentArticles.map((article) => (
              <PressableScale 
                key={article.id}
                style={[styles.articleCard, { backgroundColor: T.surface }]}
              >
                <View style={[styles.articleIcon, { backgroundColor: article.color + '20' }]}>
                  <View style={[styles.articleIconInner, { backgroundColor: article.color }]} />
                </View>
                
                <View style={styles.articleContent}>
                  <Text style={[styles.articleCategory, { color: T.textSecondary }]}>
                    {article.category}
                  </Text>
                  <Text style={[styles.articleTitle, { color: T.textPrimary }]}>
                    {article.title}
                  </Text>
                  <View style={styles.articleFooter}>
                    <Feather name="clock" size={12} color={T.textLight} />
                    <Text style={[styles.articleReadTime, { color: T.textLight }]}>
                      {article.readTime}
                    </Text>
                  </View>
                </View>
              </PressableScale>
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
          <View style={styles.sectionHeader}>
            <Feather name="zap" size={20} color={T.primary} />
            <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>
              Hızlı İşlemler
            </Text>
          </View>
          
          <View style={styles.quickActionsContainer}>
            <PressableScale 
              style={[styles.quickActionButton, { backgroundColor: T.surface }]}
              onPress={() => router.push('/(tabs)/appointments')}
            >
              <Feather name="calendar" size={24} color={T.primary} style={{ marginBottom: 8 }} />
              <Text style={[styles.quickActionText, { color: T.textPrimary }]}>
                Randevu Al
              </Text>
            </PressableScale>
            
            <PressableScale 
              style={[styles.quickActionButton, { backgroundColor: T.surface }]}
              onPress={() => router.push('/(tabs)/chat')}
            >
              <Feather name="message-circle" size={24} color={T.primary} style={{ marginBottom: 8 }} />
              <Text style={[styles.quickActionText, { color: T.textPrimary }]}>
                Mesaj Gönder
              </Text>
            </PressableScale>

            <PressableScale 
              style={[styles.quickActionButton, { backgroundColor: T.surface }]}
              onPress={() => router.push('/(tabs)/journal/new')}
            >
              <Feather name="edit-3" size={24} color={T.primary} style={{ marginBottom: 8 }} />
              <Text style={[styles.quickActionText, { color: T.textPrimary }]}>
                Günlük Yaz
              </Text>
            </PressableScale>
            
            <PressableScale style={[styles.quickActionButton, { backgroundColor: T.surface }]}>
              <Feather name="phone" size={24} color={T.error} style={{ marginBottom: 8 }} />
              <Text style={[styles.quickActionText, { color: T.textPrimary }]}>
                Acil Destek
              </Text>
            </PressableScale>
            
            <PressableScale style={[styles.quickActionButton, { backgroundColor: T.surface }]}>
              <Feather name="bar-chart-2" size={24} color={T.primary} style={{ marginBottom: 8 }} />
              <Text style={[styles.quickActionText, { color: T.textPrimary }]}>
                Raporlarım
              </Text>
            </PressableScale>
            
            <PressableScale 
              style={[styles.quickActionButton, { backgroundColor: T.surface }]}
              onPress={() => router.push('/(tabs)/feed')}
            >
              <Feather name="users" size={24} color={T.primary} style={{ marginBottom: 8 }} />
              <Text style={[styles.quickActionText, { color: T.textPrimary }]}>
                Topluluk
              </Text>
            </PressableScale>
          </View>
        </Animated.View>

      </ScrollView>

      {/* Premium FAB - Günlük Yaz */}
      <PressableScale 
        style={[styles.fab, { backgroundColor: T.primary }]}
        onPress={() => router.push('/(tabs)/journal/new')}
      >
        <Feather name="edit-3" size={24} color={T.surface} />
      </PressableScale>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl + 70,
    paddingTop: 60, // Section tabs için space
  },

  // Premium Section Tabs
  sectionTabs: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },

  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },

  tabItem: {
    flex: 1,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
  },

  tabText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
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
    lineHeight: Math.round(Typography.base * 1.35),
  },

  userName: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    lineHeight: Math.round(Typography.xxl * 1.2),
  },

  profileButton: {
    padding: Spacing.xs,
  },

  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileInitial: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },

  moodSection: {
    marginBottom: Spacing.xl,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    marginLeft: Spacing.sm,
    flex: 1,
  },

  streakText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },

  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },

  moodButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },

  moodEmoji: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },

  moodLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },

  moodToJournalButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },

  moodToJournalText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },

  chartSection: {
    marginBottom: Spacing.xl,
  },

  chartCard: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    ...Shadows.sm,
  },

  svgChartContainer: {
    alignItems: 'center',
  },

  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },

  chartLabelItem: {
    alignItems: 'center',
  },

  chartMood: {
    fontSize: 16,
    marginBottom: 4,
  },

  chartDayLabel: {
    fontSize: Typography.xs,
  },

  appointmentSection: {
    marginBottom: Spacing.xl,
  },

  appointmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  appointmentIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  appointmentInfo: {
    flex: 1,
  },

  therapistName: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    marginBottom: Spacing.xs,
  },

  appointmentDetails: {
    fontSize: Typography.sm,
    marginBottom: Spacing.xs,
  },

  appointmentType: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },

  appointmentAction: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },

  appointmentActionText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },

  statsSection: {
    marginBottom: Spacing.xl,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.xs,
    ...Shadows.sm,
  },

  statNumber: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    marginBottom: Spacing.xs,
  },

  statLabel: {
    fontSize: Typography.sm,
  },

  communitySection: {
    marginBottom: Spacing.xl,
  },

  seeAllText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },

  communityContainer: {
    paddingVertical: Spacing.md,
  },

  communityCard: {
    width: width * 0.7,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginRight: Spacing.lg,
    ...Shadows.sm,
  },

  communityMoodBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
  },

  communityText: {
    fontSize: Typography.sm,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },

  communityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  communityAuthor: {
    fontSize: Typography.xs,
    fontStyle: 'italic',
  },

  supportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
  },

  communitySupportText: {
    fontSize: Typography.xs,
    marginLeft: 4,
  },

  journalSection: {
    marginBottom: Spacing.xl,
  },

  journalContent: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingVertical: Spacing.md,
  },

  articlesSection: {
    marginBottom: Spacing.xl,
  },

  articlesContainer: {
    paddingVertical: Spacing.md,
  },

  articleCard: {
    width: width * 0.6,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginRight: Spacing.lg,
    ...Shadows.sm,
  },

  articleIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  articleIconInner: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.sm,
  },

  articleContent: {
    flex: 1,
  },

  articleCategory: {
    fontSize: Typography.xs,
    marginBottom: Spacing.xs,
  },

  articleTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    marginBottom: Spacing.md,
  },

  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  articleReadTime: {
    fontSize: Typography.xs,
    marginLeft: 4,
  },

  quickActionsSection: {
    marginBottom: Spacing.xl,
  },

  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  quickActionButton: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 3 - Spacing.xs,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },

  quickActionText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    textAlign: 'center',
  },

  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
});