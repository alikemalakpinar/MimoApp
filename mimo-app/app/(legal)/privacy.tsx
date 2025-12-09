// app/(legal)/privacy.tsx - ORA PRIVACY POLICY
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, AppConfig } from '../../shared/theme';

const PRIVACY_SECTIONS = [
  {
    title: '1. Toplanan Veriler',
    icon: 'database',
    content: `Hesap Bilgileri: Ad, e-posta, telefon (opsiyonel), doum tarihi
Sal1k Verileri: Test sonuçlar1, ruh hali kay1tlar1, günlük notlar
Kullan1m Verileri: Uygulama istatistikleri, cihaz bilgileri`,
  },
  {
    title: '2. Verilerin Kullan1m1',
    icon: 'settings',
    content: `" Hizmetlerimizi sunmak ve geli_tirmek
" Ki_iselle_tirilmi_ deneyim salamak
" Test sonuçlar1n1z1 analiz etmek
" Uzman e_le_tirmesi yapmak

Verilerinizi ASLA üçüncü taraflara satmay1z.`,
  },
  {
    title: '3. Veri Güvenlii',
    icon: 'shield',
    content: `" AES-256 _ifreleme
" SSL/TLS ile güvenli ileti_im
" Düzenli güvenlik denetimleri
" 0ki faktörlü kimlik dorulama`,
  },
  {
    title: '4. Haklar1n1z',
    icon: 'user-check',
    content: `KVKK ve GDPR kapsam1nda:
" Verilerinize eri_im hakk1
" Düzeltme ve silme hakk1
" Veri ta_1nabilirlii hakk1
" 0tiraz hakk1`,
  },
  {
    title: '5. 0leti_im',
    icon: 'mail',
    content: `Veri Koruma Görevlisi:
=ç privacy@ora-app.com
=Þ 0850 XXX XX XX`,
  },
];

export default function Privacy() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Feather name="x" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gizlilik Politikas1</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.introSection}>
            <View style={styles.iconContainer}>
              <Feather name="shield" size={32} color={Colors.light.secondary} />
            </View>
            <Text style={styles.introTitle}>Gizliliiniz Bizim 0çin Önemli</Text>
            <Text style={styles.introSubtitle}>Son güncelleme: Aral1k 2024</Text>
          </View>

          {PRIVACY_SECTIONS.map((section, index) => (
            <View key={index} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <Feather name={section.icon as any} size={18} color={Colors.light.primary} />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}

          <View style={styles.trustSection}>
            <Text style={styles.trustTitle}>Güvenlik Sertifikalar1m1z</Text>
            <View style={styles.trustBadges}>
              {['KVKK Uyumlu', 'GDPR Uyumlu', 'SSL ^ifreli'].map((badge, i) => (
                <View key={i} style={styles.badge}>
                  <Feather name="check-circle" size={20} color={Colors.light.secondary} />
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  introSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.light.secondary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  introSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  section: {
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  sectionContent: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginLeft: Spacing.xl + Spacing.sm,
  },
  trustSection: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  trustTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
  },
  trustBadges: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  badge: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
});
