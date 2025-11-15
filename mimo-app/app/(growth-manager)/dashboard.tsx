// app/(growth-manager)/dashboard.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MOCK_PATIENTS = [
  {
    id: '1',
    name: 'Ayşe Y.',
    engagementScore: 85,
    riskScore: 'low',
    moodTrend: 'up',
    lastCheckIn: '2 saat önce',
    sessionsCompleted: 8,
    tasksCompleted: 12,
    avatar: '👩',
  },
  {
    id: '2',
    name: 'Mehmet K.',
    engagementScore: 45,
    riskScore: 'medium',
    moodTrend: 'down',
    lastCheckIn: '3 gün önce',
    sessionsCompleted: 4,
    tasksCompleted: 3,
    avatar: '👨',
  },
  {
    id: '3',
    name: 'Zeynep A.',
    engagementScore: 92,
    riskScore: 'low',
    moodTrend: 'stable',
    lastCheckIn: '1 saat önce',
    sessionsCompleted: 12,
    tasksCompleted: 18,
    avatar: '👩',
  },
];

const RISK_COLORS = {
  low: Colors.light.secondary,
  medium: Colors.light.warning,
  high: Colors.light.error,
};

const MOOD_ICONS = {
  up: 'trending-up',
  down: 'trending-down',
  stable: 'minus',
};

export default function GrowthManagerDashboard() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const filteredPatients = MOCK_PATIENTS.filter(p => 
    selectedFilter === 'all' || p.riskScore === selectedFilter
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Growth Manager</Text>
          <Text style={styles.headerSubtitle}>{MOCK_PATIENTS.length} aktif danışan</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Feather name="bell" size={24} color={Colors.light.primary} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: Colors.light.secondary + '15' }]}>
          <Feather name="trending-up" size={24} color={Colors.light.secondary} />
          <Text style={[styles.statNumber, { color: Colors.light.secondary }]}>87%</Text>
          <Text style={styles.statLabel}>Ortalama Engagement</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: Colors.light.warning + '15' }]}>
          <Feather name="alert-circle" size={24} color={Colors.light.warning} />
          <Text style={[styles.statNumber, { color: Colors.light.warning }]}>2</Text>
          <Text style={styles.statLabel}>Dikkat Gereken</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'all' && styles.filterTabActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[
            styles.filterTabText,
            selectedFilter === 'all' && styles.filterTabTextActive,
          ]}>Tümü</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'high' && styles.filterTabActive]}
          onPress={() => setSelectedFilter('high')}
        >
          <Text style={[
            styles.filterTabText,
            selectedFilter === 'high' && styles.filterTabTextActive,
          ]}>Yüksek Risk</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'medium' && styles.filterTabActive]}
          onPress={() => setSelectedFilter('medium')}
        >
          <Text style={[
            styles.filterTabText,
            selectedFilter === 'medium' && styles.filterTabTextActive,
          ]}>Orta Risk</Text>
        </TouchableOpacity>
      </View>

      {/* Patient List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredPatients.map((patient) => (
          <TouchableOpacity key={patient.id} style={styles.patientCard}>
            <View style={styles.patientHeader}>
              <View style={styles.patientInfo}>
                <Text style={styles.avatar}>{patient.avatar}</Text>
                <View style={styles.patientDetails}>
                  <Text style={styles.patientName}>{patient.name}</Text>
                  <Text style={styles.lastCheckIn}>{patient.lastCheckIn}</Text>
                </View>
              </View>
              <View style={[
                styles.riskBadge,
                { backgroundColor: RISK_COLORS[patient.riskScore as keyof typeof RISK_COLORS] + '20' },
              ]}>
                <View style={[
                  styles.riskDot,
                  { backgroundColor: RISK_COLORS[patient.riskScore as keyof typeof RISK_COLORS] },
                ]} />
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{patient.engagementScore}%</Text>
                <Text style={styles.metricLabel}>Engagement</Text>
              </View>
              <View style={styles.metric}>
                <View style={styles.metricWithIcon}>
                  <Feather 
                    name={MOOD_ICONS[patient.moodTrend as keyof typeof MOOD_ICONS] as any} 
                    size={16} 
                    color={Colors.light.primary} 
                  />
                  <Text style={styles.metricValue}>Mood</Text>
                </View>
                <Text style={styles.metricLabel}>Trend</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{patient.sessionsCompleted}</Text>
                <Text style={styles.metricLabel}>Seanslar</Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="message-circle" size={16} color={Colors.light.primary} />
                <Text style={styles.actionButtonText}>Mesaj</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]}>
                <Feather name="clipboard" size={16} color={Colors.light.surface} />
                <Text style={[styles.actionButtonText, { color: Colors.light.surface }]}>Detay</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
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
    marginBottom: Spacing.xs,
  },

  headerSubtitle: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
  },

  notificationButton: {
    position: 'relative',
    padding: Spacing.xs,
  },

  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.light.error,
    borderRadius: BorderRadius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },

  notificationBadgeText: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: Colors.light.surface,
  },

  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },

  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    marginVertical: Spacing.xs,
  },

  statLabel: {
    fontSize: Typography.xs,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },

  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },

  filterTab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
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

  patientCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },

  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },

  patientInfo: {
    flexDirection: 'row',
    flex: 1,
  },

  avatar: {
    fontSize: 40,
    marginRight: Spacing.md,
  },

  patientDetails: {
    flex: 1,
  },

  patientName: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  lastCheckIn: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
  },

  riskBadge: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },

  riskDot: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
  },

  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.md,
  },

  metric: {
    alignItems: 'center',
  },

  metricWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },

  metricValue: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.primary,
    marginBottom: Spacing.xs,
  },

  metricLabel: {
    fontSize: Typography.xs,
    color: Colors.light.textSecondary,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
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
    color: Colors.light.primary,
  },
});
