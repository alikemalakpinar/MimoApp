// app/(auth)/register.tsx - MINIMAL REDESIGN
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (!formData.acceptTerms) {
      Alert.alert('Hata', 'Kullanım şartlarını kabul etmelisiniz.');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    router.push('/(auth)/email-verification');
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
            <Text style={styles.title}>Hesap Oluşturun</Text>
            <Text style={styles.subtitle}>Mimo ailesine katılın</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ad Soyad</Text>
              <View style={styles.inputContainer}>
                <Feather name="user" size={18} color={Colors.light.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Adınız ve soyadınız"
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholderTextColor={Colors.light.textLight}
                />
              </View>
            </View>

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
                  placeholder="En az 6 karakter"
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

            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setFormData(prev => ({ ...prev, acceptTerms: !prev.acceptTerms }))}
            >
              <View style={[
                styles.checkbox,
                formData.acceptTerms && styles.checkboxChecked,
              ]}>
                {formData.acceptTerms && (
                  <Feather name="check" size={12} color={Colors.light.surface} />
                )}
              </View>
              <Text style={styles.termsText}>
                Kullanım Şartları'nı kabul ediyorum
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Zaten hesabınız var mı?{' '}
              <Text
                style={styles.footerLink}
                onPress={() => router.push('/(auth)/login')}
              >
                Giriş yapın
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

  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },

  checkboxChecked: {
    backgroundColor: Colors.light.textPrimary,
    borderColor: Colors.light.textPrimary,
  },

  termsText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  registerButton: {
    backgroundColor: Colors.light.textPrimary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.sm,
  },

  registerButtonText: {
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
