// app/(tabs)/journal/new.tsx
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOODS = [
  { emoji: '😊', label: 'Mutlu', value: 'happy' },
  { emoji: '😌', label: 'Sakin', value: 'calm' },
  { emoji: '😐', label: 'Nötr', value: 'neutral' },
  { emoji: '😔', label: 'Üzgün', value: 'sad' },
  { emoji: '😰', label: 'Stresli', value: 'stressed' },
];

const PROMPTS = [
  'Bugün ne yaptın?',
  'Kendini nasıl hissediyorsun?',
  'Neler için minnetdarsın?',
  'Bugünü neyin özel kıldı?',
];

export default function NewJournal() {
  const router = useRouter();
  const { prefillMood } = useLocalSearchParams();
  const [selectedMood, setSelectedMood] = useState<string | null>(prefillMood as string || null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);

  const handleSave = () => {
    if (!selectedMood || !content.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen ruh halinizi seçin ve birşeyler yazın.');
      return;
    }

    Alert.alert(
      'Günlük Kaydedildi! ✨',
      'Günlüğünüz başarıyla kaydedildi.',
      [
        {
          text: 'Tamam',
          onPress: () => router.back(),
        },
      ]
    );
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
        {/* Mood Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>Bugün nasıl hissediyorsun?</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodContainer}
          >
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                style={[
                  styles.moodButton,
                  selectedMood === mood.value && styles.moodButtonActive,
                ]}
                onPress={() => setSelectedMood(mood.value)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[
                  styles.moodLabel,
                  selectedMood === mood.value && styles.moodLabelActive,
                ]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <TextInput
            style={styles.titleInput}
            placeholder="Başlık (opsiyonel)"
            placeholderTextColor={Colors.light.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Prompts */}
        <View style={styles.section}>
          <Text style={styles.label}>Yazmanı kolaylaştıran sorular:</Text>
          <View style={styles.promptsContainer}>
            {PROMPTS.map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.promptChip}
                onPress={() => setContent(content + '\n\n' + prompt + '\n')}
              >
                <Text style={styles.promptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.section}>
          <TextInput
            style={styles.contentInput}
            placeholder="Bugünü nasıl geçirdin? Neler hissettin?\n\nBuraya yazdıkların sadece sana özel..."
            placeholderTextColor={Colors.light.textLight}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Privacy Toggle */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.privacyToggle}
            onPress={() => setIsPrivate(!isPrivate)}
          >
            <View style={styles.privacyLeft}>
              <Feather 
                name={isPrivate ? 'lock' : 'globe'} 
                size={20} 
                color={Colors.light.primary} 
              />
              <View style={styles.privacyText}>
                <Text style={styles.privacyTitle}>
                  {isPrivate ? 'Özel Günlük' : 'Herkese Açık'}
                </Text>
                <Text style={styles.privacyDescription}>
                  {isPrivate ? 'Sadece sen görebilirsin' : 'Topluluk ile paylaş'}
                </Text>
              </View>
            </View>
            <View style={[
              styles.toggle,
              isPrivate && styles.toggleActive,
            ]}>
              <View style={[
                styles.toggleThumb,
                isPrivate && styles.toggleThumbActive,
              ]} />
            </View>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },

  backButton: {
    padding: Spacing.xs,
  },

  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
  },

  saveButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
  },

  saveButtonText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.light.surface,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },

  label: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  moodContainer: {
    gap: Spacing.sm,
  },

  moodButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.border,
    minWidth: 80,
  },

  moodButtonActive: {
    backgroundColor: Colors.light.primary + '10',
    borderColor: Colors.light.primary,
  },

  moodEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },

  moodLabel: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
  },

  moodLabelActive: {
    color: Colors.light.primary,
    fontWeight: Typography.semibold,
  },

  titleInput: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    paddingVertical: Spacing.md,
  },

  promptsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  promptChip: {
    backgroundColor: Colors.light.surface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },

  promptText: {
    fontSize: Typography.sm,
    color: Colors.light.primary,
  },

  contentInput: {
    fontSize: Typography.base,
    color: Colors.light.textPrimary,
    lineHeight: Typography.base * 1.6,
    minHeight: 300,
  },

  privacyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },

  privacyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  privacyText: {
    marginLeft: Spacing.md,
    flex: 1,
  },

  privacyTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },

  privacyDescription: {
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
  },

  toggle: {
    width: 48,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.border,
    padding: 2,
    justifyContent: 'center',
  },

  toggleActive: {
    backgroundColor: Colors.light.primary,
  },

  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
  },

  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});
