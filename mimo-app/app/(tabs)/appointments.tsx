// app/(tabs)/appointments.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOCK_APPOINTMENTS = [
  {
    id: '1',
    therapistName: 'Dr. Elif Yılmaz',
    therapistAvatar: '👩‍⚕️',
    date: '2025-02-15',
    time: '14:00',
    type: 'video',
    status: 'confirmed',
  },
  {
    id: '2',
    therapistName: 'Dr. Mehmet Kaya',
    therapistAvatar: '👨‍⚕️',
    date: '2025-02-20',
    time: '16:30',
    type: 'chat',
    status: 'pending',
  },
  {
    id: '3',
    therapistName: 'Dr. Elif Yılmaz',
    therapistAvatar: '👩‍⚕️',
    date: '2025-02-08',
    time: '15:00',
    type: 'video',
    status: 'completed',
  },
];

const STATUS_CONFIG = {
  confirmed: { label: 'Onaylanmış', color: Colors.light.secondary, icon: 'check-circle' },
  pending: { label: 'Bekliyor', color: Colors.light.warning, icon: 'clock' },
  completed: { label: 'Tamamlandı', color: Colors.light.textLight, icon: 'check' },
  cancelled: { label: 'İptal', color: Colors.light.error, icon: 'x-circle' },
};

const TYPE_CONFIG = {
  video: { label: 'Görüntülü', icon: 'video' },
  chat: { label: 'Mesajlaşma', icon: 'message-circle' },
  phone: { label: 'Sesli', icon: 'phone' },
};

export default function Appointments() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    return MOCK_APPOINTMENTS.filter(apt => {
      const aptDate = new Date(apt.date);
      if (selectedFilter === 'upcoming') return aptDate >= now;
      if (selectedFilter === 'past') return aptDate < now;
      return true;
    });
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Randevularım</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(patient)/therapist-search')}
        >
          <Feather name="plus" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'all' && styles.filterTabActive,
          ]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[
            styles.filterTabText,
            selectedFilter === 'all' && styles.filterTabTextActive,
          ]}>
            Tümü
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'upcoming' && styles.filterTabActive,
          ]}
          onPress={() => setSelectedFilter('upcoming')}
        >
          <Text style={[
            styles.filterTabText,
            selectedFilter === 'upcoming' && styles.filterTabTextActive,
          ]}>
            Yaklaşan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'past' && styles.filterTabActive,
          ]}
          onPress={() => setSelectedFilter('past')}
        >
          <Text style={[
            styles.filterTabText,
            selectedFilter === 'past' && styles.filterTabTextActive,
          ]}>
            Geçmiş
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="calendar" size={64} color={Colors.light.textLight} />
            <Text style={styles.emptyStateTitle}>Randevu Bulunamadı</Text>
            <Text style={styles.emptyStateDescription}>
              Bu kategoride randevu bulunmuyor.
            </Text>
          </View>
        ) : (
          filteredAppointments.map((appointment) => {
            const status = STATUS_CONFIG[appointment.status as keyof typeof STATUS_CONFIG];
            const type = TYPE_CONFIG[appointment.type as keyof typeof TYPE_CONFIG];
            
            return (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.therapistInfo}>
                    <Text style={styles.therapistAvatar}>
                      {appointment.therapistAvatar}
                    </Text>
                    <View style={styles.therapistDetails}>
                      <Text style={styles.therapistName}>
                        {appointment.therapistName}
                      </Text>
                      <View style={styles.typeContainer}>
                        <Feather name={type.icon as any} size={14} color={Colors.light.textSecondary} />
                        <Text style={styles.typeText}>{type.label}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                    <Feather name={status.icon as any} size={12} color={status.color} />
                    <Text style={[styles.statusText, { color: status.color }]}>
                      {status.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <Feather name="calendar" size={16} color={Colors.light.primary} />
                    <Text style={styles.infoText}>
                      {new Date(appointment.date).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Feather name="clock" size={16} color={Colors.light.primary} />
                    <Text style={styles.infoText}>{appointment.time}</Text>
                  </View>
                </View>

                {appointment.status === 'confirmed' && (
                  <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Feather name="x" size={16} color={Colors.light.error} />
                      <Text style={[styles.actionButtonText, { color: Colors.light.error }]}>
                        İptal Et
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]}>
                      <Feather name="video" size={16} color={Colors.light.surface} />
                      <Text style={[styles.actionButtonText, { color: Colors.light.surface }]}>
                        Katıl
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  headerTitle: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
  },

  addButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },

  filterTab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },

  filterTabActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },

  filterTabText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.light.textSecondary,
  },

  filterTabTextActive: {
    color: Colors.light.surface,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },

  emptyStateTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },

  emptyStateDescription: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },

  appointmentCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },

  therapistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  therapistAvatar: {
    fontSize: 32,
    marginRight: Spacing.md,
  },

  therapistDetails: {
    flex: 1,
  },

  therapistName: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },

  typeText: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },

  statusText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
  },

  cardBody: {
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  infoText: {
    fontSize: Typography.base,
    color: Colors.light.textPrimary,
  },

  cardActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },

  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.background,
    gap: Spacing.xs,
  },

  actionButtonPrimary: {
    backgroundColor: Colors.light.primary,
  },

  actionButtonText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
});
