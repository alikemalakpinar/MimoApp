// app/(tabs)/profile.tsx - HOLISTIC WELLNESS PROFILE 2026
// Featuring: Wellness dashboard, animated avatar aura, bento grid, journey visualization, social healing
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import Svg, { Circle, Defs, RadialGradient, Stop, Path } from 'react-native-svg';
import { Colors, Spacing, BorderRadius, Shadows, useThemeStore } from '../../shared/theme';

const { width, height } = Dimensions.get('window');
const AVATAR_SIZE = 120;

// ============================================
// ANIMATED AVATAR WITH AURA
// ============================================
const AvatarWithAura: React.FC<{
  initials: string;
  level: number;
  mood: 'calm' | 'happy' | 'energetic' | 'focused';
}> = ({ initials, level, mood }) => {
  const { isDarkMode } = useThemeStore();
  const pulseAnim1 = useRef(new Animated.Value(1)).current;
  const pulseAnim2 = useRef(new Animated.Value(1)).current;
  const pulseAnim3 = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const getMoodColors = () => {
    switch (mood) {
      case 'calm': return { primary: '#06B6D4', secondary: '#14B8A6', glow: '#22D3EE' };
      case 'happy': return { primary: '#10B981', secondary: '#34D399', glow: '#6EE7B7' };
      case 'energetic': return { primary: '#F59E0B', secondary: '#FBBF24', glow: '#FCD34D' };
      case 'focused': return { primary: '#6366F1', secondary: '#8B5CF6', glow: '#A78BFA' };
    }
  };

  const moodColors = getMoodColors();

  useEffect(() => {
    // Aura pulse animations
    const createPulseAnimation = (anim: Animated.Value, delay: number, scale: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: scale, duration: 2000, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        ])
      );
    };

    createPulseAnimation(pulseAnim1, 0, 1.15).start();
    createPulseAnimation(pulseAnim2, 500, 1.25).start();
    createPulseAnimation(pulseAnim3, 1000, 1.35).start();

    // Slow rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.avatarAuraContainer}>
      {/* Outer Aura Rings */}
      <Animated.View
        style={[
          styles.auraRing,
          styles.auraRing3,
          {
            transform: [{ scale: pulseAnim3 }, { rotate: rotateInterpolate }],
            borderColor: moodColors.glow + '20',
          },
        ]}
      />
      <Animated.View
        style={[
          styles.auraRing,
          styles.auraRing2,
          {
            transform: [{ scale: pulseAnim2 }],
            borderColor: moodColors.glow + '30',
          },
        ]}
      />
      <Animated.View
        style={[
          styles.auraRing,
          styles.auraRing1,
          {
            transform: [{ scale: pulseAnim1 }],
            borderColor: moodColors.glow + '40',
          },
        ]}
      />

      {/* Main Avatar */}
      <LinearGradient
        colors={[moodColors.primary, moodColors.secondary]}
        style={styles.avatarGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.avatarInner, { backgroundColor: isDarkMode ? '#1A1A2E' : '#FFFFFF' }]}>
          <LinearGradient
            colors={[moodColors.primary, moodColors.secondary]}
            style={styles.avatarContent}
          >
            <Text style={styles.avatarInitials}>{initials}</Text>
          </LinearGradient>
        </View>
      </LinearGradient>

      {/* Level Badge */}
      <View style={[styles.levelBadge, { backgroundColor: moodColors.primary }]}>
        <Text style={styles.levelText}>{level}</Text>
      </View>
    </View>
  );
};

// ============================================
// WELLNESS SCORE RING
// ============================================
const WellnessScoreRing: React.FC<{
  score: number;
  label: string;
  color: string;
  size?: number;
}> = ({ score, label, color, size = 80 }) => {
  const { isDarkMode } = useThemeStore();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: score,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    animatedValue.addListener(({ value }) => {
      setDisplayScore(Math.round(value));
    });

    return () => animatedValue.removeAllListeners();
  }, [score]);

  const circumference = 2 * Math.PI * ((size - 8) / 2);
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <View style={[styles.scoreRingContainer, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 8) / 2}
          stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
          strokeWidth={4}
          fill="none"
        />
        {/* Progress ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 8) / 2}
          stroke={color}
          strokeWidth={4}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.scoreRingCenter}>
        <Text style={[styles.scoreValue, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
          {displayScore}
        </Text>
      </View>
      <Text style={[styles.scoreLabel, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }]}>
        {label}
      </Text>
    </View>
  );
};

// ============================================
// BENTO STAT CARD
// ============================================
const BentoStatCard: React.FC<{
  icon: string;
  value: string;
  label: string;
  gradient: string[];
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
}> = ({ icon, value, label, gradient, size = 'medium', onPress }) => {
  const { isDarkMode } = useThemeStore();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, friction: 8, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }).start();
  };

  const getCardStyle = () => {
    switch (size) {
      case 'small': return styles.bentoSmall;
      case 'large': return styles.bentoLarge;
      default: return styles.bentoMedium;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.bentoCard,
          getCardStyle(),
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <BlurView intensity={isDarkMode ? 30 : 50} tint={isDarkMode ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={gradient}
          style={styles.bentoGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.bentoContent}>
          <View style={[styles.bentoIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Feather name={icon as any} size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.bentoValue}>{value}</Text>
          <Text style={styles.bentoLabel}>{label}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ============================================
// JOURNEY TIMELINE
// ============================================
const JourneyTimeline: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  const milestones = [
    { id: '1', title: 'İlk Meditasyon', date: '15 Kas', completed: true, icon: 'sun' },
    { id: '2', title: '7 Gün Seri', date: '22 Kas', completed: true, icon: 'zap' },
    { id: '3', title: 'İlk Terapi', date: '1 Ara', completed: true, icon: 'heart' },
    { id: '4', title: '30 Gün', date: 'Devam ediyor', completed: false, icon: 'award' },
  ];

  return (
    <View style={styles.journeyContainer}>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
        Yolculuğum
      </Text>
      <View style={styles.timeline}>
        {milestones.map((milestone, index) => (
          <View key={milestone.id} style={styles.timelineItem}>
            {/* Connector Line */}
            {index < milestones.length - 1 && (
              <View
                style={[
                  styles.timelineLine,
                  {
                    backgroundColor: milestone.completed
                      ? '#10B981'
                      : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                  },
                ]}
              />
            )}
            {/* Node */}
            <View
              style={[
                styles.timelineNode,
                {
                  backgroundColor: milestone.completed ? '#10B981' : 'transparent',
                  borderColor: milestone.completed
                    ? '#10B981'
                    : (isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'),
                },
              ]}
            >
              <Feather
                name={milestone.icon as any}
                size={16}
                color={milestone.completed ? '#FFFFFF' : (isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)')}
              />
            </View>
            {/* Content */}
            <View style={styles.timelineContent}>
              <Text
                style={[
                  styles.timelineTitle,
                  {
                    color: milestone.completed
                      ? (isDarkMode ? '#FFFFFF' : '#1A1A2E')
                      : (isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'),
                  },
                ]}
              >
                {milestone.title}
              </Text>
              <Text style={[styles.timelineDate, { color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }]}>
                {milestone.date}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// ============================================
// HEALING CONNECTIONS
// ============================================
const HealingConnections: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  const connections = [
    { id: '1', name: 'Dr. Elif', role: 'Terapist', initials: 'EY', gradient: ['#6366F1', '#8B5CF6'] },
    { id: '2', name: 'Can', role: 'Grup Arkadaşı', initials: 'C', gradient: ['#10B981', '#34D399'] },
    { id: '3', name: 'Ayşe', role: 'Wellness Buddy', initials: 'A', gradient: ['#F59E0B', '#FBBF24'] },
  ];

  return (
    <View style={styles.connectionsContainer}>
      <View style={styles.connectionsHeader}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
          Healing Çemberi
        </Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Tümü</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.connectionsScroll}>
        {connections.map((connection) => (
          <TouchableOpacity key={connection.id} style={styles.connectionItem} activeOpacity={0.8}>
            <LinearGradient
              colors={connection.gradient}
              style={styles.connectionAvatar}
            >
              <Text style={styles.connectionInitials}>{connection.initials}</Text>
            </LinearGradient>
            <Text style={[styles.connectionName, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
              {connection.name}
            </Text>
            <Text style={[styles.connectionRole, { color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }]}>
              {connection.role}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addConnectionItem} activeOpacity={0.8}>
          <View style={[styles.addConnectionCircle, { borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }]}>
            <Feather name="plus" size={24} color={isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'} />
          </View>
          <Text style={[styles.connectionName, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }]}>
            Ekle
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// ============================================
// QUICK ACTION BUTTON
// ============================================
const QuickActionButton: React.FC<{
  icon: string;
  label: string;
  onPress: () => void;
}> = ({ icon, label, onPress }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.quickActionIcon, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
        <Feather name={icon as any} size={20} color={isDarkMode ? '#FFFFFF' : '#1A1A2E'} />
      </View>
      <Text style={[styles.quickActionLabel, { color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ============================================
// MAIN PROFILE SCREEN
// ============================================
export default function Profile() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const scrollY = useRef(new Animated.Value(0)).current;

  const mockUser = {
    name: 'Ayşe Yılmaz',
    username: '@ayseyilmaz',
    initials: 'AY',
    bio: 'Mental sağlık yolculuğunda. Mindfulness & meditasyon pratisyeni.',
    level: 12,
    mood: 'calm' as const,
    joinDate: 'Kasım 2024',
    totalDays: 45,
    currentStreak: 12,
    totalSessions: 156,
    wellnessScore: 78,
    mindScore: 82,
    bodyScore: 71,
    socialScore: 85,
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış', style: 'destructive', onPress: () => router.replace('/(auth)/welcome') },
      ]
    );
  };

  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0A0A15' : '#F8F9FC' }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Background */}
      <LinearGradient
        colors={isDarkMode
          ? ['#0A0A15', '#1A1A2E', '#0A0A15']
          : ['#F8F9FC', '#EEF2FF', '#F8F9FC']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
            onPress={() => router.push('/(patient)/settings')}
          >
            <Feather name="settings" size={20} color={isDarkMode ? '#FFFFFF' : '#1A1A2E'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
            onPress={() => {}}
          >
            <Feather name="share-2" size={20} color={isDarkMode ? '#FFFFFF' : '#1A1A2E'} />
          </TouchableOpacity>
        </View>

        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {/* Avatar Section */}
          <Animated.View style={[styles.avatarSection, { transform: [{ scale: headerScale }] }]}>
            <AvatarWithAura
              initials={mockUser.initials}
              level={mockUser.level}
              mood={mockUser.mood}
            />
            <Text style={[styles.userName, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
              {mockUser.name}
            </Text>
            <Text style={[styles.userHandle, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }]}>
              {mockUser.username}
            </Text>
            <Text style={[styles.userBio, { color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }]}>
              {mockUser.bio}
            </Text>
          </Animated.View>

          {/* Quick Actions */}
          <View style={styles.quickActionsRow}>
            <QuickActionButton icon="edit-2" label="Düzenle" onPress={() => {}} />
            <QuickActionButton icon="award" label="Başarılar" onPress={() => router.push('/(patient)/achievements')} />
            <QuickActionButton icon="bar-chart-2" label="İstatistik" onPress={() => {}} />
            <QuickActionButton icon="bookmark" label="Kaydedilenler" onPress={() => {}} />
          </View>

          {/* Wellness Scores */}
          <View style={styles.wellnessSection}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
              Wellness Skoru
            </Text>
            <View style={styles.scoresGrid}>
              <WellnessScoreRing score={mockUser.wellnessScore} label="Genel" color="#6366F1" size={100} />
              <View style={styles.subScores}>
                <WellnessScoreRing score={mockUser.mindScore} label="Zihin" color="#10B981" size={70} />
                <WellnessScoreRing score={mockUser.bodyScore} label="Beden" color="#F59E0B" size={70} />
                <WellnessScoreRing score={mockUser.socialScore} label="Sosyal" color="#EC4899" size={70} />
              </View>
            </View>
          </View>

          {/* Bento Stats Grid */}
          <View style={styles.bentoGrid}>
            <View style={styles.bentoRow}>
              <BentoStatCard
                icon="zap"
                value={`${mockUser.currentStreak}`}
                label="Gün Seri"
                gradient={['#F59E0B', '#FBBF24']}
                size="medium"
              />
              <BentoStatCard
                icon="calendar"
                value={`${mockUser.totalDays}`}
                label="Toplam Gün"
                gradient={['#10B981', '#34D399']}
                size="medium"
              />
            </View>
            <View style={styles.bentoRow}>
              <BentoStatCard
                icon="activity"
                value={`${mockUser.totalSessions}`}
                label="Seans"
                gradient={['#6366F1', '#8B5CF6']}
                size="medium"
              />
              <BentoStatCard
                icon="award"
                value="Seviye 12"
                label="Master"
                gradient={['#EC4899', '#F472B6']}
                size="medium"
              />
            </View>
          </View>

          {/* Journey Timeline */}
          <JourneyTimeline />

          {/* Healing Connections */}
          <HealingConnections />

          {/* Settings & Actions */}
          <View style={styles.settingsSection}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
              Ayarlar
            </Text>
            {[
              { icon: 'bell', label: 'Bildirimler', hasArrow: true },
              { icon: 'lock', label: 'Gizlilik', hasArrow: true },
              { icon: 'moon', label: 'Görünüm', hasArrow: true },
              { icon: 'help-circle', label: 'Yardım & Destek', hasArrow: true },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.settingsItem, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}
                activeOpacity={0.8}
              >
                <View style={[styles.settingsIcon, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                  <Feather name={item.icon as any} size={18} color={isDarkMode ? '#FFFFFF' : '#1A1A2E'} />
                </View>
                <Text style={[styles.settingsLabel, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
                  {item.label}
                </Text>
                {item.hasArrow && (
                  <Feather name="chevron-right" size={18} color={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'} />
                )}
              </TouchableOpacity>
            ))}

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
              <Feather name="log-out" size={18} color="#EF4444" />
              <Text style={styles.logoutText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)' }]}>
              Ora v2.0.0 • {mockUser.joinDate}'dan beri üye
            </Text>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  avatarAuraContainer: {
    width: AVATAR_SIZE + 60,
    height: AVATAR_SIZE + 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  auraRing: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 100,
  },
  auraRing1: {
    width: AVATAR_SIZE + 20,
    height: AVATAR_SIZE + 20,
  },
  auraRing2: {
    width: AVATAR_SIZE + 40,
    height: AVATAR_SIZE + 40,
  },
  auraRing3: {
    width: AVATAR_SIZE + 60,
    height: AVATAR_SIZE + 60,
  },
  avatarGradient: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    padding: 4,
  },
  avatarInner: {
    flex: 1,
    borderRadius: AVATAR_SIZE / 2 - 4,
    overflow: 'hidden',
  },
  avatarContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  levelText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  userHandle: {
    fontSize: 14,
    marginTop: 4,
  },
  userBio: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
    paddingHorizontal: 20,
  },

  // Quick Actions
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Wellness Section
  wellnessSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  scoresGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  subScores: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreRingContainer: {
    alignItems: 'center',
  },
  scoreRingCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },

  // Bento Grid
  bentoGrid: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bentoSmall: {
    height: 80,
  },
  bentoMedium: {
    height: 100,
  },
  bentoLarge: {
    height: 140,
  },
  bentoGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  bentoContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  bentoIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bentoValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bentoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },

  // Journey Timeline
  journeyContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  timelineLine: {
    position: 'absolute',
    left: 18,
    top: 36,
    width: 2,
    height: 40,
  },
  timelineNode: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 6,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  timelineDate: {
    fontSize: 12,
    marginTop: 2,
  },

  // Connections
  connectionsContainer: {
    marginBottom: 24,
  },
  connectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  connectionsScroll: {
    paddingLeft: 24,
  },
  connectionItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  connectionAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  connectionInitials: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  connectionName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  connectionRole: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
  addConnectionItem: {
    alignItems: 'center',
    marginRight: 24,
    width: 80,
  },
  addConnectionCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  // Settings
  settingsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 8,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    gap: 10,
    backgroundColor: 'rgba(239,68,68,0.1)',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },

  // Version
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
  },
});
