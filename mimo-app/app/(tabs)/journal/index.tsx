// app/(tabs)/journal/index.tsx - IMMERSIVE MY JOURNEY 2026 EXPERIENCE
// Featuring: AI-powered insights, 3D mood orb, voice journaling, time capsules, emotion timeline
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  Platform,
  PanResponder,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import Svg, { Circle, Defs, RadialGradient, Stop, Path, G, Ellipse, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import { Colors, Spacing, BorderRadius, Shadows, useThemeStore } from '../../../shared/theme';

const { width, height } = Dimensions.get('window');
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

// ============================================
// 3D MOOD ORB - Interactive mood visualization
// ============================================
const MoodOrb: React.FC<{
  mood: number; // 0-100
  onMoodChange?: (mood: number) => void;
}> = ({ mood, onMoodChange }) => {
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [currentMood, setCurrentMood] = useState(mood);
  const { isDarkMode } = useThemeStore();

  // Mood color interpolation
  const getMoodColor = (value: number) => {
    if (value <= 20) return { primary: '#8B5CF6', secondary: '#6366F1', glow: '#A78BFA' }; // Sad - Purple
    if (value <= 40) return { primary: '#6366F1', secondary: '#3B82F6', glow: '#818CF8' }; // Anxious - Indigo
    if (value <= 60) return { primary: '#06B6D4', secondary: '#14B8A6', glow: '#22D3EE' }; // Calm - Cyan
    if (value <= 80) return { primary: '#10B981', secondary: '#34D399', glow: '#6EE7B7' }; // Happy - Green
    return { primary: '#F59E0B', secondary: '#FBBF24', glow: '#FCD34D' }; // Energetic - Amber
  };

  const moodColors = getMoodColor(currentMood);

  useEffect(() => {
    // Breathing animation
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Glow pulse
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Rotation
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    breathe.start();
    glow.start();
    rotate.start();

    return () => {
      breathe.stop();
      glow.stop();
      rotate.stop();
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newMood = Math.max(0, Math.min(100, currentMood - gestureState.dy / 3));
        setCurrentMood(newMood);
      },
      onPanResponderRelease: () => {
        onMoodChange?.(currentMood);
        Animated.spring(pulseAnim, {
          toValue: 1.15,
          friction: 3,
          useNativeDriver: true,
        }).start(() => {
          Animated.spring(pulseAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
          }).start();
        });
      },
    })
  ).current;

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.orbContainer} {...panResponder.panHandlers}>
      {/* Outer Glow */}
      <Animated.View
        style={[
          styles.orbGlow,
          {
            opacity: glowAnim,
            transform: [{ scale: breatheAnim }],
            shadowColor: moodColors.glow,
          },
        ]}
      >
        <LinearGradient
          colors={[moodColors.glow + '60', moodColors.glow + '00']}
          style={styles.orbGlowGradient}
        />
      </Animated.View>

      {/* Main Orb */}
      <Animated.View
        style={[
          styles.orbMain,
          {
            transform: [
              { scale: Animated.multiply(breatheAnim, pulseAnim) },
              { rotate: rotateInterpolate },
            ],
          },
        ]}
      >
        <Svg width={180} height={180} viewBox="0 0 180 180">
          <Defs>
            <RadialGradient id="orbGradient" cx="50%" cy="30%" r="60%">
              <Stop offset="0%" stopColor={moodColors.primary} stopOpacity={1} />
              <Stop offset="50%" stopColor={moodColors.secondary} stopOpacity={0.9} />
              <Stop offset="100%" stopColor={moodColors.primary} stopOpacity={0.7} />
            </RadialGradient>
            <RadialGradient id="orbHighlight" cx="35%" cy="25%" r="40%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.6} />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx="90" cy="90" r="85" fill="url(#orbGradient)" />
          <Circle cx="90" cy="90" r="85" fill="url(#orbHighlight)" />
          {/* Inner ring patterns */}
          <Circle cx="90" cy="90" r="70" fill="none" stroke={moodColors.glow} strokeWidth="0.5" strokeOpacity={0.3} />
          <Circle cx="90" cy="90" r="55" fill="none" stroke={moodColors.glow} strokeWidth="0.5" strokeOpacity={0.2} />
        </Svg>
      </Animated.View>

      {/* Mood Value */}
      <View style={styles.orbValue}>
        <Text style={[styles.orbValueText, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
          {Math.round(currentMood)}
        </Text>
        <Text style={[styles.orbValueLabel, { color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }]}>
          {currentMood <= 20 ? 'Düşük' : currentMood <= 40 ? 'Kaygılı' : currentMood <= 60 ? 'Sakin' : currentMood <= 80 ? 'İyi' : 'Harika'}
        </Text>
      </View>

      {/* Hint */}
      <View style={styles.orbHint}>
        <Feather name="chevrons-up" size={16} color={isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'} />
        <Text style={[styles.orbHintText, { color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }]}>
          Kaydır
        </Text>
      </View>
    </View>
  );
};

// ============================================
// TIME CAPSULE CARD - Future message to self
// ============================================
const TimeCapsuleCard: React.FC<{
  onPress: () => void;
}> = ({ onPress }) => {
  const { isDarkMode } = useThemeStore();
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View style={[styles.timeCapsule, { transform: [{ translateY }] }]}>
        <BlurView intensity={isDarkMode ? 40 : 80} tint={isDarkMode ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={isDarkMode
            ? ['rgba(139,92,246,0.3)', 'rgba(99,102,241,0.2)']
            : ['rgba(139,92,246,0.15)', 'rgba(99,102,241,0.1)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.timeCapsuleContent}>
          <View style={styles.timeCapsuleIcon}>
            <Feather name="gift" size={24} color="#8B5CF6" />
          </View>
          <View style={styles.timeCapsuleText}>
            <Text style={[styles.timeCapsuleTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
              Zaman Kapsülü
            </Text>
            <Text style={[styles.timeCapsuleSubtitle, { color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }]}>
              Gelecekteki sana bir mesaj bırak
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'} />
        </View>
        {/* Shimmer Effect */}
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{
                translateX: shimmerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-200, 400],
                }),
              }],
            },
          ]}
        >
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.2)', 'transparent']}
            style={styles.shimmerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ============================================
// VOICE JOURNAL BUTTON - Record audio entries
// ============================================
const VoiceJournalButton: React.FC<{
  onPress: () => void;
}> = ({ onPress }) => {
  const { isDarkMode } = useThemeStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createWaveAnimation = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createWaveAnimation(waveAnim1, 0).start();
    createWaveAnimation(waveAnim2, 600).start();
    createWaveAnimation(waveAnim3, 1200).start();
  }, []);

  const renderWave = (anim: Animated.Value) => (
    <Animated.View
      style={[
        styles.voiceWave,
        {
          opacity: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 0],
          }),
          transform: [{
            scale: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 2],
            }),
          }],
        },
      ]}
    />
  );

  return (
    <TouchableOpacity style={styles.voiceButton} onPress={onPress} activeOpacity={0.9}>
      {renderWave(waveAnim1)}
      {renderWave(waveAnim2)}
      {renderWave(waveAnim3)}
      <LinearGradient
        colors={['#F43F5E', '#EC4899']}
        style={styles.voiceButtonInner}
      >
        <Feather name="mic" size={24} color="#FFFFFF" />
      </LinearGradient>
      <Text style={[styles.voiceLabel, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
        Sesli Günlük
      </Text>
    </TouchableOpacity>
  );
};

// ============================================
// EMOTION TIMELINE - Visual mood history
// ============================================
const EmotionTimeline: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  const timelineData = [
    { day: 'Pzt', mood: 75, emotion: 'happy' },
    { day: 'Sal', mood: 45, emotion: 'anxious' },
    { day: 'Çar', mood: 60, emotion: 'calm' },
    { day: 'Per', mood: 85, emotion: 'energetic' },
    { day: 'Cum', mood: 70, emotion: 'happy' },
    { day: 'Cmt', mood: 55, emotion: 'calm' },
    { day: 'Paz', mood: 80, emotion: 'happy' },
  ];

  const getMoodColor = (emotion: string) => {
    switch (emotion) {
      case 'happy': return '#10B981';
      case 'calm': return '#06B6D4';
      case 'anxious': return '#F59E0B';
      case 'sad': return '#8B5CF6';
      case 'energetic': return '#EC4899';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.timeline}>
      <View style={styles.timelineHeader}>
        <Text style={[styles.timelineTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
          Bu Hafta
        </Text>
        <TouchableOpacity>
          <Text style={styles.timelineMore}>Detaylar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.timelineGraph}>
        {timelineData.map((item, index) => {
          const height = (item.mood / 100) * 80;
          return (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineBarContainer}>
                <LinearGradient
                  colors={[getMoodColor(item.emotion), getMoodColor(item.emotion) + '60']}
                  style={[styles.timelineBar, { height }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
              </View>
              <Text style={[styles.timelineDay, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }]}>
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// ============================================
// AI INSIGHT BUBBLE - Personalized insights
// ============================================
const AIInsightBubble: React.FC<{
  insight: string;
  type: 'tip' | 'pattern' | 'encouragement';
}> = ({ insight, type }) => {
  const { isDarkMode } = useThemeStore();
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getTypeConfig = () => {
    switch (type) {
      case 'tip':
        return { icon: 'lightbulb', color: '#F59E0B', label: 'Öneri' };
      case 'pattern':
        return { icon: 'trending-up', color: '#10B981', label: 'Kalıp' };
      case 'encouragement':
        return { icon: 'heart', color: '#EC4899', label: 'Destek' };
    }
  };

  const config = getTypeConfig();

  return (
    <Animated.View
      style={[
        styles.insightBubble,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
          backgroundColor: isDarkMode ? 'rgba(30,30,45,0.9)' : 'rgba(255,255,255,0.95)',
        },
      ]}
    >
      <BlurView intensity={isDarkMode ? 30 : 60} tint={isDarkMode ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View style={styles.insightContent}>
        <View style={[styles.insightIcon, { backgroundColor: config.color + '20' }]}>
          <Feather name={config.icon as any} size={18} color={config.color} />
        </View>
        <View style={styles.insightTextContainer}>
          <Text style={[styles.insightLabel, { color: config.color }]}>{config.label}</Text>
          <Text style={[styles.insightText, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
            {insight}
          </Text>
        </View>
      </View>
      <View style={styles.insightActions}>
        <TouchableOpacity style={styles.insightAction}>
          <Feather name="bookmark" size={16} color={isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.insightAction}>
          <Feather name="share-2" size={16} color={isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// ============================================
// QUICK MOOD ENTRY - Fast mood logging
// ============================================
const QuickMoodEntry: React.FC<{
  onMoodSelect: (mood: string) => void;
}> = ({ onMoodSelect }) => {
  const { isDarkMode } = useThemeStore();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { id: 'great', emoji: '🌟', label: 'Harika', color: '#F59E0B' },
    { id: 'good', emoji: '😊', label: 'İyi', color: '#10B981' },
    { id: 'okay', emoji: '😐', label: 'Orta', color: '#06B6D4' },
    { id: 'low', emoji: '😔', label: 'Düşük', color: '#6366F1' },
    { id: 'bad', emoji: '😢', label: 'Kötü', color: '#8B5CF6' },
  ];

  const handleSelect = (moodId: string) => {
    setSelectedMood(moodId);
    onMoodSelect(moodId);
  };

  return (
    <View style={styles.quickMood}>
      <Text style={[styles.quickMoodTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
        Şu an nasıl hissediyorsun?
      </Text>
      <View style={styles.quickMoodOptions}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.quickMoodOption,
              selectedMood === mood.id && { borderColor: mood.color, borderWidth: 2 },
            ]}
            onPress={() => handleSelect(mood.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.quickMoodEmoji}>{mood.emoji}</Text>
            <Text style={[
              styles.quickMoodLabel,
              { color: selectedMood === mood.id ? mood.color : (isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)') },
            ]}>
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// ============================================
// JOURNAL ENTRY CARD - Modern entry display
// ============================================
const JournalEntryCard: React.FC<{
  entry: {
    id: string;
    title: string;
    preview: string;
    date: string;
    mood: string;
    hasAudio: boolean;
    hasImage: boolean;
    aiInsight?: string;
  };
  onPress: () => void;
}> = ({ entry, onPress }) => {
  const { isDarkMode } = useThemeStore();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getMoodGradient = () => {
    switch (entry.mood) {
      case 'happy': return ['#10B981', '#34D399'];
      case 'calm': return ['#06B6D4', '#22D3EE'];
      case 'anxious': return ['#F59E0B', '#FBBF24'];
      case 'sad': return ['#8B5CF6', '#A78BFA'];
      case 'energetic': return ['#EC4899', '#F472B6'];
      default: return ['#6B7280', '#9CA3AF'];
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
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
          styles.entryCard,
          {
            transform: [{ scale: scaleAnim }],
            backgroundColor: isDarkMode ? 'rgba(30,30,45,0.8)' : 'rgba(255,255,255,0.95)',
          },
        ]}
      >
        <BlurView intensity={isDarkMode ? 25 : 50} tint={isDarkMode ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        {/* Mood indicator strip */}
        <LinearGradient
          colors={getMoodGradient()}
          style={styles.moodStrip}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <View style={styles.entryContent}>
          <View style={styles.entryHeader}>
            <Text style={[styles.entryDate, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }]}>
              {entry.date}
            </Text>
            <View style={styles.entryIcons}>
              {entry.hasAudio && <Feather name="mic" size={14} color={isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'} />}
              {entry.hasImage && <Feather name="image" size={14} color={isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'} />}
            </View>
          </View>
          <Text style={[styles.entryTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]} numberOfLines={1}>
            {entry.title}
          </Text>
          <Text style={[styles.entryPreview, { color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }]} numberOfLines={2}>
            {entry.preview}
          </Text>
          {entry.aiInsight && (
            <View style={styles.entryInsight}>
              <Feather name="zap" size={12} color="#F59E0B" />
              <Text style={styles.entryInsightText}>{entry.aiInsight}</Text>
            </View>
          )}
        </View>
        <Feather name="chevron-right" size={20} color={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'} />
      </Animated.View>
    </TouchableOpacity>
  );
};

// ============================================
// MAIN JOURNAL SCREEN
// ============================================
export default function MyJourney() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [currentMood, setCurrentMood] = useState(65);

  const colors = isDarkMode ? Colors.dark : Colors.light;

  const mockEntries = [
    {
      id: '1',
      title: 'Bugün çok verimli bir gündü',
      preview: 'Sabah meditasyonla başladım, ardından işlerime odaklandım. Akşam yürüyüş yaptım...',
      date: 'Bugün, 14:30',
      mood: 'happy',
      hasAudio: true,
      hasImage: false,
      aiInsight: 'Sabah rutinin enerjini artırıyor',
    },
    {
      id: '2',
      title: 'Biraz kaygılı hissettim',
      preview: 'Toplantı öncesi stres yaşadım ama nefes egzersizleri yardımcı oldu...',
      date: 'Dün, 22:15',
      mood: 'anxious',
      hasAudio: false,
      hasImage: true,
      aiInsight: undefined,
    },
    {
      id: '3',
      title: 'Minnettarlık günü',
      preview: 'Ailemle güzel vakit geçirdik. Çocuklarla park oyunu oynadık...',
      date: '7 Ara, 18:00',
      mood: 'happy',
      hasAudio: true,
      hasImage: true,
      aiInsight: 'Aile zamanı mutluluğunu artırıyor',
    },
  ];

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0A0A15' : '#F8F9FC' }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Background Gradient */}
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
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <View>
            <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
              Yolculuğum
            </Text>
            <Text style={[styles.headerSubtitle, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }]}>
              Bugün içsel yolculuğuna devam et
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.headerButton, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
              <Feather name="calendar" size={20} color={isDarkMode ? '#FFFFFF' : '#1A1A2E'} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.headerButton, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
              <Feather name="search" size={20} color={isDarkMode ? '#FFFFFF' : '#1A1A2E'} />
            </TouchableOpacity>
          </View>
        </Animated.View>

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
          {/* Mood Orb Section */}
          <View style={styles.orbSection}>
            <MoodOrb mood={currentMood} onMoodChange={setCurrentMood} />
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.newEntryButton]}
              onPress={() => router.push('/(tabs)/journal/new')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={styles.newEntryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Feather name="edit-3" size={20} color="#FFFFFF" />
                <Text style={styles.newEntryText}>Yeni Yazı</Text>
              </LinearGradient>
            </TouchableOpacity>
            <VoiceJournalButton onPress={() => {}} />
          </View>

          {/* Quick Mood Entry */}
          <QuickMoodEntry onMoodSelect={(mood) => console.log('Selected mood:', mood)} />

          {/* Time Capsule */}
          <TimeCapsuleCard onPress={() => {}} />

          {/* AI Insight */}
          <AIInsightBubble
            insight="Geçen hafta sabah rutinin olduğu günlerde %30 daha iyi hissettin. Bugün de sabah meditasyonu dene."
            type="pattern"
          />

          {/* Emotion Timeline */}
          <EmotionTimeline />

          {/* Recent Entries */}
          <View style={styles.entriesSection}>
            <View style={styles.entriesHeader}>
              <Text style={[styles.entriesTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
                Son Yazılar
              </Text>
              <TouchableOpacity>
                <Text style={styles.entriesMore}>Tümünü Gör</Text>
              </TouchableOpacity>
            </View>
            {mockEntries.map((entry) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                onPress={() => {}}
              />
            ))}
          </View>
        </Animated.ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/(tabs)/journal/new')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            style={styles.fabGradient}
          >
            <Feather name="plus" size={28} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
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
    paddingHorizontal: 24,
    paddingBottom: 120,
  },

  // Mood Orb
  orbSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  orbContainer: {
    width: 220,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    shadowRadius: 60,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
  },
  orbGlowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  orbMain: {
    width: 180,
    height: 180,
  },
  orbValue: {
    position: 'absolute',
    alignItems: 'center',
  },
  orbValueText: {
    fontSize: 42,
    fontWeight: '800',
  },
  orbValueLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  orbHint: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orbHintText: {
    fontSize: 12,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  newEntryButton: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    ...Shadows.md,
  },
  newEntryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  newEntryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  voiceButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  voiceButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  voiceWave: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#F43F5E',
  },
  voiceLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
  },

  // Quick Mood
  quickMood: {
    marginBottom: 24,
  },
  quickMoodTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  quickMoodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickMoodOption: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 60,
  },
  quickMoodEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  quickMoodLabel: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Time Capsule
  timeCapsule: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
  },
  timeCapsuleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  timeCapsuleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139,92,246,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeCapsuleText: {
    flex: 1,
  },
  timeCapsuleTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  timeCapsuleSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 200,
  },
  shimmerGradient: {
    width: '100%',
    height: '100%',
  },

  // AI Insight
  insightBubble: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  insightContent: {
    flexDirection: 'row',
    padding: 16,
    gap: 14,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightTextContainer: {
    flex: 1,
  },
  insightLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
  },
  insightActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 16,
  },
  insightAction: {
    padding: 4,
  },

  // Emotion Timeline
  timeline: {
    marginBottom: 24,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  timelineMore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  timelineGraph: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  timelineItem: {
    alignItems: 'center',
    flex: 1,
  },
  timelineBarContainer: {
    height: 80,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  timelineBar: {
    width: 24,
    borderRadius: 12,
  },
  timelineDay: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Entries Section
  entriesSection: {
    marginBottom: 24,
  },
  entriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  entriesTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  entriesMore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  moodStrip: {
    width: 4,
    height: '100%',
  },
  entryContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 14,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  entryDate: {
    fontSize: 11,
    fontWeight: '600',
  },
  entryIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  entryTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  entryPreview: {
    fontSize: 13,
    lineHeight: 18,
  },
  entryInsight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    gap: 6,
  },
  entryInsightText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F59E0B',
    flex: 1,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    ...Shadows.lg,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
