// app/(patient)/mood/check-in.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOOD_SCALE = [
  { value: 1, emoji: '😭', label: 'Çok Kötü', color: '#EF4444' },
  { value: 2, emoji: '😞', label: 'Kötü', color: '#F97316' },
  { value: 3, emoji: '🙁', label: 'İdare Eder', color: '#F59E0B' },
  { value: 4, emoji: '😐', label: 'Nötr', color: '#6B7280' },
  { value: 5, emoji: '🙂', label: 'İyi', color: '#10B981' },
  { value: 6, emoji: '😊', label: 'Çok İyi', color: '#059669' },
  { value: 7, emoji: '🤩', label: 'Mükemmel', color: '#047857' },
];

const FACTORS = [
  { icon: 'moon', label: 'Uyku', value: 'sleep' },
  { icon: 'activity', label: 'Egzersiz', value: 'exercise' },
  { icon: 'users', label: 'Sosyal', value: 'social' },
  { icon: 'briefcase', label: 'İş', value: 'work' },
  { icon: 'heart', label: 'İlişki', value: 'relationship' },
  { icon: 'sun', label: 'Hava', value: 'weather' },
];

export default function MoodCheckIn() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

  const handleFactorToggle = (factor: string) => {
    if (selectedFactors.includes(factor)) {
      setSelectedFactors(selectedFactors.filter(f => f !== factor));
    } else {
      setSelectedFactors([...selectedFactors, factor]);
    }
  };

  const handleSave = () => {
    if (!selectedMood) {
      Alert.alert('Hata', 'Lütfen ruh halinizi seçin.');
      return;
    }

    Alert.alert(
      'Kaydedildi! ✨',
      'Ruh hali kaydınız başarıyla oluşturuldu.',
      [
        {
          text: 'Geçmişi Gör',
          onPress: () => router.push('/(patient)/mood/history'),
        },
        {
          text: 'Tamam',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const selectedMoodData = MOOD_SCALE.find(m => m.value === selectedMood);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ruh Hali Check-in</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateCard}>
          <Feather name="calendar" size={20} color={Colors.light.primary} />
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.question}>Bugün kendini nasıl hissediyorsun?</Text>
          
          <View style={styles.moodScaleContainer}>
            {MOOD_SCALE.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                style={[
                  styles.moodOption,
                  selectedMood === mood.value && {
                    backgroundColor: mood.color + '20',
                    borderColor: mood.color,
                  },
                ]}
                onPress={() => setSelectedMood(mood.value)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[
                  styles.moodValue,
                  selectedMood === mood.value && { color: mood.color },
                ]}>
                  {mood.value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedMoodData && (
            <View style={[
              styles.selectedMoodCard,
              { backgroundColor: selectedMoodData.color + '10' },
            ]}>
              <Text style={styles.selectedMoodEmoji}>{selectedMoodData.emoji}</Text>
              <Text style={[
                styles.selectedMoodLabel,
                { color: selectedMoodData.color },
              ]}>
                {selectedMoodData.label}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ruh halini etkileyen faktörler?</Text>
          <Text style={styles.sectionSubtitle}>Birden fazla seçebilirsin</Text>
          
          <View style={styles.factorsGrid}>
            {FACTORS.map((factor) => (
              <TouchableOpacity
                key={factor.value}
                style={[
                  styles.factorButton,
                  selectedFactors.includes(factor.value) && styles.factorButtonActive,
                ]}
                onPress={() => handleFactorToggle(factor.value)}
              >
                <Feather 
                  name={factor.icon as any} 
                  size={24} 
                  color={
                    selectedFactors.includes(factor.value)
                      ? Colors.light.primary
                      : Colors.light.textSecondary
                  } 
                />
                <Text style={[
                  styles.factorLabel,
                  selectedFactors.includes(factor.value) && styles.factorLabelActive,
                ]}>
                  {factor.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            !selectedMood && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!selectedMood}
        >
          <LinearGradient
            colors={[Colors.light.primary, Colors.light.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonText}>Kaydet</Text>
            <Feather name="check" size={20} color={Colors.light.surface} />
          </LinearGradient>
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },

  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
    ...Shadows.sm,
  },

  dateText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.light.textPrimary,
  },

  section: {
    marginBottom: Spacing.xl,
  },

  question: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },

  moodScaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },

  moodOption: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: Colors.light.surface,
    minWidth: 48,
  },

  moodEmoji: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },

  moodValue: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.light.textSecondary,
  },

  selectedMoodCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
  },

  selectedMoodEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },

  selectedMoodLabel: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },

  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  sectionSubtitle: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
  },

  factorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  factorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: Spacing.sm,
  },

  factorButtonActive: {
    backgroundColor: Colors.light.primary + '10',
    borderColor: Colors.light.primary,
  },

  factorLabel: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
  },

  factorLabelActive: {
    color: Colors.light.primary,
    fontWeight: Typography.semibold,
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

  saveButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },

  saveButtonDisabled: {
    opacity: 0.5,
  },

  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },

  saveButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.surface,
  },
});
