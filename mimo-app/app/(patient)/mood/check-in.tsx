// app/(patient)/mood/check-in.tsx - MINIMAL REDESIGN
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
import { Colors, Spacing, BorderRadius, Shadows } from '../../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOOD_SCALE = [
  { value: 1, label: 'Çok kötü', color: '#FF8A80' },
  { value: 2, label: 'Kötü', color: '#FFB84D' },
  { value: 3, label: 'İdare eder', color: '#FFD4A3' },
  { value: 4, label: 'Nötr', color: '#C7C7CC' },
  { value: 5, label: 'İyi', color: '#A3DEC4' },
  { value: 6, label: 'Çok iyi', color: '#7BC8A8' },
  { value: 7, label: 'Mükemmel', color: '#5BA889' },
];

const FACTORS = [
  { id: 'sleep', icon: 'moon', label: 'Uyku' },
  { id: 'exercise', icon: 'activity', label: 'Egzersiz' },
  { id: 'social', icon: 'users', label: 'Sosyal' },
  { id: 'work', icon: 'briefcase', label: 'İş' },
];

export default function MoodCheckIn() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

  const handleFactorToggle = (factorId: string) => {
    if (selectedFactors.includes(factorId)) {
      setSelectedFactors(selectedFactors.filter(f => f !== factorId));
    } else {
      setSelectedFactors([...selectedFactors, factorId]);
    }
  };

  const handleSave = () => {
    if (!selectedMood) {
      Alert.alert('Hata', 'Lütfen ruh halinizi seçin.');
      return;
    }

    Alert.alert('Kaydedildi!', 'Ruh hali kaydınız oluşturuldu.', [
      { text: 'Tamam', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood Check-in</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateCard}>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.question}>Kendini nasıl hissediyorsun?</Text>
          
          <View style={styles.moodScale}>
            {MOOD_SCALE.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                style={[
                  styles.moodOption,
                  selectedMood === mood.value && {
                    backgroundColor: mood.color + '30',
                    borderColor: mood.color,
                  },
                ]}
                onPress={() => setSelectedMood(mood.value)}
              >
                <Text style={styles.moodValue}>{mood.value}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedMood && (
            <View style={styles.selectedMoodCard}>
              <Text style={styles.selectedMoodLabel}>
                {MOOD_SCALE.find(m => m.value === selectedMood)?.label}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Etkileyen faktörler?</Text>
          <View style={styles.factorsGrid}>
            {FACTORS.map((factor) => (
              <TouchableOpacity
                key={factor.id}
                style={[
                  styles.factorButton,
                  selectedFactors.includes(factor.id) && styles.factorButtonActive,
                ]}
                onPress={() => handleFactorToggle(factor.id)}
              >
                <Feather
                  name={factor.icon as any}
                  size={20}
                  color={
                    selectedFactors.includes(factor.id)
                      ? Colors.light.textPrimary
                      : Colors.light.textSecondary
                  }
                />
                <Text style={[
                  styles.factorLabel,
                  selectedFactors.includes(factor.id) && styles.factorLabelActive,
                ]}>
                  {factor.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <SafeAreaView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              !selectedMood && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!selectedMood}
          >
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    paddingHorizontal: Spacing.xl,
    paddingBottom: 120,
  },

  dateCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    ...Shadows.xs,
  },

  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  section: {
    marginBottom: Spacing.xxl,
  },

  question: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },

  moodScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },

  moodOption: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  moodValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },

  selectedMoodCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.xs,
  },

  selectedMoodLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
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
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  factorButtonActive: {
    backgroundColor: '#E8F4FF',
    borderColor: Colors.light.primary,
  },

  factorLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },

  factorLabelActive: {
    color: Colors.light.textPrimary,
    fontWeight: '600',
  },

  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
  },

  saveButton: {
    backgroundColor: Colors.light.textPrimary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },

  saveButtonDisabled: {
    opacity: 0.4,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.surface,
  },
});
