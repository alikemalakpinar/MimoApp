// shared/components/BiometricMood.tsx - Biometric Mood Tracking & Analysis
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Circle,
  Path,
  G,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Line,
} from 'react-native-svg';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';

const { width, height } = Dimensions.get('window');

// ============================================
// TYPES & INTERFACES
// ============================================
export interface BiometricData {
  heartRate: number;
  heartRateVariability: number;
  sleepQuality: number; // 0-100
  sleepHours: number;
  stepCount: number;
  activeMinutes: number;
  respiratoryRate?: number;
  bloodOxygen?: number;
  stressLevel?: number; // 0-100 derived
}

export interface MoodPrediction {
  mood: 'excellent' | 'good' | 'neutral' | 'low' | 'stressed';
  confidence: number;
  factors: {
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    value: string;
  }[];
  suggestions: string[];
}

export interface BiometricHistory {
  timestamp: Date;
  data: BiometricData;
  mood: MoodPrediction['mood'];
}

// ============================================
// HEART RATE MONITOR ANIMATION
// ============================================
interface HeartRateMonitorProps {
  heartRate: number;
  isLive?: boolean;
  size?: number;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const HeartRateMonitor: React.FC<HeartRateMonitorProps> = ({
  heartRate,
  isLive = true,
  size = 200,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const lineAnim = useRef(new Animated.Value(0)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Calculate pulse duration based on heart rate
    const bpm = Math.max(40, Math.min(200, heartRate));
    const duration = 60000 / bpm;

    if (isLive) {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: duration * 0.2,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: duration * 0.8,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Heart beat animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(heartAnim, {
            toValue: 1.15,
            duration: duration * 0.15,
            useNativeDriver: true,
          }),
          Animated.timing(heartAnim, {
            toValue: 1,
            duration: duration * 0.15,
            useNativeDriver: true,
          }),
          Animated.delay(duration * 0.7),
        ])
      ).start();

      // Line animation
      Animated.loop(
        Animated.timing(lineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [heartRate, isLive]);

  const getHeartRateStatus = () => {
    if (heartRate < 60) return { label: 'Düşük', color: '#60A5FA' };
    if (heartRate <= 100) return { label: 'Normal', color: '#34D399' };
    if (heartRate <= 120) return { label: 'Yüksek', color: '#FBBF24' };
    return { label: 'Çok Yüksek', color: '#EF4444' };
  };

  const status = getHeartRateStatus();

  return (
    <Animated.View
      style={[
        styles.heartRateContainer,
        { width: size, height: size, transform: [{ scale: pulseAnim }] },
      ]}
    >
      {/* Background glow */}
      <View
        style={[
          styles.heartGlow,
          {
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: size * 0.4,
            backgroundColor: status.color,
            opacity: 0.2,
          },
        ]}
      />

      {/* Main circle */}
      <LinearGradient
        colors={[`${status.color}30`, `${status.color}10`]}
        style={[
          styles.heartRateCircle,
          {
            width: size * 0.85,
            height: size * 0.85,
            borderRadius: size * 0.425,
          },
        ]}
      >
        {/* Heart icon */}
        <Animated.Text
          style={[
            styles.heartIcon,
            { fontSize: size * 0.15, transform: [{ scale: heartAnim }] },
          ]}
        >
          ❤️
        </Animated.Text>

        {/* BPM value */}
        <Text style={[styles.bpmValue, { fontSize: size * 0.2, color: status.color }]}>
          {heartRate}
        </Text>
        <Text style={[styles.bpmLabel, { fontSize: size * 0.07 }]}>BPM</Text>

        {/* Status */}
        <View style={[styles.heartRateStatus, { backgroundColor: `${status.color}20` }]}>
          <Text style={[styles.heartRateStatusText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      </LinearGradient>

      {/* ECG Line */}
      <Svg
        width={size}
        height={40}
        style={styles.ecgLine}
        viewBox="0 0 200 40"
      >
        <Path
          d="M0,20 L30,20 L35,20 L40,5 L45,35 L50,20 L55,20 L60,15 L65,25 L70,20 L200,20"
          stroke={status.color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
};

// ============================================
// SLEEP QUALITY RING
// ============================================
interface SleepQualityRingProps {
  quality: number; // 0-100
  hours: number;
  size?: number;
}

export const SleepQualityRing: React.FC<SleepQualityRingProps> = ({
  quality,
  hours,
  size = 140,
}) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const radius = size * 0.4;
  const strokeWidth = size * 0.08;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: quality / 100,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [quality]);

  const getQualityColor = () => {
    if (quality >= 80) return '#34D399';
    if (quality >= 60) return '#FBBF24';
    if (quality >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const getQualityLabel = () => {
    if (quality >= 80) return 'Mükemmel';
    if (quality >= 60) return 'İyi';
    if (quality >= 40) return 'Orta';
    return 'Düşük';
  };

  const color = getQualityColor();

  return (
    <View style={[styles.sleepRingContainer, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgLinearGradient id="sleepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={color} />
            <Stop offset="100%" stopColor={`${color}80`} />
          </SvgLinearGradient>
        </Defs>

        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.light.border}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#sleepGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - quality / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <View style={styles.sleepRingContent}>
        <Text style={styles.sleepIcon}>🌙</Text>
        <Text style={[styles.sleepHours, { color }]}>{hours.toFixed(1)}h</Text>
        <Text style={styles.sleepLabel}>{getQualityLabel()}</Text>
      </View>
    </View>
  );
};

// ============================================
// STRESS LEVEL INDICATOR
// ============================================
interface StressIndicatorProps {
  level: number; // 0-100
  size?: number;
}

export const StressIndicator: React.FC<StressIndicatorProps> = ({
  level,
  size = 120,
}) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: level / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Wave animation for high stress
    if (level > 50) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [level]);

  const getStressInfo = () => {
    if (level < 25) return { label: 'Düşük', color: '#34D399', icon: '😌' };
    if (level < 50) return { label: 'Normal', color: '#60A5FA', icon: '🙂' };
    if (level < 75) return { label: 'Orta', color: '#FBBF24', icon: '😐' };
    return { label: 'Yüksek', color: '#EF4444', icon: '😰' };
  };

  const info = getStressInfo();
  const fillHeight = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, size * 0.7],
  });

  return (
    <View style={[styles.stressContainer, { width: size, height: size }]}>
      {/* Background */}
      <View
        style={[
          styles.stressBackground,
          {
            width: size * 0.7,
            height: size * 0.85,
            borderRadius: size * 0.35,
          },
        ]}
      >
        {/* Fill */}
        <Animated.View
          style={[
            styles.stressFill,
            {
              height: fillHeight,
              backgroundColor: info.color,
              borderBottomLeftRadius: size * 0.35,
              borderBottomRightRadius: size * 0.35,
            },
          ]}
        />

        {/* Wave overlay */}
        {level > 50 && (
          <Animated.View
            style={[
              styles.stressWave,
              {
                opacity: waveAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.1],
                }),
              },
            ]}
          />
        )}
      </View>

      {/* Icon */}
      <Text style={[styles.stressIcon, { fontSize: size * 0.25 }]}>{info.icon}</Text>

      {/* Label */}
      <View style={styles.stressLabelContainer}>
        <Text style={[styles.stressValue, { color: info.color }]}>{level}%</Text>
        <Text style={styles.stressLabel}>{info.label}</Text>
      </View>
    </View>
  );
};

// ============================================
// ACTIVITY RINGS (Apple-style)
// ============================================
interface ActivityRingsProps {
  steps: number;
  stepsGoal?: number;
  activeMinutes: number;
  activeGoal?: number;
  standHours?: number;
  standGoal?: number;
  size?: number;
}

export const ActivityRings: React.FC<ActivityRingsProps> = ({
  steps,
  stepsGoal = 10000,
  activeMinutes,
  activeGoal = 30,
  standHours = 8,
  standGoal = 12,
  size = 160,
}) => {
  const stepAnim = useRef(new Animated.Value(0)).current;
  const activeAnim = useRef(new Animated.Value(0)).current;
  const standAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(stepAnim, {
        toValue: Math.min(steps / stepsGoal, 1.5),
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(activeAnim, {
        toValue: Math.min(activeMinutes / activeGoal, 1.5),
        duration: 1500,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(standAnim, {
        toValue: Math.min(standHours / standGoal, 1.5),
        duration: 1500,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [steps, activeMinutes, standHours]);

  const rings = [
    {
      progress: Math.min(steps / stepsGoal, 1.5),
      color: '#FA2D55',
      radius: size * 0.4,
      label: 'Adım',
      value: steps.toLocaleString(),
    },
    {
      progress: Math.min(activeMinutes / activeGoal, 1.5),
      color: '#92E82A',
      radius: size * 0.32,
      label: 'Aktif',
      value: `${activeMinutes} dk`,
    },
    {
      progress: Math.min(standHours / standGoal, 1.5),
      color: '#1EEAEF',
      radius: size * 0.24,
      label: 'Ayakta',
      value: `${standHours} saat`,
    },
  ];

  const strokeWidth = size * 0.06;

  return (
    <View style={[styles.activityRingsContainer, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {rings.map((ring, index) => {
          const circumference = 2 * Math.PI * ring.radius;
          const strokeDashoffset = circumference * (1 - Math.min(ring.progress, 1));

          return (
            <G key={index}>
              {/* Background */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={ring.radius}
                stroke={`${ring.color}30`}
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Progress */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={ring.radius}
                stroke={ring.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </G>
          );
        })}
      </Svg>

      {/* Center stats */}
      <View style={styles.activityCenter}>
        <Text style={styles.activitySteps}>{steps.toLocaleString()}</Text>
        <Text style={styles.activityStepsLabel}>adım</Text>
      </View>
    </View>
  );
};

// ============================================
// MOOD PREDICTION CARD
// ============================================
interface MoodPredictionCardProps {
  prediction: MoodPrediction;
  onTakeSurvey?: () => void;
}

const moodConfig = {
  excellent: { color: '#34D399', icon: '🌟', label: 'Mükemmel' },
  good: { color: '#60A5FA', icon: '😊', label: 'İyi' },
  neutral: { color: '#FBBF24', icon: '😐', label: 'Nötr' },
  low: { color: '#F472B6', icon: '😔', label: 'Düşük' },
  stressed: { color: '#EF4444', icon: '😰', label: 'Stresli' },
};

export const MoodPredictionCard: React.FC<MoodPredictionCardProps> = ({
  prediction,
  onTakeSurvey,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const config = moodConfig[prediction.mood];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.predictionCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <BlurView intensity={40} tint="light" style={styles.predictionBlur}>
        <LinearGradient
          colors={[`${config.color}20`, `${config.color}05`]}
          style={styles.predictionGradient}
        >
          {/* Header */}
          <View style={styles.predictionHeader}>
            <View style={styles.predictionMoodInfo}>
              <Text style={styles.predictionIcon}>{config.icon}</Text>
              <View>
                <Text style={styles.predictionTitle}>Tahmin Edilen Ruh Hali</Text>
                <Text style={[styles.predictionMood, { color: config.color }]}>
                  {config.label}
                </Text>
              </View>
            </View>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>%{Math.round(prediction.confidence * 100)}</Text>
              <Text style={styles.confidenceLabel}>Güven</Text>
            </View>
          </View>

          {/* Factors */}
          <View style={styles.factorsContainer}>
            <Text style={styles.factorsTitle}>Etkileyen Faktörler</Text>
            {prediction.factors.map((factor, index) => (
              <View key={index} style={styles.factorItem}>
                <View
                  style={[
                    styles.factorImpact,
                    {
                      backgroundColor:
                        factor.impact === 'positive'
                          ? '#34D39920'
                          : factor.impact === 'negative'
                          ? '#EF444420'
                          : '#9CA3AF20',
                    },
                  ]}
                >
                  <Text style={styles.factorImpactIcon}>
                    {factor.impact === 'positive' ? '↑' : factor.impact === 'negative' ? '↓' : '→'}
                  </Text>
                </View>
                <Text style={styles.factorName}>{factor.name}</Text>
                <Text style={styles.factorValue}>{factor.value}</Text>
              </View>
            ))}
          </View>

          {/* Suggestions */}
          {prediction.suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Öneriler</Text>
              {prediction.suggestions.map((suggestion, index) => (
                <View key={index} style={styles.suggestionItem}>
                  <Text style={styles.suggestionBullet}>💡</Text>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Survey CTA */}
          <TouchableOpacity style={styles.surveyButton} onPress={onTakeSurvey}>
            <Text style={styles.surveyButtonText}>Doğruluğunu Onayla</Text>
          </TouchableOpacity>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
};

// ============================================
// BIOMETRIC DASHBOARD
// ============================================
interface BiometricDashboardProps {
  data: BiometricData;
  prediction?: MoodPrediction;
  onSync?: () => void;
}

export const BiometricDashboard: React.FC<BiometricDashboardProps> = ({
  data,
  prediction,
  onSync,
}) => {
  const [lastSynced, setLastSynced] = useState(new Date());

  const handleSync = () => {
    setLastSynced(new Date());
    onSync?.();
  };

  return (
    <ScrollView
      style={styles.dashboard}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.dashboardContent}
    >
      {/* Header */}
      <View style={styles.dashboardHeader}>
        <View>
          <Text style={styles.dashboardTitle}>Biyometrik Veriler</Text>
          <Text style={styles.dashboardSubtitle}>
            Son güncelleme: {lastSynced.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <TouchableOpacity style={styles.syncButton} onPress={handleSync}>
          <Text style={styles.syncIcon}>🔄</Text>
          <Text style={styles.syncText}>Senkronize Et</Text>
        </TouchableOpacity>
      </View>

      {/* Mood Prediction */}
      {prediction && (
        <MoodPredictionCard prediction={prediction} />
      )}

      {/* Main metrics */}
      <View style={styles.metricsGrid}>
        {/* Heart Rate */}
        <View style={styles.metricCard}>
          <BlurView intensity={30} tint="light" style={styles.metricBlur}>
            <HeartRateMonitor heartRate={data.heartRate} size={140} />
          </BlurView>
        </View>

        {/* Sleep Quality */}
        <View style={styles.metricCard}>
          <BlurView intensity={30} tint="light" style={styles.metricBlur}>
            <Text style={styles.metricTitle}>Uyku</Text>
            <SleepQualityRing quality={data.sleepQuality} hours={data.sleepHours} size={100} />
          </BlurView>
        </View>
      </View>

      {/* Activity & Stress */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { flex: 1.5 }]}>
          <BlurView intensity={30} tint="light" style={styles.metricBlur}>
            <Text style={styles.metricTitle}>Aktivite</Text>
            <ActivityRings
              steps={data.stepCount}
              activeMinutes={data.activeMinutes}
              size={120}
            />
          </BlurView>
        </View>

        <View style={[styles.metricCard, { flex: 1 }]}>
          <BlurView intensity={30} tint="light" style={styles.metricBlur}>
            <Text style={styles.metricTitle}>Stres</Text>
            <StressIndicator level={data.stressLevel || 0} size={90} />
          </BlurView>
        </View>
      </View>

      {/* Additional metrics */}
      <View style={styles.additionalMetrics}>
        <Text style={styles.sectionTitle}>Ek Ölçümler</Text>

        <View style={styles.miniMetricsGrid}>
          {/* HRV */}
          <View style={styles.miniMetric}>
            <BlurView intensity={20} tint="light" style={styles.miniMetricBlur}>
              <Text style={styles.miniMetricIcon}>💓</Text>
              <Text style={styles.miniMetricValue}>{data.heartRateVariability}</Text>
              <Text style={styles.miniMetricLabel}>HRV (ms)</Text>
            </BlurView>
          </View>

          {/* Respiratory Rate */}
          {data.respiratoryRate && (
            <View style={styles.miniMetric}>
              <BlurView intensity={20} tint="light" style={styles.miniMetricBlur}>
                <Text style={styles.miniMetricIcon}>🌬️</Text>
                <Text style={styles.miniMetricValue}>{data.respiratoryRate}</Text>
                <Text style={styles.miniMetricLabel}>Solunum/dk</Text>
              </BlurView>
            </View>
          )}

          {/* Blood Oxygen */}
          {data.bloodOxygen && (
            <View style={styles.miniMetric}>
              <BlurView intensity={20} tint="light" style={styles.miniMetricBlur}>
                <Text style={styles.miniMetricIcon}>🩸</Text>
                <Text style={styles.miniMetricValue}>{data.bloodOxygen}%</Text>
                <Text style={styles.miniMetricLabel}>SpO2</Text>
              </BlurView>
            </View>
          )}
        </View>
      </View>

      {/* Connect device prompt */}
      <TouchableOpacity style={styles.connectPrompt}>
        <LinearGradient
          colors={['#8B7CF620', '#6366F110']}
          style={styles.connectGradient}
        >
          <Text style={styles.connectIcon}>⌚</Text>
          <View style={styles.connectInfo}>
            <Text style={styles.connectTitle}>Cihaz Bağla</Text>
            <Text style={styles.connectDesc}>Apple Watch, Fitbit, Garmin...</Text>
          </View>
          <Text style={styles.connectArrow}>→</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

// ============================================
// BIOMETRIC TREND CHART
// ============================================
interface BiometricTrendProps {
  data: { date: Date; value: number }[];
  label: string;
  color?: string;
  unit?: string;
}

export const BiometricTrend: React.FC<BiometricTrendProps> = ({
  data,
  label,
  color = Colors.light.primary,
  unit = '',
}) => {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const chartWidth = width - Spacing.xl * 2;
  const chartHeight = 100;

  const points = data.map((d, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((d.value - minValue) / range) * chartHeight;
    return { x, y };
  });

  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <View style={styles.trendContainer}>
      <View style={styles.trendHeader}>
        <Text style={styles.trendLabel}>{label}</Text>
        <Text style={[styles.trendValue, { color }]}>
          {data[data.length - 1].value.toFixed(0)}{unit}
        </Text>
      </View>

      <Svg width={chartWidth} height={chartHeight + 20}>
        {/* Gradient fill */}
        <Defs>
          <SvgLinearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </SvgLinearGradient>
        </Defs>

        {/* Fill area */}
        <Path
          d={`${pathData} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
          fill="url(#trendGradient)"
        />

        {/* Line */}
        <Path d={pathData} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />

        {/* Points */}
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />
        ))}
      </Svg>
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  // Heart Rate Monitor
  heartRateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartGlow: {
    position: 'absolute',
  },
  heartRateCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    ...Shadows.md,
  },
  heartIcon: {
    marginBottom: Spacing.xs,
  },
  bpmValue: {
    fontWeight: '700',
  },
  bpmLabel: {
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  heartRateStatus: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.lg,
  },
  heartRateStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ecgLine: {
    position: 'absolute',
    bottom: 0,
  },

  // Sleep Quality Ring
  sleepRingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sleepRingContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  sleepIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  sleepHours: {
    fontSize: 20,
    fontWeight: '700',
  },
  sleepLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },

  // Stress Indicator
  stressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stressBackground: {
    backgroundColor: Colors.light.border,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  stressFill: {
    width: '100%',
  },
  stressWave: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },
  stressIcon: {
    position: 'absolute',
    top: '25%',
  },
  stressLabelContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  stressValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  stressLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },

  // Activity Rings
  activityRingsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  activitySteps: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  activityStepsLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },

  // Mood Prediction Card
  predictionCard: {
    marginBottom: Spacing.lg,
  },
  predictionBlur: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  predictionGradient: {
    padding: Spacing.lg,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  predictionMoodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  predictionIcon: {
    fontSize: 40,
    marginRight: Spacing.md,
  },
  predictionTitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  predictionMood: {
    fontSize: 20,
    fontWeight: '700',
  },
  confidenceBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(139, 124, 246, 0.1)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  confidenceText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  confidenceLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  factorsContainer: {
    marginBottom: Spacing.md,
  },
  factorsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  factorImpact: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  factorImpactIcon: {
    fontSize: 12,
    fontWeight: '700',
  },
  factorName: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.textPrimary,
  },
  factorValue: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  suggestionsContainer: {
    marginBottom: Spacing.md,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  suggestionBullet: {
    fontSize: 14,
    marginRight: Spacing.sm,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  surveyButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  surveyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Dashboard
  dashboard: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  dashboardContent: {
    padding: Spacing.xl,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  dashboardSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  syncIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  syncText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  metricCard: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  metricBlur: {
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: BorderRadius.xl,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  additionalMetrics: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },
  miniMetricsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  miniMetric: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  miniMetricBlur: {
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: BorderRadius.lg,
  },
  miniMetricIcon: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  miniMetricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  miniMetricLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  connectPrompt: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  connectGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  connectIcon: {
    fontSize: 28,
    marginRight: Spacing.md,
  },
  connectInfo: {
    flex: 1,
  },
  connectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  connectDesc: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  connectArrow: {
    fontSize: 20,
    color: Colors.light.textSecondary,
  },

  // Trend Chart
  trendContainer: {
    marginBottom: Spacing.lg,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  trendLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  trendValue: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default {
  HeartRateMonitor,
  SleepQualityRing,
  StressIndicator,
  ActivityRings,
  MoodPredictionCard,
  BiometricDashboard,
  BiometricTrend,
};
