// app/(therapist)/appointments.tsx - THERAPIST APPOINTMENTS
import React, { useState, useRef, useEffect } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';

const APPOINTMENTS = [
  {
    id: '1',
    patient: 'Ay_e Y.',
    time: '09:00',
    duration: 50,
    type: 'video',
    status: 'upcoming',
    notes: '0lk seans - tan1_ma',
  },
  {
    id: '2',
    patient: 'Mehmet K.',
    time: '10:00',
    duration: 50,
    type: 'video',
    status: 'upcoming',
    notes: 'Takip seans1',
  },
  {
    id: '3',
    patient: 'Zeynep A.',
    time: '11:30',
    duration: 50,
    type: 'in-person',
    status: 'upcoming',
    notes: 'CBT devam',
  },
  {
    id: '4',
    patient: 'Ali R.',
    time: '14:00',
    duration: 50,
    type: 'video',
    status: 'upcoming',
    notes: '^ema terapi',
  },
];

const STATS = [
  { label: 'Bugün', value: '4', icon: 'calendar' },
  { label: 'Bu Hafta', value: '18', icon: 'clock' },
  { label: 'Bekleyen', value: '2', icon: 'user-plus' },
];

export default function TherapistAppointments() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const formatDate = (date: Date) => {
    const days = ['Pazar', 'Pazartesi', 'Sal1', 'Çar_amba', 'Per_embe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', '^ubat', 'Mart', 'Nisan', 'May1s', 'Haziran', 'Temmuz', 'Austos', 'Eylül', 'Ekim', 'Kas1m', 'Aral1k'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Randevular1m</Text>
        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <Animated.View style={[styles.statsRow, { opacity: fadeAnim }]}>
          {STATS.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statIcon}>
                <Feather name={stat.icon as any} size={18} color={Colors.light.primary} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Date */}
        <View style={styles.dateSection}>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          <TouchableOpacity style={styles.calendarButton}>
            <Feather name="calendar" size={20} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>

        {/* Appointments List */}
        {APPOINTMENTS.map((appointment, index) => (
          <Animated.View
            key={appointment.id}
            style={{
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20 * (index + 1), 0],
                }),
              }],
            }}
          >
            <TouchableOpacity style={styles.appointmentCard} activeOpacity={0.85}>
              <View style={styles.timeColumn}>
                <Text style={styles.timeText}>{appointment.time}</Text>
                <Text style={styles.durationText}>{appointment.duration} dk</Text>
              </View>

              <View style={styles.appointmentContent}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.patientName}>{appointment.patient}</Text>
                  <View style={[
                    styles.typeBadge,
                    { backgroundColor: appointment.type === 'video' ? Colors.light.primary + '15' : Colors.light.secondary + '15' }
                  ]}>
                    <Feather
                      name={appointment.type === 'video' ? 'video' : 'map-pin'}
                      size={12}
                      color={appointment.type === 'video' ? Colors.light.primary : Colors.light.secondary}
                    />
                    <Text style={[
                      styles.typeText,
                      { color: appointment.type === 'video' ? Colors.light.primary : Colors.light.secondary }
                    ]}>
                      {appointment.type === 'video' ? 'Video' : 'Yüz yüze'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.notesText}>{appointment.notes}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="file-text" size={16} color={Colors.light.textSecondary} />
                    <Text style={styles.actionText}>Notlar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.primaryAction]}>
                    <Feather name="video" size={16} color={Colors.light.primary} />
                    <Text style={[styles.actionText, { color: Colors.light.primary }]}>Ba_lat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Empty slot for new */}
        <TouchableOpacity style={styles.addSlotCard}>
          <Feather name="plus-circle" size={24} color={Colors.light.textTertiary} />
          <Text style={styles.addSlotText}>Yeni Randevu Ekle</Text>
        </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  timeColumn: {
    alignItems: 'center',
    paddingRight: Spacing.lg,
    borderRightWidth: 2,
    borderRightColor: Colors.light.primary,
    marginRight: Spacing.lg,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  durationText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  notesText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.light.background,
  },
  primaryAction: {
    backgroundColor: Colors.light.primary + '15',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  addSlotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.light.border,
    gap: Spacing.sm,
  },
  addSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textTertiary,
  },
});
