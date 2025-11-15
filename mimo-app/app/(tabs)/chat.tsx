// app/(tabs)/chat.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOCK_CONVERSATIONS = [
  {
    id: '1',
    therapistName: 'Dr. Elif Yılmaz',
    therapistAvatar: '👩‍⚕️',
    lastMessage: 'Seansımız öncesi hatırlatıcı: Lütfen duygu günlüğünüzü tamamlayın.',
    timestamp: '10:30',
    unreadCount: 2,
    online: true,
  },
  {
    id: '2',
    therapistName: 'Dr. Mehmet Kaya',
    therapistAvatar: '👨‍⚕️',
    lastMessage: 'Bu hafta oldukça verimli bir seans yaptık. Teşekkürler!',
    timestamp: 'Dün',
    unreadCount: 0,
    online: false,
  },
  {
    id: '3',
    therapistName: 'Ayşe Demir',
    therapistAvatar: '👩‍💼',
    lastMessage: 'Önerdiğim egzersizleri deneme fırsatınız oldu mu?',
    timestamp: '2 gün önce',
    unreadCount: 1,
    online: false,
  },
];

export default function Chat() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = MOCK_CONVERSATIONS.filter(conv =>
    conv.therapistName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mesajlar</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Feather name="edit" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color={Colors.light.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.textLight}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color={Colors.light.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.conversationCard}
            onPress={() => {
              // TODO: Navigate to chat detail
              console.log('Open chat with', item.therapistName);
            }}
          >
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>{item.therapistAvatar}</Text>
              {item.online && <View style={styles.onlineBadge} />}
            </View>

            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <Text style={styles.therapistName}>{item.therapistName}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
              <View style={styles.conversationBody}>
                <Text
                  style={[
                    styles.lastMessage,
                    item.unreadCount > 0 && styles.lastMessageUnread,
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>
                {item.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="message-circle" size={64} color={Colors.light.textLight} />
            <Text style={styles.emptyStateTitle}>Sohbet Bulunamadı</Text>
            <Text style={styles.emptyStateDescription}>
              Henüz hiçbir sohbet başlatmadınız.
            </Text>
          </View>
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  headerTitle: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    ...Shadows.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.light.textPrimary,
    paddingVertical: Spacing.xs,
  },

  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  conversationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },

  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },

  avatar: {
    fontSize: 40,
  },

  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.secondary,
    borderWidth: 2,
    borderColor: Colors.light.surface,
  },

  conversationContent: {
    flex: 1,
  },

  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },

  therapistName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
  },

  timestamp: {
    fontSize: Typography.xs,
    color: Colors.light.textLight,
  },

  conversationBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  lastMessage: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.light.textSecondary,
    marginRight: Spacing.sm,
  },

  lastMessageUnread: {
    fontWeight: Typography.semibold,
    color: Colors.light.textPrimary,
  },

  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },

  unreadCount: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.light.surface,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },

  emptyStateTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.light.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },

  emptyStateDescription: {
    fontSize: Typography.base,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
