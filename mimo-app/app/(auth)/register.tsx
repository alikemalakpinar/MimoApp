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
      
      // Görseldeki akışa göre email verification'a yönlendir
      router.push('/(auth)/email-verification');

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
          
          {/* Header - Görseldeki minimal design */}
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
            
            <Text style={styles.headerTitle}>Hesap Oluştur</Text>
            <Text style={styles.headerSubtitle}>
              Mental sağlık yolculuğuna başlayın
            </Text>
          </Animated.View>

          {/* Form - Modern minimal style */}
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
              <Text style={styles.inputLabel}>Ad Soyad</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Adınızı ve soyadınızı girin"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholderTextColor={Colors.light.textLight}
                autoCapitalize="words"
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-posta</Text>
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

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Şifre</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
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
                  <Text style={styles.eyeIcon}>{showPassword ? '👁' : '🙈'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Şifre Tekrar</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
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
                  <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁' : '🙈'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms & Conditions - Minimal checkbox */}
            <TouchableOpacity
              onPress={() => setFormData(prev => ({ ...prev, acceptTerms: !prev.acceptTerms }))}
              style={styles.termsContainer}
            >
              <View style={[
                styles.checkbox,
                { backgroundColor: formData.acceptTerms ? Colors.light.primary : 'transparent' }
              ]}>
                {formData.acceptTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                <Text style={styles.termsLink}>Kullanım Şartları</Text> ve{' '}
                <Text style={styles.termsLink}>Gizlilik Politikası</Text>'nı kabul ediyorum
              </Text>
            </TouchableOpacity>

          </Animated.View>

          {/* Submit Button - Görseldeki stil */}
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
                {isLoading ? 'Hesap Oluşturuluyor...' : 'Devam Et'}
              </Text>
            </TouchableOpacity>

            {/* Social Login Options */}
            <View style={styles.socialContainer}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>veya</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>G</Text>
                <Text style={styles.socialButtonText}>Google ile devam et</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>f</Text>
                <Text style={styles.socialButtonText}>Facebook ile devam et</Text>
              </TouchableOpacity>
            </View>

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
    backgroundColor: '#FFFFFF', // Görseldeki beyaz arka plan
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
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxxl,
  },

  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonText: {
    fontSize: 18,
    color: '#333',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: Spacing.xs,
    marginTop: Spacing.xl,
  },

  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  formContainer: {
    marginBottom: Spacing.xl,
  },

  inputGroup: {
    marginBottom: Spacing.lg,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: Spacing.xs,
  },

  textInput: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: 12,
    fontSize: 16,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  passwordInput: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    fontSize: 16,
    color: '#1A1A1A',
  },

  eyeButton: {
    padding: Spacing.md,
  },

  eyeIcon: {
    fontSize: 16,
  },

  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.lg,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    marginTop: 2,
  },

  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  termsLink: {
    color: Colors.light.primary,
    fontWeight: '600',
  },

  submitContainer: {
    marginTop: Spacing.xl,
  },

  submitButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  socialContainer: {
    marginVertical: Spacing.lg,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  dividerText: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: Spacing.md,
  },

  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },

  socialIcon: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: Spacing.sm,
    color: Colors.light.primary,
  },

  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },

  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },

  loginLinkText: {
    fontSize: 14,
    color: '#666',
  },

  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
});