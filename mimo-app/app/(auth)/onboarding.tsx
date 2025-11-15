// app/(auth)/onboarding.tsx - MINIMAL REDESIGN
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
  {
    id: 1,
    question: 'Mimo\'yu kullanma amacın nedir?',
    options: [
      { id: '1a', text: 'Stres ve anksiyete yönetimi', icon: 'zap' },
      { id: '1b', text: 'Ruh halimi iyileştirmek', icon: 'smile' },
      { id: '1c', text: 'İş-yaşam dengesi', icon: 'briefcase' },
      { id: '1d', text: 'İlişki problemleri', icon: 'heart' },
      { id: '1e', text: 'Kişisel gelişim', icon: 'trending-up' },
    ],
  },
  {
    id: 2,
    question: 'Daha önce terapi deneyimin oldu mu?',
    options: [
      { id: '2a', text: 'Evet, halen devam ediyorum', icon: 'check-circle' },
      { id: '2b', text: 'Evet, geçmişte aldım', icon: 'clock' },
      { id: '2c', text: 'Hayır, ilk defa', icon: 'star' },
    ],
  },
  {
    id: 3,
    question: 'Hangi seans türünü tercih edersin?',
    options: [
      { id: '3a', text: 'Görüntülü görüşme', icon: 'video' },
      { id: '3b', text: 'Mesajlaşma', icon: 'message-circle' },
      { id: '3c', text: 'Sesli arama', icon: 'phone' },
    ],
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = () => {
    if (!selectedOption) return;
    
    setAnswers(prev => ({ ...prev, [QUESTIONS[currentStep].id]: selectedOption }));
    
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
    } else {
      router.push('/(auth)/personality-test');
    }
  };

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => currentStep > 0 ? setCurrentStep(prev => prev - 1) : router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{currentStep + 1}/{QUESTIONS.length}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.question}>{QUESTIONS[currentStep].question}</Text>

          <View style={styles.optionsContainer}>
            {QUESTIONS[currentStep].options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  selectedOption === option.id && styles.optionCardActive,
                ]}
                onPress={() => setSelectedOption(option.id)}
              >
                <View style={[
                  styles.optionIcon,
                  selectedOption === option.id && styles.optionIconActive,
                ]}>
                  <Feather
                    name={option.icon as any}
                    size={20}
                    color={
                      selectedOption === option.id
                        ? Colors.light.surface
                        : Colors.light.textSecondary
                    }
                  />
                </View>
                <Text style={[
                  styles.optionText,
                  selectedOption === option.id && styles.optionTextActive,
                ]}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedOption && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!selectedOption}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === QUESTIONS.length - 1 ? 'Devam Et' : 'İleri'}
          </Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: Colors.light.textPrimary,
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
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.huge,
  },

  content: {
    flex: 1,
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
  },

  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.xs,
  },

  optionCardActive: {
    borderColor: Colors.light.textPrimary,
    backgroundColor: '#F5F5F0',
  },

  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  optionIconActive: {
    backgroundColor: Colors.light.textPrimary,
  },

  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.light.textPrimary,
    flex: 1,
  },

  optionTextActive: {
    fontWeight: '600',
  },

  footer: {
    padding: Spacing.xl,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
  },

  nextButton: {
    backgroundColor: Colors.light.textPrimary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.sm,
  },

  nextButtonDisabled: {
    opacity: 0.4,
  },

  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.surface,
  },
});
