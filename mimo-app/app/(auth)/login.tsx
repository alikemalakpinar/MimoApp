// app/(auth)/register.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '', 
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı girin.');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin.');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return false;
    }
    if (!formData.acceptTerms) {
      Alert.alert('Hata', 'Kullanım şartlarını kabul etmelisiniz.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: API call will be implemented here
      console.log('Register data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Başarılı!', 
        'Hesabınız başarıyla oluşturuldu. Şimdi giriş yapabilirsiniz.',
        [{ text: 'Tamam', onPress: () => router.push('/(tabs)/home') }]
      );

    } catch (error) {
      Alert.alert('Hata', 'Hesap oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          
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
            
            <View style={styles.logo}>
              <Text style={styles.logoText}>M</Text>
            </View>
            
            <Text style={styles.headerTitle}>Hesap Oluşturun</Text>
            <Text style={styles.headerSubtitle}>
              Mental sağlık yolculuğunuza başlayın
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
            
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ad Soyad *</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Adınızı ve soyadınızı girin"
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholderTextColor={Colors.light.textLight}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-posta *</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>📧</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text.toLowerCase() }))}
                  placeholderTextColor={Colors.light.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Şifre *</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="En az 6 karakter"
                  value={formData.password}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                  placeholderTextColor={Colors.light.textLight}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Şifre Tekrar *</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Şifrenizi tekrar girin"
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                  placeholderTextColor={Colors.light.textLight}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '🙈'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms & Conditions */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                onPress={() => setFormData(prev => ({ ...prev, acceptTerms: !prev.acceptTerms }))}
                style={styles.checkboxContainer}
              >
                <View style={[
                  styles.checkbox,
                  { backgroundColor: formData.acceptTerms ? Colors.light.primary : Colors.light.surface }
                ]}>
                  {formData.acceptTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                  <Text style={styles.termsLink}>Kullanım Şartları</Text> ve{' '}
                  <Text style={styles.termsLink}>Gizlilik Politikası</Text>'nı 
                  okudum ve kabul ediyorum.
                </Text>
              </TouchableOpacity>
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
              onPress={handleRegister}
              style={[
                styles.submitButton,
                { opacity: isLoading ? 0.7 : 1 }
              ]}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
              </Text>
              {!isLoading && <Text style={styles.submitButtonArrow}>→</Text>}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginLinkText}>Zaten hesabınız var mı? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.loginLink}>Giriş Yapın</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

        </ScrollView>
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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  header: {
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },

  backButton: {
    position: 'absolute',
    top: 0,
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

  logo: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },

  logoText: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.surface,
  },

  headerTitle: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  headerSubtitle: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
    textAlign: 'center',
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
    paddingVertical: Spacing.sm,
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

  eyeButton: {
    padding: Spacing.xs,
  },

  eyeIcon: {
    fontSize: Typography.base,
  },

  termsContainer: {
    marginTop: Spacing.md,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    marginTop: 2,
  },

  checkmark: {
    color: Colors.light.surface,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },

  termsText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
    lineHeight: Typography.sm * Typography.lineHeight.relaxed,
  },

  termsLink: {
    color: Colors.light.primaryLight,
    fontWeight: Typography.medium,
  },

  submitContainer: {
    marginTop: Spacing.lg,
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
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
  },

  submitButtonArrow: {
    fontSize: Typography.lg,
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
});