// app/breathing.tsx - BREATHING EXERCISES
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Vibration,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../shared/theme';

const TECHNIQUES = [
  {
    id: '1',
    name: '4-7-8 Nefes',
    description: 'İçine çek 4sn, tut 7sn, ver 8sn',
    inhale: 4,
    hold: 7,
    exhale: 8,
    color: '#E8F4FF',
  },
  {
    id: '2',
    name: 'Box Breathing',
    description: 'Her adım 4 saniye',
    inhale: 4,
    hold: 4,
    exhale: 4,
    color: '#E8F8F0',
  },
  {
    id: '3',
    name: 'Sakin Nefes',
    description: 'İçine çek 5sn, ver 5sn',
    inhale: 5,
    hold: 0,
    exhale: 5,
    color: '#FFF5E8',
  },
];

const PHASES = ['inhale', 'hold', 'exhale', 'rest'];
const PHASE_LABELS = {
  inhale: 'İçine çek',
  hold: 'Tut',
  exhale: 'Ver',
  rest: 'Dinlen',
};

export default function Breathing() {
  const router = useRouter();
  const [selectedTechnique, setSelectedTechnique] = useState(TECHNIQUES[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('inhale');
  const [countdown, setCountdown] = useState(4);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: selectedTechnique.inhale * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: selectedTechnique.hold * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: selectedTechnique.exhale * 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isActive]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nefes Egzersizleri</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Technique Selector */}
        <View style={styles.techniquesContainer}>
          {TECHNIQUES.map((technique) => (
            <TouchableOpacity
              key={technique.id}
              style={[
                styles.techniqueCard,
                { backgroundColor: technique.color },
                selectedTechnique.id === technique.id && styles.techniqueCardActive,
              ]}
              onPress={() => {
                setSelectedTechnique(technique);
                setIsActive(false);
              }}
            >
              <Text style={styles.techniqueName}>{technique.name}</Text>
              <Text style={styles.techniqueDescription}>{technique.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Breathing Circle */}
        <View style={styles.breathingSection}>
          <Animated.View
            style={[
              styles.breathingCircle,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.innerCircle}>
              <Text style={styles.phaseText}>
                {isActive ? PHASE_LABELS[currentPhase as keyof typeof PHASE_LABELS] : 'Hazır'}
              </Text>
              {isActive && <Text style={styles.countdownText}>{countdown}</Text>}
            </View>
          </Animated.View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => setIsActive(!isActive)}
          >
            <Feather
              name={isActive ? 'pause' : 'play'}
              size={32}
              color={Colors.light.surface}
              style={!isActive && { marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Feather name="info" size={20} color={Colors.light.primary} />
          <Text style={styles.infoText}>
            Rahat bir pozisyonda oturun. Gözlerinizi kapatın ve sadece nefes alıp vermeye odaklanın.
          </Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },

  techniquesContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xxxl,
  },

  techniqueCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  techniqueCardActive: {
    borderColor: Colors.light.textPrimary,
  },

  techniqueName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  techniqueDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  breathingSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },

  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.light.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },

  innerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  phaseText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.surface,
    marginBottom: Spacing.xs,
  },

  countdownText: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.light.surface,
  },

  controls: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },

  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.light.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FF',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 19,
  },
});
