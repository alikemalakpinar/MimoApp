// app/(patient)/surveys/phq9.tsx - PHQ-9 Depression Screening
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../../shared/theme';

const PHQ9_QUESTIONS = [
  'Yapt11n1z i_lerden çok az ilgi veya zevk duyma',
  'Kendinizi çökkün, depresif veya umutsuz hissetme',
  'Uykuya dalmakta veya uyumakta güçlük, ya da çok fazla uyuma',
  'Yorgunluk veya enerji azl11 hissetme',
  '0_tahs1zl1k veya a_1r1 yeme',
  'Kendinizi kötü hissetme, ba_ar1s1z olduunuzu dü_ünme veya kendinizi ya da ailenizi hayal k1r1kl11na uratt11n1z1 dü_ünme',
  'Gazete okumak ya da televizyon izlemek gibi _eylere konsantre olmakta güçlük',
  'Dier insanlar1n fark edebilecei kadar yava_ hareket etme veya konu_ma, ya da tam tersi - normalden çok daha fazla k1p1r k1p1r veya huzursuz olma',
  'Kendinize zarar verme ya da ölseniz daha iyi olur dü_ünceleri',
];

const OPTIONS = [
  { label: 'Hiç', value: 0 },
  { label: 'Birkaç gün', value: 1 },
  { label: 'Günlerin yar1s1ndan fazlas1', value: 2 },
  { label: 'Hemen hemen her gün', value: 3 },
];

const SEVERITY_LEVELS = [
  { min: 0, max: 4, level: 'Minimal', color: Colors.light.moodHappy, description: 'Minimal depresyon belirtileri. ^u an için profesyonel destek gerekmeyebilir.' },
  { min: 5, max: 9, level: 'Hafif', color: Colors.light.moodCalm, description: 'Hafif depresyon belirtileri. Öz bak1m ve takip önerilir.' },
  { min: 10, max: 14, level: 'Orta', color: Colors.light.gold, description: 'Orta düzey depresyon. Profesyonel deerlendirme önerilir.' },
  { min: 15, max: 19, level: 'Orta-Ciddi', color: Colors.light.moodAnxious, description: 'Orta-ciddi depresyon. Tedavi planlamas1 için bir uzmana ba_vurun.' },
  { min: 20, max: 27, level: 'Ciddi', color: Colors.light.moodSad, description: 'Ciddi depresyon belirtileri. Acil profesyonel destek alman1z önerilir.' },
];

export default function PHQ9Survey() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentQuestion + 1) / PHQ9_QUESTIONS.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestion]);

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);

    if (currentQuestion < PHQ9_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        fadeAnim.setValue(0.5);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }, 200);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const calculateScore = () => Object.values(answers).reduce((sum, val) => sum + val, 0);

  const getSeverity = (score: number) => {
    return SEVERITY_LEVELS.find(level => score >= level.min && score <= level.max) || SEVERITY_LEVELS[0];
  };

  if (showResults) {
    const score = calculateScore();
    const severity = getSeverity(score);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <View style={[styles.resultsBadge, { backgroundColor: severity.color }]}>
              <Feather name="activity" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.resultsTitle}>PHQ-9 Sonuçlar1</Text>
          </View>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Toplam Puan</Text>
            <Text style={[styles.scoreValue, { color: severity.color }]}>{score}</Text>
            <Text style={styles.scoreMax}>/ 27</Text>
          </View>

          <View style={[styles.severityCard, { borderColor: severity.color }]}>
            <Text style={[styles.severityLevel, { color: severity.color }]}>{severity.level}</Text>
            <Text style={styles.severityDescription}>{severity.description}</Text>
          </View>

          {score >= 10 && (
            <View style={styles.warningCard}>
              <Feather name="alert-circle" size={20} color={Colors.light.accent} />
              <Text style={styles.warningText}>
                Puan1n1z profesyonel destek alman1z1 önermektedir. Bir ruh sal11 uzman1yla görü_menizi tavsiye ederiz.
              </Text>
            </View>
          )}

          {answers[8] > 0 && (
            <View style={[styles.warningCard, { backgroundColor: Colors.light.error + '15' }]}>
              <Feather name="alert-triangle" size={20} color={Colors.light.error} />
              <Text style={[styles.warningText, { color: Colors.light.error }]}>
                Önemli: 9. soruya verdiiniz yan1t endi_e verici olabilir. Lütfen en k1sa sürede bir uzmana ba_vurun veya acil yard1m hatt1n1 aray1n: 182
              </Text>
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/(patient)/therapist-search')}
            >
              <LinearGradient colors={Colors.gradients.primary as [string, string]} style={styles.buttonGradient}>
                <Feather name="user-check" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Uzman Bul</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
              <Text style={styles.secondaryButtonText}>Ana Sayfaya Dön</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.disclaimer}>
            Bu test sadece tarama amaçl1d1r ve t1bbi te_his yerine geçmez.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="x" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, {
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }]} />
        </View>
        <Text style={styles.progressText}>{currentQuestion + 1}/{PHQ9_QUESTIONS.length}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.questionContainer}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.surveyTitle}>PHQ-9</Text>
          <Text style={styles.surveySubtitle}>Son 2 hafta içinde a_a1daki sorunlar sizi ne kadar rahats1z etti?</Text>

          <Text style={styles.questionText}>{PHQ9_QUESTIONS[currentQuestion]}</Text>

          <View style={styles.optionsContainer}>
            {OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.optionButton, answers[currentQuestion] === option.value && styles.optionActive]}
                onPress={() => handleAnswer(option.value)}
              >
                <View style={[styles.optionRadio, answers[currentQuestion] === option.value && styles.optionRadioActive]}>
                  {answers[currentQuestion] === option.value && <View style={styles.optionRadioDot} />}
                </View>
                <Text style={[styles.optionText, answers[currentQuestion] === option.value && styles.optionTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {currentQuestion > 0 && (
            <TouchableOpacity style={styles.prevButton} onPress={() => setCurrentQuestion(prev => prev - 1)}>
              <Feather name="arrow-left" size={18} color={Colors.light.textSecondary} />
              <Text style={styles.prevButtonText}>Önceki</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, gap: Spacing.md },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.light.surface, justifyContent: 'center', alignItems: 'center', ...Shadows.sm },
  progressContainer: { flex: 1, height: 8, backgroundColor: Colors.light.surface, borderRadius: 4, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: Colors.light.primary, borderRadius: 4 },
  progressText: { fontSize: 14, fontWeight: '600', color: Colors.light.textSecondary, minWidth: 40 },
  questionContainer: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.huge },
  surveyTitle: { fontSize: 14, fontWeight: '700', color: Colors.light.primary, marginBottom: Spacing.xs },
  surveySubtitle: { fontSize: 13, color: Colors.light.textSecondary, marginBottom: Spacing.xl, lineHeight: 18 },
  questionText: { fontSize: 20, fontWeight: '700', color: Colors.light.textPrimary, lineHeight: 28, marginBottom: Spacing.xl },
  optionsContainer: { gap: Spacing.md },
  optionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, padding: Spacing.lg, borderRadius: BorderRadius.xl, borderWidth: 2, borderColor: 'transparent', ...Shadows.sm },
  optionActive: { borderColor: Colors.light.primary, backgroundColor: Colors.light.primary + '10' },
  optionRadio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: Colors.light.border, marginRight: Spacing.md, justifyContent: 'center', alignItems: 'center' },
  optionRadioActive: { borderColor: Colors.light.primary },
  optionRadioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.light.primary },
  optionText: { fontSize: 15, fontWeight: '500', color: Colors.light.textPrimary },
  optionTextActive: { color: Colors.light.primary, fontWeight: '600' },
  prevButton: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.xl, paddingVertical: Spacing.sm },
  prevButtonText: { fontSize: 14, fontWeight: '600', color: Colors.light.textSecondary },
  // Results
  resultsContainer: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xl },
  resultsHeader: { alignItems: 'center', marginBottom: Spacing.xl },
  resultsBadge: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg },
  resultsTitle: { fontSize: 24, fontWeight: '700', color: Colors.light.textPrimary },
  scoreCard: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', backgroundColor: Colors.light.surface, padding: Spacing.xl, borderRadius: BorderRadius.xl, marginBottom: Spacing.lg, ...Shadows.sm },
  scoreLabel: { fontSize: 14, color: Colors.light.textSecondary, marginRight: Spacing.md },
  scoreValue: { fontSize: 48, fontWeight: '700' },
  scoreMax: { fontSize: 20, color: Colors.light.textTertiary },
  severityCard: { backgroundColor: Colors.light.surface, padding: Spacing.xl, borderRadius: BorderRadius.xl, borderLeftWidth: 4, marginBottom: Spacing.lg, ...Shadows.sm },
  severityLevel: { fontSize: 20, fontWeight: '700', marginBottom: Spacing.sm },
  severityDescription: { fontSize: 14, color: Colors.light.textSecondary, lineHeight: 20 },
  warningCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.light.accent + '15', padding: Spacing.lg, borderRadius: BorderRadius.lg, marginBottom: Spacing.lg, gap: Spacing.md },
  warningText: { flex: 1, fontSize: 13, color: Colors.light.accent, lineHeight: 18 },
  actionButtons: { gap: Spacing.md, marginTop: Spacing.lg },
  primaryButton: { borderRadius: BorderRadius.button, overflow: 'hidden', ...Shadows.primary },
  buttonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.lg, gap: Spacing.sm },
  primaryButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  secondaryButton: { paddingVertical: Spacing.md, alignItems: 'center' },
  secondaryButtonText: { fontSize: 15, fontWeight: '600', color: Colors.light.textSecondary },
  disclaimer: { fontSize: 12, color: Colors.light.textTertiary, textAlign: 'center', marginTop: Spacing.xl, fontStyle: 'italic' },
});
