// app/(therapist)/dashboard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOCK_STATS = {
  todaySessions: 4,
  weekRevenue: 12500,
  totalPatients: 28,
  rating: 4.9,
};

const TODAY_SESSIONS = [
  { id: '1', patient: 'A.Y.', time: '09:00', type: 'video', status: 'completed' },
  { id: '2', patient: 'M.K.', time: '11:00', type: 'video', status: 'upcoming' },
  { id: '3', patient: 'Z.A.', time: '14:00', type: 'chat', status: 'upcoming' },
  { id: '4', patient: 'E.S.', time: '16:00', type: 'video', status: 'upcoming' },
];

export default function TherapistDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Merhaba,</Text>
          <Text style={styles.name}>Dr. Elif Yılmaz</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Feather name="bell" size={24} color={Colors.light.primary} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: Colors.light.primary + '15' }]}>
            <Feather name="calendar" size={24} color={Colors.light.primary} />
            <Text style={[styles.statValue, { color: Colors.light.primary }]}>
              {MOCK_STATS.todaySessions}
            </Text>
            <Text style={styles.statLabel}>Bugünün Seansları</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors.light.secondary + '15' }]}>
            <Feather name="users" size={24} color={Colors.light.secondary} />
            <Text style={[styles.statValue, { color: Colors.light.secondary }]}>
              {MOCK_STATS.totalPatients}
            </Text>
            <Text style={styles.statLabel}>Toplam Danışan</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors.light.accent + '15' }]}>
            <Feather name="dollar-sign" size={24} color={Colors.light.accent} />
            <Text style={[styles.statValue, { color: Colors.light.accent }]}>
              {MOCK_STATS.weekRevenue}₺
            </Text>
            <Text style={styles.statLabel}>Haftalık Gelir</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors.light.warning + '15' }]}>
            <Feather name="star" size={24} color={Colors.light.warning} />
            <Text style={[styles.statValue, { color: Colors.light.warning }]}>
              {MOCK_STATS.rating}
            </Text>
            <Text style={styles.statLabel}>Değerlendirme</Text>
          </View>
        </View>

        {/* Today's Sessions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bugünün Seansları</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Tümü</Text>
            </TouchableOpacity>
          </View>

          {TODAY_SESSIONS.map((session) => (
            <TouchableOpacity key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionLeft}>
                <View style={[
                  styles.sessionStatus,
                  {
                    backgroundColor: session.status === 'completed'
                      ? Colors.light.secondary
                      : Colors.light.primary,
                  },
                ]} />
                <View>
                  <Text style={styles.sessionPatient}>{session.patient}</Text>
                  <Text style={styles.sessionTime}>{session.time}</Text>
                </View>
              </View>
              <View style={styles.sessionRight}>
                <Feather
                  name={session.type === 'video' ? 'video' : 'message-circle'}
                  size={20}
                  color={Colors.light.textSecondary}
                />
                {session.status === 'upcoming' && (
                  <TouchableOpacity style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>Katıl</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="calendar" size={24} color={Colors.light.primary} />
              <Text style={styles.actionButtonText}>Takvim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="users" size={24} color={Colors.light.primary} />
              <Text style={styles.actionButtonText}>Danışanlar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="file-text" size={24} color={Colors.light.primary} />
              <Text style={styles.actionButtonText}>Notlar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="bar-chart-2" size={24} color={Colors.light.primary} />
              <Text style={styles.actionButtonText}>Raporlar</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  greeting: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
  },

  name: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
  },

  notificationButton: {
    position: 'relative',
    padding: Spacing.xs,
  },

  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.error,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },

  statCard: {
    width: '48%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },

  statValue: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    marginVertical: Spacing.sm,
  },

  statLabel: {
    fontSize: Typography.xs,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },

  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
  },

  seeAllText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.light.primary,
  },

  sessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },

  sessionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  sessionStatus: {
    width: 4,
    height: 40,
    borderRadius: BorderRadius.xs,
    marginRight: Spacing.md,
  },

  sessionPatient: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  sessionTime: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
  },

  sessionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  joinButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },

  joinButtonText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
  },

  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },

  actionButton: {
    width: '48%',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },

  actionButtonText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.light.textPrimary,
    marginTop: Spacing.sm,
  },
});
