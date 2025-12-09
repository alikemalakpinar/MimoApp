// shared/components/AdaptiveOnboarding.tsx - Personalized Adaptive Onboarding Flow
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../theme';

const { width, height } = Dimensions.get('window');

// ============================================
// TYPES & INTERFACES
// ============================================
export interface OnboardingProfile {
  name: string;
  goals: string[];
  challenges: string[];
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'night';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredActivities: string[];
  notificationPreference: 'frequent' | 'moderate' | 'minimal';
}

export interface OnboardingStep {
  id: string;
  type: 'welcome' | 'goals' | 'challenges' | 'schedule' | 'activities' | 'personalization' | 'complete';
  title: string;
  subtitle?: string;
}

// ============================================
// ANIMATED PARTICLES BACKGROUND
// ============================================
interface ParticlesBackgroundProps {
  color?: string;
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  color = Colors.light.primary,
}) => {
  const particles = useRef(
    Array.from({ length: 20 }, () => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.1),
      size: Math.random() * 8 + 4,
    }))
  ).current;

  useEffect(() => {
    particles.forEach((particle) => {
      const animateParticle = () => {
        Animated.parallel([
          Animated.timing(particle.y, {
            toValue: -50,
            duration: 8000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: 0.6,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          particle.y.setValue(height + 50);
          particle.x.setValue(Math.random() * width);
          particle.opacity.setValue(0.1);
          animateParticle();
        });
      };
      animateParticle();
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              width: particle.size,
              height: particle.size,
              borderRadius: particle.size / 2,
              backgroundColor: color,
              opacity: particle.opacity,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

// ============================================
// WELCOME STEP
// ============================================
interface WelcomeStepProps {
  onContinue: () => void;
  name?: string;
  onNameChange: (name: string) => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  onContinue,
  name,
  onNameChange,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const [localName, setLocalName] = useState(name || '');

  useEffect(() => {
    Animated.sequence([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleContinue = () => {
    if (localName.trim()) {
      onNameChange(localName.trim());
      onContinue();
    }
  };

  return (
    <View style={styles.stepContainer}>
      <ParticlesBackground />

      {/* Ora Logo */}
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.secondary]}
          style={styles.logoGradient}
        >
          <Text style={styles.logoText}>✨</Text>
        </LinearGradient>
        <Text style={styles.appName}>Ora</Text>
        <Text style={styles.appTagline}>from now, find yourself</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.welcomeContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.welcomeTitle}>Merhaba!</Text>
        <Text style={styles.welcomeSubtitle}>
          Sana nasıl hitap etmemi istersin?
        </Text>

        <View style={styles.nameInputContainer}>
          <BlurView intensity={30} tint="light" style={styles.nameInputBlur}>
            <TextInput
              style={styles.nameInput}
              value={localName}
              onChangeText={setLocalName}
              placeholder="Adını yaz..."
              placeholderTextColor={Colors.light.textSecondary}
              autoFocus
              maxLength={20}
            />
          </BlurView>
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !localName.trim() && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!localName.trim()}
        >
          <LinearGradient
            colors={
              localName.trim()
                ? [Colors.light.primary, Colors.light.secondary]
                : ['#E5E7EB', '#D1D5DB']
            }
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Devam Et</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// ============================================
// GOALS SELECTION STEP
// ============================================
interface GoalsStepProps {
  selectedGoals: string[];
  onGoalsChange: (goals: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
  userName: string;
}

const availableGoals = [
  { id: 'stress', label: 'Stresi azaltmak', icon: '🧘', color: '#8B7CF6' },
  { id: 'sleep', label: 'Daha iyi uyumak', icon: '🌙', color: '#A78BFA' },
  { id: 'anxiety', label: 'Kaygıyı yönetmek', icon: '🌊', color: '#60A5FA' },
  { id: 'focus', label: 'Odaklanmak', icon: '🎯', color: '#34D399' },
  { id: 'happiness', label: 'Mutluluğu artırmak', icon: '☀️', color: '#FBBF24' },
  { id: 'mindfulness', label: 'Farkındalık geliştirmek', icon: '🧠', color: '#F472B6' },
  { id: 'confidence', label: 'Özgüven kazanmak', icon: '💪', color: '#FB7185' },
  { id: 'relationships', label: 'İlişkileri güçlendirmek', icon: '💝', color: '#EC4899' },
  { id: 'growth', label: 'Kişisel gelişim', icon: '🌱', color: '#10B981' },
];

export const GoalsStep: React.FC<GoalsStepProps> = ({
  selectedGoals,
  onGoalsChange,
  onContinue,
  onBack,
  userName,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const itemAnims = useRef(availableGoals.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    itemAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      onGoalsChange(selectedGoals.filter((g) => g !== goalId));
    } else if (selectedGoals.length < 5) {
      onGoalsChange([...selectedGoals, goalId]);
    }
  };

  return (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <View style={styles.stepHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressDots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      <ScrollView
        style={styles.stepScrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.stepScrollInner}
      >
        <Text style={styles.stepTitle}>
          {userName}, hedeflerini seç
        </Text>
        <Text style={styles.stepSubtitle}>
          En fazla 5 hedef seçebilirsin
        </Text>

        <View style={styles.goalsGrid}>
          {availableGoals.map((goal, index) => {
            const isSelected = selectedGoals.includes(goal.id);
            return (
              <Animated.View
                key={goal.id}
                style={{
                  opacity: itemAnims[index],
                  transform: [
                    {
                      translateY: itemAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.goalItem,
                    isSelected && styles.goalItemSelected,
                    isSelected && { borderColor: goal.color },
                  ]}
                  onPress={() => toggleGoal(goal.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.goalIconContainer,
                      isSelected && { backgroundColor: `${goal.color}20` },
                    ]}
                  >
                    <Text style={styles.goalIcon}>{goal.icon}</Text>
                  </View>
                  <Text
                    style={[
                      styles.goalLabel,
                      isSelected && { color: goal.color },
                    ]}
                  >
                    {goal.label}
                  </Text>
                  {isSelected && (
                    <View style={[styles.checkmark, { backgroundColor: goal.color }]}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.stepFooter}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedGoals.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={onContinue}
          disabled={selectedGoals.length === 0}
        >
          <LinearGradient
            colors={
              selectedGoals.length > 0
                ? [Colors.light.primary, Colors.light.secondary]
                : ['#E5E7EB', '#D1D5DB']
            }
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>
              Devam Et ({selectedGoals.length}/5)
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// ============================================
// SCHEDULE PREFERENCE STEP
// ============================================
interface ScheduleStepProps {
  selectedTime: OnboardingProfile['preferredTime'] | null;
  onTimeChange: (time: OnboardingProfile['preferredTime']) => void;
  onContinue: () => void;
  onBack: () => void;
}

const timeOptions = [
  { id: 'morning', label: 'Sabah', sublabel: '06:00 - 12:00', icon: '🌅', color: '#FBBF24' },
  { id: 'afternoon', label: 'Öğleden Sonra', sublabel: '12:00 - 18:00', icon: '☀️', color: '#F59E0B' },
  { id: 'evening', label: 'Akşam', sublabel: '18:00 - 22:00', icon: '🌆', color: '#F472B6' },
  { id: 'night', label: 'Gece', sublabel: '22:00 - 06:00', icon: '🌙', color: '#8B7CF6' },
];

export const ScheduleStep: React.FC<ScheduleStepProps> = ({
  selectedTime,
  onTimeChange,
  onContinue,
  onBack,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <View style={styles.stepHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressDots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>En verimli zamanın</Text>
        <Text style={styles.stepSubtitle}>
          Sana en uygun zamanda hatırlatmalar göndereceğiz
        </Text>

        <View style={styles.timeOptions}>
          {timeOptions.map((option) => {
            const isSelected = selectedTime === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.timeOption,
                  isSelected && styles.timeOptionSelected,
                  isSelected && { borderColor: option.color },
                ]}
                onPress={() => onTimeChange(option.id as OnboardingProfile['preferredTime'])}
              >
                <LinearGradient
                  colors={
                    isSelected
                      ? [`${option.color}30`, `${option.color}10`]
                      : ['transparent', 'transparent']
                  }
                  style={styles.timeOptionGradient}
                >
                  <Text style={styles.timeOptionIcon}>{option.icon}</Text>
                  <View style={styles.timeOptionInfo}>
                    <Text
                      style={[
                        styles.timeOptionLabel,
                        isSelected && { color: option.color },
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text style={styles.timeOptionSublabel}>{option.sublabel}</Text>
                  </View>
                  {isSelected && (
                    <View style={[styles.timeCheckmark, { backgroundColor: option.color }]}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.stepFooter}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedTime && styles.continueButtonDisabled,
          ]}
          onPress={onContinue}
          disabled={!selectedTime}
        >
          <LinearGradient
            colors={
              selectedTime
                ? [Colors.light.primary, Colors.light.secondary]
                : ['#E5E7EB', '#D1D5DB']
            }
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Devam Et</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// ============================================
// EXPERIENCE LEVEL STEP
// ============================================
interface ExperienceStepProps {
  selectedLevel: OnboardingProfile['experienceLevel'] | null;
  onLevelChange: (level: OnboardingProfile['experienceLevel']) => void;
  onContinue: () => void;
  onBack: () => void;
}

const experienceLevels = [
  {
    id: 'beginner',
    label: 'Yeni Başlıyorum',
    description: 'Meditasyon ve farkındalık konusunda yeniyim',
    icon: '🌱',
    color: '#34D399',
  },
  {
    id: 'intermediate',
    label: 'Biraz Deneyimliyim',
    description: 'Daha önce denedim ama düzenli değilim',
    icon: '🌿',
    color: '#60A5FA',
  },
  {
    id: 'advanced',
    label: 'Deneyimliyim',
    description: 'Düzenli pratik yapıyorum',
    icon: '🌳',
    color: '#8B7CF6',
  },
];

export const ExperienceStep: React.FC<ExperienceStepProps> = ({
  selectedLevel,
  onLevelChange,
  onContinue,
  onBack,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(experienceLevels.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    cardAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <View style={styles.stepHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressDots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>
      </View>

      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>Deneyim seviyeni belirle</Text>
        <Text style={styles.stepSubtitle}>
          Sana uygun içerikler sunalım
        </Text>

        <View style={styles.experienceOptions}>
          {experienceLevels.map((level, index) => {
            const isSelected = selectedLevel === level.id;
            return (
              <Animated.View
                key={level.id}
                style={{
                  transform: [
                    {
                      scale: cardAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                  opacity: cardAnims[index],
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.experienceOption,
                    isSelected && styles.experienceOptionSelected,
                    isSelected && { borderColor: level.color },
                  ]}
                  onPress={() => onLevelChange(level.id as OnboardingProfile['experienceLevel'])}
                >
                  <LinearGradient
                    colors={
                      isSelected
                        ? [`${level.color}20`, `${level.color}05`]
                        : ['transparent', 'transparent']
                    }
                    style={styles.experienceOptionGradient}
                  >
                    <Text style={styles.experienceIcon}>{level.icon}</Text>
                    <Text
                      style={[
                        styles.experienceLabel,
                        isSelected && { color: level.color },
                      ]}
                    >
                      {level.label}
                    </Text>
                    <Text style={styles.experienceDescription}>
                      {level.description}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      <View style={styles.stepFooter}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedLevel && styles.continueButtonDisabled,
          ]}
          onPress={onContinue}
          disabled={!selectedLevel}
        >
          <LinearGradient
            colors={
              selectedLevel
                ? [Colors.light.primary, Colors.light.secondary]
                : ['#E5E7EB', '#D1D5DB']
            }
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Devam Et</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// ============================================
// COMPLETION STEP
// ============================================
interface CompletionStepProps {
  profile: OnboardingProfile;
  onComplete: () => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
  profile,
  onComplete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const confettiAnims = useRef(
    Array.from({ length: 30 }, () => ({
      x: new Animated.Value(width / 2),
      y: new Animated.Value(height / 2),
      rotation: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    // Main animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Confetti animation
    confettiAnims.forEach((anim, index) => {
      const angle = (index / confettiAnims.length) * 2 * Math.PI;
      const distance = 150 + Math.random() * 100;

      Animated.parallel([
        Animated.timing(anim.x, {
          toValue: width / 2 + Math.cos(angle) * distance,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(anim.y, {
          toValue: height / 2 - 100 + Math.sin(angle) * distance + 200,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(anim.rotation, {
          toValue: Math.random() * 4,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(400),
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  }, []);

  const confettiColors = ['#8B7CF6', '#F472B6', '#FBBF24', '#34D399', '#60A5FA'];

  return (
    <Animated.View style={[styles.completionContainer, { opacity: fadeAnim }]}>
      <ParticlesBackground color={Colors.light.primary} />

      {/* Confetti */}
      {confettiAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.confetti,
            {
              backgroundColor: confettiColors[index % confettiColors.length],
              opacity: anim.opacity,
              transform: [
                { translateX: anim.x },
                { translateY: anim.y },
                {
                  rotate: anim.rotation.interpolate({
                    inputRange: [0, 4],
                    outputRange: ['0deg', '1440deg'],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      <Animated.View
        style={[
          styles.completionContent,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Success icon */}
        <View style={styles.successIconContainer}>
          <LinearGradient
            colors={[Colors.light.primary, Colors.light.secondary]}
            style={styles.successIconGradient}
          >
            <Text style={styles.successIcon}>🎉</Text>
          </LinearGradient>
        </View>

        <Text style={styles.completionTitle}>
          Harika, {profile.name}!
        </Text>
        <Text style={styles.completionSubtitle}>
          Profilin hazır. Ora seni tanımaya başladı.
        </Text>

        {/* Summary */}
        <BlurView intensity={30} tint="light" style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Hedeflerin</Text>
            <Text style={styles.summaryValue}>{profile.goals.length} hedef</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tercih ettiğin zaman</Text>
            <Text style={styles.summaryValue}>
              {profile.preferredTime === 'morning' && '🌅 Sabah'}
              {profile.preferredTime === 'afternoon' && '☀️ Öğleden Sonra'}
              {profile.preferredTime === 'evening' && '🌆 Akşam'}
              {profile.preferredTime === 'night' && '🌙 Gece'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Deneyim</Text>
            <Text style={styles.summaryValue}>
              {profile.experienceLevel === 'beginner' && '🌱 Yeni başlıyor'}
              {profile.experienceLevel === 'intermediate' && '🌿 Orta seviye'}
              {profile.experienceLevel === 'advanced' && '🌳 Deneyimli'}
            </Text>
          </View>
        </BlurView>

        <TouchableOpacity style={styles.startButton} onPress={onComplete}>
          <LinearGradient
            colors={[Colors.light.primary, Colors.light.secondary]}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>Yolculuğa Başla</Text>
            <Text style={styles.startButtonIcon}>→</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

// ============================================
// MAIN ONBOARDING FLOW
// ============================================
interface AdaptiveOnboardingProps {
  onComplete: (profile: OnboardingProfile) => void;
}

export const AdaptiveOnboarding: React.FC<AdaptiveOnboardingProps> = ({
  onComplete,
}) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<OnboardingProfile>>({
    goals: [],
    challenges: [],
    preferredActivities: [],
  });

  const handleComplete = () => {
    onComplete(profile as OnboardingProfile);
  };

  const updateProfile = (updates: Partial<OnboardingProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <WelcomeStep
            name={profile.name}
            onNameChange={(name) => updateProfile({ name })}
            onContinue={() => setStep(1)}
          />
        );
      case 1:
        return (
          <GoalsStep
            userName={profile.name || ''}
            selectedGoals={profile.goals || []}
            onGoalsChange={(goals) => updateProfile({ goals })}
            onContinue={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        );
      case 2:
        return (
          <ScheduleStep
            selectedTime={profile.preferredTime || null}
            onTimeChange={(preferredTime) => updateProfile({ preferredTime })}
            onContinue={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        );
      case 3:
        return (
          <ExperienceStep
            selectedLevel={profile.experienceLevel || null}
            onLevelChange={(experienceLevel) => updateProfile({ experienceLevel })}
            onContinue={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        );
      case 4:
        return (
          <CompletionStep
            profile={profile as OnboardingProfile}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.onboardingContainer}>
      <LinearGradient
        colors={[Colors.light.background, `${Colors.light.primary}10`]}
        style={StyleSheet.absoluteFill}
      />
      {renderStep()}
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  onboardingContainer: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
  },
  particle: {
    position: 'absolute',
  },

  // Welcome Step
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  logoText: {
    fontSize: 48,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginTop: Spacing.md,
  },
  appTagline: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  welcomeContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  nameInputContainer: {
    marginBottom: Spacing.xl,
  },
  nameInputBlur: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  nameInput: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    fontSize: 18,
    color: Colors.light.textPrimary,
    textAlign: 'center',
  },
  continueButton: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonGradient: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Step Header
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: Colors.light.textPrimary,
    fontWeight: '300',
  },
  progressDots: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.border,
  },
  dotActive: {
    backgroundColor: Colors.light.primary,
  },

  // Step Content
  stepContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  stepScrollContent: {
    flex: 1,
  },
  stepScrollInner: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: 100,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },
  stepSubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xl,
  },
  stepFooter: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },

  // Goals Grid
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  goalItem: {
    width: (width - Spacing.xl * 2 - Spacing.md) / 2,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  goalItemSelected: {
    backgroundColor: 'rgba(139, 124, 246, 0.05)',
  },
  goalIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  goalIcon: {
    fontSize: 22,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textPrimary,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Time Options
  timeOptions: {
    gap: Spacing.md,
  },
  timeOption: {
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.light.border,
    overflow: 'hidden',
  },
  timeOptionSelected: {
    borderWidth: 2,
  },
  timeOptionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  timeOptionIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  timeOptionInfo: {
    flex: 1,
  },
  timeOptionLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  timeOptionSublabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  timeCheckmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Experience Options
  experienceOptions: {
    gap: Spacing.md,
  },
  experienceOption: {
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.light.border,
    overflow: 'hidden',
  },
  experienceOptionSelected: {
    borderWidth: 2,
  },
  experienceOptionGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  experienceIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  experienceLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },
  experienceDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },

  // Completion
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  completionContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  successIconContainer: {
    marginBottom: Spacing.lg,
  },
  successIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  successIcon: {
    fontSize: 56,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },
  completionSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  summaryCard: {
    width: '100%',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  startButton: {
    width: '100%',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  startButtonIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginLeft: Spacing.sm,
  },
});

export default AdaptiveOnboarding;
