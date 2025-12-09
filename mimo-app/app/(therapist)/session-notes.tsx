// app/(therapist)/session-notes.tsx - SESSION NOTES
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';

const QUICK_TAGS = [
  'Kayg1', 'Depresyon', '0li_kiler', '0_ Stresi', 'Aile',
  'Travma', 'Öz güven', 'Uyku', 'Öfke', 'Yas',
];

export default function SessionNotes() {
  const router = useRouter();
  const { patientId, sessionId } = useLocalSearchParams();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [notes, setNotes] = useState('');
  const [goals, setGoals] = useState('');
  const [homework, setHomework] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [moodRating, setMoodRating] = useState(3);
  const [progressRating, setProgressRating] = useState(3);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    // TODO: Save notes to API
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="x" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seans Notlar1</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Kaydet</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient Info */}
        <Animated.View style={[styles.patientCard, { opacity: fadeAnim }]}>
          <View style={styles.patientAvatar}>
            <Text style={styles.avatarText}>AY</Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>Ay_e Y1lmaz</Text>
            <Text style={styles.sessionDate}>9 Aral1k 2024, 09:00</Text>
          </View>
          <View style={styles.sessionBadge}>
            <Text style={styles.sessionNumber}>Seans #8</Text>
          </View>
        </Animated.View>

        {/* Mood & Progress Ratings */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Deerlendirme</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.ratingLabel}>Dan1_an Ruh Hali</Text>
            <View style={styles.ratingButtons}>
              {[1, 2, 3, 4, 5].map(rating => (
                <TouchableOpacity
                  key={rating}
                  style={[styles.ratingButton, moodRating === rating && styles.ratingButtonActive]}
                  onPress={() => setMoodRating(rating)}
                >
                  <Text style={[styles.ratingText, moodRating === rating && styles.ratingTextActive]}>
                    {rating}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.ratingRow}>
            <Text style={styles.ratingLabel}>Terapi 0lerlemesi</Text>
            <View style={styles.ratingButtons}>
              {[1, 2, 3, 4, 5].map(rating => (
                <TouchableOpacity
                  key={rating}
                  style={[styles.ratingButton, progressRating === rating && styles.ratingButtonActive]}
                  onPress={() => setProgressRating(rating)}
                >
                  <Text style={[styles.ratingText, progressRating === rating && styles.ratingTextActive]}>
                    {rating}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Quick Tags */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Konular</Text>
          <View style={styles.tagsContainer}>
            {QUICK_TAGS.map(tag => (
              <TouchableOpacity
                key={tag}
                style={[styles.tag, selectedTags.includes(tag) && styles.tagActive]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextActive]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Session Notes */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Seans Notlar1</Text>
          <TextInput
            style={styles.textArea}
            value={notes}
            onChangeText={setNotes}
            placeholder="Seans sürecinde görü_ülenler, gözlemler, önemli noktalar..."
            placeholderTextColor={Colors.light.textTertiary}
            multiline
            textAlignVertical="top"
          />
        </Animated.View>

        {/* Goals */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Hedefler & Sonraki Ad1mlar</Text>
          <TextInput
            style={[styles.textArea, { minHeight: 80 }]}
            value={goals}
            onChangeText={setGoals}
            placeholder="K1sa ve uzun vadeli hedefler..."
            placeholderTextColor={Colors.light.textTertiary}
            multiline
            textAlignVertical="top"
          />
        </Animated.View>

        {/* Homework */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Ev Ödevi</Text>
          <TextInput
            style={[styles.textArea, { minHeight: 80 }]}
            value={homework}
            onChangeText={setHomework}
            placeholder="Dan1_ana verilen görevler..."
            placeholderTextColor={Colors.light.textTertiary}
            multiline
            textAlignVertical="top"
          />
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.light.primary + '15' }]}>
              <Feather name="file-plus" size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.actionText}>Rapor Olu_tur</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.light.secondary + '15' }]}>
              <Feather name="calendar" size={20} color={Colors.light.secondary} />
            </View>
            <Text style={styles.actionText}>Sonraki Randevu</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.light.gold + '15' }]}>
              <Feather name="send" size={20} color={Colors.light.gold} />
            </View>
            <Text style={styles.actionText}>Ödev Gönder</Text>
          </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
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
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  patientInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  sessionDate: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  sessionBadge: {
    backgroundColor: Colors.light.primary + '15',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.pill,
  },
  sessionNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  section: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },
  ratingRow: {
    marginBottom: Spacing.lg,
  },
  ratingLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  ratingButton: {
    flex: 1,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  ratingTextActive: {
    color: '#FFFFFF',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  tagActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  tagTextActive: {
    color: '#FFFFFF',
  },
  textArea: {
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    fontSize: 14,
    color: Colors.light.textPrimary,
    minHeight: 120,
    lineHeight: 22,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
