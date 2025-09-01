// app/(auth)/welcome.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        
        {/* Logo Section */}
        <Animated.View 
          style={[
            styles.logoSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.logo}>
            <Text style={styles.logoText}>M</Text>
          </View>
          
          <Text style={styles.appName}>Mimo</Text>
          <Text style={styles.tagline}>Mind Yourself</Text>
        </Animated.View>

        {/* Illustration Section */}
        <Animated.View 
          style={[
            styles.illustrationSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Mental Health Illustration - Basit şekiller ile */}
          <View style={styles.illustration}>
            
            {/* Ana kalp ikonu */}
            <View style={styles.heartContainer}>
              <View style={styles.heart}>
                <Text style={styles.heartIcon}>💚</Text>
              </View>
              
              {/* Floating dots */}
              <View style={[styles.floatingDot, styles.dot1]} />
              <View style={[styles.floatingDot, styles.dot2]} />
              <View style={[styles.floatingDot, styles.dot3]} />
              <View style={[styles.floatingDot, styles.dot4]} />
            </View>

          </View>
        </Animated.View>

        {/* Text Content */}
        <Animated.View 
          style={[
            styles.textContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.title}>
            Mental Sağlığınız{'\n'}Bizim Önceliğimiz
          </Text>
          <Text style={styles.description}>
            Lisanslı psikologlarla güvenli bir şekilde bağlantı kurun ve 
            mental sağlığınızı iyileştirme yolculuğunuza başlayın.
          </Text>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View 
          style={[
            styles.actionSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Primary Button - Başlayalım */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(auth)/onboarding')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Başlayalım</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          {/* Secondary Button - Giriş Yap */}
          <View style={styles.loginSection}>
            <Text style={styles.loginText}>Zaten hesabınız var mı?</Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Giriş Yapın</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>

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

  logoSection: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  logo: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.md,
  },

  logoText: {
    fontSize: 36,
    fontWeight: Typography.bold,
    color: Colors.light.surface,
  },

  appName: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  tagline: {
    fontSize: Typography.lg,
    fontWeight: Typography.medium,
    color: Colors.light.textSecondary,
  },

  illustrationSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },

  illustration: {
    width: width * 0.8,
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.light.secondaryLight + '20', // 20% opacity
  },

  heartContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  heart: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },

  heartIcon: {
    fontSize: 60,
  },

  floatingDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: BorderRadius.full,
  },

  dot1: {
    top: -20,
    right: -20,
    backgroundColor: Colors.light.accent,
  },

  dot2: {
    bottom: -10,
    left: -30,
    backgroundColor: Colors.light.primaryLight,
    width: 12,
    height: 12,
  },

  dot3: {
    top: 20,
    left: -40,
    backgroundColor: Colors.light.secondary,
    width: 8,
    height: 8,
  },

  dot4: {
    bottom: 30,
    right: -25,
    backgroundColor: Colors.light.accent,
    width: 10,
    height: 10,
  },

  textContent: {
    marginBottom: Spacing.xl,
  },

  title: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: Typography.xxxl * Typography.lineHeight.tight,
  },

  description: {
    fontSize: Typography.lg,
    fontWeight: Typography.normal,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lg * Typography.lineHeight.relaxed,
    paddingHorizontal: Spacing.sm,
  },

  actionSection: {
    marginBottom: Spacing.lg,
  },

  primaryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },

  primaryButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
    marginRight: Spacing.sm,
  },

  arrow: {
    fontSize: Typography.lg,
    color: Colors.light.surface,
    fontWeight: Typography.semibold,
  },

  loginSection: {
    alignItems: 'center',
  },

  loginText: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },

  loginButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },

  loginButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.primaryLight,
  },
});