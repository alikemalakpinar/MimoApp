// app/(patient)/appointment/confirm.tsx
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
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../shared/theme';
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
        <View style={styles.appointmentCard}>
          <Text style={styles.cardTitle}>Randevu Detayları</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Feather name="user" size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Terapist</Text>
              <Text style={styles.detailValue}>Dr. Elif Yılmaz</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Feather name="calendar" size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Tarih</Text>
              <Text style={styles.detailValue}>15 Şubat 2025, Pazartesi</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Feather name="clock" size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Saat</Text>
              <Text style={styles.detailValue}>14:00 - 14:50</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Feather name="video" size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Seans Türü</Text>
              <Text style={styles.detailValue}>Görüntülü Görüşme</Text>
            </View>
          </View>
        </View>

        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Seans Ücreti</Text>
            <Text style={styles.priceValue}>750₺</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Hizmet Bedeli</Text>
            <Text style={styles.priceValue}>50₺</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Toplam</Text>
            <Text style={styles.totalValue}>800₺</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Feather name="info" size={20} color={Colors.light.info} />
          <Text style={styles.infoText}>
            Randevunuzu en az 24 saat öncesinden iptal edebilirsiniz. Daha geç iptal durumunda ücret iadesi yapılamaz.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => router.push('/(patient)/payment/checkout')}
        >
          <Text style={styles.confirmButtonText}>Ödemeye Geç</Text>
          <Feather name="arrow-right" size={20} color={Colors.light.surface} />
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

  appointmentCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },

  cardTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.lg,
  },

  detailRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },

  detailValue: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
  },

  priceCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },

  priceLabel: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
  },

  priceValue: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.sm,
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

  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.info + '10',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },

  infoText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
    lineHeight: Typography.sm * 1.5,
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

  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadows.md,
  },

  confirmButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
  },
});
