// app/(auth)/personality-test.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius } from '../../shared/theme';

const { width } = Dimensions.get('window');

// Quick Test Questions (10 soruluk)
const quickTestQuestions = [
  { id: 1, trait: "E", text: "Yeni insanlarla tanışmaktan keyif alırım." },
  { id: 2, trait: "E", text: "Kalabalık ortamlarda bulunmak bana enerji verir." },
  { id: 3, trait: "A", text: "Başkalarının duygularını kolayca anlarım." },
  { id: 4, trait: "A", text: "Birlikte çalışırken uyumlu olmaya önem veririm." },
  { id: 5, trait: "C", text: "Görevlerimi planlı ve düzenli bir şekilde yaparım." },
  { id: 6, trait: "C", text: "Verilen işleri zamanında bitirmeye dikkat ederim." },
  { id: 7, trait: "N", text: "Zor durumlarda kolayca strese girerim." },
  { id: 8, trait: "N", text: "Küçük şeyler bile moralimi bozabilir." },
  { id: 9, trait: "O", text: "Yeni fikirlere ve deneyimlere açıktırım." },
  { id: 10, trait: "O", text: "Sanatsal ve yaratıcı etkinliklerden keyif alırım." }
];

const likertOptions = [
  { value: 1, text: 'Kesinlikle Katılmıyorum', color: '#EF4444' },
  { value: 2, text: 'Katılmıyorum', color: '#F97316' },
  { value: 3, text: 'Kararsızım', color: '#6B7280' },
  { value: 4, text: 'Katılıyorum', color: '#10B981' },
  { value: 5, text: 'Kesinlikle Katılıyorum', color: '#059669' }
];

export default function PersonalityTest() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Progress bar animasyonu
    Animated.timing(progressAnim, {
      toValue: (currentQuestion) / quickTestQuestions.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestion]);

  const animateQuestionChange = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 30,
        duration: 0,
        useNativeDriver: true,
      })
    ]).start(() => {
      callback();
      setSelectedAnswer(null);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 6,
          useNativeDriver: true,
        })
      ]).start();
    });
  };

  const handleAnswerSelect = (value: number) => {
    setSelectedAnswer(value);
    
    // Auto advance after selection
    setTimeout(() => {
      handleNext();
    }, 500);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < quickTestQuestions.length - 1) {
      animateQuestionChange(() => {
        setCurrentQuestion(prev => prev + 1);
      });
    } else {
      // Test tamamlandı
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (allAnswers: number[]) => {
    // Quick test için basit hesaplama (her trait için ortalama)
    const traitScores = {
      E: Math.round((allAnswers[0] + allAnswers[1]) / 2 * 8), // 0-40 scale'e çevir
      A: Math.round((allAnswers[2] + allAnswers[3]) / 2 * 8),
      C: Math.round((allAnswers[4] + allAnswers[5]) / 2 * 8),
      N: Math.round((allAnswers[6] + allAnswers[7]) / 2 * 8),
      O: Math.round((allAnswers[8] + allAnswers[9]) / 2 * 8),
    };

    const results = {
      scores: traitScores,
      levels: {
        E: traitScores.E <= 19 ? 'Düşük' : traitScores.E <= 29 ? 'Orta' : 'Yüksek',
        A: traitScores.A <= 19 ? 'Düşük' : traitScores.A <= 29 ? 'Orta' : 'Yüksek',
        C: traitScores.C <= 19 ? 'Düşük' : traitScores.C <= 29 ? 'Orta' : 'Yüksek',
        N: traitScores.N <= 19 ? 'Düşük' : traitScores.N <= 29 ? 'Orta' : 'Yüksek',
        O: traitScores.O <= 19 ? 'Düşük' : traitScores.O <= 29 ? 'Orta' : 'Yüksek',
      }
    };

    setTestResults(results);
    setIsCompleted(true);
  };

  const handleFinish = () => {
    // Görseldeki akışa göre psychologist matching'e geç
    router.push('/(auth)/psychologist-matching');
  };

  // Test Results Screen - görseldeki modern design
  if (isCompleted && testResults) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          
          {/* Results Header */}
          <View style={styles.resultsHeader}>
            <View style={styles.resultIconContainer}>
              <Text style={styles.resultIcon}>🎯</Text>
            </View>
            <Text style={styles.resultsTitle}>Kişilik Profiliniz Hazır!</Text>
            <Text style={styles.resultsSubtitle}>
              Test sonuçlarınıza göre size uygun psikolog önerilerimiz hazırlanıyor.
            </Text>
          </View>

          {/* Personality Chart - Görseldeki radar chart benzeri */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Kişilik Haritanız</Text>
            
            <View style={styles.personalityChart}>
              {Object.entries(testResults.levels).map(([trait, level], index) => {
                const traitInfo = {
                  E: { name: 'Dışa Dönüklük', color: '#3B82F6', icon: '👥' },
                  A: { name: 'Uyumluluk', color: '#10B981', icon: '🤝' },
                  C: { name: 'Sorumluluk', color: '#F59E0B', icon: '📋' },
                  N: { name: 'Duygusal Denge', color: '#EF4444', icon: '🧘' },
                  O: { name: 'Deneyime Açıklık', color: '#8B5CF6', icon: '🎨' }
                };

                const info = traitInfo[trait as keyof typeof traitInfo];
                const score = testResults.scores[trait];
                const percentage = (score / 40) * 100;

                return (
                  <View key={trait} style={styles.traitRow}>
                    <View style={styles.traitInfo}>
                      <Text style={styles.traitIcon}>{info.icon}</Text>
                      <View style={styles.traitDetails}>
                        <Text style={styles.traitName}>{info.name}</Text>
                        <Text style={[styles.traitLevel, { color: info.color }]}>{String(level)}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBg}>
                        <View 
                          style={[
                            styles.progressBarFill, 
                            { 
                              width: `${percentage}%`,
                              backgroundColor: info.color 
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.scoreText}>{score}/40</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Insights Section */}
          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>Sizin İçin Öneriler</Text>
            
            <View style={styles.insightCard}>
              <Text style={styles.insightIcon}>💡</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightText}>
                  Kişilik profilinize göre, empatik ve anlayışlı psikologlarla çalışmanız 
                  daha etkili olacaktır.
                </Text>
              </View>
            </View>

            <View style={styles.insightCard}>
              <Text style={styles.insightIcon}>🎯</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightText}>
                  Yapılandırılmış terapi seansları ve net hedefler sizin için ideal olacak.
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={handleFinish}
              style={styles.primaryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Psikolog Önerilerini Gör</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                Detaylı testi daha sonra profil sayfasından alabilirsiniz
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    );
  }

  // Test Questions Screen - Görseldeki minimal design
  const currentQ = quickTestQuestions[currentQuestion];
  const progress = ((currentQuestion) / quickTestQuestions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        
        {/* Header with Progress */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {currentQuestion + 1} / {quickTestQuestions.length}
            </Text>
          </View>
          
          <TouchableOpacity onPress={() => router.push('/(auth)/psychologist-matching')}>
            <Text style={styles.skipText}>Geç</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              }
            ]} 
          />
        </View>

        {/* Question */}
        <Animated.View 
          style={[
            styles.questionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.questionText}>{currentQ.text}</Text>
        </Animated.View>

        {/* Answer Options - Görseldeki style */}
        <Animated.View 
          style={[
            styles.answersContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {likertOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.answerOption,
                selectedAnswer === option.value && [
                  styles.answerOptionSelected,
                  { borderColor: option.color, backgroundColor: option.color + '10' }
                ]
              ]}
              onPress={() => handleAnswerSelect(option.value)}
              activeOpacity={0.8}
            >
              <View style={[
                styles.answerRadio,
                selectedAnswer === option.value && [
                  styles.answerRadioSelected,
                  { backgroundColor: option.color }
                ]
              ]}>
                {selectedAnswer === option.value && (
                  <View style={styles.answerRadioInner} />
                )}
              </View>
              
              <Text style={[
                styles.answerText,
                selectedAnswer === option.value && { color: option.color, fontWeight: '600' }
              ]}>
                {option.text}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonText: {
    fontSize: 18,
    color: '#333',
  },

  progressInfo: {
    alignItems: 'center',
  },

  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },

  skipText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },

  progressBarContainer: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    marginBottom: Spacing.xxxl,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
  },

  questionContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.md,
  },

  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 32,
  },

  answersContainer: {
    flex: 1,
  },

  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  answerOptionSelected: {
    borderWidth: 2,
    shadowOpacity: 0.1,
  },

  answerRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },

  answerRadioSelected: {
    borderColor: 'transparent',
  },

  answerRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },

  answerText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 22,
  },

  // Results Screen Styles
  resultsHeader: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxxl,
  },

  resultIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  resultIcon: {
    fontSize: 36,
  },

  resultsTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },

  resultsSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },

  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  chartTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },

  personalityChart: {
    paddingVertical: Spacing.md,
  },

  traitRow: {
    marginBottom: Spacing.lg,
  },

  traitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  traitIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },

  traitDetails: {
    flex: 1,
  },

  traitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },

  traitLevel: {
    fontSize: 14,
    fontWeight: '500',
  },

  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    flex: 1,
    marginRight: Spacing.sm,
  },

  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  scoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    minWidth: 35,
  },

  insightsContainer: {
    marginBottom: Spacing.xl,
  },

  insightsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: Spacing.lg,
  },

  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F9FA',
    padding: Spacing.lg,
    borderRadius: 16,
    marginBottom: Spacing.md,
  },

  insightIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },

  insightContent: {
    flex: 1,
  },

  insightText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },

  actionContainer: {
    paddingBottom: Spacing.xl,
  },

  primaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  secondaryButton: {
    backgroundColor: '#F8F9FA',
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },

  secondaryButtonText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});