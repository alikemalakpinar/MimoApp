// app/(auth)/login.tsx
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
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
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
    if (!formData.email.trim()) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin.');
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert('Hata', 'Lütfen şifrenizi girin.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: API call will be implemented here
      console.log('Login data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Hoş Geldiniz!', 
        'Giriş başarılı.',
        [{ text: 'Tamam', onPress: () => router.push('/(tabs)/home') }]
      );

    } catch (error) {
      Alert.alert('Hata', 'Giriş yapılırken bir hata oluştu. Lütfen bilgilerinizi kontrol edin.');
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
            
            <Text style={styles.headerTitle}>Tekrar Hoş Geldiniz</Text>
            <Text style={styles.headerSubtitle}>
              Hesabınıza giriş yapın
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
              <Text style={styles.inputLabel}>E-posta</Text>
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
              <Text style={styles.inputLabel}>Şifre</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Şifrenizi girin"
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

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                onPress={() => setFormData(prev => ({ ...prev, rememberMe: !prev.rememberMe }))}
                style={styles.rememberMeContainer}
              >
                <View style={[
                  styles.checkbox,
                  { backgroundColor: formData.rememberMe ? Colors.light.primary : Colors.light.surface }
                ]}>
                  {formData.rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rememberMeText}>Beni hatırla</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
                <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
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
              onPress={handleLogin}
              style={[
                styles.submitButton,
                { opacity: isLoading ? 0.7 : 1 }
              ]}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </Text>
              {!isLoading && <Text style={styles.submitButtonArrow}>→</Text>}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>🔍</Text>
                <Text style={styles.socialButtonText}>Google ile Giriş</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>📱</Text>
                <Text style={styles.socialButtonText}>Apple ile Giriş</Text>
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View style={styles.registerLinkContainer}>
              <Text style={styles.registerLinkText}>Hesabınız yok mu? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.registerLink}>Kayıt Olun</Text>
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

  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },

  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },

  checkmark: {
    color: Colors.light.surface,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },

  rememberMeText: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
  },

  forgotPasswordText: {
    fontSize: Typography.sm,
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

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },

  dividerText: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
    paddingHorizontal: Spacing.md,
  },

  socialButtonsContainer: {
    marginBottom: Spacing.lg,
  },

  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },

  socialIcon: {
    fontSize: Typography.lg,
    marginRight: Spacing.sm,
  },

  socialButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.light.textPrimary,
  },

  registerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  registerLinkText: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
  },

  registerLink: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.light.primaryLight,
  },
});