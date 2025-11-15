// app/(patient)/appointment/slot-select.tsx - MINIMAL REDESIGN
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
import { Colors, Spacing, BorderRadius, Shadows } from '../../../shared/theme';
import { Feather } from '@expo/vector-icons';

const DAYS = [
  { date: '2025-03-08', day: 'Pzt', num: 8 },
  { date: '2025-03-09', day: 'Sal', num: 9 },
  { date: '2025-03-10', day: 'Çar', num: 10 },
  { date: '2025-03-11', day: 'Per', num: 11 },
  { date: '2025-03-12', day: 'Cum', num: 12 },
];

const SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

export default function SlotSelect() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(DAYS[0].date);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tarih & Saat</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Therapist Info */}
        <View style={styles.therapistCard}>
          <View style={styles.therapistAvatar}>
            <Feather name="user" size={20} color={Colors.light.primary} />
          </View>
          <View>
            <Text style={styles.therapistName}>Dr. Elif Yılmaz</Text>
            <Text style={styles.therapistTitle}>Klinik Psikolog</Text>
          </View>
        </View>

        {/* Date Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tarih seç</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.datesContainer}>
              {DAYS.map((day) => (
                <TouchableOpacity
                  key={day.date}
                  style={[
                    styles.dateCard,
                    selectedDate === day.date && styles.dateCardActive,
                  ]}
                  onPress={() => {
                    setSelectedDate(day.date);
                    setSelectedTime(null);
                  }}
                >
                  <Text style={[
                    styles.dateDay,
                    selectedDate === day.date && styles.dateDayActive,
                  ]}>
                    {day.day}
                  </Text>
                  <Text style={[
                    styles.dateNum,
                    selectedDate === day.date && styles.dateNumActive,
                  ]}>
                    {day.num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saat seç</Text>
          <View style={styles.slotsGrid}>
            {SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.slotButton,
                  selectedTime === slot && styles.slotButtonActive,
                ]}
                onPress={() => setSelectedTime(slot)}
              >
                <Text style={[
                  styles.slotText,
                  selectedTime === slot && styles.slotTextActive,
                ]}>
                  {slot}
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
    paddingBottom: 120,
  },

  therapistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xxl,
    ...Shadows.xs,
  },

  therapistAvatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  therapistName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },

  therapistTitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  section: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  datesContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  dateCard: {
    width: 64,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  dateCardActive: {
    backgroundColor: Colors.light.textPrimary,
    borderColor: Colors.light.textPrimary,
  },

  dateDay: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },

  dateDayActive: {
    color: Colors.light.surface,
  },

  dateNum: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  dateNumActive: {
    color: Colors.light.surface,
  },

  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  slotButton: {
    width: '31%',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },

  slotButtonActive: {
    backgroundColor: Colors.light.textPrimary,
    borderColor: Colors.light.textPrimary,
  },

  slotText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  slotTextActive: {
    color: Colors.light.surface,
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

  confirmButtonDisabled: {
    opacity: 0.4,
  },

  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.surface,
  },
});
