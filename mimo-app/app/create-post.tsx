// app/create-post.tsx - CREATE POST PAGE
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOOD_OPTIONS = [
  { id: 'happy', label: 'Mutlu', icon: 'smile' },
  { id: 'calm', label: 'Sakin', icon: 'coffee' },
  { id: 'grateful', label: 'Minnettar', icon: 'heart' },
  { id: 'motivated', label: 'Motive', icon: 'zap' },
];

export default function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handlePost = () => {
    if (!content.trim()) {
      Alert.alert('Hata', 'Lütfen birşeyler yazın.');
      return;
    }

    Alert.alert('Paylaşıldı!', 'Paylaşımınız oluşturuldu.', [
      { text: 'Tamam', onPress: () => router.back() },
    ]);
  };

  const handlePickImage = () => {
    // Mock image picker
    setSelectedImage('https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="x" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Paylaşım</Text>
        <TouchableOpacity onPress={handlePost}>
          <Text style={styles.postButton}>Paylaş</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AY</Text>
          </View>
          <Text style={styles.userName}>
            {isAnonymous ? 'Anonim' : 'Ayşe Yılmaz'}
          </Text>
        </View>

        <TextInput
          style={styles.contentInput}
          placeholder="Ne düşünüyorsun?"
          placeholderTextColor={Colors.light.textLight}
          value={content}
          onChangeText={setContent}
          multiline
          autoFocus
        />

        {selectedImage && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Feather name="x" size={16} color={Colors.light.surface} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ruh halin nasıl?</Text>
          <View style={styles.moodOptions}>
            {MOOD_OPTIONS.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodOption,
                  selectedMood === mood.id && styles.moodOptionActive,
                ]}
                onPress={() => setSelectedMood(mood.id)}
              >
                <Feather
                  name={mood.icon as any}
                  size={18}
                  color={
                    selectedMood === mood.id
                      ? Colors.light.surface
                      : Colors.light.textSecondary
                  }
                />
                <Text style={[
                  styles.moodLabel,
                  selectedMood === mood.id && styles.moodLabelActive,
                ]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.optionsCard}>
          <TouchableOpacity style={styles.option} onPress={handlePickImage}>
            <View style={styles.optionLeft}>
              <Feather name="image" size={20} color={Colors.light.textPrimary} />
              <Text style={styles.optionText}>Fotoğraf ekle</Text>
            </View>
            <Feather name="chevron-right" size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.option}
            onPress={() => setIsAnonymous(!isAnonymous)}
          >
            <View style={styles.optionLeft}>
              <Feather name="user-x" size={20} color={Colors.light.textPrimary} />
              <Text style={styles.optionText}>Anonim paylaş</Text>
            </View>
            <View style={[
              styles.toggle,
              isAnonymous && styles.toggleActive,
            ]}>
              <View style={[
                styles.toggleThumb,
                isAnonymous && styles.toggleThumbActive,
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  postButton: {
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

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },

  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.surface,
  },

  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },

  contentInput: {
    fontSize: 16,
    color: Colors.light.textPrimary,
    lineHeight: 24,
    minHeight: 150,
    marginBottom: Spacing.lg,
  },

  imagePreview: {
    position: 'relative',
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },

  previewImage: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.light.border,
  },

  removeImageButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  section: {
    marginBottom: Spacing.xl,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },

  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  moodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },

  moodOptionActive: {
    backgroundColor: Colors.light.secondary,
  },

  moodLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },

  moodLabelActive: {
    color: Colors.light.surface,
  },

  optionsCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.xs,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },

  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textPrimary,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.light.divider,
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
    backgroundColor: Colors.light.secondary,
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
