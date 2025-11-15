// app/(auth)/personality-test.tsx
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
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const PHQ9_QUESTIONS = [
  'Yaptığınız işlerden çok az ilgi duyma veya zevk almama',
  'Kendinizi çökkün, depresif veya umutsuz hissetme',
  'Uykuya dalmada veya uykuyu sürdürmede güçlük, ya da çok fazla uyuma',
  'Kendinizi yorgun hissetme veya çok az enerjiniz olması',
  'İştahsızlık veya aşırı yeme',
];

const OPTIONS = [
  { label: 'Hiçbir zaman', value: 0 },
  { label: 'Birkaç gün', value: 1 },
  { label: 'Yarıdan fazla gün', value: 2 },
  { label: 'Hemen her gün', value: 3 },
];

export default function PersonalityTest() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);

    if (currentQuestion < PHQ9_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    } else {
      // Test tamamlandı - eşleştirmeye geç
      setTimeout(() => router.push('/(auth)/psychologist-matching'), 500);
    }
  };

  const progress = ((currentQuestion + 1) / PHQ9_QUESTIONS.length) * 100;

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
          <Text style={styles.progressText}>{currentQuestion + 1}/{PHQ9_QUESTIONS.length}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Son 2 haftada...</Text>
          
          <Text style={styles.question}>
            {PHQ9_QUESTIONS[currentQuestion]}
          </Text>

          <View style={styles.optionsContainer}>
            {OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  answers[currentQuestion] === option.value && styles.optionButtonSelected,
                ]}
                onPress={() => handleAnswer(option.value)}
              >
                <Text style={[
                  styles.optionText,
                  answers[currentQuestion] === option.value && styles.optionTextSelected,
                ]}>
                  {option.label}
                </Text>
                {answers[currentQuestion] === option.value && (
                  <Feather name="check" size={20} color={Colors.light.surface} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.disclaimer}>
            💡 Bu test sadece ön değerlendirme amaçlıdır. Profesyonel tanı için terapistinizle görüşün.
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.md,
  },

  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.secondary,
    borderRadius: BorderRadius.full,
  },

  progressText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.light.textSecondary,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  content: {
    flex: 1,
    paddingTop: Spacing.xl,
  },

  title: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.light.secondary,
    marginBottom: Spacing.md,
  },

  question: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xxl,
    lineHeight: Typography.xxl * 1.3,
  },

  optionsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },

  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.light.border,
    padding: Spacing.lg,
    ...Shadows.sm,
  },

  optionButtonSelected: {
    backgroundColor: Colors.light.secondary,
    borderColor: Colors.light.secondary,
  },

  optionText: {
    fontSize: Typography.lg,
    fontWeight: Typography.medium,
    color: Colors.light.textPrimary,
  },

  optionTextSelected: {
    color: Colors.light.surface,
    fontWeight: Typography.semibold,
  },

  disclaimer: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.sm * 1.5,
    paddingHorizontal: Spacing.md,
  },
});
