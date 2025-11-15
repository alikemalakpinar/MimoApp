// app/video-call/[id].tsx - VIDEO CALL INTERFACE
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';

const { width, height } = Dimensions.get('window');

export default function VideoCall() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [duration, setDuration] = useState(1823); // 30:23

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Main Video (Therapist) */}
      <View style={styles.mainVideo}>
        <View style={styles.videoPlaceholder}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>EY</Text>
          </View>
          <Text style={styles.therapistName}>Dr. Elif Yılmaz</Text>
        </View>
        
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.sessionInfo}>
            <View style={styles.recordingDot} />
            <Text style={styles.durationText}>{formatTime(duration)}</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="minimize-2" size={24} color={Colors.light.surface} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Self Video (Picture-in-Picture) */}
      <View style={styles.pipVideo}>
        <View style={styles.pipPlaceholder}>
          <Text style={styles.pipText}>Sen</Text>
        </View>
        <TouchableOpacity style={styles.switchCamera}>
          <Feather name="rotate-cw" size={16} color={Colors.light.surface} />
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            isMuted && styles.controlButtonActive,
          ]}
          onPress={() => setIsMuted(!isMuted)}
        >
          <Feather
            name={isMuted ? 'mic-off' : 'mic'}
            size={24}
            color={isMuted ? '#FF8A80' : Colors.light.surface}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            isVideoOff && styles.controlButtonActive,
          ]}
          onPress={() => setIsVideoOff(!isVideoOff)}
        >
          <Feather
            name={isVideoOff ? 'video-off' : 'video'}
            size={24}
            color={isVideoOff ? '#FF8A80' : Colors.light.surface}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Feather name="message-circle" size={24} color={Colors.light.surface} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.endCallButton}
          onPress={() => router.back()}
        >
          <Feather name="phone-off" size={24} color={Colors.light.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  mainVideo: {
    flex: 1,
    position: 'relative',
  },

  videoPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  avatarText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.light.surface,
  },

  therapistName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.surface,
  },

  topBar: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },

  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },

  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF8A80',
  },

  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.surface,
  },

  pipVideo: {
    position: 'absolute',
    top: 120,
    right: Spacing.xl,
    width: 100,
    height: 140,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.lg,
  },

  pipPlaceholder: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },

  pipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.surface,
  },

  switchCamera: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  controlsContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xl,
  },

  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  controlButtonActive: {
    backgroundColor: 'rgba(255,138,128,0.3)',
  },

  endCallButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF8A80',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
