// app/(auth)/onboarding.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  backgroundColor: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Güvenli & Gizli",
    description: "KVKK uyumlu platform ile verileriniz tamamen güvende. End-to-end şifreleme ile tam gizlilik sağlıyoruz.",
    icon: "🔒",
    color: Colors.light.secondary,
    backgroundColor: Colors.light.secondaryLight + '20'
  },
  {
    id: 2,
    title: "Uzman Psikologlar",
    description: "Lisanslı ve deneyimli psikologlarla eşleşin. Uzmanlık alanlarına göre filtreleme yapın ve size uygun uzmanı bulun.",
    icon: "👥",
    color: Colors.light.primaryLight,
    backgroundColor: Colors.light.primaryLight + '20'
  },
  {
    id: 3,
    title: "7/24 Destek",
    description: "Mesajlaşma, görüntülü seans ve acil durum desteği ile her zaman yanınızdayız. İhtiyacınız olduğunda buradayız.",
    icon: "💬",
    color: Colors.light.accent,
    backgroundColor: Colors.light.accent + '20'
  }
];

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setIsLastStep(currentStep === onboardingSteps.length - 1);
  }, [currentStep]);

  const animateStepChange = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 0,
        useNativeDriver: true,
      })
    ]).start(() => {
      callback();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 6,
          useNativeDriver: true,
        })
      ]).start();
    });
  };

  const handleNext = () => {
    if (isLastStep) {
      router.push('/(auth)/register');
    } else {
      animateStepChange(() => {
        setCurrentStep(prev => prev + 1);
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep === 0) {
      router.back();
    } else {
      animateStepChange(() => {
        setCurrentStep(prev => prev - 1);
      });
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/register');
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        
        {/* Header - Progress & Skip */}
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            {onboardingSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: index === currentStep 
                      ? Colors.light.primary 
                      : Colors.light.border,
                    width: index === currentStep ? 32 : 12,
                  }
                ]}
              />
            ))}
          </View>
          
          <TouchableOpacity
            onPress={handleSkip}
            style={styles.skipButton}
          >
            <Text style={styles.skipButtonText}>Geç</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <Animated.View 
          style={[
            styles.mainContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          
          {/* Illustration */}
          <View style={[styles.illustrationContainer, { backgroundColor: currentStepData.backgroundColor }]}>
            <View style={styles.illustration}>
              
              {/* Main Icon */}
              <View style={[styles.iconContainer, { backgroundColor: Colors.light.surface }]}>
                <Text style={styles.mainIcon}>{currentStepData.icon}</Text>
              </View>

              {/* Floating Elements */}
              <View style={[styles.floatingElement, styles.element1, { backgroundColor: currentStepData.color }]} />
              <View style={[styles.floatingElement, styles.element2, { backgroundColor: currentStepData.color + '60' }]} />
              <View style={[styles.floatingElement, styles.element3, { backgroundColor: currentStepData.color + '40' }]} />
              <View style={[styles.floatingElement, styles.element4, { backgroundColor: currentStepData.color + '80' }]} />

            </View>
          </View>

          {/* Text Content */}
          <View style={styles.textContent}>
            <Text style={styles.stepTitle}>
              {currentStepData.title}
            </Text>
            <Text style={styles.stepDescription}>
              {currentStepData.description}
            </Text>
          </View>

        </Animated.View>

        {/* Navigation */}
        <View style={styles.navigation}>
          
          {/* Previous Button */}
          <TouchableOpacity
            onPress={handlePrevious}
            style={styles.previousButton}
            activeOpacity={0.7}
          >
            <Text style={styles.previousButtonText}>←</Text>
          </TouchableOpacity>

          {/* Next/Finish Button */}
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.nextButton, { backgroundColor: currentStepData.color }]}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {isLastStep ? 'Başlayın' : 'Devam'}
            </Text>
            {!isLastStep && <Text style={styles.nextButtonArrow}>→</Text>}
          </TouchableOpacity>

        </View>

      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingTop: Spacing.sm,
  },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressDot: {
    height: 12,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
  },

  skipButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },

  skipButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.light.textSecondary,
  },

  mainContent: {
    flex: 1,
    alignItems: 'center',
  },

  illustrationContainer: {
    width: width * 0.85,
    height: height * 0.4,
    borderRadius: BorderRadius.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },

  illustration: {
    position: 'relative',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },

  mainIcon: {
    fontSize: 60,
  },

  floatingElement: {
    position: 'absolute',
    borderRadius: BorderRadius.full,
  },

  element1: {
    width: 20,
    height: 20,
    top: '15%',
    right: '20%',
  },

  element2: {
    width: 16,
    height: 16,
    bottom: '20%',
    left: '15%',
  },

  element3: {
    width: 12,
    height: 12,
    top: '35%',
    left: '10%',
  },

  element4: {
    width: 14,
    height: 14,
    bottom: '30%',
    right: '25%',
  },

  textContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },

  stepTitle: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: Typography.xxxl * Typography.lineHeight.tight,
  },

  stepDescription: {
    fontSize: Typography.lg,
    fontWeight: Typography.normal,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lg * Typography.lineHeight.relaxed,
    paddingHorizontal: Spacing.sm,
  },

  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },

  previousButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  previousButtonText: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
  },

  nextButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.lg,
    ...Shadows.md,
  },

  nextButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
  },

  nextButtonArrow: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
    marginLeft: Spacing.sm,
  },
});