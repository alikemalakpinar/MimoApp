// shared/components/OraAI.tsx - Ora AI Companion with Emotional Memory
// "Your personal wellness companion that remembers, learns, and grows with you"
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Path, Defs, RadialGradient, Stop, G } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { useThemeStore } from '../store/themeStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// ============================================
// TYPES & INTERFACES
// ============================================
interface EmotionalMemory {
  date: string;
  mood: string;
  moodScore: number;
  triggers: string[];
  copingStrategies: string[];
  insights: string[];
}

interface ConversationMessage {
  id: string;
  role: 'user' | 'ora';
  content: string;
  timestamp: Date;
  emotion?: string;
  suggestions?: string[];
}

interface UserPattern {
  peakMoodTimes: string[];
  commonTriggers: string[];
  effectiveStrategies: string[];
  weeklyTrend: 'improving' | 'stable' | 'declining';
  streakDays: number;
}

// ============================================
// ORA AI AVATAR - Animated breathing orb
// ============================================
interface OraAvatarProps {
  size?: number;
  isListening?: boolean;
  isThinking?: boolean;
  mood?: 'calm' | 'supportive' | 'celebratory' | 'empathetic';
}

export const OraAvatar: React.FC<OraAvatarProps> = ({
  size = 120,
  isListening = false,
  isThinking = false,
  mood = 'calm',
}) => {
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const moodColors = {
    calm: ['#7C5CE0', '#A18AFF', '#C4B5FD'],
    supportive: ['#20B2AA', '#5CD5CD', '#A7F3D0'],
    celebratory: ['#FFB347', '#FFD89B', '#FEF3C7'],
    empathetic: ['#FF6B6B', '#FFA07A', '#FECACA'],
  };

  useEffect(() => {
    // Breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.15,
          duration: isListening ? 800 : 3000,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: isListening ? 800 : 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation for thinking state
    if (isThinking) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isListening, isThinking]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const colors = moodColors[mood];

  return (
    <View style={[styles.avatarContainer, { width: size, height: size }]}>
      {/* Outer glow */}
      <Animated.View
        style={[
          styles.avatarGlow,
          {
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: size * 0.75,
            backgroundColor: colors[0],
            opacity: pulseAnim,
            transform: [{ scale: breatheAnim }],
          },
        ]}
      />

      {/* Main orb */}
      <Animated.View
        style={[
          styles.avatarOrb,
          {
            transform: [
              { scale: breatheAnim },
              { rotate: isThinking ? spin : '0deg' },
            ],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Defs>
            <RadialGradient id="oraGradient" cx="30%" cy="30%" r="70%">
              <Stop offset="0%" stopColor={colors[2]} stopOpacity="1" />
              <Stop offset="50%" stopColor={colors[1]} stopOpacity="0.9" />
              <Stop offset="100%" stopColor={colors[0]} stopOpacity="0.8" />
            </RadialGradient>
            <RadialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Main sphere */}
          <Circle cx="60" cy="60" r="50" fill="url(#oraGradient)" />

          {/* Inner highlight */}
          <Circle cx="45" cy="45" r="20" fill="url(#innerGlow)" />

          {/* Core */}
          <Circle cx="60" cy="60" r="8" fill={colors[0]} opacity="0.8" />

          {/* Listening indicator */}
          {isListening && (
            <G>
              <Circle cx="60" cy="60" r="55" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.5" />
              <Circle cx="60" cy="60" r="58" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.3" />
            </G>
          )}
        </Svg>
      </Animated.View>

      {/* Thinking particles */}
      {isThinking && (
        <View style={styles.thinkingParticles}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  backgroundColor: colors[0],
                  transform: [
                    { rotate: `${i * 120}deg` },
                    { translateY: -size * 0.4 },
                  ],
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// ============================================
// QUICK MOOD SELECTOR
// ============================================
interface QuickMoodSelectorProps {
  onSelect: (mood: string, score: number) => void;
}

const QUICK_MOODS = [
  { emoji: '😊', label: 'Harika', score: 5, color: '#10B981' },
  { emoji: '🙂', label: 'İyi', score: 4, color: '#3B82F6' },
  { emoji: '😐', label: 'Normal', score: 3, color: '#F59E0B' },
  { emoji: '😔', label: 'Kötü', score: 2, color: '#EF4444' },
  { emoji: '😢', label: 'Çok Kötü', score: 1, color: '#7C3AED' },
];

export const QuickMoodSelector: React.FC<QuickMoodSelectorProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const scaleAnims = useRef(QUICK_MOODS.map(() => new Animated.Value(1))).current;

  const handleSelect = (index: number) => {
    setSelected(index);
    const mood = QUICK_MOODS[index];

    // Bounce animation
    Animated.sequence([
      Animated.spring(scaleAnims[index], {
        toValue: 1.3,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    onSelect(mood.label, mood.score);
  };

  return (
    <View style={styles.moodSelector}>
      <Text style={styles.moodSelectorTitle}>Bugün nasıl hissediyorsun?</Text>
      <View style={styles.moodOptions}>
        {QUICK_MOODS.map((mood, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSelect(index)}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.moodOption,
                selected === index && {
                  backgroundColor: mood.color + '20',
                  borderColor: mood.color,
                },
                { transform: [{ scale: scaleAnims[index] }] },
              ]}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  selected === index && { color: mood.color },
                ]}
              >
                {mood.label}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// ============================================
// AI INSIGHT CARD
// ============================================
interface InsightCardProps {
  title: string;
  insight: string;
  icon: string;
  color: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  insight,
  icon,
  color,
  actionLabel,
  onAction,
}) => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.insightCard, { backgroundColor: colors.surface }]}>
      <LinearGradient
        colors={[color + '20', 'transparent']}
        style={styles.insightGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.insightHeader}>
        <View style={[styles.insightIcon, { backgroundColor: color + '30' }]}>
          <Feather name={icon as any} size={20} color={color} />
        </View>
        <Text style={[styles.insightTitle, { color: colors.textPrimary }]}>{title}</Text>
      </View>
      <Text style={[styles.insightText, { color: colors.textSecondary }]}>{insight}</Text>
      {actionLabel && (
        <TouchableOpacity
          style={[styles.insightAction, { borderColor: color }]}
          onPress={onAction}
        >
          <Text style={[styles.insightActionText, { color }]}>{actionLabel}</Text>
          <Feather name="arrow-right" size={16} color={color} />
        </TouchableOpacity>
      )}
    </View>
  );
};

// ============================================
// CHAT MESSAGE BUBBLE
// ============================================
interface MessageBubbleProps {
  message: ConversationMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const isOra = message.role === 'ora';
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageBubbleContainer,
        isOra ? styles.oraMessage : styles.userMessage,
        { opacity: fadeAnim },
      ]}
    >
      {isOra && (
        <View style={styles.oraAvatarSmall}>
          <OraAvatar size={32} mood="supportive" />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          isOra
            ? { backgroundColor: colors.surface }
            : { backgroundColor: colors.primary },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: isOra ? colors.textPrimary : '#FFFFFF' },
          ]}
        >
          {message.content}
        </Text>
        {message.suggestions && message.suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {message.suggestions.map((suggestion, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.suggestionChip, { borderColor: colors.primary }]}
              >
                <Text style={[styles.suggestionText, { color: colors.primary }]}>
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// ============================================
// ORA CHAT INTERFACE
// ============================================
interface OraChatProps {
  onClose?: () => void;
  initialMessage?: string;
}

export const OraChat: React.FC<OraChatProps> = ({ onClose, initialMessage }) => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [oraState, setOraState] = useState<'calm' | 'supportive' | 'celebratory' | 'empathetic'>('calm');
  const scrollViewRef = useRef<ScrollView>(null);

  // Simulated AI responses based on emotional analysis
  const generateOraResponse = useCallback(async (userMessage: string): Promise<ConversationMessage> => {
    // Simulate emotional analysis
    const emotions = analyzeEmotion(userMessage);

    // Adjust Ora's mood based on user emotion
    if (emotions.includes('sad') || emotions.includes('anxious')) {
      setOraState('empathetic');
    } else if (emotions.includes('happy') || emotions.includes('grateful')) {
      setOraState('celebratory');
    } else {
      setOraState('supportive');
    }

    // Generate contextual response
    const responses = getContextualResponses(emotions, userMessage);
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      id: Date.now().toString(),
      role: 'ora',
      content: selectedResponse.content,
      timestamp: new Date(),
      suggestions: selectedResponse.suggestions,
    };
  }, []);

  const analyzeEmotion = (text: string): string[] => {
    const emotions: string[] = [];
    const lowerText = text.toLowerCase();

    if (lowerText.match(/üzgün|mutsuz|kötü|ağl|yalnız/)) emotions.push('sad');
    if (lowerText.match(/endişe|kaygı|korku|stres|gergin/)) emotions.push('anxious');
    if (lowerText.match(/mutlu|iyi|harika|sevin|güzel/)) emotions.push('happy');
    if (lowerText.match(/teşekkür|minnet|şükür/)) emotions.push('grateful');
    if (lowerText.match(/yorgun|tüken|bitkin/)) emotions.push('tired');
    if (lowerText.match(/öfke|sinir|kız|nefret/)) emotions.push('angry');

    return emotions.length > 0 ? emotions : ['neutral'];
  };

  const getContextualResponses = (emotions: string[], message: string) => {
    const responseMap: Record<string, { content: string; suggestions?: string[] }[]> = {
      sad: [
        {
          content: "Bu hisleri yaşaman çok zor olmalı. Seninle birlikteyim ve seni dinliyorum. 💜 Üzüntünün kaynağı hakkında biraz daha konuşmak ister misin?",
          suggestions: ["Evet, konuşalım", "Sadece dinle", "Nefes egzersizi yap"],
        },
        {
          content: "Üzgün hissetmek tamamen normal ve geçerli bir duygu. Kendine karşı nazik ol. 🌸 Bu duyguyla nasıl başa çıkabileceğimize birlikte bakalım mı?",
          suggestions: ["Günlük yaz", "Meditasyon öner", "Aktivite öner"],
        },
      ],
      anxious: [
        {
          content: "Kaygı hissettiğini anlıyorum. Birlikte nefes alalım ve şu anı odaklanalım. 🌿 4-7-8 nefes tekniğini denemek ister misin?",
          suggestions: ["Evet, başlayalım", "Başka bir teknik", "Konuşmak istiyorum"],
        },
        {
          content: "Endişeli hissetmek yorucu olabilir. Hatırla, bu an geçici. 💫 Seni endişelendiren şeyi parçalara ayırıp bakalım mı?",
          suggestions: ["Evet, bakalım", "Dikkat dağıtıcı aktivite", "Rahatlama egzersizi"],
        },
      ],
      happy: [
        {
          content: "Bu harika! Mutluluğunu duymak beni de çok sevindirdi! 🎉 Bu güzel anı not etmek ister misin?",
          suggestions: ["Günlüğe kaydet", "Paylaş", "Devam edelim"],
        },
        {
          content: "Pozitif enerjin harika! 🌟 Bu güzel hissi yaratan şeyi keşfetmek, gelecekte de mutlu olmana yardımcı olabilir.",
          suggestions: ["Analiz edelim", "Teşekkür listesi yap", "Kutlayalım"],
        },
      ],
      neutral: [
        {
          content: "Bugün nasıl bir gün geçirdin? Seninle her konuda konuşabiliriz. 💭",
          suggestions: ["Günümü anlat", "Tavsiye iste", "Test öner"],
        },
      ],
      tired: [
        {
          content: "Yorgunluk zor bir his. Kendine dinlenme izni vermek önemli. 🌙 Kısa bir rahatlama egzersizi yapmak ister misin?",
          suggestions: ["Body scan", "Uyku meditasyonu", "Enerji veren aktivite"],
        },
      ],
      angry: [
        {
          content: "Öfke hissettiğini anlıyorum. Bu duygu da geçerli ve dinlenmeyi hak ediyor. 🔥 Bu duyguyu güvenli bir şekilde ifade etmek için ne yapabiliriz?",
          suggestions: ["Nefes egzersizi", "Yazarak ifade et", "Fiziksel aktivite"],
        },
      ],
    };

    const primaryEmotion = emotions[0];
    return responseMap[primaryEmotion] || responseMap.neutral;
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsThinking(true);

    // Simulate AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const oraResponse = await generateOraResponse(userMessage.content);
    setMessages((prev) => [...prev, oraResponse]);
    setIsThinking(false);
  };

  useEffect(() => {
    // Initial greeting
    const greeting: ConversationMessage = {
      id: 'greeting',
      role: 'ora',
      content: initialMessage || "Merhaba! 💜 Ben Ora, kişisel wellness yol arkadaşın. Seninle konuşmak için buradayım. Bugün nasıl hissediyorsun?",
      timestamp: new Date(),
      suggestions: ["Çok iyi!", "İdare eder", "Pek iyi değil"],
    };
    setMessages([greeting]);
  }, [initialMessage]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={[styles.chatContainer, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <BlurView intensity={80} tint={isDarkMode ? 'dark' : 'light'} style={styles.chatHeader}>
        <View style={styles.chatHeaderContent}>
          <OraAvatar size={44} isListening={isThinking} mood={oraState} />
          <View style={styles.chatHeaderInfo}>
            <Text style={[styles.chatHeaderTitle, { color: colors.textPrimary }]}>Ora</Text>
            <Text style={[styles.chatHeaderStatus, { color: colors.textSecondary }]}>
              {isThinking ? 'Düşünüyor...' : 'Seninle birlikte'}
            </Text>
          </View>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
      </BlurView>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isThinking && (
          <View style={styles.thinkingIndicator}>
            <OraAvatar size={48} isThinking mood={oraState} />
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <BlurView intensity={80} tint={isDarkMode ? 'dark' : 'light'} style={styles.inputContainer}>
        <View style={[styles.inputWrapper, { backgroundColor: colors.surfaceAlt }]}>
          <TextInput
            style={[styles.textInput, { color: colors.textPrimary }]}
            placeholder="Mesajını yaz..."
            placeholderTextColor={colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={() => {/* Voice input */}}
          >
            <Feather name="mic" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: inputText.trim() ? colors.primary : colors.border },
          ]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isThinking}
        >
          <Feather name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </BlurView>
    </KeyboardAvoidingView>
  );
};

// ============================================
// DAILY CHECK-IN COMPONENT
// ============================================
interface DailyCheckInProps {
  onComplete: (data: {
    mood: number;
    energy: number;
    sleep: number;
    gratitude: string[];
    goals: string[];
  }) => void;
}

export const DailyCheckIn: React.FC<DailyCheckInProps> = ({ onComplete }) => {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [sleep, setSleep] = useState(3);
  const [gratitude, setGratitude] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const steps = [
    { title: 'Ruh Halin', subtitle: 'Bugün nasıl hissediyorsun?' },
    { title: 'Enerji Seviyen', subtitle: 'Ne kadar enerjik hissediyorsun?' },
    { title: 'Uyku Kaliten', subtitle: 'Dün gece nasıl uyudun?' },
    { title: 'Minnettarlık', subtitle: 'Bugün neye minnettar hissediyorsun?' },
    { title: 'Günlük Hedef', subtitle: 'Bugün için küçük bir hedef belirle' },
  ];

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (step + 1) / steps.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [step]);

  const renderSlider = (value: number, onChange: (v: number) => void, labels: string[]) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderTrack}>
        {[1, 2, 3, 4, 5].map((v) => (
          <TouchableOpacity
            key={v}
            onPress={() => onChange(v)}
            style={[
              styles.sliderDot,
              v <= value && { backgroundColor: colors.primary },
              v === value && styles.sliderDotActive,
            ]}
          >
            {v === value && (
              <View style={[styles.sliderDotInner, { backgroundColor: colors.primary }]} />
            )}
          </TouchableOpacity>
        ))}
        <View style={[styles.sliderLine, { backgroundColor: colors.border }]} />
        <Animated.View
          style={[
            styles.sliderLineFilled,
            {
              backgroundColor: colors.primary,
              width: `${((value - 1) / 4) * 100}%`,
            },
          ]}
        />
      </View>
      <View style={styles.sliderLabels}>
        <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>{labels[0]}</Text>
        <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>{labels[1]}</Text>
      </View>
    </View>
  );

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({ mood, energy, sleep, gratitude, goals });
    }
  };

  return (
    <View style={[styles.checkInContainer, { backgroundColor: colors.background }]}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {/* Content */}
      <View style={styles.checkInContent}>
        <OraAvatar size={80} mood="supportive" />
        <Text style={[styles.checkInTitle, { color: colors.textPrimary }]}>
          {steps[step].title}
        </Text>
        <Text style={[styles.checkInSubtitle, { color: colors.textSecondary }]}>
          {steps[step].subtitle}
        </Text>

        <View style={styles.checkInInput}>
          {step === 0 && renderSlider(mood, setMood, ['Çok Kötü', 'Harika'])}
          {step === 1 && renderSlider(energy, setEnergy, ['Düşük', 'Yüksek'])}
          {step === 2 && renderSlider(sleep, setSleep, ['Kötü', 'Mükemmel'])}
          {/* Steps 3 & 4 would have text inputs for gratitude and goals */}
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.checkInNav}>
        {step > 0 && (
          <TouchableOpacity
            style={[styles.navButton, { borderColor: colors.border }]}
            onPress={() => setStep(step - 1)}
          >
            <Feather name="arrow-left" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.navButtonPrimary, { backgroundColor: colors.primary }]}
          onPress={handleNext}
        >
          <Text style={styles.navButtonText}>
            {step === steps.length - 1 ? 'Tamamla' : 'Devam'}
          </Text>
          <Feather name="arrow-right" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  // Avatar styles
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarGlow: {
    position: 'absolute',
  },
  avatarOrb: {
    position: 'absolute',
  },
  thinkingParticles: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Mood selector styles
  moodSelector: {
    padding: Spacing.xl,
  },
  moodSelectorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodOption: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 60,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },

  // Insight card styles
  insightCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  insightGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  insightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  insightActionText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Chat styles
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  chatHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeaderInfo: {
    marginLeft: Spacing.md,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  chatHeaderStatus: {
    fontSize: 13,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    maxWidth: '85%',
  },
  oraMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  oraAvatarSmall: {
    marginRight: Spacing.sm,
  },
  messageBubble: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    maxWidth: '100%',
    ...Shadows.xs,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  suggestionChip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  thinkingIndicator: {
    alignSelf: 'flex-start',
    marginLeft: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  voiceButton: {
    padding: Spacing.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Check-in styles
  checkInContainer: {
    flex: 1,
    paddingTop: Spacing.xl,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.light.border,
    marginHorizontal: Spacing.xl,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  checkInContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  checkInTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  checkInSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  checkInInput: {
    width: '100%',
    paddingHorizontal: Spacing.xl,
  },
  sliderContainer: {
    width: '100%',
  },
  sliderTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    position: 'relative',
  },
  sliderLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 4,
    borderRadius: 2,
  },
  sliderLineFilled: {
    position: 'absolute',
    left: 20,
    height: 4,
    borderRadius: 2,
  },
  sliderDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  sliderDotActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary + '30',
  },
  sliderDotInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  sliderLabel: {
    fontSize: 13,
  },
  checkInNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.pill,
    gap: Spacing.sm,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default {
  OraAvatar,
  QuickMoodSelector,
  InsightCard,
  OraChat,
  DailyCheckIn,
};
