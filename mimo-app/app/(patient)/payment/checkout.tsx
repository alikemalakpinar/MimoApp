// app/(patient)/payment/checkout.tsx
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
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../shared/theme';
import { Feather } from '@expo/vector-icons';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Kredi/Banka Kartı', icon: 'credit-card' },
  { id: 'apple', label: 'Apple Pay', icon: 'smartphone' },
  { id: 'google', label: 'Google Pay', icon: 'smartphone' },
];

export default function Checkout() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    
    Alert.alert(
      'Ödeme Başarılı! 🎉',
      'Randevunuz başarıyla oluşturuldu. Terapistinizle iletişime geçebilirsiniz.',
      [
        {
          text: 'Tamam',
          onPress: () => router.replace('/(tabs)/appointments'),
        },
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
        <Text style={styles.headerTitle}>Ödeme</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.securityBanner}>
          <Feather name="shield" size={20} color={Colors.light.secondary} />
          <Text style={styles.securityText}>
            Ödemeleriniz SSL ile şifrelenir ve güvenle işlenir
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ödeme Yöntemi</Text>
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
                <View style={styles.iconCircle}>
                  <Feather name={method.icon as any} size={20} color={Colors.light.primary} />
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
          <Text style={styles.summaryTitle}>Ödeme Özeti</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Seans</Text>
            <Text style={styles.summaryValue}>750₺</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Hizmet Bedeli</Text>
            <Text style={styles.summaryValue}>50₺</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Toplam</Text>
            <Text style={styles.totalValue}>800₺</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            isProcessing && styles.payButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <Feather name="lock" size={20} color={Colors.light.surface} />
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  backButton: {
    padding: Spacing.xs,
  },

  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },

  securityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.secondary + '10',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },

  securityText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.light.secondary,
  },

  section: {
    marginBottom: Spacing.xl,
  },

  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.light.border,
    ...Shadows.sm,
  },

  paymentMethodActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '05',
  },

  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  methodLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.light.textPrimary,
  },

  radio: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioActive: {
    borderColor: Colors.light.primary,
  },

  radioDot: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary,
  },

  summaryCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },

  summaryTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },

  summaryLabel: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
  },

  summaryValue: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.light.textPrimary,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.md,
  },

  totalLabel: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
  },

  totalValue: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.light.primary,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },

  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadows.md,
  },

  payButtonDisabled: {
    opacity: 0.6,
  },

  payButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.surface,
  },
});
