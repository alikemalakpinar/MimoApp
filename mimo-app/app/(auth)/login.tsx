// app/(auth)/login.tsx - MINIMAL REDESIGN
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    Alert.alert('Hoş Geldiniz!', 'Giriş başarılı.', [
      { text: 'Tamam', onPress: () => router.push('/(tabs)/home') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Tekrar Hoş Geldiniz</Text>
            <Text style={styles.subtitle}>Hesabınıza giriş yapın</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-posta</Text>
              <View style={styles.inputContainer}>
                <Feather name="mail" size={18} color={Colors.light.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  placeholderTextColor={Colors.light.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre</Text>
              <View style={styles.inputContainer}>
                <Feather name="lock" size={18} color={Colors.light.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifrenizi girin"
                  value={formData.password}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                  placeholderTextColor={Colors.light.textLight}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={18}
                    color={Colors.light.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
              <Text style={styles.forgotPassword}>Şifremi unuttum</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Hesabınız yok mu?{' '}
              <Text
                style={styles.footerLink}
                onPress={() => router.push('/(auth)/register')}
              >
                Üye olun
              </Text>
            </Text>
          </View>
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

  keyboardView: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.huge,
  },

  header: {
    marginBottom: Spacing.huge,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
    letterSpacing: -1,
  },

  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },

  form: {
    marginBottom: Spacing.xxxl,
  },

  inputGroup: {
    marginBottom: Spacing.lg,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    ...Shadows.xs,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.textPrimary,
  },

  forgotPassword: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
    textAlign: 'right',
    marginBottom: Spacing.xl,
  },

  loginButton: {
    backgroundColor: Colors.light.textPrimary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.sm,
  },

  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.surface,
  },

  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.xl,
  },

  footerText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },

  footerLink: {
    fontWeight: '600',
    color: Colors.light.primary,
  },
});
