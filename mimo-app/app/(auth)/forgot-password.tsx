// app/(auth)/forgot-password.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateEmail = () => {
    if (!email.trim()) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin.');
      return false;
    }
    return true;
  };

  const handleSendResetEmail = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      // TODO: API call will be implemented here
      console.log('Reset password for:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSent(true);

    } catch (error) {
      Alert.alert('Hata', 'E-posta gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        <View style={styles.content}>
          
          {/* Success Illustration */}
          <Animated.View 
            style={[
              styles.successContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.successIcon}>
              <Text style={styles.successEmoji}>📧</Text>
            </View>
            
            <Text style={styles.successTitle}>E-posta Gönderildi!</Text>
            <Text style={styles.successDescription}>
              <Text style={styles.emailText}>{email}</Text> adresine şifre sıfırlama 
              bağlantısı gönderildi. Lütfen e-postanızı kontrol edin.
            </Text>

            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Sonraki Adımlar:</Text>
              <Text style={styles.instructionItem}>
                • E-postanızdaki bağlantıya tıklayın
              </Text>
              <Text style={styles.instructionItem}>
                • Yeni şifrenizi belirleyin
              </Text>
              <Text style={styles.instructionItem}>
                • Uygulamaya geri dönün ve giriş yapın
              </Text>
            </View>

            <Text style={styles.noteText}>
              E-posta gelmedi mi? Spam klasörünüzü kontrol edin.
            </Text>

          </Animated.View>

          {/* Action Buttons */}
          <Animated.View 
            style={[
              styles.actionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <TouchableOpacity
              onPress={() => handleSendResetEmail()}
              style={styles.resendButton}
              activeOpacity={0.8}
            >
              <Text style={styles.resendButtonText}>Tekrar Gönder</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              style={styles.backToLoginButton}
              activeOpacity={0.8}
            >
              <Text style={styles.backToLoginText}>← Giriş Sayfasına Dön</Text>
            </TouchableOpacity>
          </Animated.View>

        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          
          {/* Header */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.iconContainer}>
              <Text style={styles.lockIcon}>🔐</Text>
            </View>
            
            <Text style={styles.headerTitle}>Şifrenizi mi Unuttunuz?</Text>
            <Text style={styles.headerSubtitle}>
              E-posta adresinizi girin, size şifre sıfırlama 
              bağlantısı gönderelim.
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-posta Adresi</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>📧</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="ornek@email.com"
                  value={email}
                  onChangeText={(text) => setEmail(text.toLowerCase())}
                  placeholderTextColor={Colors.light.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoFocus
                />
              </View>
            </View>

          </Animated.View>

          {/* Submit Button */}
          <Animated.View 
            style={[
              styles.submitContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <TouchableOpacity
              onPress={handleSendResetEmail}
              style={[
                styles.submitButton,
                { opacity: isLoading ? 0.7 : 1 }
              ]}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
              </Text>
              {!isLoading && <Text style={styles.submitButtonArrow}>→</Text>}
            </TouchableOpacity>

            {/* Back to Login */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginLinkText}>Şifrenizi hatırladınız mı? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.loginLink}>Giriş Yapın</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

        </View>
      </KeyboardAvoidingView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },

  backButton: {
    position: 'absolute',
    top: -Spacing.xl,
    left: 0,
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.light.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  lockIcon: {
    fontSize: 40,
  },

  headerTitle: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },

  headerSubtitle: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.base * Typography.lineHeight.relaxed,
    paddingHorizontal: Spacing.md,
  },

  formContainer: {
    marginBottom: Spacing.xl,
  },

  inputGroup: {
    marginBottom: Spacing.lg,
  },

  inputLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.light.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    ...Shadows.sm,
  },

  inputIcon: {
    fontSize: Typography.lg,
    marginRight: Spacing.sm,
  },

  textInput: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.light.textPrimary,
    padding: 0,
  },

  submitContainer: {
    marginBottom: Spacing.xl,
  },

  submitButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },

  submitButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
    textAlign: 'center',
  },

  submitButtonArrow: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
    marginLeft: Spacing.sm,
  },

  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginLinkText: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
  },

  loginLink: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.light.primaryLight,
  },

  // Success Screen Styles
  successContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },

  successIcon: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  successEmoji: {
    fontSize: 50,
  },

  successTitle: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },

  successDescription: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.base * Typography.lineHeight.relaxed,
    marginBottom: Spacing.lg,
  },

  emailText: {
    fontWeight: Typography.semibold,
    color: Colors.light.primaryLight,
  },

  instructionsContainer: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    width: '100%',
    ...Shadows.sm,
  },

  instructionsTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
  },

  instructionItem: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: Typography.sm * Typography.lineHeight.normal,
  },

  noteText: {
    fontSize: Typography.sm,
    color: Colors.light.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  actionContainer: {
    alignItems: 'center',
  },

  resendButton: {
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },

  resendButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.primary,
  },

  backToLoginButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },

  backToLoginText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.light.textSecondary,
  },
});