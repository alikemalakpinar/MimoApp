// shared/components/VoiceInterface.tsx - Voice-First Interaction System
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Modal,
  ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';

const { width, height } = Dimensions.get('window');

// ============================================
// TYPES & INTERFACES
// ============================================
export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export interface VoiceCommand {
  id: string;
  phrase: string;
  action: string;
  icon: string;
}

export interface VoiceTranscript {
  text: string;
  isFinal: boolean;
  confidence: number;
}

// ============================================
// ANIMATED VOICE WAVE
// ============================================
interface VoiceWaveProps {
  isActive: boolean;
  color?: string;
  barCount?: number;
  style?: ViewStyle;
}

export const VoiceWave: React.FC<VoiceWaveProps> = ({
  isActive,
  color = Colors.light.primary,
  barCount = 5,
  style,
}) => {
  const barAnims = useRef(
    Array.from({ length: barCount }, () => new Animated.Value(0.3))
  ).current;

  useEffect(() => {
    if (isActive) {
      const animations = barAnims.map((anim, index) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: Math.random() * 0.7 + 0.3,
              duration: 150 + index * 50,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.3,
              duration: 150 + index * 50,
              useNativeDriver: true,
            }),
          ])
        );
      });

      Animated.parallel(animations).start();
    } else {
      barAnims.forEach(anim => {
        Animated.timing(anim, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [isActive]);

  return (
    <View style={[styles.waveContainer, style]}>
      {barAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.waveBar,
            {
              backgroundColor: color,
              transform: [{ scaleY: anim }],
            },
          ]}
        />
      ))}
    </View>
  );
};

// ============================================
// CIRCULAR VOICE VISUALIZER
// ============================================
interface CircularVisualizerProps {
  isActive: boolean;
  state: VoiceState;
  size?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CircularVisualizer: React.FC<CircularVisualizerProps> = ({
  isActive,
  state,
  size = 200,
}) => {
  const rings = 4;
  const ringAnims = useRef(
    Array.from({ length: rings }, () => new Animated.Value(0))
  ).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const stateColors = {
    idle: ['#E5E7EB', '#D1D5DB'],
    listening: ['#8B7CF6', '#6366F1'],
    processing: ['#FBBF24', '#F59E0B'],
    speaking: ['#34D399', '#10B981'],
    error: ['#F87171', '#EF4444'],
  };

  useEffect(() => {
    // Pulse animation
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

    // Rotation for processing
    if (state === 'processing') {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    }

    // Ring animations when listening
    if (isActive && state === 'listening') {
      ringAnims.forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 500 + index * 200,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 500 + index * 200,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    }
  }, [isActive, state]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const colors = stateColors[state];

  return (
    <Animated.View
      style={[
        styles.circularVisualizer,
        { width: size, height: size, transform: [{ scale: pulseAnim }] },
      ]}
    >
      {/* Glow effect */}
      <View
        style={[
          styles.visualizerGlow,
          {
            width: size * 1.2,
            height: size * 1.2,
            borderRadius: size * 0.6,
            backgroundColor: colors[0],
            opacity: 0.2,
          },
        ]}
      />

      {/* Animated rings */}
      {ringAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.visualizerRing,
            {
              width: size + index * 20,
              height: size + index * 20,
              borderRadius: (size + index * 20) / 2,
              borderColor: colors[0],
              opacity: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 0],
              }),
              transform: [
                {
                  scale: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.3],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      {/* Main circle */}
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <LinearGradient
          colors={colors}
          style={[
            styles.visualizerMain,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          {/* Voice wave inside */}
          <VoiceWave isActive={isActive && state === 'listening'} color="#FFFFFF" />

          {/* State icon */}
          <Text style={styles.visualizerIcon}>
            {state === 'idle' && '🎙️'}
            {state === 'listening' && '👂'}
            {state === 'processing' && '⏳'}
            {state === 'speaking' && '💬'}
            {state === 'error' && '⚠️'}
          </Text>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
};

// ============================================
// VOICE BUTTON
// ============================================
interface VoiceButtonProps {
  onPress: () => void;
  onLongPress?: () => void;
  state: VoiceState;
  size?: number;
  style?: ViewStyle;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onPress,
  onLongPress,
  state,
  size = 72,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const stateColors = {
    idle: Colors.light.primary,
    listening: '#EF4444',
    processing: '#FBBF24',
    speaking: '#34D399',
    error: '#F87171',
  };

  useEffect(() => {
    if (state === 'listening') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [state]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
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
      {/* Glow */}
      <Animated.View
        style={[
          styles.voiceButtonGlow,
          {
            width: size * 1.4,
            height: size * 1.4,
            borderRadius: size * 0.7,
            backgroundColor: stateColors[state],
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.4],
            }),
          },
        ]}
      />

      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          styles.voiceButton,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: stateColors[state],
          },
        ]}
      >
        {state === 'listening' ? (
          <VoiceWave isActive={true} color="#FFFFFF" barCount={3} />
        ) : (
          <Text style={[styles.voiceButtonIcon, { fontSize: size * 0.4 }]}>
            {state === 'idle' && '🎙️'}
            {state === 'processing' && '⏳'}
            {state === 'speaking' && '🔊'}
            {state === 'error' && '🔄'}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================
// VOICE TRANSCRIPT DISPLAY
// ============================================
interface TranscriptDisplayProps {
  transcript: VoiceTranscript | null;
  response?: string;
  isVisible: boolean;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  transcript,
  response,
  isVisible,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (isVisible && (transcript || response)) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      slideAnim.setValue(20);
    }
  }, [isVisible, transcript, response]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.transcriptContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <BlurView intensity={50} tint="light" style={styles.transcriptBlur}>
        {transcript && (
          <View style={styles.transcriptSection}>
            <Text style={styles.transcriptLabel}>Sen</Text>
            <Text style={[
              styles.transcriptText,
              !transcript.isFinal && styles.transcriptTextPartial,
            ]}>
              {transcript.text}
              {!transcript.isFinal && <Text style={styles.cursor}>|</Text>}
            </Text>
          </View>
        )}

        {response && (
          <View style={styles.transcriptSection}>
            <Text style={styles.transcriptLabel}>Ora</Text>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        )}
      </BlurView>
    </Animated.View>
  );
};

// ============================================
// VOICE COMMAND HINTS
// ============================================
interface CommandHintsProps {
  commands: VoiceCommand[];
  isVisible: boolean;
}

export const CommandHints: React.FC<CommandHintsProps> = ({
  commands,
  isVisible,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const defaultCommands: VoiceCommand[] = [
    { id: '1', phrase: '"Nasıl hissediyorum"', action: 'mood_check', icon: '🎭' },
    { id: '2', phrase: '"Nefes egzersizi"', action: 'breathing', icon: '🌬️' },
    { id: '3', phrase: '"Günlük yaz"', action: 'journal', icon: '📝' },
    { id: '4', phrase: '"Meditasyon başlat"', action: 'meditation', icon: '🧘' },
    { id: '5', phrase: '"Seninle konuşmak istiyorum"', action: 'chat', icon: '💬' },
  ];

  const displayCommands = commands.length > 0 ? commands : defaultCommands;

  return (
    <Animated.View style={[styles.hintsContainer, { opacity: fadeAnim }]}>
      <Text style={styles.hintsTitle}>Şunları deneyin:</Text>
      <View style={styles.hintsList}>
        {displayCommands.map((command, index) => (
          <Animated.View
            key={command.id}
            style={[
              styles.hintItem,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.hintIcon}>{command.icon}</Text>
            <Text style={styles.hintPhrase}>{command.phrase}</Text>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
};

// ============================================
// FULL VOICE INTERFACE MODAL
// ============================================
interface VoiceInterfaceModalProps {
  isVisible: boolean;
  onClose: () => void;
  onTranscript: (transcript: VoiceTranscript) => void;
  state: VoiceState;
  transcript: VoiceTranscript | null;
  response?: string;
}

export const VoiceInterfaceModal: React.FC<VoiceInterfaceModalProps> = ({
  isVisible,
  onClose,
  onTranscript,
  state,
  transcript,
  response,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const stateMessages = {
    idle: 'Dinlemek için dokun',
    listening: 'Seni dinliyorum...',
    processing: 'Düşünüyorum...',
    speaking: 'Konuşuyorum...',
    error: 'Bir sorun oluştu, tekrar dene',
  };

  return (
    <Modal visible={isVisible} transparent animationType="none">
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />

        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Close button */}
          <TouchableOpacity style={styles.modalClose} onPress={handleClose}>
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>

          {/* Ora branding */}
          <View style={styles.modalHeader}>
            <LinearGradient
              colors={[Colors.light.primary, Colors.light.secondary]}
              style={styles.oraIconContainer}
            >
              <Text style={styles.oraIcon}>✨</Text>
            </LinearGradient>
            <Text style={styles.modalTitle}>Ora ile Konuş</Text>
          </View>

          {/* Visualizer */}
          <CircularVisualizer
            isActive={state === 'listening'}
            state={state}
            size={180}
          />

          {/* State message */}
          <Text style={styles.stateMessage}>{stateMessages[state]}</Text>

          {/* Transcript display */}
          <TranscriptDisplay
            transcript={transcript}
            response={response}
            isVisible={!!transcript || !!response}
          />

          {/* Command hints */}
          <CommandHints
            commands={[]}
            isVisible={state === 'idle'}
          />

          {/* Voice button */}
          <VoiceButton
            onPress={() => {}}
            state={state}
            size={72}
            style={styles.modalVoiceButton}
          />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// ============================================
// MINI VOICE ASSISTANT
// ============================================
interface MiniVoiceAssistantProps {
  onActivate: () => void;
  isListening: boolean;
  style?: ViewStyle;
}

export const MiniVoiceAssistant: React.FC<MiniVoiceAssistantProps> = ({
  onActivate,
  isListening,
  style,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    // Continuous subtle pulse
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

    // Glow animation when listening
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.2,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isListening]);

  return (
    <TouchableOpacity
      onPress={onActivate}
      activeOpacity={0.8}
      style={style}
    >
      <Animated.View
        style={[
          styles.miniAssistant,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        {/* Glow */}
        <Animated.View
          style={[
            styles.miniGlow,
            {
              opacity: glowAnim,
              backgroundColor: isListening ? '#EF4444' : Colors.light.primary,
            },
          ]}
        />

        {/* Main circle */}
        <LinearGradient
          colors={
            isListening
              ? ['#EF4444', '#DC2626']
              : [Colors.light.primary, Colors.light.secondary]
          }
          style={styles.miniCircle}
        >
          <BlurView intensity={20} style={styles.miniCircleInner}>
            {isListening ? (
              <VoiceWave isActive={true} color="#FFFFFF" barCount={3} />
            ) : (
              <Text style={styles.miniIcon}>🎙️</Text>
            )}
          </BlurView>
        </LinearGradient>

        {/* Label */}
        <View style={styles.miniLabel}>
          <Text style={styles.miniLabelText}>
            {isListening ? 'Dinliyor...' : 'Ora\'ya Sor'}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ============================================
// VOICE WAVEFORM ANIMATION
// ============================================
interface VoiceWaveformProps {
  audioLevels: number[];
  color?: string;
  style?: ViewStyle;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  audioLevels = [],
  color = Colors.light.primary,
  style,
}) => {
  const barCount = 40;
  const defaultLevels = Array.from({ length: barCount }, () => Math.random() * 0.3 + 0.1);
  const levels = audioLevels.length > 0 ? audioLevels : defaultLevels;

  return (
    <View style={[styles.waveformContainer, style]}>
      {levels.slice(0, barCount).map((level, index) => (
        <View
          key={index}
          style={[
            styles.waveformBar,
            {
              height: `${Math.min(level * 100, 100)}%`,
              backgroundColor: color,
              opacity: 0.5 + level * 0.5,
            },
          ]}
        />
      ))}
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  // Voice Wave
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    gap: 4,
  },
  waveBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },

  // Circular Visualizer
  circularVisualizer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualizerGlow: {
    position: 'absolute',
  },
  visualizerRing: {
    position: 'absolute',
    borderWidth: 2,
  },
  visualizerMain: {
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  visualizerIcon: {
    fontSize: 40,
    position: 'absolute',
    bottom: 30,
  },

  // Voice Button
  voiceButton: {
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  voiceButtonGlow: {
    position: 'absolute',
  },
  voiceButtonIcon: {
    textAlign: 'center',
  },

  // Transcript Display
  transcriptContainer: {
    width: '100%',
    marginVertical: Spacing.lg,
  },
  transcriptBlur: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  transcriptSection: {
    marginBottom: Spacing.md,
  },
  transcriptLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    marginBottom: 4,
  },
  transcriptText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  transcriptTextPartial: {
    opacity: 0.7,
  },
  cursor: {
    color: Colors.light.primary,
  },
  responseText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },

  // Command Hints
  hintsContainer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  hintsTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: Spacing.md,
  },
  hintsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  hintIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  hintPhrase: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - Spacing.xl * 2,
    maxHeight: height * 0.8,
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalCloseText: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.6)',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  oraIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  oraIcon: {
    fontSize: 28,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stateMessage: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  modalVoiceButton: {
    marginTop: 'auto',
    paddingTop: Spacing.xl,
  },

  // Mini Assistant
  miniAssistant: {
    alignItems: 'center',
  },
  miniGlow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  miniCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  miniCircleInner: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  miniIcon: {
    fontSize: 24,
  },
  miniLabel: {
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: BorderRadius.sm,
  },
  miniLabelText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  // Waveform
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    gap: 2,
  },
  waveformBar: {
    width: 3,
    borderRadius: 1.5,
  },
});

export default {
  VoiceWave,
  CircularVisualizer,
  VoiceButton,
  TranscriptDisplay,
  CommandHints,
  VoiceInterfaceModal,
  MiniVoiceAssistant,
  VoiceWaveform,
};
