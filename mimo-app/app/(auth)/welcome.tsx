// app/(auth)/welcome.tsx - MINIMAL REDESIGN
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logo}>
            <Feather name="heart" size={40} color={Colors.light.surface} />
          </View>
          <Text style={styles.appName}>Mimo</Text>
          <Text style={styles.tagline}>Mental sağlığınıza destek</Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustration}>
          <View style={styles.illustrationCard}>
            <Feather name="smile" size={64} color={Colors.light.primary} />
          </View>
        </View>

        {/* Text */}
        <View style={styles.textSection}>
          <Text style={styles.title}>
            Mental Sağlığınız{"\n"}Bizim Önceliğimiz
          </Text>
          <Text style={styles.description}>
            Lisanslı psikologlarla güvenli bir şekilde bağlantı kurun
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.primaryButtonText}>Başlayalım</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.secondaryButtonText}>Zaten hesabım var</Text>
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

  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.huge,
  },

  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.huge,
  },

  logo: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },

  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
    letterSpacing: -1,
  },

  tagline: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },

  illustration: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.huge,
  },

  illustrationCard: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: BorderRadius.xxxl,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 36,
    letterSpacing: -0.5,
  },

  description: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  actions: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  primaryButton: {
    backgroundColor: Colors.light.textPrimary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.sm,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.surface,
  },

  secondaryButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
});
