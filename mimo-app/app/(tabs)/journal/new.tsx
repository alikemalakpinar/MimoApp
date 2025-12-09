// app/(tabs)/journal/new.tsx - PREMIUM JOURNAL ENTRY WITH LOTTIE ANIMATIONS
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
// LottieView ready for future animations
// import LottieView from 'lottie-react-native';
import { Colors, Spacing, BorderRadius, Shadows, useThemeStore } from '../../../shared/theme';
// Haptics disabled for build compatibility
// import * as Haptics from 'expo-haptics';
const Haptics = {
  impactAsync: () => Promise.resolve(),
  notificationAsync: () => Promise.resolve(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
};

const { width, height } = Dimensions.get('window');

// ============================================
// ANIMATED MOOD SELECTOR
// ============================================
interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  color: string;
  gradient: string[];
}

const MOODS: MoodOption[] = [
  { id: 'amazing', emoji: '🌟', label: 'Muhteşem', color: '#F59E0B', gradient: ['#F59E0B', '#FBBF24'] },
  { id: 'happy', emoji: '😊', label: 'Mutlu', color: '#10B981', gradient: ['#10B981', '#34D399'] },
  { id: 'calm', emoji: '😌', label: 'Sakin', color: '#06B6D4', gradient: ['#06B6D4', '#22D3EE'] },
  { id: 'neutral', emoji: '😐', label: 'Nötr', color: '#6B7280', gradient: ['#6B7280', '#9CA3AF'] },
  { id: 'anxious', emoji: '😰', label: 'Kaygılı', color: '#8B5CF6', gradient: ['#8B5CF6', '#A78BFA'] },
  { id: 'sad', emoji: '😢', label: 'Üzgün', color: '#6366F1', gradient: ['#6366F1', '#818CF8'] },
];

const AnimatedMoodSelector: React.FC<{
  selectedMood: string | null;
  onSelect: (mood: string) => void;
}> = ({ selectedMood, onSelect }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <View style={styles.moodSelector}>
      <Text style={[styles.sectionLabel, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
        Bugün nasıl hissediyorsun?
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodList}>
        {MOODS.map((mood, index) => {
          const isSelected = selectedMood === mood.id;
          const scaleAnim = useRef(new Animated.Value(1)).current;
          const bounceAnim = useRef(new Animated.Value(0)).current;

          useEffect(() => {
            if (isSelected) {
              Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1.15, friction: 3, useNativeDriver: true }),
                Animated.spring(bounceAnim, { toValue: -10, friction: 3, useNativeDriver: true }),
              ]).start();
            } else {
              Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
                Animated.spring(bounceAnim, { toValue: 0, friction: 3, useNativeDriver: true }),
              ]).start();
            }
          }, [isSelected]);

          const handlePress = () => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            onSelect(mood.id);
          };

          return (
            <TouchableOpacity key={mood.id} onPress={handlePress} activeOpacity={0.8}>
              <Animated.View
                style={[
                  styles.moodItem,
                  {
                    transform: [{ scale: scaleAnim }, { translateY: bounceAnim }],
                    backgroundColor: isSelected
                      ? mood.color + '20'
                      : (isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                    borderColor: isSelected ? mood.color : 'transparent',
                  },
                ]}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    { color: isSelected ? mood.color : (isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)') },
                  ]}
                >
                  {mood.label}
                </Text>
                {isSelected && (
                  <View style={[styles.moodCheck, { backgroundColor: mood.color }]}>
                    <Feather name="check" size={10} color="#FFFFFF" />
                  </View>
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// ============================================
// WRITING PROMPTS CAROUSEL
// ============================================
const PROMPTS = [
  { id: '1', text: 'Bugün en çok neye minnettar hissediyorsun?', icon: 'heart' },
  { id: '2', text: 'Bu anı bir kelimeyle anlat...', icon: 'edit-3' },
  { id: '3', text: 'Bugün seni ne güldürdü?', icon: 'smile' },
  { id: '4', text: 'Kendine ne söylemek istersin?', icon: 'message-circle' },
  { id: '5', text: 'Yarın için bir niyet belirle...', icon: 'target' },
];

const WritingPromptsCarousel: React.FC<{
  onSelectPrompt: (text: string) => void;
}> = ({ onSelectPrompt }) => {
  const { isDarkMode } = useThemeStore();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.promptsSection}>
      <View style={styles.promptsHeader}>
        <Feather name="lightbulb" size={16} color="#F59E0B" />
        <Text style={[styles.promptsTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
          İlham Al
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={width - 80}
        decelerationRate="fast"
        contentContainerStyle={styles.promptsCarousel}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / (width - 80));
          setActiveIndex(index);
        }}
      >
        {PROMPTS.map((prompt, index) => (
          <TouchableOpacity
            key={prompt.id}
            style={[
              styles.promptCard,
              { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)' },
            ]}
            onPress={() => onSelectPrompt(prompt.text)}
            activeOpacity={0.8}
          >
            <View style={[styles.promptIconContainer, { backgroundColor: '#F59E0B20' }]}>
              <Feather name={prompt.icon as any} size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.promptText, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
              {prompt.text}
            </Text>
            <View style={styles.promptAction}>
              <Text style={styles.promptActionText}>Kullan</Text>
              <Feather name="arrow-right" size={14} color="#6366F1" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Pagination dots */}
      <View style={styles.pagination}>
        {PROMPTS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: activeIndex === index
                  ? '#6366F1'
                  : (isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'),
                width: activeIndex === index ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// ============================================
// ANIMATED TEXT INPUT
// ============================================
const AnimatedTextArea: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}> = ({ value, onChangeText, placeholder }) => {
  const { isDarkMode } = useThemeStore();
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(focusAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(borderAnim, {
        toValue: isFocused ? 1 : 0,
        friction: 8,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isFocused]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#6366F1'],
  });

  const shadowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.1],
  });

  return (
    <View style={styles.textAreaContainer}>
      <Animated.View
        style={[
          styles.textAreaWrapper,
          {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderColor,
            shadowOpacity,
          },
        ]}
      >
        <TextInput
          style={[
            styles.textArea,
            { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' },
          ]}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
          value={value}
          onChangeText={onChangeText}
          multiline
          textAlignVertical="top"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {/* Word count */}
        <View style={styles.wordCount}>
          <Text style={[styles.wordCountText, { color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }]}>
            {value.split(/\s+/).filter(Boolean).length} kelime
          </Text>
        </View>
      </Animated.View>
      {/* Floating label animation */}
      {isFocused && (
        <Animated.View style={[styles.floatingLabel, { opacity: focusAnim }]}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            style={styles.floatingLabelGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Feather name="edit-3" size={12} color="#FFFFFF" />
            <Text style={styles.floatingLabelText}>Yazıyor...</Text>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
};

// ============================================
// ATTACHMENT OPTIONS
// ============================================
const AttachmentOptions: React.FC<{
  onAttach: (type: string) => void;
}> = ({ onAttach }) => {
  const { isDarkMode } = useThemeStore();

  const options = [
    { id: 'photo', icon: 'image', label: 'Fotoğraf', color: '#10B981' },
    { id: 'voice', icon: 'mic', label: 'Ses', color: '#F43F5E' },
    { id: 'location', icon: 'map-pin', label: 'Konum', color: '#6366F1' },
    { id: 'tag', icon: 'tag', label: 'Etiket', color: '#F59E0B' },
  ];

  return (
    <View style={styles.attachments}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[styles.attachmentBtn, { backgroundColor: option.color + '15' }]}
          onPress={() => onAttach(option.id)}
          activeOpacity={0.8}
        >
          <Feather name={option.icon as any} size={18} color={option.color} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ============================================
// PRIVACY TOGGLE
// ============================================
const PrivacyToggle: React.FC<{
  isPrivate: boolean;
  onToggle: () => void;
}> = ({ isPrivate, onToggle }) => {
  const { isDarkMode } = useThemeStore();
  const translateX = useRef(new Animated.Value(isPrivate ? 22 : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isPrivate ? 22 : 0,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isPrivate]);

  return (
    <TouchableOpacity
      style={[styles.privacyToggle, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={styles.privacyInfo}>
        <Feather
          name={isPrivate ? 'lock' : 'globe'}
          size={18}
          color={isPrivate ? '#10B981' : '#6B7280'}
        />
        <View style={styles.privacyTextContainer}>
          <Text style={[styles.privacyTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
            {isPrivate ? 'Özel Günlük' : 'Herkese Açık'}
          </Text>
          <Text style={[styles.privacyDesc, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }]}>
            {isPrivate ? 'Sadece sen görebilirsin' : 'Toplulukla paylaş'}
          </Text>
        </View>
      </View>
      <View style={[styles.toggleTrack, { backgroundColor: isPrivate ? '#10B98130' : '#6B728030' }]}>
        <Animated.View
          style={[
            styles.toggleThumb,
            {
              transform: [{ translateX }],
              backgroundColor: isPrivate ? '#10B981' : '#6B7280',
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

// ============================================
// SUCCESS ANIMATION MODAL
// ============================================
const SuccessModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(confettiAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.successModal, { opacity: opacityAnim }]}>
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
      <Animated.View style={[styles.successContent, { transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient
          colors={['#10B981', '#34D399']}
          style={styles.successIconContainer}
        >
          <Feather name="check" size={48} color="#FFFFFF" />
        </LinearGradient>
        <Text style={styles.successTitle}>Harika!</Text>
        <Text style={styles.successMessage}>Günlüğün başarıyla kaydedildi</Text>
        <TouchableOpacity style={styles.successButton} onPress={onClose}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            style={styles.successButtonGradient}
          >
            <Text style={styles.successButtonText}>Tamam</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function NewJournal() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  const handleSave = () => {
    if (!content.trim()) {
      Alert.alert('Bir dakika!', 'Lütfen günlüğüne bir şeyler yaz.');
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.back();
  };

  const handlePromptSelect = (text: string) => {
    setContent(content + (content ? '\n\n' : '') + text + '\n');
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0A0A15' : '#F8F9FC' }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Background */}
      <LinearGradient
        colors={isDarkMode
          ? ['#0A0A15', '#1A1A2E', '#0A0A15']
          : ['#F8F9FC', '#EEF2FF', '#F8F9FC']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
            onPress={() => router.back()}
          >
            <Feather name="x" size={22} color={isDarkMode ? '#FFFFFF' : '#1A1A2E'} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
              Yeni Günlük
            </Text>
            <Text style={[styles.headerDate, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }]}>
              {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { opacity: content.trim() ? 1 : 0.5 }]}
            onPress={handleSave}
            disabled={!content.trim()}
          >
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.saveButtonGradient}
            >
              <Feather name="check" size={18} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Mood Selector */}
            <AnimatedMoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />

            {/* Writing Prompts */}
            {!keyboardVisible && (
              <WritingPromptsCarousel onSelectPrompt={handlePromptSelect} />
            )}

            {/* Text Area */}
            <AnimatedTextArea
              value={content}
              onChangeText={setContent}
              placeholder="Bugün neler oldu? Nasıl hissettin? Düşüncelerini buraya yaz..."
            />

            {/* Attachments */}
            <AttachmentOptions onAttach={(type) => console.log('Attach:', type)} />

            {/* Privacy Toggle */}
            <PrivacyToggle isPrivate={isPrivate} onToggle={() => setIsPrivate(!isPrivate)} />

            {/* Spacer for keyboard */}
            <View style={{ height: 100 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Success Modal */}
      <SuccessModal visible={showSuccess} onClose={handleSuccessClose} />
    </View>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerDate: {
    fontSize: 12,
    marginTop: 2,
  },
  saveButton: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  // Mood Selector
  moodSelector: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  moodList: {
    gap: 12,
    paddingRight: 20,
  },
  moodItem: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    minWidth: 80,
    position: 'relative',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  moodCheck: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Prompts
  promptsSection: {
    marginBottom: 24,
  },
  promptsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  promptsTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  promptsCarousel: {
    paddingRight: 20,
  },
  promptCard: {
    width: width - 80,
    marginRight: 16,
    padding: 20,
    borderRadius: 20,
  },
  promptIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  promptText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 14,
  },
  promptAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  promptActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },

  // Text Area
  textAreaContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  textAreaWrapper: {
    borderRadius: 24,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  textArea: {
    minHeight: 200,
    padding: 20,
    fontSize: 16,
    lineHeight: 26,
  },
  wordCount: {
    position: 'absolute',
    bottom: 12,
    right: 16,
  },
  wordCountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  floatingLabel: {
    position: 'absolute',
    top: -12,
    left: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  floatingLabelGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  floatingLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Attachments
  attachments: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  attachmentBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Privacy Toggle
  privacyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
  },
  privacyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  privacyTextContainer: {
    gap: 2,
  },
  privacyTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  privacyDesc: {
    fontSize: 12,
  },
  toggleTrack: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 3,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },

  // Success Modal
  successModal: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  successContent: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.95)',
    width: width - 60,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 15,
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 28,
    textAlign: 'center',
  },
  successButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  successButtonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 14,
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
