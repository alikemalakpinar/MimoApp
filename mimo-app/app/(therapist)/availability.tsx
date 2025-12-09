// app/(therapist)/availability.tsx - THERAPIST AVAILABILITY SETTINGS
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';

const DAYS = [
  { id: 'mon', label: 'Pazartesi', short: 'Pzt' },
  { id: 'tue', label: 'Sal1', short: 'Sal' },
  { id: 'wed', label: 'Çar_amba', short: 'Çar' },
  { id: 'thu', label: 'Per_embe', short: 'Per' },
  { id: 'fri', label: 'Cuma', short: 'Cum' },
  { id: 'sat', label: 'Cumartesi', short: 'Cmt' },
  { id: 'sun', label: 'Pazar', short: 'Paz' },
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00',
];

export default function Availability() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [availability, setAvailability] = useState<Record<string, { enabled: boolean; start: string; end: string }>>({
    mon: { enabled: true, start: '09:00', end: '18:00' },
    tue: { enabled: true, start: '09:00', end: '18:00' },
    wed: { enabled: true, start: '09:00', end: '18:00' },
    thu: { enabled: true, start: '09:00', end: '18:00' },
    fri: { enabled: true, start: '09:00', end: '17:00' },
    sat: { enabled: false, start: '10:00', end: '14:00' },
    sun: { enabled: false, start: '10:00', end: '14:00' },
  });
  const [sessionDuration, setSessionDuration] = useState(50);
  const [breakDuration, setBreakDuration] = useState(10);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [inPersonEnabled, setInPersonEnabled] = useState(true);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleDay = (dayId: string) => {
    setAvailability(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], enabled: !prev[dayId].enabled },
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Müsaitlik Ayarlar1</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Kaydet</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Session Settings */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Seans Ayarlar1</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Feather name="clock" size={20} color={Colors.light.primary} />
              <View>
                <Text style={styles.settingLabel}>Seans Süresi</Text>
                <Text style={styles.settingValue}>{sessionDuration} dakika</Text>
              </View>
            </View>
            <View style={styles.durationButtons}>
              {[45, 50, 60].map(dur => (
                <TouchableOpacity
                  key={dur}
                  style={[styles.durationButton, sessionDuration === dur && styles.durationButtonActive]}
                  onPress={() => setSessionDuration(dur)}
                >
                  <Text style={[styles.durationText, sessionDuration === dur && styles.durationTextActive]}>
                    {dur}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Feather name="coffee" size={20} color={Colors.light.secondary} />
              <View>
                <Text style={styles.settingLabel}>Seanslar Aras1 Mola</Text>
                <Text style={styles.settingValue}>{breakDuration} dakika</Text>
              </View>
            </View>
            <View style={styles.durationButtons}>
              {[5, 10, 15].map(dur => (
                <TouchableOpacity
                  key={dur}
                  style={[styles.durationButton, breakDuration === dur && styles.durationButtonActive]}
                  onPress={() => setBreakDuration(dur)}
                >
                  <Text style={[styles.durationText, breakDuration === dur && styles.durationTextActive]}>
                    {dur}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Session Types */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Seans Türleri</Text>

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <View style={[styles.toggleIcon, { backgroundColor: Colors.light.primary + '15' }]}>
                <Feather name="video" size={18} color={Colors.light.primary} />
              </View>
              <View>
                <Text style={styles.toggleLabel}>Video Görü_me</Text>
                <Text style={styles.toggleDesc}>Online seans kabul et</Text>
              </View>
            </View>
            <Switch
              value={videoEnabled}
              onValueChange={setVideoEnabled}
              trackColor={{ false: Colors.light.border, true: Colors.light.primary + '50' }}
              thumbColor={videoEnabled ? Colors.light.primary : Colors.light.surface}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <View style={[styles.toggleIcon, { backgroundColor: Colors.light.secondary + '15' }]}>
                <Feather name="map-pin" size={18} color={Colors.light.secondary} />
              </View>
              <View>
                <Text style={styles.toggleLabel}>Yüz Yüze</Text>
                <Text style={styles.toggleDesc}>Ofiste seans kabul et</Text>
              </View>
            </View>
            <Switch
              value={inPersonEnabled}
              onValueChange={setInPersonEnabled}
              trackColor={{ false: Colors.light.border, true: Colors.light.secondary + '50' }}
              thumbColor={inPersonEnabled ? Colors.light.secondary : Colors.light.surface}
            />
          </View>
        </Animated.View>

        {/* Weekly Schedule */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Haftal1k Program</Text>

          {DAYS.map((day, index) => {
            const dayAvail = availability[day.id];
            return (
              <Animated.View
                key={day.id}
                style={[
                  styles.dayRow,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateX: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }),
                    }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.dayToggle}
                  onPress={() => toggleDay(day.id)}
                >
                  <View style={[styles.dayCheck, dayAvail.enabled && styles.dayCheckActive]}>
                    {dayAvail.enabled && <Feather name="check" size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={[styles.dayLabel, !dayAvail.enabled && styles.dayLabelDisabled]}>
                    {day.label}
                  </Text>
                </TouchableOpacity>

                {dayAvail.enabled && (
                  <View style={styles.timeRange}>
                    <TouchableOpacity style={styles.timeButton}>
                      <Text style={styles.timeText}>{dayAvail.start}</Text>
                    </TouchableOpacity>
                    <Text style={styles.timeSeparator}>-</Text>
                    <TouchableOpacity style={styles.timeButton}>
                      <Text style={styles.timeText}>{dayAvail.end}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Feather name="info" size={18} color={Colors.light.primary} />
          <Text style={styles.infoText}>
            Dei_iklikler kaydedildikten sonra yeni randevular için geçerli olacakt1r.
          </Text>
        </View>
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
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  saveButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.button,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  section: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  settingValue: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  durationButtons: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  durationButton: {
    width: 40,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  durationTextActive: {
    color: '#FFFFFF',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  toggleDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  dayToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  dayCheck: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCheckActive: {
    backgroundColor: Colors.light.primary,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  dayLabelDisabled: {
    color: Colors.light.textTertiary,
  },
  timeRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  timeButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.sm,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  timeSeparator: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.light.primary + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.primary,
    lineHeight: 18,
  },
});
