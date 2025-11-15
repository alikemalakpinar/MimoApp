// app/subscription/index.tsx - SUBSCRIPTION PLANS
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';

const PLANS = [
  {
    id: 'basic',
    name: 'Temel',
    price: 499,
    period: 'ay',
    features: [
      'Ayda 2 seans',
      'Mesajlaşma desteği',
      'Günlük ve mood tracking',
      'Meditasyon kütüphanesi',
    ],
    color: '#E8F4FF',
    popular: false,
  },
  {
    id: 'standard',
    name: 'Standart',
    price: 899,
    period: 'ay',
    features: [
      'Ayda 4 seans',
      '7/24 mesajlaşma',
      'Günlük ve mood tracking',
      'Tüm meditasyonlar',
      'Grup seansları',
      'Haftalık raporlar',
    ],
    color: '#E8F8F0',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1499,
    period: 'ay',
    features: [
      'Sınırsız seans',
      '7/24 öncelikli destek',
      'Kendi terapistini seç',
      'Tüm özellikler',
      'Video kayıtları',
      'Kişisel gelişim koçu',
    ],
    color: '#FFE8DC',
    popular: false,
  },
];

export default function Subscription() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('standard');

  const handleSubscribe = () => {
    const plan = PLANS.find(p => p.id === selectedPlan);
    Alert.alert(
      'Abonelik',
      `${plan?.name} planı seçtiniz. Ödeme sayfasına yönlendiriliyorsunuz.`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Devam Et', onPress: () => console.log('Subscribe') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Abonelik Planları</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Mental sağlığınız için size uygun planı seçin
        </Text>

        {PLANS.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              { backgroundColor: plan.color },
              selectedPlan === plan.id && styles.planCardActive,
            ]}
            onPress={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Feather name="star" size={12} color={Colors.light.surface} />
                <Text style={styles.popularText}>En Popüler</Text>
              </View>
            )}

            <Text style={styles.planName}>{plan.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{plan.price}₺</Text>
              <Text style={styles.period}>/{plan.period}</Text>
            </View>

            <View style={styles.featuresContainer}>
              {plan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <Feather name="check" size={18} color={Colors.light.secondary} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <View style={[
              styles.radio,
              selectedPlan === plan.id && styles.radioActive,
            ]}>
              {selectedPlan === plan.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeButtonText}>Abone Ol</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          Devam ederek Kullanım Şartları'nı kabul edersiniz
        </Text>
      </View>
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
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 120,
  },

  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: 22,
  },

  planCard: {
    padding: Spacing.xxl,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.lg,
    position: 'relative',
    borderWidth: 3,
    borderColor: 'transparent',
  },

  planCardActive: {
    borderColor: Colors.light.textPrimary,
  },

  popularBadge: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },

  popularText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.surface,
  },

  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xl,
  },

  price: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  period: {
    fontSize: 18,
    color: Colors.light.textSecondary,
  },

  featuresContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  featureText: {
    fontSize: 14,
    color: Colors.light.textPrimary,
  },

  radio: {
    alignSelf: 'center',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioActive: {
    borderColor: Colors.light.textPrimary,
  },

  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.textPrimary,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
  },

  subscribeButton: {
    backgroundColor: Colors.light.textPrimary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },

  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.surface,
  },

  termsText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
