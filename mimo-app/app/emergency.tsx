// app/emergency.tsx - EMERGENCY MEDITATION PAGE
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../shared/theme';

const { width } = Dimensions.get('window');

export default function Emergency() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(253); // 4:23 in seconds
  const totalTime = 380; // 6:20 in seconds

  const progress = (currentTime / totalTime) * 100;
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
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="bell" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.subtitle}>Acil Durumlar</Text>
        <Text style={styles.mainTitle}>Panikle Başa Çık</Text>

        {/* Circular Timer */}
        <View style={styles.timerContainer}>
          <Svg width={width * 0.7} height={width * 0.7}>
            {/* Background Circle */}
            <Circle
              cx={width * 0.35}
              cy={width * 0.35}
              r="120"
              stroke={Colors.light.border}
              strokeWidth="6"
              fill="transparent"
            />
            {/* Progress Circle */}
            <Circle
              cx={width * 0.35}
              cy={width * 0.35}
              r="120"
              stroke={Colors.light.primary}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${width * 0.35} ${width * 0.35})`}
            />
          </Svg>
          
          {/* Center Content */}
          <View style={styles.timerCenter}>
            <Text style={styles.exerciseName}>Flower</Text>
            <Text style={styles.exerciseType}>Meditation</Text>
            <Text style={styles.voice}>Voice: Ofosu</Text>
          </View>
        </View>

        {/* Time Display */}
        <View style={styles.timeRow}>
          <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
          <Text style={styles.totalTime}>{formatTime(totalTime)}</Text>
        </View>

        {/* Controls */}
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
    alignItems: 'center',
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

  addButton: {
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

  subtitle: {
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

  exerciseName: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },

  exerciseType: {
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
