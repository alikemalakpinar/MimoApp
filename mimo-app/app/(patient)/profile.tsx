// app/(patient)/profile.tsx - PROFILE EDIT SCREEN
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows, useThemeStore } from '../../shared/theme';

export default function ProfileEdit() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { isDark } = useThemeStore();
  const colors = isDark ? Colors.dark : Colors.light;

  const [name, setName] = useState('Ayşe Yılmaz');
  const [username, setUsername] = useState('ayseyilmaz');
  const [bio, setBio] = useState('Mental sağlık yolculuğum\nMindfulness & Yoga\nHer gün günlük yazma alışkanlığım');
  const [email, setEmail] = useState('ayse@email.com');
  const [phone, setPhone] = useState('+90 555 123 4567');
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSave = () => {
    // TODO: Save to API
    Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.', [
      { text: 'Tamam', onPress: () => router.back() }
    ]);
  };

  const handleChange = (setter: (val: string) => void) => (val: string) => {
    setter(val);
    setIsEdited(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="x" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Profili Düzenle</Text>
        <TouchableOpacity
          style={[styles.saveButton, !isEdited && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isEdited}
        >
          <Text style={[styles.saveText, !isEdited && styles.saveTextDisabled]}>Kaydet</Text>
        </TouchableOpacity>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section */}
          <Animated.View style={[styles.avatarSection, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarRing}
            >
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>AY</Text>
              </View>
            </LinearGradient>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={[styles.changePhotoText, { color: colors.primary }]}>Fotoğrafı Değiştir</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Form Fields */}
          <Animated.View style={[styles.formSection, { opacity: fadeAnim }]}>
            <View style={[styles.inputGroup, { backgroundColor: colors.surface }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Ad Soyad</Text>
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                value={name}
                onChangeText={handleChange(setName)}
                placeholder="Adınızı girin"
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <View style={[styles.inputGroup, { backgroundColor: colors.surface }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Kullanıcı Adı</Text>
              <View style={styles.usernameInput}>
                <Text style={[styles.usernamePrefix, { color: colors.textTertiary }]}>@</Text>
                <TextInput
                  style={[styles.input, styles.usernameField, { color: colors.textPrimary }]}
                  value={username}
                  onChangeText={handleChange(setUsername)}
                  placeholder="kullanici_adi"
                  placeholderTextColor={colors.textTertiary}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { backgroundColor: colors.surface }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Biyografi</Text>
              <TextInput
                style={[styles.input, styles.bioInput, { color: colors.textPrimary }]}
                value={bio}
                onChangeText={handleChange(setBio)}
                placeholder="Kendinizden bahsedin..."
                placeholderTextColor={colors.textTertiary}
                multiline
                textAlignVertical="top"
                maxLength={150}
              />
              <Text style={[styles.charCount, { color: colors.textTertiary }]}>{bio.length}/150</Text>
            </View>

            <View style={[styles.inputGroup, { backgroundColor: colors.surface }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>E-posta</Text>
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                value={email}
                onChangeText={handleChange(setEmail)}
                placeholder="email@ornek.com"
                placeholderTextColor={colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputGroup, { backgroundColor: colors.surface }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Telefon</Text>
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                value={phone}
                onChangeText={handleChange(setPhone)}
                placeholder="+90 555 123 4567"
                placeholderTextColor={colors.textTertiary}
                keyboardType="phone-pad"
              />
            </View>
          </Animated.View>

          {/* Privacy Section */}
          <Animated.View style={[styles.privacySection, { opacity: fadeAnim }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Gizlilik</Text>

            <TouchableOpacity style={[styles.privacyItem, { backgroundColor: colors.surface }]}>
              <View style={styles.privacyInfo}>
                <Feather name="lock" size={20} color={colors.primary} />
                <View>
                  <Text style={[styles.privacyTitle, { color: colors.textPrimary }]}>Hesap Gizliliği</Text>
                  <Text style={[styles.privacyDesc, { color: colors.textSecondary }]}>Profilini kimler görebilir</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.privacyItem, { backgroundColor: colors.surface }]}>
              <View style={styles.privacyInfo}>
                <Feather name="eye-off" size={20} color={colors.secondary} />
                <View>
                  <Text style={[styles.privacyTitle, { color: colors.textPrimary }]}>Anonim Paylaşım</Text>
                  <Text style={[styles.privacyDesc, { color: colors.textSecondary }]}>Gönderilerinde kimliğini gizle</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.button,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.light.border,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveTextDisabled: {
    color: Colors.light.textTertiary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  changePhotoButton: {
    paddingVertical: Spacing.sm,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  formSection: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    fontSize: 16,
    paddingVertical: Spacing.xs,
  },
  usernameInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernamePrefix: {
    fontSize: 16,
    marginRight: 2,
  },
  usernameField: {
    flex: 1,
  },
  bioInput: {
    minHeight: 80,
  },
  charCount: {
    fontSize: 11,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  privacySection: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  privacyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  privacyTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  privacyDesc: {
    fontSize: 12,
    marginTop: 2,
  },
});
