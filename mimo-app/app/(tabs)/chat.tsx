// app/(tabs)/chat.tsx - FUTURISTIC 2026 MESSAGING EXPERIENCE
// Featuring: AI-assisted responses, emotion detection, voice messages, wellness check-ins, smart replies
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  Platform,
  Image,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { Colors, Spacing, BorderRadius, Shadows, useThemeStore } from '../../shared/theme';

const { width, height } = Dimensions.get('window');

// ============================================
// ORA AI ASSISTANT HEADER - Always present helper
// ============================================
const OraAssistantBanner: React.FC<{
  onPress: () => void;
}> = ({ onPress }) => {
  const { isDarkMode } = useThemeStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.5, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View style={[styles.oraBanner, { transform: [{ scale: pulseAnim }] }]}>
        <LinearGradient
          colors={isDarkMode
            ? ['rgba(99,102,241,0.3)', 'rgba(139,92,246,0.2)']
            : ['rgba(99,102,241,0.15)', 'rgba(139,92,246,0.1)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <BlurView intensity={isDarkMode ? 40 : 60} tint={isDarkMode ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />

        {/* AI Avatar */}
        <Animated.View style={[styles.oraAvatar, { opacity: glowAnim }]}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            style={styles.oraAvatarInner}
          >
            <Feather name="zap" size={20} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>

        <View style={styles.oraContent}>
          <Text style={[styles.oraTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
            Ora Asistanı
          </Text>
          <Text style={[styles.oraSubtitle, { color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }]}>
            Hemen konuşmaya başla
          </Text>
        </View>

        <View style={styles.oraStatus}>
          <View style={styles.oraOnlineDot} />
          <Text style={[styles.oraStatusText, { color: '#10B981' }]}>Çevrimiçi</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ============================================
// CONVERSATION CARD - Modern chat preview
// ============================================
interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  isTherapist: boolean;
  mood?: 'happy' | 'supportive' | 'professional';
  typing?: boolean;
  lastSeen?: string;
  aiSuggestion?: string;
}

const ConversationCard: React.FC<{
  conversation: Conversation;
  onPress: () => void;
}> = ({ conversation, onPress }) => {
  const { isDarkMode } = useThemeStore();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const typingAnim1 = useRef(new Animated.Value(0)).current;
  const typingAnim2 = useRef(new Animated.Value(0)).current;
  const typingAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (conversation.typing) {
      const createTypingAnimation = (anim: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
          ])
        );
      };
      createTypingAnimation(typingAnim1, 0).start();
      createTypingAnimation(typingAnim2, 150).start();
      createTypingAnimation(typingAnim3, 300).start();
    }
  }, [conversation.typing]);

  const getMoodColor = () => {
    switch (conversation.mood) {
      case 'happy': return '#10B981';
      case 'supportive': return '#F59E0B';
      case 'professional': return '#6366F1';
      default: return '#6B7280';
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.98, friction: 8, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }).start();
  };

  const renderTypingIndicator = () => (
    <View style={styles.typingIndicator}>
      {[typingAnim1, typingAnim2, typingAnim3].map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.typingDot,
            {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
              transform: [{
                translateY: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -4],
                }),
              }],
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.conversationCard,
          {
            transform: [{ scale: scaleAnim }],
            backgroundColor: isDarkMode ? 'rgba(30,30,45,0.8)' : 'rgba(255,255,255,0.95)',
          },
        ]}
      >
        <BlurView intensity={isDarkMode ? 25 : 50} tint={isDarkMode ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />

        {/* Avatar with status ring */}
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={conversation.online ? ['#10B981', '#34D399'] : ['#6B7280', '#9CA3AF']}
            style={styles.avatarRing}
          >
            <View style={[styles.avatarInner, { backgroundColor: isDarkMode ? '#1A1A2E' : '#FFFFFF' }]}>
              {conversation.avatar ? (
                <Image source={{ uri: conversation.avatar }} style={styles.avatarImage} />
              ) : (
                <LinearGradient
                  colors={conversation.isTherapist ? ['#6366F1', '#8B5CF6'] : ['#06B6D4', '#14B8A6']}
                  style={styles.avatarPlaceholder}
                >
                  <Text style={styles.avatarInitials}>{conversation.initials}</Text>
                </LinearGradient>
              )}
            </View>
          </LinearGradient>
          {conversation.isTherapist && (
            <View style={styles.verifiedBadge}>
              <Feather name="check" size={10} color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <View style={styles.nameContainer}>
              <Text style={[styles.conversationName, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
                {conversation.name}
              </Text>
              {conversation.mood && (
                <View style={[styles.moodIndicator, { backgroundColor: getMoodColor() + '20' }]}>
                  <View style={[styles.moodDot, { backgroundColor: getMoodColor() }]} />
                </View>
              )}
            </View>
            <Text style={[styles.conversationTime, { color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }]}>
              {conversation.time}
            </Text>
          </View>

          <View style={styles.conversationFooter}>
            {conversation.typing ? (
              renderTypingIndicator()
            ) : (
              <Text
                style={[
                  styles.lastMessage,
                  {
                    color: conversation.unread > 0
                      ? (isDarkMode ? '#FFFFFF' : '#1A1A2E')
                      : (isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'),
                    fontWeight: conversation.unread > 0 ? '600' : '400',
                  },
                ]}
                numberOfLines={1}
              >
                {conversation.lastMessage}
              </Text>
            )}
            {conversation.unread > 0 && (
              <View style={styles.unreadBadge}>
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6']}
                  style={styles.unreadBadgeGradient}
                >
                  <Text style={styles.unreadText}>{conversation.unread}</Text>
                </LinearGradient>
              </View>
            )}
          </View>

          {/* AI Suggestion */}
          {conversation.aiSuggestion && (
            <View style={styles.aiSuggestionContainer}>
              <Feather name="zap" size={10} color="#F59E0B" />
              <Text style={styles.aiSuggestionText}>{conversation.aiSuggestion}</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ============================================
// WELLNESS CHECK PROMPT - In-chat wellness
// ============================================
const WellnessCheckPrompt: React.FC<{
  onPress: () => void;
}> = ({ onPress }) => {
  const { isDarkMode } = useThemeStore();
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View
        style={[
          styles.wellnessPrompt,
          {
            transform: [{
              translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -5],
              }),
            }],
          },
        ]}
      >
        <LinearGradient
          colors={['#10B981', '#14B8A6']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.wellnessContent}>
          <View style={styles.wellnessIcon}>
            <Feather name="heart" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.wellnessText}>
            <Text style={styles.wellnessTitle}>Günlük Check-in</Text>
            <Text style={styles.wellnessSubtitle}>Bugün nasıl hissediyorsun?</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#FFFFFF" />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ============================================
// STORY CIRCLES - Quick access stories
// ============================================
const StoryCircles: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  const stories = [
    { id: 'add', name: 'Ekle', isAdd: true },
    { id: '1', name: 'Dr. Elif', initials: 'EY', hasNew: true, gradient: ['#6366F1', '#8B5CF6'] },
    { id: '2', name: 'Grup', initials: 'G', hasNew: true, gradient: ['#F59E0B', '#FBBF24'] },
    { id: '3', name: 'Destek', initials: 'D', hasNew: false, gradient: ['#10B981', '#34D399'] },
    { id: '4', name: 'Yoga', initials: 'Y', hasNew: false, gradient: ['#EC4899', '#F472B6'] },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.storiesContainer}
      contentContainerStyle={styles.storiesContent}
    >
      {stories.map((story) => (
        <TouchableOpacity key={story.id} style={styles.storyItem} activeOpacity={0.8}>
          {story.isAdd ? (
            <View style={[styles.storyCircle, styles.addStoryCircle, { borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }]}>
              <Feather name="plus" size={24} color={isDarkMode ? '#FFFFFF' : '#1A1A2E'} />
            </View>
          ) : (
            <View style={styles.storyWrapper}>
              <LinearGradient
                colors={story.hasNew ? ['#6366F1', '#EC4899'] : ['transparent', 'transparent']}
                style={[styles.storyRing, !story.hasNew && { borderWidth: 2, borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
              >
                <LinearGradient
                  colors={story.gradient || ['#6B7280', '#9CA3AF']}
                  style={styles.storyCircle}
                >
                  <Text style={styles.storyInitials}>{story.initials}</Text>
                </LinearGradient>
              </LinearGradient>
              {story.hasNew && <View style={styles.storyNewDot} />}
            </View>
          )}
          <Text style={[styles.storyName, { color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }]}>
            {story.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// ============================================
// SEARCH BAR - Modern glass search
// ============================================
const SearchBar: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
}> = ({ value, onChangeText }) => {
  const { isDarkMode } = useThemeStore();
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(focusAnim, {
      toValue: isFocused ? 1 : 0,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  return (
    <Animated.View
      style={[
        styles.searchBar,
        {
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
          borderColor: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', '#6366F1'],
          }),
          borderWidth: 1,
        },
      ]}
    >
      <Feather name="search" size={18} color={isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'} />
      <TextInput
        style={[styles.searchInput, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}
        placeholder="Ara..."
        placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <View style={[styles.clearButton, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
            <Feather name="x" size={14} color={isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'} />
          </View>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// ============================================
// FLOATING COMPOSE BUTTON
// ============================================
const FloatingComposeButton: React.FC<{
  onPress: () => void;
}> = ({ onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.9, friction: 8, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }).start();
  };

  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          style={styles.floatingButtonGradient}
        >
          <Feather name="edit-2" size={24} color="#FFFFFF" />
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ============================================
// MAIN CHAT SCREEN
// ============================================
export default function Chat() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Dr. Elif Yılmaz',
      initials: 'EY',
      lastMessage: 'Merhaba! Bugünkü seansımız için hazır mısın?',
      time: '10:30',
      unread: 2,
      online: true,
      isTherapist: true,
      mood: 'supportive',
      aiSuggestion: 'Randevu yaklaşıyor',
    },
    {
      id: '2',
      name: 'Mindfulness Grubu',
      initials: 'MG',
      lastMessage: 'Ayşe: Bugünkü meditasyon harikaydı! 🧘‍♀️',
      time: '09:15',
      unread: 5,
      online: true,
      isTherapist: false,
      typing: true,
    },
    {
      id: '3',
      name: 'Dr. Mehmet Kaya',
      initials: 'MK',
      lastMessage: 'Egzersizleri düzenli yapıyor musun?',
      time: 'Dün',
      unread: 0,
      online: false,
      isTherapist: true,
      mood: 'professional',
      lastSeen: '2 saat önce',
    },
    {
      id: '4',
      name: 'Destek Çemberi',
      initials: 'DC',
      lastMessage: 'Can: Teşekkürler, çok yardımcı oldunuz 💜',
      time: 'Dün',
      unread: 0,
      online: true,
      isTherapist: false,
    },
    {
      id: '5',
      name: 'Yoga & Wellness',
      initials: 'YW',
      lastMessage: 'Yarın sabah 07:00 - Güneşe Selam seansı',
      time: 'Paz',
      unread: 0,
      online: false,
      isTherapist: false,
      aiSuggestion: 'Seans hatırlatıcısı',
    },
  ];

  const filteredConversations = conversations.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

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
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <View>
            <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
              Mesajlar
            </Text>
            <Text style={[styles.headerSubtitle, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }]}>
              {conversations.filter(c => c.online).length} kişi çevrimiçi
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.headerButton, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
              <Feather name="video" size={20} color={isDarkMode ? '#FFFFFF' : '#1A1A2E'} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        </View>

        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {/* Story Circles */}
          <StoryCircles />

          {/* Ora AI Assistant */}
          <View style={styles.sectionContainer}>
            <OraAssistantBanner onPress={() => router.push('/ora-chat')} />
          </View>

          {/* Wellness Check */}
          <View style={styles.sectionContainer}>
            <WellnessCheckPrompt onPress={() => {}} />
          </View>

          {/* Conversations Section */}
          <View style={styles.conversationsSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
                Sohbetler
              </Text>
              <TouchableOpacity style={styles.filterButton}>
                <Feather name="filter" size={16} color={isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'} />
                <Text style={[styles.filterText, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }]}>
                  Filtrele
                </Text>
              </TouchableOpacity>
            </View>

            {filteredConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                onPress={() => router.push(`/chat/${conversation.id}`)}
              />
            ))}

            {filteredConversations.length === 0 && (
              <View style={styles.emptyState}>
                <Feather name="message-circle" size={48} color={isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} />
                <Text style={[styles.emptyText, { color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }]}>
                  Sonuç bulunamadı
                </Text>
              </View>
            )}
          </View>

          {/* Quick Connect Section */}
          <View style={styles.quickConnectSection}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }]}>
              Hızlı Bağlan
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickConnectScroll}>
              {[
                { icon: 'phone', label: 'Acil Destek', color: '#EF4444' },
                { icon: 'users', label: 'Grup Bul', color: '#6366F1' },
                { icon: 'calendar', label: 'Randevu', color: '#10B981' },
                { icon: 'headphones', label: 'Meditasyon', color: '#F59E0B' },
              ].map((item, index) => (
                <TouchableOpacity key={index} style={styles.quickConnectItem} activeOpacity={0.8}>
                  <View style={[styles.quickConnectIcon, { backgroundColor: item.color + '20' }]}>
                    <Feather name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <Text style={[styles.quickConnectLabel, { color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Animated.ScrollView>

        {/* Floating Compose Button */}
        <FloatingComposeButton onPress={() => router.push('/new-message')} />
      </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Search
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Stories
  storiesContainer: {
    marginBottom: 20,
  },
  storiesContent: {
    paddingHorizontal: 24,
    gap: 16,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  storyWrapper: {
    position: 'relative',
  },
  storyRing: {
    padding: 3,
    borderRadius: 32,
  },
  storyCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addStoryCircle: {
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  storyInitials: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  storyNewDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#6366F1',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  storyName: {
    fontSize: 11,
    marginTop: 6,
  },

  sectionContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },

  // Ora Banner
  oraBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.2)',
  },
  oraAvatar: {
    marginRight: 14,
  },
  oraAvatarInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  oraContent: {
    flex: 1,
  },
  oraTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  oraSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  oraStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  oraOnlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  oraStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Wellness Prompt
  wellnessPrompt: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Shadows.md,
  },
  wellnessContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  wellnessIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wellnessText: {
    flex: 1,
  },
  wellnessTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  wellnessSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },

  // Conversations
  conversationsSection: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatarRing: {
    padding: 2,
    borderRadius: 26,
  },
  avatarInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  conversationName: {
    fontSize: 15,
    fontWeight: '700',
  },
  moodIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  conversationTime: {
    fontSize: 11,
    fontWeight: '600',
  },
  conversationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 13,
    flex: 1,
    marginRight: 10,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 20,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  unreadBadge: {
    overflow: 'hidden',
    borderRadius: 10,
  },
  unreadBadgeGradient: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  aiSuggestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.03)',
    gap: 6,
  },
  aiSuggestionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F59E0B',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },

  // Quick Connect
  quickConnectSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  quickConnectScroll: {
    marginTop: 16,
  },
  quickConnectItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  quickConnectIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickConnectLabel: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Floating Button
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    ...Shadows.lg,
  },
  floatingButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
