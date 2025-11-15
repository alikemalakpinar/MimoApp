// app/(auth)/email-verification.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

export default function EmailVerification() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const checkAnim = new Animated.Value(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(60);
    setCanResend(false);
    // TODO: Resend verification email
  };

  const handleContinue = () => {
    // Demo için direkt onboarding'e yönlendir
    router.push('/(auth)/onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Feather name="mail" size={48} color={Colors.light.primary} />
          </View>
        </View>

        <Text style={styles.title}>E-postanızı Doğrulayın</Text>
        <Text style={styles.description}>
          örnek@email.com adresine bir doğrulama bağlantısı gönderdik.
          Lütfen e-postanızı kontrol edin.
        </Text>

        <View style={styles.checklistContainer}>
          <View style={styles.checklistItem}>
            <Feather name="check-circle" size={20} color={Colors.light.secondary} />
            <Text style={styles.checklistText}>Gelen kutunuzu kontrol edin</Text>
          </View>
          <View style={styles.checklistItem}>
            <Feather name="check-circle" size={20} color={Colors.light.secondary} />
            <Text style={styles.checklistText}>Spam klasörüne bakın</Text>
          </View>
          <View style={styles.checklistItem}>
            <Feather name="check-circle" size={20} color={Colors.light.secondary} />
            <Text style={styles.checklistText}>Doğrulama linkine tıklayın</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>E-postayı Doğruladım</Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>E-posta almadınız mı?</Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={!canResend}
            style={styles.resendButton}
          >
            <Text style={[
              styles.resendButtonText,
              !canResend && styles.resendButtonTextDisabled,
            ]}>
              {canResend ? 'Tekrar Gönder' : `Tekrar gönder (${countdown}s)`}
            </Text>
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    marginBottom: Spacing.xl,
  },

  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },

  description: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: Typography.base * 1.5,
  },

  checklistContainer: {
    width: '100%',
    marginBottom: Spacing.xxl,
  },

  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  checklistText: {
    fontSize: Typography.base,
    color: Colors.light.textPrimary,
    marginLeft: Spacing.md,
  },

  continueButton: {
    width: '100%',
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadows.md,
  },

  continueButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
  },

  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },

  resendText: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
    marginRight: Spacing.xs,
  },

  resendButton: {
    padding: Spacing.xs,
  },

  resendButtonText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.light.primary,
  },

  resendButtonTextDisabled: {
    color: Colors.light.textLight,
  },
});
