// shared/components/SocialCircles.tsx - Anonymous Healing Circles & Community Support
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, RadialGradient, Stop, Path } from 'react-native-svg';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../theme';

const { width, height } = Dimensions.get('window');

// ============================================
// TYPES & INTERFACES
// ============================================
export interface CircleMember {
  id: string;
  anonymousName: string;
  avatar: string; // Emoji or icon
  mood: 'calm' | 'struggling' | 'hopeful' | 'grateful' | 'anxious';
  isOnline: boolean;
  joinedAt: Date;
}

export interface HealingCircle {
  id: string;
  name: string;
  description: string;
  theme: 'anxiety' | 'grief' | 'stress' | 'growth' | 'mindfulness' | 'sleep' | 'relationships';
  memberCount: number;
  maxMembers: number;
  isLive: boolean;
  nextSession?: Date;
  mood: string;
  color: string;
}

export interface SupportMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: Date;
  reactions: { emoji: string; count: number }[];
  isAnonymous: boolean;
}

// ============================================
// CIRCLE THEME CONFIGS
// ============================================
const circleThemes = {
  anxiety: {
    color: '#8B7CF6',
    gradient: ['#8B7CF6', '#6366F1'],
    icon: '🌊',
    name: 'Sakin Liman'
  },
  grief: {
    color: '#F472B6',
    gradient: ['#F472B6', '#EC4899'],
    icon: '🕊️',
    name: 'Şifa Bahçesi'
  },
  stress: {
    color: '#34D399',
    gradient: ['#34D399', '#10B981'],
    icon: '🌿',
    name: 'Huzur Ormanı'
  },
  growth: {
    color: '#FBBF24',
    gradient: ['#FBBF24', '#F59E0B'],
    icon: '🌱',
    name: 'Büyüme Yolculuğu'
  },
  mindfulness: {
    color: '#60A5FA',
    gradient: ['#60A5FA', '#3B82F6'],
    icon: '🧘',
    name: 'Farkındalık Çemberi'
  },
  sleep: {
    color: '#A78BFA',
    gradient: ['#A78BFA', '#7C3AED'],
    icon: '🌙',
    name: 'Gece Sığınağı'
  },
  relationships: {
    color: '#FB7185',
    gradient: ['#FB7185', '#F43F5E'],
    icon: '💝',
    name: 'Bağ Kurma'
  },
};

// Anonymous name generator
const anonymousNames = [
  'Nazik Ruh', 'Umut Işığı', 'Sakin Deniz', 'Güçlü Kalp', 'Parlak Yıldız',
  'Sıcak Güneş', 'Hafif Rüzgar', 'Derin Nehir', 'Cesur Dağ', 'Sevgi Dolu',
  'Dingin Göl', 'Yeşil Yaprak', 'Mavi Kuş', 'Altın Işık', 'Gümüş Ay'
];

// ============================================
// ANIMATED CIRCLE ORB
// ============================================
interface CircleOrbProps {
  theme: HealingCircle['theme'];
  memberCount: number;
  isLive: boolean;
  size?: number;
  onPress?: () => void;
}

export const CircleOrb: React.FC<CircleOrbProps> = ({
  theme,
  memberCount,
  isLive,
  size = 120,
  onPress,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const config = circleThemes[theme];

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation for live circles
    if (isLive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // Slow rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, [isLive]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Generate member dots around the circle
  const memberDots = Array.from({ length: Math.min(memberCount, 8) }).map((_, i) => {
    const angle = (i / Math.min(memberCount, 8)) * 2 * Math.PI - Math.PI / 2;
    const x = Math.cos(angle) * (size / 2 - 10);
    const y = Math.sin(angle) * (size / 2 - 10);
    return { x, y, key: i };
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.circleOrbContainer,
          {
            width: size,
            height: size,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.circleGlow,
            {
              width: size * 1.3,
              height: size * 1.3,
              borderRadius: size * 0.65,
              backgroundColor: config.color,
              opacity: glowAnim,
            },
          ]}
        />

        {/* Main orb */}
        <LinearGradient
          colors={config.gradient}
          style={[
            styles.circleOrb,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <BlurView intensity={20} style={styles.circleOrbInner}>
            {/* Center icon */}
            <Text style={[styles.circleIcon, { fontSize: size * 0.35 }]}>
              {config.icon}
            </Text>

            {/* Live indicator */}
            {isLive && (
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>CANLI</Text>
              </View>
            )}
          </BlurView>
        </LinearGradient>

        {/* Rotating member dots */}
        <Animated.View
          style={[
            styles.memberDotsContainer,
            {
              width: size,
              height: size,
              transform: [{ rotate: rotation }],
            },
          ]}
        >
          {memberDots.map((dot) => (
            <View
              key={dot.key}
              style={[
                styles.memberDot,
                {
                  left: size / 2 + dot.x - 6,
                  top: size / 2 + dot.y - 6,
                  backgroundColor: config.color,
                },
              ]}
            />
          ))}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ============================================
// HEALING CIRCLE CARD
// ============================================
interface CircleCardProps {
  circle: HealingCircle;
  onJoin: (circleId: string) => void;
  style?: ViewStyle;
}

export const CircleCard: React.FC<CircleCardProps> = ({
  circle,
  onJoin,
  style,
}) => {
  const config = circleThemes[circle.theme];
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onJoin(circle.id)}
        activeOpacity={1}
      >
        <BlurView intensity={40} tint="light" style={styles.circleCard}>
          <LinearGradient
            colors={[`${config.color}20`, `${config.color}05`]}
            style={styles.circleCardGradient}
          >
            <View style={styles.circleCardHeader}>
              <View style={styles.circleCardIcon}>
                <Text style={styles.circleCardEmoji}>{config.icon}</Text>
              </View>
              <View style={styles.circleCardInfo}>
                <Text style={styles.circleCardName}>{circle.name}</Text>
                <Text style={styles.circleCardTheme}>{config.name}</Text>
              </View>
              {circle.isLive && (
                <View style={[styles.liveBadge, { backgroundColor: config.color }]}>
                  <View style={styles.liveBadgeDot} />
                  <Text style={styles.liveBadgeText}>Canlı</Text>
                </View>
              )}
            </View>

            <Text style={styles.circleCardDesc} numberOfLines={2}>
              {circle.description}
            </Text>

            <View style={styles.circleCardFooter}>
              <View style={styles.memberInfo}>
                <View style={styles.memberAvatars}>
                  {[...Array(Math.min(3, circle.memberCount))].map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.miniAvatar,
                        { marginLeft: i > 0 ? -8 : 0, backgroundColor: config.gradient[0] },
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.memberCountText}>
                  {circle.memberCount}/{circle.maxMembers} kişi
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.joinButton, { backgroundColor: config.color }]}
                onPress={() => onJoin(circle.id)}
              >
                <Text style={styles.joinButtonText}>Katıl</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================
// ANONYMOUS AVATAR
// ============================================
interface AnonymousAvatarProps {
  avatar: string;
  mood: CircleMember['mood'];
  isOnline?: boolean;
  size?: number;
}

const moodColors = {
  calm: '#60A5FA',
  struggling: '#F472B6',
  hopeful: '#34D399',
  grateful: '#FBBF24',
  anxious: '#A78BFA',
};

export const AnonymousAvatar: React.FC<AnonymousAvatarProps> = ({
  avatar,
  mood,
  isOnline = false,
  size = 48,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isOnline) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isOnline]);

  return (
    <View style={[styles.avatarContainer, { width: size, height: size }]}>
      <LinearGradient
        colors={[moodColors[mood], `${moodColors[mood]}80`]}
        style={[
          styles.avatarGradient,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Text style={[styles.avatarEmoji, { fontSize: size * 0.5 }]}>{avatar}</Text>
      </LinearGradient>
      {isOnline && (
        <Animated.View
          style={[
            styles.onlineIndicator,
            {
              transform: [{ scale: pulseAnim }],
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}
    </View>
  );
};

// ============================================
// SUPPORT MESSAGE BUBBLE
// ============================================
interface MessageBubbleProps {
  message: SupportMessage;
  onReact: (messageId: string, emoji: string) => void;
  isOwn?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onReact,
  isOwn = false,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const supportReactions = ['💜', '🤗', '💪', '🙏', '✨'];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Animated.View
      style={[
        styles.messageBubbleContainer,
        isOwn && styles.messageBubbleOwn,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      {!isOwn && (
        <View style={styles.messageAuthorRow}>
          <Text style={styles.messageAvatar}>{message.authorAvatar}</Text>
          <Text style={styles.messageAuthor}>{message.authorName}</Text>
        </View>
      )}

      <BlurView
        intensity={30}
        tint="light"
        style={[
          styles.messageBubble,
          isOwn && styles.messageBubbleOwnStyle,
        ]}
      >
        <Text style={styles.messageContent}>{message.content}</Text>
        <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
      </BlurView>

      {message.reactions.length > 0 && (
        <View style={styles.reactionsContainer}>
          {message.reactions.map((reaction, index) => (
            <TouchableOpacity
              key={index}
              style={styles.reactionBubble}
              onPress={() => onReact(message.id, reaction.emoji)}
            >
              <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
              <Text style={styles.reactionCount}>{reaction.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.addReactionButton}
        onPress={() => setShowReactions(!showReactions)}
      >
        <Text style={styles.addReactionText}>+</Text>
      </TouchableOpacity>

      {showReactions && (
        <View style={styles.reactionPicker}>
          {supportReactions.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              style={styles.reactionOption}
              onPress={() => {
                onReact(message.id, emoji);
                setShowReactions(false);
              }}
            >
              <Text style={styles.reactionOptionEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Animated.View>
  );
};

// ============================================
// CIRCLE CHAT ROOM
// ============================================
interface CircleChatRoomProps {
  circle: HealingCircle;
  messages: SupportMessage[];
  members: CircleMember[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  onLeave: () => void;
}

export const CircleChatRoom: React.FC<CircleChatRoomProps> = ({
  circle,
  messages,
  members,
  currentUserId,
  onSendMessage,
  onReact,
  onLeave,
}) => {
  const [inputText, setInputText] = useState('');
  const config = circleThemes[circle.theme];
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <View style={styles.chatRoom}>
      {/* Header */}
      <LinearGradient
        colors={config.gradient}
        style={styles.chatHeader}
      >
        <BlurView intensity={30} style={styles.chatHeaderBlur}>
          <View style={styles.chatHeaderContent}>
            <TouchableOpacity onPress={onLeave} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatHeaderIcon}>{config.icon}</Text>
              <View>
                <Text style={styles.chatHeaderTitle}>{circle.name}</Text>
                <Text style={styles.chatHeaderMembers}>
                  {members.filter(m => m.isOnline).length} çevrimiçi
                </Text>
              </View>
            </View>

            {circle.isLive && (
              <View style={styles.chatLiveBadge}>
                <View style={styles.liveBadgeDot} />
                <Text style={styles.chatLiveText}>CANLI</Text>
              </View>
            )}
          </View>
        </BlurView>
      </LinearGradient>

      {/* Online members strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.membersStrip}
        contentContainerStyle={styles.membersStripContent}
      >
        {members.filter(m => m.isOnline).map((member) => (
          <View key={member.id} style={styles.memberStripItem}>
            <AnonymousAvatar
              avatar={member.avatar}
              mood={member.mood}
              isOnline={true}
              size={40}
            />
            <Text style={styles.memberStripName} numberOfLines={1}>
              {member.anonymousName.split(' ')[0]}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd()}
      >
        {/* Welcome message */}
        <View style={styles.welcomeMessage}>
          <LinearGradient
            colors={[`${config.color}30`, `${config.color}10`]}
            style={styles.welcomeGradient}
          >
            <Text style={styles.welcomeIcon}>{config.icon}</Text>
            <Text style={styles.welcomeTitle}>Hoş Geldin!</Text>
            <Text style={styles.welcomeText}>
              Bu güvenli alanda hepimiz birbirimizi desteklemek için buradayız.
              Paylaşımların tamamen anonim kalacak. 💜
            </Text>
          </LinearGradient>
        </View>

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onReact={onReact}
            isOwn={message.authorId === currentUserId}
          />
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.chatInputContainer}>
        <BlurView intensity={50} tint="light" style={styles.chatInputBlur}>
          <View style={styles.chatInputRow}>
            <TextInput
              style={styles.chatInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Düşüncelerini paylaş..."
              placeholderTextColor={Colors.light.textSecondary}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: inputText.trim() ? config.color : Colors.light.border },
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Text style={styles.sendButtonText}>→</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </View>
  );
};

// ============================================
// CIRCLE DISCOVERY
// ============================================
interface CircleDiscoveryProps {
  circles: HealingCircle[];
  onJoinCircle: (circleId: string) => void;
}

export const CircleDiscovery: React.FC<CircleDiscoveryProps> = ({
  circles,
  onJoinCircle,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<HealingCircle['theme'] | 'all'>('all');

  const themes: (HealingCircle['theme'] | 'all')[] = [
    'all', 'anxiety', 'stress', 'mindfulness', 'growth', 'grief', 'sleep', 'relationships'
  ];

  const filteredCircles = selectedTheme === 'all'
    ? circles
    : circles.filter(c => c.theme === selectedTheme);

  const liveCircles = filteredCircles.filter(c => c.isLive);
  const upcomingCircles = filteredCircles.filter(c => !c.isLive);

  return (
    <ScrollView style={styles.discovery} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.discoveryHeader}>
        <Text style={styles.discoveryTitle}>Şifa Çemberleri</Text>
        <Text style={styles.discoverySubtitle}>
          Anonim destek gruplarında güvenle paylaş
        </Text>
      </View>

      {/* Theme filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.themeFilters}
        contentContainerStyle={styles.themeFiltersContent}
      >
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme;
          const config = theme === 'all' ? null : circleThemes[theme];

          return (
            <TouchableOpacity
              key={theme}
              style={[
                styles.themeFilter,
                isSelected && styles.themeFilterSelected,
                isSelected && config && { backgroundColor: config.color },
              ]}
              onPress={() => setSelectedTheme(theme)}
            >
              <Text style={styles.themeFilterIcon}>
                {theme === 'all' ? '🌈' : config?.icon}
              </Text>
              <Text style={[
                styles.themeFilterText,
                isSelected && styles.themeFilterTextSelected,
              ]}>
                {theme === 'all' ? 'Tümü' : config?.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Live circles */}
      {liveCircles.length > 0 && (
        <View style={styles.circleSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLiveIndicator}>
              <View style={styles.sectionLiveDot} />
              <Text style={styles.sectionTitle}>Şimdi Canlı</Text>
            </View>
            <Text style={styles.sectionCount}>{liveCircles.length} çember</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.liveCirclesScroll}
          >
            {liveCircles.map((circle) => (
              <View key={circle.id} style={styles.liveCircleItem}>
                <CircleOrb
                  theme={circle.theme}
                  memberCount={circle.memberCount}
                  isLive={true}
                  size={100}
                  onPress={() => onJoinCircle(circle.id)}
                />
                <Text style={styles.liveCircleName}>{circle.name}</Text>
                <Text style={styles.liveCircleMembers}>
                  {circle.memberCount} kişi
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* All circles */}
      <View style={styles.circleSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tüm Çemberler</Text>
          <Text style={styles.sectionCount}>{upcomingCircles.length} çember</Text>
        </View>

        {upcomingCircles.map((circle) => (
          <CircleCard
            key={circle.id}
            circle={circle}
            onJoin={onJoinCircle}
            style={styles.circleCardItem}
          />
        ))}
      </View>

      {/* Create circle prompt */}
      <TouchableOpacity style={styles.createCirclePrompt}>
        <LinearGradient
          colors={['#8B7CF620', '#6366F110']}
          style={styles.createCircleGradient}
        >
          <Text style={styles.createCircleIcon}>✨</Text>
          <View style={styles.createCircleInfo}>
            <Text style={styles.createCircleTitle}>Kendi Çemberini Oluştur</Text>
            <Text style={styles.createCircleDesc}>
              Benzer deneyimleri paylaşan insanları bir araya getir
            </Text>
          </View>
          <Text style={styles.createCircleArrow}>→</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

// ============================================
// MOOD CHECK-IN FOR CIRCLE
// ============================================
interface CircleMoodCheckInProps {
  onComplete: (mood: CircleMember['mood'], message: string) => void;
}

export const CircleMoodCheckIn: React.FC<CircleMoodCheckInProps> = ({
  onComplete,
}) => {
  const [selectedMood, setSelectedMood] = useState<CircleMember['mood'] | null>(null);
  const [message, setMessage] = useState('');
  const scaleAnims = useRef(
    ['calm', 'struggling', 'hopeful', 'grateful', 'anxious'].map(() => new Animated.Value(1))
  ).current;

  const moods: { key: CircleMember['mood']; emoji: string; label: string }[] = [
    { key: 'calm', emoji: '😌', label: 'Sakin' },
    { key: 'struggling', emoji: '😔', label: 'Zorlanıyorum' },
    { key: 'hopeful', emoji: '🌟', label: 'Umutlu' },
    { key: 'grateful', emoji: '🙏', label: 'Minnettar' },
    { key: 'anxious', emoji: '😰', label: 'Kaygılı' },
  ];

  const handleSelect = (index: number, mood: CircleMember['mood']) => {
    setSelectedMood(mood);
    Animated.sequence([
      Animated.spring(scaleAnims[index], {
        toValue: 1.2,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1.1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Reset others
    scaleAnims.forEach((anim, i) => {
      if (i !== index) {
        Animated.spring(anim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }).start();
      }
    });
  };

  return (
    <View style={styles.moodCheckIn}>
      <Text style={styles.moodCheckInTitle}>Bugün Nasıl Hissediyorsun?</Text>
      <Text style={styles.moodCheckInSubtitle}>
        Çembere katılmadan önce ruh halini paylaş
      </Text>

      <View style={styles.moodOptions}>
        {moods.map((mood, index) => (
          <Animated.View
            key={mood.key}
            style={{ transform: [{ scale: scaleAnims[index] }] }}
          >
            <TouchableOpacity
              style={[
                styles.moodOption,
                selectedMood === mood.key && styles.moodOptionSelected,
                selectedMood === mood.key && { borderColor: moodColors[mood.key] },
              ]}
              onPress={() => handleSelect(index, mood.key)}
            >
              <Text style={styles.moodOptionEmoji}>{mood.emoji}</Text>
              <Text style={[
                styles.moodOptionLabel,
                selectedMood === mood.key && { color: moodColors[mood.key] },
              ]}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {selectedMood && (
        <Animated.View style={styles.moodMessageContainer}>
          <TextInput
            style={styles.moodMessageInput}
            placeholder="Paylaşmak istediğin bir şey var mı? (opsiyonel)"
            placeholderTextColor={Colors.light.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={200}
          />

          <TouchableOpacity
            style={[styles.moodContinueButton, { backgroundColor: moodColors[selectedMood] }]}
            onPress={() => onComplete(selectedMood, message)}
          >
            <Text style={styles.moodContinueText}>Çembere Katıl</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  // Circle Orb
  circleOrbContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleGlow: {
    position: 'absolute',
  },
  circleOrb: {
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  circleOrbInner: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    overflow: 'hidden',
  },
  circleIcon: {
    textAlign: 'center',
  },
  liveIndicator: {
    position: 'absolute',
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 4,
  },
  liveText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  memberDotsContainer: {
    position: 'absolute',
  },
  memberDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Circle Card
  circleCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  circleCardGradient: {
    padding: Spacing.lg,
  },
  circleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  circleCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCardEmoji: {
    fontSize: 24,
  },
  circleCardInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  circleCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  circleCardTheme: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 4,
  },
  liveBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  circleCardDesc: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  circleCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatars: {
    flexDirection: 'row',
    marginRight: Spacing.sm,
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  memberCountText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  joinButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Anonymous Avatar
  avatarContainer: {
    position: 'relative',
  },
  avatarGradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    textAlign: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Message Bubble
  messageBubbleContainer: {
    marginVertical: Spacing.xs,
    maxWidth: '80%',
  },
  messageBubbleOwn: {
    alignSelf: 'flex-end',
  },
  messageAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageAvatar: {
    fontSize: 16,
    marginRight: 6,
  },
  messageAuthor: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  messageBubble: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  messageBubbleOwnStyle: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: 4,
    backgroundColor: 'rgba(139, 124, 246, 0.2)',
  },
  messageContent: {
    fontSize: 15,
    color: Colors.light.textPrimary,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 4,
  },
  reactionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  reactionEmoji: {
    fontSize: 12,
  },
  reactionCount: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginLeft: 2,
  },
  addReactionButton: {
    position: 'absolute',
    right: -20,
    bottom: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  addReactionText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  reactionPicker: {
    flexDirection: 'row',
    position: 'absolute',
    right: -20,
    bottom: 30,
    backgroundColor: Colors.light.surface,
    padding: 6,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  reactionOption: {
    padding: 4,
  },
  reactionOptionEmoji: {
    fontSize: 18,
  },

  // Chat Room
  chatRoom: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  chatHeader: {
    paddingTop: 50,
  },
  chatHeaderBlur: {
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  chatHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  chatHeaderIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  chatHeaderTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chatHeaderMembers: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  chatLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chatLiveText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  membersStrip: {
    maxHeight: 80,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  membersStripContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  memberStripItem: {
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  memberStripName: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 4,
    maxWidth: 50,
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.lg,
  },
  welcomeMessage: {
    marginBottom: Spacing.lg,
  },
  welcomeGradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  welcomeIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  chatInputContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  chatInputBlur: {
    padding: Spacing.md,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  chatInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 15,
    color: Colors.light.textPrimary,
    marginRight: Spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '300',
  },

  // Discovery
  discovery: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  discoveryHeader: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
  },
  discoveryTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },
  discoverySubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  themeFilters: {
    maxHeight: 50,
    marginBottom: Spacing.lg,
  },
  themeFiltersContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  themeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.surface,
    marginRight: Spacing.sm,
  },
  themeFilterSelected: {
    backgroundColor: Colors.light.primary,
  },
  themeFilterIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  themeFilterText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  themeFilterTextSelected: {
    color: '#FFFFFF',
  },
  circleSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionLiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  sectionCount: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  liveCirclesScroll: {
    paddingVertical: Spacing.md,
    gap: Spacing.lg,
  },
  liveCircleItem: {
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  liveCircleName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginTop: Spacing.sm,
  },
  liveCircleMembers: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  circleCardItem: {
    marginBottom: Spacing.md,
  },
  createCirclePrompt: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  createCircleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  createCircleIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  createCircleInfo: {
    flex: 1,
  },
  createCircleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  createCircleDesc: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  createCircleArrow: {
    fontSize: 20,
    color: Colors.light.textSecondary,
  },

  // Mood Check-in
  moodCheckIn: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  moodCheckInTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  moodCheckInSubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  moodOption: {
    width: 80,
    height: 90,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodOptionSelected: {
    backgroundColor: 'rgba(139, 124, 246, 0.1)',
  },
  moodOptionEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  moodOptionLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  moodMessageContainer: {
    width: '100%',
    marginTop: Spacing.xl,
  },
  moodMessageInput: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: 15,
    color: Colors.light.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: Spacing.md,
  },
  moodContinueButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  moodContinueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default {
  CircleOrb,
  CircleCard,
  AnonymousAvatar,
  MessageBubble,
  CircleChatRoom,
  CircleDiscovery,
  CircleMoodCheckIn,
};
