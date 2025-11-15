// app/(auth)/onboarding.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const QUESTIONS = [
  {
    id: 1,
    question: 'Mimo\'yu kullanma amacınız nedir?',
    options: [
      { id: '1a', text: '🧘 Stres ve anksiyete yönetimi', value: 'stress' },
      { id: '1b', text: '😊 Ruh halimi iyileştirmek', value: 'mood' },
      { id: '1c', text: '💼 İş-yaşam dengesi', value: 'work_life' },
      { id: '1d', text: '❤️ İlişki problemleri', value: 'relationship' },
      { id: '1e', text: '🎯 Kişisel gelişim', value: 'personal_growth' },
    ],
  },
  {
    id: 2,
    question: 'Daha önce terapi deneyiminiz oldu mu?',
    options: [
      { id: '2a', text: 'Evet, halen devam ediyorum', value: 'ongoing' },
      { id: '2b', text: 'Evet, geçmişte aldım', value: 'past' },
      { id: '2c', text: 'Hayır, ilk defa', value: 'never' },
    ],
  },
  {
    id: 3,
    question: 'Hangi seans türünü tercih edersiniz?',
    options: [
      { id: '3a', text: '📹 Görüntülü görüşme', value: 'video' },
      { id: '3b', text: '💬 Mesajlaşma', value: 'chat' },
      { id: '3c', text: '📞 Sesli arama', value: 'audio' },
    ],
  },
  {
    id: 4,
    question: 'Terapist tercihiniz var mı?',
    options: [
      { id: '4a', text: '👩 Kadın terapist', value: 'female' },
      { id: '4b', text: '👨 Erkek terapist', value: 'male' },
      { id: '4c', text: '🤝 Fark etmez', value: 'any' },
    ],
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Load previous answer if exists
    const previousAnswer = answers[QUESTIONS[currentStep].id];
    setSelectedOption(previousAnswer || null);
  }, [currentStep]);

  const handleNext = () => {
    if (!selectedOption) return;
    
    setAnswers(prev => ({ ...prev, [QUESTIONS[currentStep].id]: selectedOption }));
    
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Onboarding tamamlandı - personality test'e yönlendir
      router.push('/(auth)/personality-test');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      router.back();
    }
  };

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;
  const currentQuestion = QUESTIONS[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View 
              style={[
                styles.progressBarFill,
                { width: `${progress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1}/{QUESTIONS.length}
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionNumber}>Soru {currentStep + 1}</Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  selectedOption === option.value && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedOption(option.value)}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionText,
                    selectedOption === option.value && styles.optionTextSelected,
                  ]}>
                    {option.text}
                  </Text>
                  {selectedOption === option.value && (
                    <Feather name="check" size={20} color={Colors.light.primary} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

      </ScrollView>

      {/* Next Button */}
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
          <Feather name="arrow-right" size={20} color={Colors.light.surface} />
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.md,
  },

  progressBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.full,
  },

  progressText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.light.textSecondary,
    minWidth: 40,
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

  questionContainer: {
    marginBottom: Spacing.xxl,
  },

  questionNumber: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.light.primary,
    marginBottom: Spacing.sm,
  },

  questionText: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    lineHeight: Typography.xxl * 1.3,
  },

  optionsContainer: {
    gap: Spacing.md,
  },

  optionButton: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.light.border,
    padding: Spacing.lg,
    ...Shadows.sm,
  },

  optionButtonSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '08',
  },

  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionText: {
    fontSize: Typography.lg,
    fontWeight: Typography.medium,
    color: Colors.light.textPrimary,
    flex: 1,
  },

  optionTextSelected: {
    color: Colors.light.primary,
    fontWeight: Typography.semibold,
  },

  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
  },

  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadows.md,
  },

  nextButtonDisabled: {
    opacity: 0.5,
  },

  nextButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
  },
});
