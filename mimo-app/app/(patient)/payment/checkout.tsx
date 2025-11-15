// app/(patient)/payment/checkout.tsx - MINIMAL REDESIGN
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
import { Colors, Spacing, BorderRadius, Shadows } from '../../../shared/theme';
import { Feather } from '@expo/vector-icons';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Kredi Kartı', icon: 'credit-card' },
  { id: 'apple', label: 'Apple Pay', icon: 'smartphone' },
];

export default function Checkout() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    
    Alert.alert('Ödeme Başarılı!', 'Randevunuz oluşturuldu.', [
      { text: 'Tamam', onPress: () => router.replace('/(tabs)/appointments') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ödeme</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.securityBanner}>
          <Feather name="shield" size={16} color={Colors.light.secondary} />
          <Text style={styles.securityText}>Güvenli ödeme</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ödeme yöntemi</Text>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedMethod === method.id && styles.paymentMethodActive,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodLeft}>
                <View style={styles.methodIcon}>
                  <Feather name={method.icon as any} size={18} color={Colors.light.textPrimary} />
                </View>
                <Text style={styles.methodLabel}>{method.label}</Text>
              </View>
              <View style={[
                styles.radio,
                selectedMethod === method.id && styles.radioActive,
              ]}>
                {selectedMethod === method.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Toplam</Text>
            <Text style={styles.summaryValue}>800₺</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <Feather name="lock" size={18} color={Colors.light.surface} />
          <Text style={styles.payButtonText}>
            {isProcessing ? 'İşleniyor...' : '800₺ Öde'}
          </Text>
        </TouchableOpacity>
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
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

  securityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F8F0',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xxl,
    gap: Spacing.xs,
  },

  securityText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.secondary,
  },

  section: {
    marginBottom: Spacing.xxl,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.xs,
  },

  paymentMethodActive: {
    borderColor: Colors.light.textPrimary,
  },

  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  methodIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  methodLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioActive: {
    borderColor: Colors.light.textPrimary,
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.textPrimary,
  },

  summaryCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    ...Shadows.sm,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FF',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xl,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
  },

  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.textPrimary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    ...Shadows.sm,
  },

  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.surface,
  },
});
