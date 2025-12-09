// app/(tabs)/chat.tsx - ORA THERAPEUTIC MESSAGING
// "Güvenli alanınız, her zaman yanınızda"
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { useThemeStore } from '../../shared/store/themeStore';
import { ChatLoader } from '../../shared/components/SkeletonLoader';

const { width } = Dimensions.get('window');

// Ora AI Logo
const OraAILogo = ({ size = 48 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 120 120">
    <Defs>
      <RadialGradient id="aiGlow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#A18AFF" stopOpacity="0.8" />
        <Stop offset="100%" stopColor="#7C5CE0" stopOpacity="0.2" />
      </RadialGradient>
    </Defs>
    <Circle cx="60" cy="60" r="50" fill="url(#aiGlow)" />
    <Circle cx="60" cy="60" r="35" fill="none" stroke="#7C5CE0" strokeWidth="4" />
    <Circle cx="60" cy="60" r="6" fill="#7C5CE0" />
    <Circle cx="60" cy="60" r="4" fill="#A18AFF" />
  </Svg>
);

// Conversation Types
const THERAPIST_CONVERSATIONS = [
  {
    id: '1',
    name: 'Dr. Elif Yılmaz',
    initials: 'EY',
    specialty: 'Bilişsel Davranışçı Terapi',
    lastMessage: 'Bir sonraki seansımızda bu konuyu derinlemesine ele alalım.',
    time: '10:30',
    unread: 2,
    online: true,
    color: '#7C5CE0',
    nextSession: 'Yarın 14:00',
    verified: true,
  },
  {
    id: '2',
    name: 'Dr. Mehmet Kaya',
    initials: 'MK',
    specialty: 'Şema Terapisi',
    lastMessage: 'Bu hafta oldukça verimli bir ilerleme kaydettik.',
    time: 'Dün',
    unread: 0,
    online: false,
    color: '#20B2AA',
    nextSession: null,
    verified: true,
  },
];

const SUPPORT_GROUPS = [
  {
    id: '1',
    name: 'Mindfulness Çemberi',
    icon: '🧘',
    members: 24,
    lastMessage: 'Bugünkü meditasyon seansı harikaydı!',
    time: '15 dk',
    unread: 5,
    color: '#7C5CE0',
  },
  {
    id: '2',
    name: 'Anksiyete Destek',
    icon: '💙',
    members: 18,
    lastMessage: 'Nefes egzersizleri gerçekten işe yarıyor.',
    time: '1 sa',
    unread: 0,
    color: '#6BB5FF',
  },
];

// Animated Conversation Card
const ConversationCard: React.FC<{
  conversation: typeof THERAPIST_CONVERSATIONS[0];
  colors: typeof Colors.light;
  onPress: () => void;
  index: number;
}> = ({ conversation, colors, onPress, index }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 80),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }, { translateX }],
        opacity: scaleAnim,
      }}
    >
      <TouchableOpacity
        style={[styles.conversationCard, { backgroundColor: colors.surface }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: conversation.color }]}>
            <Text style={styles.avatarText}>{conversation.initials}</Text>
          </View>
          {conversation.online && (
            <View style={[styles.onlineIndicator, { borderColor: colors.surface }]}>
              <View style={styles.onlineDot} />
            </View>
          )}
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <View style={styles.nameRow}>
              <Text style={[styles.conversationName, { color: colors.textPrimary }]} numberOfLines={1}>
                {conversation.name}
              </Text>
              {conversation.verified && (
                <View style={[styles.verifiedBadge, { backgroundColor: colors.secondary }]}>
                  <Feather name="check" size={10} color="#FFFFFF" />
                </View>
              )}
            </View>
            <Text style={[styles.conversationTime, { color: colors.textTertiary }]}>{conversation.time}</Text>
          </View>

          <Text style={[styles.specialty, { color: colors.textSecondary }]}>{conversation.specialty}</Text>

          <View style={styles.messageRow}>
            <Text style={[styles.lastMessage, { color: colors.textSecondary }]} numberOfLines={1}>
              {conversation.lastMessage}
            </Text>
            {conversation.unread > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.unreadText}>{conversation.unread}</Text>
              </View>
            )}
          </View>

          {conversation.nextSession && (
            <View style={[styles.sessionBadge, { backgroundColor: colors.cardPrimary }]}>
              <Feather name="calendar" size={12} color={colors.primary} />
              <Text style={[styles.sessionText, { color: colors.primary }]}>
                Sonraki seans: {conversation.nextSession}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Support Group Card
const GroupCard: React.FC<{
  group: typeof SUPPORT_GROUPS[0];
  colors: typeof Colors.light;
  onPress: () => void;
}> = ({ group, colors, onPress }) => (
  <TouchableOpacity
    style={[styles.groupCard, { backgroundColor: colors.surface }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.groupIcon, { backgroundColor: group.color + '20' }]}>
      <Text style={styles.groupEmoji}>{group.icon}</Text>
    </View>
    <View style={styles.groupContent}>
      <Text style={[styles.groupName, { color: colors.textPrimary }]} numberOfLines={1}>
        {group.name}
      </Text>
      <Text style={[styles.groupMembers, { color: colors.textTertiary }]}>
        {group.members} üye aktif
      </Text>
    </View>
    {group.unread > 0 && (
      <View style={[styles.groupUnread, { backgroundColor: colors.accent }]}>
        <Text style={styles.groupUnreadText}>{group.unread}</Text>
      </View>
    )}
  </TouchableOpacity>
);

export default function Chat() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'therapists' | 'groups'>('therapists');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 800);
  }, []);

  useEffect(() => {
    Animated.spring(tabIndicatorPosition, {
      toValue: activeTab === 'therapists' ? 0 : 1,
      friction: 8,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  const indicatorTranslate = tabIndicatorPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (width - Spacing.xl * 2) / 2],
  });

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <ChatLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Mesajlar</Text>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.surfaceAlt }]}
          onPress={() => router.push('/new-message')}
        >
          <Feather name="edit" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ora AI Assistant Card */}
        <TouchableOpacity
          style={styles.aiCard}
          onPress={() => router.push('/ora-chat')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#7C5CE0', '#A18AFF']}
            style={styles.aiCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.aiCardContent}>
              <View style={styles.aiLogoContainer}>
                <OraAILogo size={56} />
                <View style={styles.aiPulse} />
              </View>
              <View style={styles.aiInfo}>
                <Text style={styles.aiTitle}>Ora AI Asistan</Text>
                <Text style={styles.aiSubtitle}>7/24 yanınızda, her an destek</Text>
                <View style={styles.aiFeatures}>
                  <View style={styles.aiFeature}>
                    <Feather name="mic" size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.aiFeatureText}>Sesli</Text>
                  </View>
                  <View style={styles.aiFeature}>
                    <Feather name="shield" size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.aiFeatureText}>Gizli</Text>
                  </View>
                  <View style={styles.aiFeature}>
                    <Feather name="zap" size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.aiFeatureText}>Anlık</Text>
                  </View>
                </View>
              </View>
            </View>
            <Feather name="chevron-right" size={24} color="rgba(255,255,255,0.6)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
            <Feather name="search" size={18} color={colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Mesajlarda ara..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Feather name="x" size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSection}>
          <View style={[styles.tabContainer, { backgroundColor: colors.surfaceAlt }]}>
            <Animated.View
              style={[
                styles.tabIndicator,
                { backgroundColor: colors.surface, transform: [{ translateX: indicatorTranslate }] },
              ]}
            />
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab('therapists')}
            >
              <Feather
                name="user"
                size={16}
                color={activeTab === 'therapists' ? colors.primary : colors.textTertiary}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'therapists' ? colors.primary : colors.textTertiary },
                ]}
              >
                Terapistler
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab('groups')}
            >
              <Feather
                name="users"
                size={16}
                color={activeTab === 'groups' ? colors.primary : colors.textTertiary}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'groups' ? colors.primary : colors.textTertiary },
                ]}
              >
                Destek Grupları
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content based on active tab */}
        {activeTab === 'therapists' ? (
          <View style={styles.section}>
            {THERAPIST_CONVERSATIONS.map((conversation, index) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                colors={colors}
                index={index}
                onPress={() => router.push(`/chat/${conversation.id}`)}
              />
            ))}

            {/* Find Therapist CTA */}
            <TouchableOpacity
              style={[styles.findTherapistCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/(tabs)/search')}
            >
              <LinearGradient
                colors={[colors.cardSecondary, colors.cardSecondary]}
                style={styles.findTherapistIcon}
              >
                <Feather name="plus" size={24} color={colors.secondary} />
              </LinearGradient>
              <View style={styles.findTherapistContent}>
                <Text style={[styles.findTherapistTitle, { color: colors.textPrimary }]}>
                  Yeni Terapist Bul
                </Text>
                <Text style={[styles.findTherapistSubtitle, { color: colors.textSecondary }]}>
                  Alanında uzman terapistlerle tanışın
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            {SUPPORT_GROUPS.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                colors={colors}
                onPress={() => router.push(`/group/${group.id}`)}
              />
            ))}

            {/* Browse Groups CTA */}
            <TouchableOpacity
              style={[styles.browseGroupsCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/groups')}
            >
              <View style={styles.browseGroupsContent}>
                <Text style={[styles.browseGroupsTitle, { color: colors.textPrimary }]}>
                  Daha Fazla Grup Keşfet
                </Text>
                <Text style={[styles.browseGroupsSubtitle, { color: colors.textSecondary }]}>
                  İlgi alanlarınıza uygun topluluklar bulun
                </Text>
              </View>
              <View style={styles.browseGroupsAvatars}>
                {['🧘', '💪', '🌙'].map((emoji, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.browseAvatar,
                      { backgroundColor: colors.cardPrimary, marginLeft: idx > 0 ? -10 : 0 },
                    ]}
                  >
                    <Text style={styles.browseEmoji}>{emoji}</Text>
                  </View>
                ))}
                <View style={[styles.browseMore, { backgroundColor: colors.primary }]}>
                  <Text style={styles.browseMoreText}>+12</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Tips */}
        <View style={styles.tipsSection}>
          <Text style={[styles.tipsTitle, { color: colors.textPrimary }]}>Güvenli İletişim</Text>
          <View style={[styles.tipCard, { backgroundColor: colors.cardPrimary }]}>
            <Feather name="lock" size={18} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              Tüm mesajlarınız uçtan uca şifrelenir ve gizli tutulur.
            </Text>
          </View>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 120 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
  },
  aiCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    ...Shadows.md,
  },
  aiCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  aiCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiLogoContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  aiPulse: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  aiInfo: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  aiSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.sm,
  },
  aiFeatures: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  aiFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiFeatureText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  searchSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    ...Shadows.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  tabSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: BorderRadius.xl,
    padding: 4,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: '50%',
    height: '100%',
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
    zIndex: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: Spacing.xl,
  },
  conversationCard: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  avatarSection: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    backgroundColor: '#34D399',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationTime: {
    fontSize: 12,
  },
  specialty: {
    fontSize: 12,
    marginBottom: 6,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: Spacing.sm,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.sm,
    gap: 4,
  },
  sessionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  findTherapistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.sm,
    ...Shadows.sm,
  },
  findTherapistIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  findTherapistContent: {
    flex: 1,
  },
  findTherapistTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  findTherapistSubtitle: {
    fontSize: 13,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  groupEmoji: {
    fontSize: 24,
  },
  groupContent: {
    flex: 1,
  },
  groupName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  groupMembers: {
    fontSize: 12,
  },
  groupUnread: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  groupUnreadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  browseGroupsCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.sm,
    ...Shadows.sm,
  },
  browseGroupsContent: {
    marginBottom: Spacing.md,
  },
  browseGroupsTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  browseGroupsSubtitle: {
    fontSize: 13,
  },
  browseGroupsAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  browseAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  browseEmoji: {
    fontSize: 18,
  },
  browseMore: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  browseMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tipsSection: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.md,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
