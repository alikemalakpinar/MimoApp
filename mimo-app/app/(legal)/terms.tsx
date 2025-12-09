// app/(legal)/terms.tsx - ORA TERMS OF SERVICE
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
import { Colors, Spacing, BorderRadius, AppConfig } from '../../shared/theme';

const TERMS_SECTIONS = [
  {
    title: '1. Hizmet Tan1m1',
    content: `${AppConfig.name}, kullan1c1lar1n ruh sal11 yolculuklar1nda kendilerini ke_fetmelerine yard1mc1 olan bir dijital platformdur. Uygulamam1z psikolojik testler, günlük takip araçlar1, topluluk payla_1mlar1 ve lisansl1 uzmanlarla balant1 kurma imkan1 sunar.

${AppConfig.name} bir acil durum hizmeti deildir. Acil psikolojik kriz durumlar1nda lütfen 182 (0ntihar Önleme Hatt1) veya en yak1n sal1k kurulu_unu aray1n.`,
  },
  {
    title: '2. Kullan1c1 Hesab1',
    content: `Hizmetlerimizi kullanmak için bir hesap olu_turman1z gerekmektedir. Hesap olu_tururken:

" Doru ve güncel bilgiler vermeyi kabul edersiniz
" Hesap güvenliinizden siz sorumlusunuz
" 18 ya_1ndan küçükseniz veli/vasi onay1 gereklidir
" Hesab1n1z1 ba_kalar1yla payla_amazs1n1z`,
  },
  {
    title: '3. Gizlilik ve Veri Güvenlii',
    content: `Ki_isel verileriniz KVKK ve GDPR kapsam1nda korunmaktad1r.

" Tüm veriler _ifrelenmi_ olarak saklan1r
" Test sonuçlar1n1z yaln1zca sizin izninizle payla_1l1r
" Anonim payla_1m seçenei mevcuttur
" Verilerinizi istediiniz zaman silebilirsiniz`,
  },
  {
    title: '4. Uzman Hizmetleri',
    content: `Platformumuzda yer alan tüm psikologlar ve psikiyatristler lisansl1d1r.

Seans Ücretleri:
" Standart seans: 1.250 TL
" Örenci indirimi: 850 TL
" Platform komisyonu: %15`,
  },
  {
    title: '5. Topluluk Kurallar1',
    content: `My Journey bölümünde payla_1m yaparken:

" Ba_kalar1na sayg1l1 olun
" Nefret söylemi ve taciz yasakt1r
" Ki_isel sal1k tavsiyeleri vermeyin
" Reklam ve spam payla_may1n`,
  },
  {
    title: '6. Ödeme ve 0ptal',
    content: `" Ödemeler güvenli altyap1 ile i_lenir
" Abonelikler otomatik yenilenir
" Seans iptali 24 saat öncesinden bildirilmelidir
" Geç iptal durumunda ücret iadesi yap1lmaz`,
  },
  {
    title: '7. 0leti_im',
    content: `Sorular1n1z için:
=ç destek@ora-app.com
=Þ 0850 XXX XX XX`,
  },
];

export default function Terms() {
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
        <Text style={styles.headerTitle}>Kullan1m Ko_ullar1</Text>
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
              <Feather name="file-text" size={32} color={Colors.light.primary} />
            </View>
            <Text style={styles.introTitle}>{AppConfig.name} Kullan1m Ko_ullar1</Text>
            <Text style={styles.introSubtitle}>Son güncelleme: Aral1k 2024</Text>
          </View>

          {TERMS_SECTIONS.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Bu ko_ullar1 kabul ederek {AppConfig.name} hizmetlerini kullanmay1 onayl1yorsunuz.
            </Text>
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },
  sectionContent: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  footer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: Colors.light.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
