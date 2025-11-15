// app/(tabs)/journal/new.tsx - MINIMAL REDESIGN
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '../../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOODS = [
  { id: 'happy', label: 'Mutlu' },
  { id: 'calm', label: 'Sakin' },
  { id: 'neutral', label: 'Nötr' },
  { id: 'sad', label: 'Üzgün' },
  { id: 'stressed', label: 'Stresli' },
];

const PROMPTS = [
  'Bugün ne yaptın?',
  'Neler hissettin?',
  'Neler için minnetdarsın?',
];

export default function NewJournal() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);

  const handleSave = () => {
    if (!content.trim()) {
      Alert.alert('Hata', 'Lütfen birşeyler yazın.');
      return;
    }

    Alert.alert('Kaydedildi!', 'Günlüğün kaydedildi.', [
      { text: 'Tamam', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="x" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Günlük</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
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
          <Text style={styles.label}>Ruh halin nasıl?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.moodContainer}>
              {MOODS.map((mood) => (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    styles.moodChip,
                    selectedMood === mood.id && styles.moodChipActive,
                  ]}
                  onPress={() => setSelectedMood(mood.id)}
                >
                  <Text style={[
                    styles.moodChipText,
                    selectedMood === mood.id && styles.moodChipTextActive,
                  ]}>
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Yazmanı kolaylaştıran sorular</Text>
          <View style={styles.promptsContainer}>
            {PROMPTS.map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.promptChip}
                onPress={() => setContent(content + '\n' + prompt + '\n')}
              >
                <Text style={styles.promptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TextInput
            style={styles.contentInput}
            placeholder="Bugünü nasıl geçirdin?\n\nNeler hissettin?\n\nYazdıkların sadece sana özel..."
            placeholderTextColor={Colors.light.textLight}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.privacyCard}>
          <View style={styles.privacyLeft}>
            <Feather
              name={isPrivate ? 'lock' : 'globe'}
              size={18}
              color={Colors.light.textPrimary}
            />
            <Text style={styles.privacyText}>
              {isPrivate ? 'Özel günlük' : 'Herkese açık'}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggle,
              isPrivate && styles.toggleActive,
            ]}
            onPress={() => setIsPrivate(!isPrivate)}
          >
            <View style={[
              styles.toggleThumb,
              isPrivate && styles.toggleThumbActive,
            ]} />
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
    borderBottomColor: Colors.light.divider,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  saveButton: {
    width: 60,
    alignItems: 'flex-end',
  },

  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  dateCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },

  dateText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },

  section: {
    marginBottom: Spacing.xxl,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  moodContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  moodChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
  },

  moodChipActive: {
    backgroundColor: Colors.light.textPrimary,
  },

  moodChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  moodChipTextActive: {
    color: Colors.light.surface,
  },

  promptsContainer: {
    gap: Spacing.sm,
  },

  promptChip: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.xs,
  },

  promptText: {
    fontSize: 14,
    color: Colors.light.primary,
  },

  contentInput: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    fontSize: 15,
    color: Colors.light.textPrimary,
    minHeight: 240,
    lineHeight: 24,
    ...Shadows.xs,
  },

  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.xs,
  },

  privacyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  privacyText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.light.border,
    padding: 2,
    justifyContent: 'center',
  },

  toggleActive: {
    backgroundColor: Colors.light.textPrimary,
  },

  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.light.surface,
  },

  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});
