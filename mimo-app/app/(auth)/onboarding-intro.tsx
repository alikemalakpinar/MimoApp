// app/(auth)/onboarding-intro.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius } from '../../shared/theme';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  illustration: string;
  backgroundColor: string;
  primaryColor: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Mimo'ya Hoş Geldiniz",
    subtitle: "Mental sağlığınız bizim önceliğimiz",
    description: "Lisanslı psikologlarla güvenli bir şekilde bağlantı kurun ve mental sağlığınızı iyileştirin.",
    illustration: "🧠",
    backgroundColor: "#F0F9FF",
    primaryColor: Colors.light.primary
  },
  {
    id: 2,
    title: "Uzman Psikologlarla Eşleşin",
    subtitle: "Size uygun uzmanı bulun", 
    description: "Kişilik testiniz sonrası, uzmanlık alanları ve yaklaşımları size uygun psikologlarla eşleşin.",
    illustration: "👥",
    backgroundColor: "#F0FDF4",
    primaryColor: Colors.light.secondary
  },
  {
    id: 3,
    title: "Güvenli & Gizli İletişim",
    subtitle: "Verileriniz tamamen güvende",
    description: "KVKK uyumlu platform ile end-to-end şifreleme. Tüm görüşmeleriniz tamamen gizli kalır.",
    illustration: "🔒", 
    backgroundColor: "#FFFBEB",
    primaryColor: Colors.light.accent
  },
  {
    id: 4,
    title: "7/24 Destek",
    subtitle: "Her zaman yanınızdayız", 
    description: "Mesajlaşma, görüntülü seans ve acil durum desteği ile ihtiyacınız olduğunda buradayız.",
    illustration: "💬",
    backgroundColor: "#FDF2F8",
    primaryColor: "#EC4899"
  }
];

export default function OnboardingIntro() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateStepChange = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
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
          duration: 350,
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
    if (currentStep < onboardingSteps.length - 1) {
      animateStepChange(() => {
        setCurrentStep(prev => prev + 1);
      });
    } else {
      // Onboarding tamamlandı - personality test'e geç
      router.push('/(auth)/personality-test');
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
    router.push('/(auth)/personality-test');
  };

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: currentStepData.backgroundColor }]}>
      <StatusBar style="dark" />
      
      <SafeAreaView style={styles.safeArea}>
        
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
                      ? currentStepData.primaryColor 
                      : '#E5E7EB',
                    width: index === currentStep ? 24 : 8,
                  }
                ]}
              />
            ))}
          </View>
          
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
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
          <View style={styles.illustrationContainer}>
            <View style={[styles.illustrationCircle, { backgroundColor: currentStepData.primaryColor + '30' }]}>
              <Text style={styles.illustration}>{currentStepData.illustration}</Text>
              
              {/* Floating decorative elements */}
              <View style={[styles.floatingDot, styles.dot1, { backgroundColor: currentStepData.primaryColor }]} />
              <View style={[styles.floatingDot, styles.dot2, { backgroundColor: currentStepData.primaryColor + '60' }]} />
              <View style={[styles.floatingDot, styles.dot3, { backgroundColor: currentStepData.primaryColor + '40' }]} />
            </View>
          </View>

          {/* Text Content */}
          <View style={styles.textContent}>
            <Text style={styles.stepTitle}>{currentStepData.title}</Text>
            <Text style={styles.stepSubtitle}>{currentStepData.subtitle}</Text>
            <Text style={styles.stepDescription}>{currentStepData.description}</Text>
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

          {/* Next Button */}
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.nextButton, { backgroundColor: currentStepData.primaryColor }]}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {isLastStep ? 'Teste Başla' : 'Devam'}
            </Text>
            <Text style={styles.nextButtonArrow}>{isLastStep ? '🧠' : '→'}</Text>
          </TouchableOpacity>

        </View>

      </SafeAreaView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
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
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },

  skipButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },

  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },

  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  illustrationContainer: {
    width: width * 0.8,
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },

  illustrationCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  illustration: {
    fontSize: 80,
  },

  floatingDot: {
    position: 'absolute',
    borderRadius: 50,
  },

  dot1: {
    width: 16,
    height: 16,
    top: 20,
    right: 30,
  },

  dot2: {
    width: 12,
    height: 12,
    bottom: 30,
    left: 20,
  },

  dot3: {
    width: 8,
    height: 8,
    top: 60,
    left: -10,
  },

  textContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },

  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 34,
  },

  stepSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },

  stepDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.sm,
  },

  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.lg,
    marginTop: Spacing.xl,
  },

  previousButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  previousButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },

  nextButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: Spacing.sm,
  },

  nextButtonArrow: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});