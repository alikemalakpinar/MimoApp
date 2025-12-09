// shared/components/LottieAnimations.tsx - Lottie Animation Components
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ViewStyle, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { Colors, Spacing, BorderRadius } from '../theme';

const { width } = Dimensions.get('window');

// ============================================
// TYPES
// ============================================
interface LottieWrapperProps {
  size?: number;
  autoPlay?: boolean;
  loop?: boolean;
  style?: ViewStyle;
}

// ============================================
// INLINE LOTTIE ANIMATIONS (No external files needed)
// These are simple animated components that simulate Lottie-like effects
// ============================================

// Breathing Circle Animation (Meditation)
export const BreathingCircle: React.FC<LottieWrapperProps> = ({
  size = 200,
  autoPlay = true,
  loop = true,
  style,
}) => {
  const scaleAnim = useRef(new (require('react-native').Animated).Value(1)).current;
  const opacityAnim = useRef(new (require('react-native').Animated).Value(0.3)).current;

  useEffect(() => {
    if (autoPlay) {
      const breatheIn = require('react-native').Animated.parallel([
        require('react-native').Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 4000,
          useNativeDriver: true,
        }),
        require('react-native').Animated.timing(opacityAnim, {
          toValue: 0.6,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]);

      const breatheOut = require('react-native').Animated.parallel([
        require('react-native').Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        require('react-native').Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]);

      const animation = require('react-native').Animated.loop(
        require('react-native').Animated.sequence([breatheIn, breatheOut])
      );
      animation.start();

      return () => animation.stop();
    }
  }, [autoPlay]);

  const Animated = require('react-native').Animated;
  const LinearGradient = require('expo-linear-gradient').LinearGradient;

  return (
    <View style={[styles.breathingContainer, { width: size, height: size }, style]}>
      <Animated.View
        style={[
          styles.breathingCircle,
          {
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: size * 0.4,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.secondary]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      <View
        style={[
          styles.breathingInner,
          {
            width: size * 0.4,
            height: size * 0.4,
            borderRadius: size * 0.2,
          },
        ]}
      />
    </View>
  );
};

// Success Checkmark Animation
export const SuccessCheckmark: React.FC<LottieWrapperProps> = ({
  size = 120,
  autoPlay = true,
  style,
}) => {
  const scaleAnim = useRef(new (require('react-native').Animated).Value(0)).current;
  const rotateAnim = useRef(new (require('react-native').Animated).Value(0)).current;

  useEffect(() => {
    if (autoPlay) {
      require('react-native').Animated.sequence([
        require('react-native').Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
        require('react-native').Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [autoPlay]);

  const Animated = require('react-native').Animated;
  const LinearGradient = require('expo-linear-gradient').LinearGradient;

  return (
    <Animated.View
      style={[
        styles.successContainer,
        { width: size, height: size, transform: [{ scale: scaleAnim }] },
        style,
      ]}
    >
      <LinearGradient
        colors={['#34D399', '#10B981']}
        style={[styles.successCircle, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Text style={[styles.successCheck, { fontSize: size * 0.5 }]}>✓</Text>
      </LinearGradient>
    </Animated.View>
  );
};

// Loading Spinner (Ora branded)
export const OraLoadingSpinner: React.FC<LottieWrapperProps> = ({
  size = 60,
  autoPlay = true,
  loop = true,
  style,
}) => {
  const rotateAnim = useRef(new (require('react-native').Animated).Value(0)).current;
  const pulseAnim = useRef(new (require('react-native').Animated).Value(1)).current;

  useEffect(() => {
    if (autoPlay) {
      // Rotation
      const rotate = require('react-native').Animated.loop(
        require('react-native').Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      );

      // Pulse
      const pulse = require('react-native').Animated.loop(
        require('react-native').Animated.sequence([
          require('react-native').Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          require('react-native').Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );

      rotate.start();
      pulse.start();

      return () => {
        rotate.stop();
        pulse.stop();
      };
    }
  }, [autoPlay]);

  const Animated = require('react-native').Animated;
  const Svg = require('react-native-svg').default;
  const Circle = require('react-native-svg').Circle;
  const Defs = require('react-native-svg').Defs;
  const RadialGradient = require('react-native-svg').RadialGradient;
  const Stop = require('react-native-svg').Stop;

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        { width: size, height: size, transform: [{ rotate: rotation }, { scale: pulseAnim }] },
        style,
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="spinnerGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#A18AFF" stopOpacity="1" />
            <Stop offset="100%" stopColor="#7C5CE0" stopOpacity="0.5" />
          </RadialGradient>
        </Defs>
        <Circle cx="50" cy="50" r="45" fill="none" stroke="url(#spinnerGradient)" strokeWidth="6" strokeLinecap="round" strokeDasharray="200" strokeDashoffset="50" />
        <Circle cx="50" cy="50" r="8" fill="#7C5CE0" />
      </Svg>
    </Animated.View>
  );
};

// Mood Emoji Animation
export const MoodEmoji: React.FC<LottieWrapperProps & { mood: 'happy' | 'calm' | 'sad' | 'anxious' | 'neutral' }> = ({
  size = 80,
  mood = 'neutral',
  autoPlay = true,
  style,
}) => {
  const bounceAnim = useRef(new (require('react-native').Animated).Value(0)).current;

  const emojis = {
    happy: '😊',
    calm: '😌',
    sad: '😢',
    anxious: '😰',
    neutral: '😐',
  };

  const colors = {
    happy: ['#FFD93D', '#FFC107'],
    calm: ['#6BB5FF', '#3B82F6'],
    sad: ['#A8B5C9', '#6B7280'],
    anxious: ['#FF9F43', '#F59E0B'],
    neutral: ['#E5E7EB', '#9CA3AF'],
  };

  useEffect(() => {
    if (autoPlay) {
      require('react-native').Animated.loop(
        require('react-native').Animated.sequence([
          require('react-native').Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 500,
            useNativeDriver: true,
          }),
          require('react-native').Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [autoPlay]);

  const Animated = require('react-native').Animated;
  const LinearGradient = require('expo-linear-gradient').LinearGradient;

  return (
    <Animated.View
      style={[
        styles.moodContainer,
        { width: size, height: size, transform: [{ translateY: bounceAnim }] },
        style,
      ]}
    >
      <LinearGradient
        colors={colors[mood]}
        style={[styles.moodCircle, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Text style={[styles.moodEmoji, { fontSize: size * 0.6 }]}>{emojis[mood]}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

// Celebration Confetti
export const CelebrationAnimation: React.FC<LottieWrapperProps> = ({
  size = 200,
  autoPlay = true,
  style,
}) => {
  const particles = useRef(
    Array.from({ length: 20 }, () => ({
      x: new (require('react-native').Animated).Value(size / 2),
      y: new (require('react-native').Animated).Value(size / 2),
      opacity: new (require('react-native').Animated).Value(1),
      scale: new (require('react-native').Animated).Value(0),
    }))
  ).current;

  const colors = ['#8B7CF6', '#F472B6', '#FBBF24', '#34D399', '#60A5FA', '#FF6B6B'];

  useEffect(() => {
    if (autoPlay) {
      particles.forEach((particle, index) => {
        const angle = (index / particles.length) * 2 * Math.PI;
        const distance = 50 + Math.random() * 50;

        require('react-native').Animated.sequence([
          require('react-native').Animated.delay(index * 30),
          require('react-native').Animated.parallel([
            require('react-native').Animated.timing(particle.x, {
              toValue: size / 2 + Math.cos(angle) * distance,
              duration: 600,
              useNativeDriver: true,
            }),
            require('react-native').Animated.timing(particle.y, {
              toValue: size / 2 + Math.sin(angle) * distance,
              duration: 600,
              useNativeDriver: true,
            }),
            require('react-native').Animated.sequence([
              require('react-native').Animated.timing(particle.scale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
              require('react-native').Animated.timing(particle.scale, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
            require('react-native').Animated.timing(particle.opacity, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      });
    }
  }, [autoPlay]);

  const Animated = require('react-native').Animated;

  return (
    <View style={[{ width: size, height: size }, style]}>
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.confettiParticle,
            {
              backgroundColor: colors[index % colors.length],
              opacity: particle.opacity,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

// Wave Animation (for sleep/calm screens)
export const WaveAnimation: React.FC<LottieWrapperProps> = ({
  size = 300,
  autoPlay = true,
  loop = true,
  style,
}) => {
  const wave1 = useRef(new (require('react-native').Animated).Value(0)).current;
  const wave2 = useRef(new (require('react-native').Animated).Value(0)).current;

  useEffect(() => {
    if (autoPlay) {
      const anim1 = require('react-native').Animated.loop(
        require('react-native').Animated.timing(wave1, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      );

      const anim2 = require('react-native').Animated.loop(
        require('react-native').Animated.timing(wave2, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        })
      );

      anim1.start();
      anim2.start();

      return () => {
        anim1.stop();
        anim2.stop();
      };
    }
  }, [autoPlay]);

  const Animated = require('react-native').Animated;

  const translateX1 = wave1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -size],
  });

  const translateX2 = wave2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -size],
  });

  return (
    <View style={[styles.waveContainer, { width: size, height: size * 0.3 }, style]}>
      <Animated.View
        style={[
          styles.wave,
          {
            backgroundColor: 'rgba(107, 181, 255, 0.3)',
            transform: [{ translateX: translateX1 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          {
            backgroundColor: 'rgba(107, 181, 255, 0.2)',
            transform: [{ translateX: translateX2 }],
          },
        ]}
      />
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  breathingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingCircle: {
    position: 'absolute',
    overflow: 'hidden',
  },
  breathingInner: {
    backgroundColor: Colors.light.primary,
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCheck: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  moodContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodEmoji: {
    textAlign: 'center',
  },
  confettiParticle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  waveContainer: {
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    width: '200%',
    height: '100%',
    borderRadius: 100,
  },
});

export default {
  BreathingCircle,
  SuccessCheckmark,
  OraLoadingSpinner,
  MoodEmoji,
  CelebrationAnimation,
  WaveAnimation,
};
