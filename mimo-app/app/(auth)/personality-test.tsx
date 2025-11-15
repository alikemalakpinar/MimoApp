// app/(auth)/personality-test.tsx - MINIMAL REDESIGN
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const QUESTIONS = [
  'Yaptığınız işlerden çok az ilgi duyma',
  'Kendinizi çökkün hissetme',
  'Uyku problemleri',
  'Yorgunluk veya enerji azlığı',
  'İştah değişikliği',
];

const OPTIONS = [
  { label: 'Hiç', value: 0 },
  { label: 'Az', value: 1 },
  { label: 'Çok', value: 2 },
  { label: 'Her gün', value: 3 },
];

export default function PersonalityTest() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [currentQuestion]: value });

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    } else {
      setTimeout(() => router.push('/(auth)/psychologist-matching'), 500);
    }
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{currentQuestion + 1}/{QUESTIONS.length}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>Son 2 haftada...</Text>
        <Text style={styles.question}>{QUESTIONS[currentQuestion]}</Text>

        <View style={styles.optionsContainer}>
          {OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                answers[currentQuestion] === option.value && styles.optionButtonActive,
              ]}
              onPress={() => handleAnswer(option.value)}
            >
              <Text style={[
                styles.optionText,
                answers[currentQuestion] === option.value && styles.optionTextActive,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.disclaimer}>
          Bu test sadece ön değerlendirme amaçlıdır.
        </Text>
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.light.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.secondary,
  },

  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.huge,
    paddingBottom: Spacing.xl,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.secondary,
    marginBottom: Spacing.md,
  },

  question: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xxxl,
    lineHeight: 34,
    letterSpacing: -0.5,
  },

  optionsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },

  optionButton: {
    backgroundColor: Colors.light.surface,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.xs,
  },

  optionButtonActive: {
    backgroundColor: Colors.light.secondary,
    borderColor: Colors.light.secondary,
  },

  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  optionTextActive: {
    color: Colors.light.surface,
  },

  disclaimer: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
