// app/(patient)/settings.tsx - SETTINGS SCREEN
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows, useThemeStore } from '../../shared/theme';

interface SettingItemProps {
  icon: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showArrow?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  iconColor = Colors.light.primary,
  title,
  subtitle,
  onPress,
  rightElement,
  showArrow = true,
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={!onPress && !rightElement}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View style={[styles.settingIcon, { backgroundColor: iconColor + '15' }]}>
      <Feather name={icon as any} size={20} color={iconColor} />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {rightElement || (showArrow && onPress && (
      <Feather name="chevron-right" size={20} color={Colors.light.textTertiary} />
    ))}
  </TouchableOpacity>
);

export default function Settings() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { mode, isDark, setMode, toggleTheme } = useThemeStore();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: () => router.replace('/(auth)/login') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Hesabı Sil', style: 'destructive', onPress: () => {
          // TODO: Implement account deletion
          router.replace('/(auth)/login');
        }},
      ]
    );
  };

  const themeModeLabel = mode === 'system' ? 'Sistem' : mode === 'dark' ? 'Koyu' : 'Açık';

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={isDark ? Colors.dark.textPrimary : Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>Ayarlar</Text>
        <View style={{ width: 44 }} />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={[styles.sectionTitle, isDark && styles.textSecondaryDark]}>Hesap</Text>
          <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
            <SettingItem
              icon="user"
              title="Profil"
              subtitle="Bilgilerinizi düzenleyin"
              onPress={() => router.push('/(patient)/profile')}
            />
            <SettingItem
              icon="award"
              iconColor={Colors.light.gold}
              title="Başarılar"
              subtitle="Rozetler ve seviyeler"
              onPress={() => router.push('/(patient)/achievements')}
            />
            <SettingItem
              icon="bell"
              iconColor={Colors.light.accent}
              title="Bildirimler"
              subtitle="Bildirim tercihlerinizi yönetin"
              onPress={() => {}}
            />
          </View>
        </Animated.View>

        {/* Appearance Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={[styles.sectionTitle, isDark && styles.textSecondaryDark]}>Görünüm</Text>
          <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
            <SettingItem
              icon="moon"
              iconColor={Colors.light.calm}
              title="Koyu Mod"
              subtitle={`Şu an: ${themeModeLabel}`}
              rightElement={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: Colors.light.border, true: Colors.light.primary + '50' }}
                  thumbColor={isDark ? Colors.light.primary : Colors.light.surface}
                />
              }
              showArrow={false}
            />
            <TouchableOpacity style={styles.themeOptions}>
              {(['light', 'dark', 'system'] as const).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.themeOption,
                    mode === m && styles.themeOptionActive,
                  ]}
                  onPress={() => setMode(m)}
                >
                  <Feather
                    name={m === 'light' ? 'sun' : m === 'dark' ? 'moon' : 'smartphone'}
                    size={16}
                    color={mode === m ? '#FFFFFF' : Colors.light.textSecondary}
                  />
                  <Text
                    style={[
                      styles.themeOptionText,
                      mode === m && styles.themeOptionTextActive,
                    ]}
                  >
                    {m === 'light' ? 'Açık' : m === 'dark' ? 'Koyu' : 'Sistem'}
                  </Text>
                </TouchableOpacity>
              ))}
            </TouchableOpacity>
            <SettingItem
              icon="globe"
              iconColor={Colors.light.secondary}
              title="Dil"
              subtitle="Türkçe"
              onPress={() => {}}
            />
          </View>
        </Animated.View>

        {/* Privacy Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={[styles.sectionTitle, isDark && styles.textSecondaryDark]}>Gizlilik & Güvenlik</Text>
          <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
            <SettingItem
              icon="lock"
              iconColor={Colors.light.nature}
              title="Gizlilik"
              subtitle="Veri paylaşımı ayarları"
              onPress={() => {}}
            />
            <SettingItem
              icon="shield"
              iconColor={Colors.light.primary}
              title="Güvenlik"
              subtitle="Şifre ve oturum yönetimi"
              onPress={() => {}}
            />
            <SettingItem
              icon="download"
              iconColor={Colors.light.calm}
              title="Verilerimi İndir"
              subtitle="KVKK kapsamında"
              onPress={() => {}}
            />
          </View>
        </Animated.View>

        {/* Support Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={[styles.sectionTitle, isDark && styles.textSecondaryDark]}>Destek</Text>
          <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
            <SettingItem
              icon="help-circle"
              iconColor={Colors.light.info}
              title="Yardım Merkezi"
              subtitle="SSS ve destek"
              onPress={() => {}}
            />
            <SettingItem
              icon="message-circle"
              iconColor={Colors.light.secondary}
              title="Bize Ulaşın"
              subtitle="destek@oraapp.com"
              onPress={() => Linking.openURL('mailto:destek@oraapp.com')}
            />
            <SettingItem
              icon="star"
              iconColor={Colors.light.gold}
              title="Uygulamayı Değerlendir"
              onPress={() => {}}
            />
          </View>
        </Animated.View>

        {/* Legal Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={[styles.sectionTitle, isDark && styles.textSecondaryDark]}>Yasal</Text>
          <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
            <SettingItem
              icon="file-text"
              title="Kullanım Koşulları"
              onPress={() => router.push('/(legal)/terms')}
            />
            <SettingItem
              icon="shield"
              title="Gizlilik Politikası"
              onPress={() => router.push('/(legal)/privacy')}
            />
          </View>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={[styles.sectionTitle, isDark && styles.textSecondaryDark]}>Tehlikeli Bölge</Text>
          <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
            <SettingItem
              icon="log-out"
              iconColor={Colors.light.warning}
              title="Çıkış Yap"
              onPress={handleLogout}
              showArrow={false}
            />
            <SettingItem
              icon="trash-2"
              iconColor={Colors.light.error}
              title="Hesabı Sil"
              subtitle="Bu işlem geri alınamaz"
              onPress={handleDeleteAccount}
              showArrow={false}
            />
          </View>
        </Animated.View>

        {/* App Info */}
        <Animated.View style={[styles.appInfo, { opacity: fadeAnim }]}>
          <Text style={styles.appName}>Ora</Text>
          <Text style={styles.appVersion}>Versiyon 1.0.0</Text>
          <Text style={styles.appTagline}>from now, find yourself</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  containerDark: {
    backgroundColor: Colors.dark.background,
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
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  textDark: {
    color: Colors.dark.textPrimary,
  },
  textSecondaryDark: {
    color: Colors.dark.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  sectionCardDark: {
    backgroundColor: Colors.dark.surface,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  settingSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  themeOptions: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  themeOptionActive: {
    backgroundColor: Colors.light.primary,
  },
  themeOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  themeOptionTextActive: {
    color: '#FFFFFF',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.primary,
  },
  appVersion: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
  },
  appTagline: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.light.textTertiary,
    marginTop: Spacing.xs,
  },
});
