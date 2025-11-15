// app/chat/[id].tsx - CHAT DETAIL PAGE
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const MOCK_MESSAGES = [
  {
    id: '1',
    sender: 'therapist',
    content: 'Merhaba! Bugünkü seansımız için hazır mısınız?',
    time: '10:30',
  },
  {
    id: '2',
    sender: 'me',
    content: 'Evet, hazırım. Teşekkür ederim.',
    time: '10:32',
  },
  {
    id: '3',
    sender: 'therapist',
    content: 'Harika! Görüşmeden önce duygu günlüğünüzü tamamlamanızı öneririm.',
    time: '10:33',
  },
  {
    id: '4',
    sender: 'me',
    content: 'Tamam, hemen yapıyorum.',
    time: '10:35',
  },
];

export default function ChatDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <SafeAreaView>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerInfo}
              onPress={() => router.push(`/user/${id}`)}
            >
              <View style={styles.headerAvatar}>
                <Text style={styles.headerAvatarText}>EY</Text>
              </View>
              <View>
                <Text style={styles.headerName}>Dr. Elif Yılmaz</Text>
                <View style={styles.onlineStatus}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>Aktif</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.videoButton}>
            <Feather name="video" size={22} color={Colors.light.textPrimary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_MESSAGES.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === 'me' ? styles.myMessage : styles.theirMessage,
            ]}
          >
            <Text style={[
              styles.messageText,
              msg.sender === 'me' && styles.myMessageText,
            ]}>
              {msg.content}
            </Text>
            <Text style={[
              styles.messageTime,
              msg.sender === 'me' && styles.myMessageTime,
            ]}>
              {msg.time}
            </Text>
          </View>
        ))}
      </ScrollView>

      <SafeAreaView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <Feather name="plus-circle" size={24} color={Colors.light.textSecondary} />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Mesaj yaz..."
              value={message}
              onChangeText={setMessage}
              placeholderTextColor={Colors.light.textLight}
              multiline
            />
            <TouchableOpacity style={styles.sendButton}>
              <Feather name="send" size={20} color={Colors.light.surface} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
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
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  backButton: {
    marginRight: Spacing.sm,
  },

  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },

  headerAvatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.secondary,
  },

  headerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },

  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.secondary,
  },

  onlineText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },

  videoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  messagesContainer: {
    flex: 1,
  },

  messagesContent: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },

  messageBubble: {
    maxWidth: '75%',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
  },

  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.light.textPrimary,
    borderBottomRightRadius: 4,
  },

  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.surface,
    borderBottomLeftRadius: 4,
    ...Shadows.xs,
  },

  messageText: {
    fontSize: 14,
    color: Colors.light.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },

  myMessageText: {
    color: Colors.light.surface,
  },

  messageTime: {
    fontSize: 11,
    color: Colors.light.textLight,
  },

  myMessageTime: {
    color: Colors.light.surface,
    opacity: 0.7,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
    gap: Spacing.sm,
  },

  attachButton: {
    paddingBottom: 4,
  },

  input: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    fontSize: 14,
    color: Colors.light.textPrimary,
    maxHeight: 100,
  },

  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
