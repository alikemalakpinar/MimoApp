// app/(auth)/welcome.tsx - ORA PREMIUM WELCOME SCREEN
// "from now, find yourself"
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Defs, RadialGradient, Stop, G, Ellipse } from 'react-native-svg';
import { Colors, Spacing, BorderRadius, Shadows, AppConfig } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Onboarding slides data
const SLIDES = [
  {
    id: 1,
    title: 'Kendinizi Keşfedin',
    subtitle: 'Psikolojik testlerle iç dünyanızı anlamaya başlayın',
    icon: 'compass',
    color: Colors.light.primary,
    gradient: ['#7C5CE0', '#A18AFF'],
  },
  {
    id: 2,
    title: 'Yolculuğunuzu Paylaşın',
    subtitle: 'My Journey ile deneyimlerinizi anonim olarak paylaşın',
    icon: 'edit-3',
    color: Colors.light.secondary,
    gradient: ['#20B2AA', '#5CD5CD'],
  },
  {
    id: 3,
    title: 'Uzman Desteği Alın',
    subtitle: 'Lisanslı psikologlarla güvenli bir şekilde bağlantı kurun',
    icon: 'users',
    color: Colors.light.accent,
    gradient: ['#FF6B6B', '#FFA07A'],
  },
];

// Ora Logo Component
const OraLogo = ({ size = 80 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 120 120">
    <Defs>
      <RadialGradient id="logoGlow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#A18AFF" stopOpacity="0.8" />
        <Stop offset="50%" stopColor="#7C5CE0" stopOpacity="0.6" />
        <Stop offset="100%" stopColor="#5B3DC4" stopOpacity="0.3" />
      </RadialGradient>
    </Defs>
    <Circle cx="60" cy="60" r="55" fill="url(#logoGlow)" opacity="0.3" />
    <Circle cx="60" cy="60" r="45" fill="none" stroke="#7C5CE0" strokeWidth="5" />
    <Circle cx="60" cy="60" r="35" fill="none" stroke="#A18AFF" strokeWidth="2" strokeDasharray="8 4" opacity="0.6" />
    <Circle cx="60" cy="60" r="8" fill="#7C5CE0" />
    <Circle cx="60" cy="60" r="5" fill="#A18AFF" />
    <Path d="M30 60 Q45 30 60 30" fill="none" stroke="#20B2AA" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <Path d="M90 60 Q75 90 60 90" fill="none" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
  </Svg>
);

// Illustration for each slide
const SlideIllustration = ({ slide }: { slide: typeof SLIDES[0] }) => (
  <View style={styles.illustrationContainer}>
    <LinearGradient
      colors={slide.gradient as [string, string]}
      style={styles.illustrationBg}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    />
    <View style={styles.illustrationIconContainer}>
      <Feather name={slide.icon as any} size={48} color="#FFFFFF" />
    </View>
    {/* Decorative elements */}
    <View style={[styles.floatingDot, { top: 20, left: 30, backgroundColor: '#FFFFFF' }]} />
    <View style={[styles.floatingDot, { top: 60, right: 25, backgroundColor: '#FFFFFF', width: 12, height: 12 }]} />
    <View style={[styles.floatingDot, { bottom: 40, left: 50, backgroundColor: '#FFFFFF', width: 6, height: 6 }]} />
  </View>
);

export default function Welcome() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Background gradient */}
      <LinearGradient
        colors={['#FAFAFA', '#F8F5FF', '#FAFAFA']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header with logo */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.logoRow}>
          <OraLogo size={48} />
          <Text style={styles.logoText}>{AppConfig.name}</Text>
        </View>
      </Animated.View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.slidesContainer}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <Animated.View
              style={[
                styles.slideContent,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      scale: slideAnim,
                    },
                  ],
                },
              ]}
            >
              <SlideIllustration slide={slide} />
              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
            </Animated.View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {SLIDES.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goToSlide(index)}
            style={[
              styles.paginationDot,
              currentSlide === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      {/* Actions */}
      <Animated.View
        style={[
          styles.actions,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(auth)/register')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={Colors.gradients.primary as [string, string]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.primaryButtonText}>Başlayalım</Text>
            <Feather name="arrow-right" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.secondaryButtonText}>Zaten hesabım var</Text>
        </TouchableOpacity>

        {/* Legal links */}
        <View style={styles.legalContainer}>
          <Text style={styles.legalText}>
            Devam ederek{' '}
            <Text style={styles.legalLink} onPress={() => router.push('/(legal)/terms')}>
              Kullanım Koşulları
            </Text>
            {' '}ve{' '}
            <Text style={styles.legalLink} onPress={() => router.push('/(legal)/privacy')}>
              Gizlilik Politikası
            </Text>
            'nı kabul etmiş olursunuz.
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    letterSpacing: -1,
  },

  slidesContainer: {
    flex: 1,
  },

  slide: {
    width: width,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },

  slideContent: {
    alignItems: 'center',
    width: '100%',
  },

  illustrationContainer: {
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    marginBottom: Spacing.huge,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },

  illustrationBg: {
    ...StyleSheet.absoluteFillObject,
  },

  illustrationIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  floatingDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.5,
  },

  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },

  slideSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.lg,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },

  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.border,
  },

  paginationDotActive: {
    width: 24,
    backgroundColor: Colors.light.primary,
  },

  actions: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  primaryButton: {
    borderRadius: BorderRadius.button,
    overflow: 'hidden',
    ...Shadows.primary,
  },

  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },

  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  secondaryButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  legalContainer: {
    paddingTop: Spacing.sm,
  },

  legalText: {
    fontSize: 12,
    color: Colors.light.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },

  legalLink: {
    color: Colors.light.primary,
    fontWeight: '500',
  },
});
