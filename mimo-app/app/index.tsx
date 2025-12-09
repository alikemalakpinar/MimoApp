// app/index.tsx - ORA PREMIUM SPLASH SCREEN
// "from now, find yourself"
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Colors, Spacing, AppConfig } from '../shared/theme';

const { width, height } = Dimensions.get('window');

// Ora Logo Component - Abstract "O" with inner glow representing the self
const OraLogo = ({ size = 120 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 120 120">
    <Defs>
      <RadialGradient id="logoGlow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#A18AFF" stopOpacity="0.8" />
        <Stop offset="50%" stopColor="#7C5CE0" stopOpacity="0.6" />
        <Stop offset="100%" stopColor="#5B3DC4" stopOpacity="0.3" />
      </RadialGradient>
      <RadialGradient id="innerGlow" cx="50%" cy="30%" r="60%">
        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
        <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </RadialGradient>
    </Defs>
    {/* Outer glow ring */}
    <Circle cx="60" cy="60" r="55" fill="url(#logoGlow)" opacity="0.3" />
    {/* Main circle */}
    <Circle
      cx="60"
      cy="60"
      r="45"
      fill="none"
      stroke="#7C5CE0"
      strokeWidth="6"
      strokeLinecap="round"
    />
    {/* Inner accent ring */}
    <Circle
      cx="60"
      cy="60"
      r="35"
      fill="none"
      stroke="#A18AFF"
      strokeWidth="2"
      strokeDasharray="10 5"
      opacity="0.6"
    />
    {/* Center dot - represents the self */}
    <Circle cx="60" cy="60" r="8" fill="#7C5CE0" />
    <Circle cx="60" cy="60" r="5" fill="#A18AFF" />
    {/* Inner glow overlay */}
    <Circle cx="60" cy="60" r="45" fill="url(#innerGlow)" />
    {/* Decorative arcs - journey paths */}
    <Path
      d="M30 60 Q45 30 60 30"
      fill="none"
      stroke="#20B2AA"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.5"
    />
    <Path
      d="M90 60 Q75 90 60 90"
      fill="none"
      stroke="#FF6B6B"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.5"
    />
  </Svg>
);

// Floating Orbs Background Component
const FloatingOrbs = () => {
  const orbs = [
    { x: width * 0.1, y: height * 0.2, size: 80, color: '#7C5CE0', opacity: 0.15 },
    { x: width * 0.8, y: height * 0.15, size: 120, color: '#20B2AA', opacity: 0.12 },
    { x: width * 0.2, y: height * 0.7, size: 100, color: '#FF6B6B', opacity: 0.1 },
    { x: width * 0.85, y: height * 0.6, size: 60, color: '#FFB347', opacity: 0.15 },
    { x: width * 0.5, y: height * 0.85, size: 90, color: '#A18AFF', opacity: 0.12 },
  ];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {orbs.map((orb, index) => (
        <View
          key={index}
          style={[
            styles.orb,
            {
              left: orb.x - orb.size / 2,
              top: orb.y - orb.size / 2,
              width: orb.size,
              height: orb.size,
              backgroundColor: orb.color,
              opacity: orb.opacity,
              borderRadius: orb.size / 2,
            },
          ]}
        />
      ))}
    </View>
  );
};

export default function Index() {
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Fade in and scale up logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Fade in tagline
      Animated.timing(taglineAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate after splash
    const timer = setTimeout(() => {
      router.replace('/(auth)/welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Gradient Background */}
      <LinearGradient
        colors={['#FAFAFA', '#F8F5FF', '#F0FFFE']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Floating Orbs */}
      <FloatingOrbs />

      {/* Content */}
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: Animated.multiply(scaleAnim, pulseAnim) },
              ],
            },
          ]}
        >
          {/* Glow Effect */}
          <View style={styles.logoGlow} />

          {/* Logo */}
          <OraLogo size={140} />
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.appName}>{AppConfig.name}</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: taglineAnim,
              transform: [
                {
                  translateY: taglineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.tagline}>{AppConfig.tagline}</Text>
        </Animated.View>
      </View>

      {/* Bottom decoration */}
      <View style={styles.bottomDecoration}>
        <View style={styles.decorationLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },

  logoGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.light.primary,
    opacity: 0.1,
  },

  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  appName: {
    fontSize: 56,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    letterSpacing: -2,
  },

  taglineContainer: {
    alignItems: 'center',
  },

  tagline: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.textSecondary,
    letterSpacing: 2,
    textTransform: 'lowercase',
  },

  orb: {
    position: 'absolute',
  },

  bottomDecoration: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  decorationLine: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.primary,
    opacity: 0.3,
  },
});
