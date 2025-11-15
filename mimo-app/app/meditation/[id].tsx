// app/meditation/[id].tsx - MEDITATION PLAYER (LIKE EMERGENCY PAGE)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';

const { width } = Dimensions.get('window');

const MOCK_MEDITATION = {
  title: 'Flower',
  subtitle: 'Meditation',
  voice: 'Ofosu',
  duration: 380,
  category: 'Stres Yönetimi',
};

export default function MeditationPlayer() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(253);

  const progress = (currentTime / MOCK_MEDITATION.duration) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="more-horizontal" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.category}>{MOCK_MEDITATION.category}</Text>
        <Text style={styles.mainTitle}>{MOCK_MEDITATION.title}</Text>

        <View style={styles.timerContainer}>
          <Svg width={width * 0.7} height={width * 0.7}>
            <Circle
              cx={width * 0.35}
              cy={width * 0.35}
              r="120"
              stroke={Colors.light.border}
              strokeWidth="8"
              fill="transparent"
            />
            <Circle
              cx={width * 0.35}
              cy={width * 0.35}
              r="120"
              stroke={Colors.light.primary}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${width * 0.35} ${width * 0.35})`}
            />
          </Svg>
          
          <View style={styles.timerCenter}>
            <Text style={styles.timerTitle}>{MOCK_MEDITATION.title}</Text>
            <Text style={styles.timerSubtitle}>{MOCK_MEDITATION.subtitle}</Text>
            <Text style={styles.voice}>Voice: {MOCK_MEDITATION.voice}</Text>
          </View>
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
          <Text style={styles.totalTime}>{formatTime(MOCK_MEDITATION.duration)}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton}>
            <Feather name="skip-back" size={28} color={Colors.light.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <Feather name="rotate-ccw" size={24} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Feather
              name={isPlaying ? 'pause' : 'play'}
              size={32}
              color={Colors.light.surface}
              style={!isPlaying && { marginLeft: 4 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Feather name="rotate-cw" size={24} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Feather name="skip-forward" size={28} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E8E0',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },

  category: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },

  mainTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.huge,
    letterSpacing: -1,
  },

  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxxl,
    position: 'relative',
  },

  timerCenter: {
    position: 'absolute',
    alignItems: 'center',
  },

  timerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },

  timerSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
  },

  voice: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxxl,
  },

  currentTime: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  totalTime: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },

  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },

  controlButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
});
