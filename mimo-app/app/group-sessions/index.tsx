// app/group-sessions/index.tsx - GROUP THERAPY SESSIONS
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
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';

const GROUP_SESSIONS = [
  {
    id: '1',
    title: 'Anksiyete Destek Grubu',
    therapist: 'Dr. Elif Yılmaz',
    date: '15 Şubat',
    time: '19:00',
    participants: 8,
    maxParticipants: 12,
    price: 250,
    topic: 'Anksiyete yönetimi teknikleri',
  },
  {
    id: '2',
    title: 'Mindfulness Uygulamaları',
    therapist: 'Dr. Mehmet Kaya',
    date: '17 Şubat',
    time: '18:00',
    participants: 5,
    maxParticipants: 10,
    price: 200,
    topic: 'Mindfulness meditasyonu',
  },
  {
    id: '3',
    title: 'İlişki Terapisi Grubu',
    therapist: 'Dr. Ayşe Demir',
    date: '20 Şubat',
    time: '20:00',
    participants: 10,
    maxParticipants: 12,
    price: 300,
    topic: 'Sağlıklı iletişim',
  },
];

export default function GroupSessions() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grup Seansları</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <Feather name="users" size={24} color={Colors.light.primary} />
          <Text style={styles.infoText}>
            Grup seanslarında benzer deneyimleri paylaşan kişilerle bir araya gelin.
          </Text>
        </View>

        {GROUP_SESSIONS.map((session) => (
          <View key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <View style={styles.participantsInfo}>
                <Feather name="users" size={18} color={Colors.light.textSecondary} />
                <Text style={styles.participantsText}>
                  {session.participants}/{session.maxParticipants} katılımcı
                </Text>
              </View>
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>{session.price}₺</Text>
              </View>
            </View>

            <Text style={styles.sessionTitle}>{session.title}</Text>
            <Text style={styles.sessionTopic}>{session.topic}</Text>

            <View style={styles.sessionMeta}>
              <View style={styles.metaItem}>
                <Feather name="user" size={14} color={Colors.light.textSecondary} />
                <Text style={styles.metaText}>{session.therapist}</Text>
              </View>
              <View style={styles.metaItem}>
                <Feather name="calendar" size={14} color={Colors.light.textSecondary} />
                <Text style={styles.metaText}>{session.date}</Text>
              </View>
              <View style={styles.metaItem}>
                <Feather name="clock" size={14} color={Colors.light.textSecondary} />
                <Text style={styles.metaText}>{session.time}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Gruba Katıl</Text>
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingBottom: Spacing.xl,
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FF',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },

  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },

  sessionCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },

  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  participantsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },

  participantsText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  priceBadge: {
    backgroundColor: Colors.light.secondary + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },

  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.secondary,
  },

  sessionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  sessionTopic: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
  },

  sessionMeta: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },

  metaText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  joinButton: {
    backgroundColor: Colors.light.textPrimary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },

  joinButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.surface,
  },
});
