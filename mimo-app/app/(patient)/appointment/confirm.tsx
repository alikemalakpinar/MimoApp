// app/(patient)/appointment/confirm.tsx - MINIMAL REDESIGN
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '../../../shared/theme';
import { Feather } from '@expo/vector-icons';

export default function ConfirmAppointment() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Randevu Onayı</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Feather name="user" size={18} color={Colors.light.textPrimary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Terapist</Text>
              <Text style={styles.detailValue}>Dr. Elif Yılmaz</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Feather name="calendar" size={18} color={Colors.light.textPrimary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Tarih</Text>
              <Text style={styles.detailValue}>8 Mart 2025, Pazartesi</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Feather name="clock" size={18} color={Colors.light.textPrimary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Saat</Text>
              <Text style={styles.detailValue}>14:00 - 14:50</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Feather name="video" size={18} color={Colors.light.textPrimary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Tür</Text>
              <Text style={styles.detailValue}>Görüntülü Görüşme</Text>
            </View>
          </View>
        </View>

        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Seans</Text>
            <Text style={styles.priceValue}>750₺</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Hizmet</Text>
            <Text style={styles.priceValue}>50₺</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Toplam</Text>
            <Text style={styles.totalValue}>800₺</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Feather name="info" size={16} color={Colors.light.primary} />
          <Text style={styles.infoText}>
            24 saat öncesine kadar ücretsiz iptal edebilirsiniz.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => router.push('/(patient)/payment/checkout')}
        >
          <Text style={styles.confirmButtonText}>Ödemeye Geç</Text>
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

  detailsCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },

  detailRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },

  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },

  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  priceCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },

  priceLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },

  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.light.divider,
    marginVertical: Spacing.md,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FF',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
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

  confirmButton: {
    backgroundColor: Colors.light.textPrimary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.sm,
  },

  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.surface,
  },
});
