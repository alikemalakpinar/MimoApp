// app/(tabs)/appointments.tsx - MINIMAL REDESIGN
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
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOCK_APPOINTMENTS = [
  {
    id: '1',
    therapist: 'Dr. Elif Yılmaz',
    date: '2025-02-15',
    time: '14:00',
    type: 'video',
    status: 'confirmed',
  },
  {
    id: '2',
    therapist: 'Dr. Mehmet Kaya',
    date: '2025-02-20',
    time: '16:30',
    type: 'chat',
    status: 'pending',
  },
];

const STATUS_CONFIG = {
  confirmed: { label: 'Onaylandı', color: Colors.light.secondary },
  pending: { label: 'Bekliyor', color: '#FFB84D' },
  completed: { label: 'Tamamlandı', color: Colors.light.textLight },
};

export default function Appointments() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming'>('all');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Randevularım</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/(patient)/therapist-search')}
        >
          <Feather name="plus" size={20} color={Colors.light.surface} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'all' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[
            styles.filterButtonText,
            selectedFilter === 'all' && styles.filterButtonTextActive,
          ]}>
            Tümü
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'upcoming' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter('upcoming')}
        >
          <Text style={[
            styles.filterButtonText,
            selectedFilter === 'upcoming' && styles.filterButtonTextActive,
          ]}>
            Yaklaşan
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_APPOINTMENTS.map((apt) => {
          const status = STATUS_CONFIG[apt.status as keyof typeof STATUS_CONFIG];
          
          return (
            <TouchableOpacity key={apt.id} style={styles.appointmentCard}>
              <View style={styles.cardHeader}>
                <View style={styles.therapistAvatar}>
                  <Feather name="user" size={20} color={Colors.light.primary} />
                </View>
                <View style={styles.therapistInfo}>
                  <Text style={styles.therapistName}>{apt.therapist}</Text>
                  <View style={styles.dateTimeRow}>
                    <Feather name="calendar" size={12} color={Colors.light.textSecondary} />
                    <Text style={styles.dateTimeText}>
                      {new Date(apt.date).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                      })} • {apt.time}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                  <Text style={[styles.statusText, { color: status.color }]}>
                    {status.label}
                  </Text>
                </View>
                {apt.status === 'confirmed' && (
                  <TouchableOpacity style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>Katıl</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    letterSpacing: -0.5,
  },

  addButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },

  filterButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
  },

  filterButtonActive: {
    backgroundColor: Colors.light.textPrimary,
  },

  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  filterButtonTextActive: {
    color: Colors.light.surface,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },

  appointmentCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },

  cardHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
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

  therapistInfo: {
    flex: 1,
  },

  therapistName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },

  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  dateTimeText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  joinButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.textPrimary,
  },

  joinButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.surface,
  },
});
