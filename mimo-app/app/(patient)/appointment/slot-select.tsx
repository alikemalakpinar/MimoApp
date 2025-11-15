// app/(patient)/appointment/slot-select.tsx
import React, { useState } from 'react';
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

const MOCK_SLOTS = [
  { date: '2025-02-15', day: 'Pazartesi', slots: ['09:00', '10:00', '14:00', '15:00', '16:00'] },
  { date: '2025-02-16', day: 'Salı', slots: ['10:00', '11:00', '15:00', '16:00'] },
  { date: '2025-02-17', day: 'Çarşamba', slots: ['09:00', '14:00', '15:00'] },
];

export default function SlotSelect() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(MOCK_SLOTS[0].date);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selectedSlots = MOCK_SLOTS.find(s => s.date === selectedDate);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Randevu Saati Seçin</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.therapistInfo}>
          <Text style={styles.avatar}>👩‍⚕️</Text>
          <View>
            <Text style={styles.therapistName}>Dr. Elif Yılmaz</Text>
            <Text style={styles.therapistTitle}>Klinik Psikolog</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tarih Seçin</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {MOCK_SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot.date}
                style={[
                  styles.dateCard,
                  selectedDate === slot.date && styles.dateCardActive,
                ]}
                onPress={() => {
                  setSelectedDate(slot.date);
                  setSelectedTime(null);
                }}
              >
                <Text style={[
                  styles.dateDay,
                  selectedDate === slot.date && styles.dateDayActive,
                ]}>
                  {slot.day}
                </Text>
                <Text style={[
                  styles.dateNumber,
                  selectedDate === slot.date && styles.dateNumberActive,
                ]}>
                  {new Date(slot.date).getDate()}
                </Text>
                <Text style={[
                  styles.dateMonth,
                  selectedDate === slot.date && styles.dateMonthActive,
                ]}>
                  {new Date(slot.date).toLocaleDateString('tr-TR', { month: 'short' })}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saat Seçin</Text>
          <View style={styles.slotsGrid}>
            {selectedSlots?.slots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.timeSlotActive,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timeText,
                  selectedTime === time && styles.timeTextActive,
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedTime && styles.confirmButtonDisabled,
          ]}
          disabled={!selectedTime}
          onPress={() => router.push('/(patient)/appointment/confirm')}
        >
          <Text style={styles.confirmButtonText}>Devam Et</Text>
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
    paddingBottom: 100,
  },

  therapistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },

  avatar: {
    fontSize: 48,
    marginRight: Spacing.md,
  },

  therapistName: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  therapistTitle: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
  },

  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  dateCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.sm,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.border,
  },

  dateCardActive: {
    backgroundColor: Colors.light.primary + '15',
    borderColor: Colors.light.primary,
  },

  dateDay: {
    fontSize: Typography.xs,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },

  dateDayActive: {
    color: Colors.light.primary,
  },

  dateNumber: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  dateNumberActive: {
    color: Colors.light.primary,
  },

  dateMonth: {
    fontSize: Typography.xs,
    color: Colors.light.textLight,
  },

  dateMonthActive: {
    color: Colors.light.primary,
  },

  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  timeSlot: {
    backgroundColor: Colors.light.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minWidth: 100,
    alignItems: 'center',
  },

  timeSlotActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },

  timeText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.light.textPrimary,
  },

  timeTextActive: {
    color: Colors.light.surface,
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
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },

  confirmButtonDisabled: {
    opacity: 0.5,
  },

  confirmButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
  },
});
