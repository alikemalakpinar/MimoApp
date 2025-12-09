// app/tests/index.tsx - ORA TEST LIBRARY
// Comprehensive psychological tests collection
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Test categories and tests
const TEST_CATEGORIES = [
  {
    id: 'schema',
    title: 'Şema Testleri',
    subtitle: 'Erken dönem uyumsuz şemalarınızı keşfedin',
    icon: 'layers',
    gradient: ['#7C5CE0', '#A18AFF'],
    tests: [
      { id: 'schema-abandonment', name: 'Terk Edilme Şeması', duration: '5-7 dk', questions: 10 },
      { id: 'schema-emotional-deprivation', name: 'Duygusal Yoksunluk Şeması', duration: '5-7 dk', questions: 10 },
      { id: 'schema-mistrust', name: 'Güvensizlik/Kötüye Kullanılma Şeması', duration: '5-7 dk', questions: 10 },
      { id: 'schema-social-isolation', name: 'Sosyal İzolasyon Şeması', duration: '5-7 dk', questions: 10 },
      { id: 'schema-vulnerability', name: 'Hastalık ve Tehditler Karşısında Dayanıksızlık', duration: '5-7 dk', questions: 10 },
      { id: 'schema-defectiveness', name: 'Kusurluluk/Utanç Şeması', duration: '5-7 dk', questions: 10 },
      { id: 'schema-subjugation', name: 'Boyun Eğicilik Şeması', duration: '5-7 dk', questions: 10 },
      { id: 'schema-unrelenting-standards', name: 'Yüksek Standartlar/Aşırı Eleştiricilik', duration: '5-7 dk', questions: 10 },
      { id: 'schema-entitlement', name: 'Hak Görme/Büyüklenmecilik Şeması', duration: '5-7 dk', questions: 10 },
    ],
  },
  {
    id: 'mood',
    title: 'Duygudurum Testleri',
    subtitle: 'Ruh halinizi ve duygusal durumunuzu değerlendirin',
    icon: 'sun',
    gradient: ['#FF6B6B', '#FFA07A'],
    tests: [
      { id: 'beck-depression', name: 'Beck Depresyon Envanteri', duration: '10-15 dk', questions: 21 },
      { id: 'perceived-stress', name: 'Algılanan Stres Ölçeği', duration: '5-7 dk', questions: 14 },
      { id: 'stress-symptoms', name: 'Stres Belirtileri Ölçeği', duration: '8-10 dk', questions: 18 },
    ],
  },
  {
    id: 'personality',
    title: 'Kişilik Testleri',
    subtitle: 'Kişilik özelliklerinizi ve eğilimlerinizi anlayın',
    icon: 'user',
    gradient: ['#20B2AA', '#5CD5CD'],
    tests: [
      { id: 'big-five', name: 'Big Five Kişilik Testi', duration: '15-20 dk', questions: 50 },
      { id: 'npi-40', name: 'Narsistik Kişilik Envanteri (NPI-40)', duration: '12-15 dk', questions: 40 },
    ],
  },
  {
    id: 'relationship',
    title: 'İlişki Testleri',
    subtitle: 'İlişki dinamiklerinizi ve bağlanma stilinizi keşfedin',
    icon: 'heart',
    gradient: ['#FFB347', '#FFD89B'],
    tests: [
      { id: 'ecr-attachment', name: 'Yetişkin Bağlanma Stili (ECR)', duration: '10-12 dk', questions: 36 },
      { id: 'love-languages', name: 'Beş Sevgi Dili Testi', duration: '8-10 dk', questions: 30 },
      { id: 'loyalty-tendency', name: 'Sadakat Eğilimi Ölçeği', duration: '5-7 dk', questions: 15 },
    ],
  },
  {
    id: 'other',
    title: 'Diğer Testler',
    subtitle: 'Farklı psikolojik boyutları değerlendirin',
    icon: 'grid',
    gradient: ['#6BB5FF', '#A0D2FF'],
    tests: [
      { id: 'food-neophobia', name: 'Yiyecek Neofobisi Ölçeği', duration: '3-5 dk', questions: 10 },
    ],
  },
];

// Featured tests for quick access
const FEATURED_TESTS = [
  { id: 'beck-depression', name: 'Beck Depresyon', icon: 'cloud-rain', color: '#FF6B6B' },
  { id: 'big-five', name: 'Big Five', icon: 'star', color: '#20B2AA' },
  { id: 'schema-abandonment', name: 'Terk Edilme', icon: 'user-x', color: '#7C5CE0' },
  { id: 'love-languages', name: 'Sevgi Dilleri', icon: 'heart', color: '#FFB347' },
];

export default function TestLibrary() {
  const router = useRouter();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const navigateToTest = (testId: string) => {
    router.push(`/tests/${testId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Psikolojik Testler</Text>
          <Text style={styles.headerSubtitle}>Kendinizi keşfedin</Text>
        </View>
        <TouchableOpacity style={styles.historyButton}>
          <Feather name="clock" size={22} color={Colors.light.textSecondary} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Tests */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.sectionTitle}>Popüler Testler</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContainer}
          >
            {FEATURED_TESTS.map((test) => (
              <TouchableOpacity
                key={test.id}
                style={styles.featuredCard}
                onPress={() => navigateToTest(test.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.featuredIcon, { backgroundColor: test.color + '20' }]}>
                  <Feather name={test.icon as any} size={24} color={test.color} />
                </View>
                <Text style={styles.featuredName}>{test.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Info Card */}
        <Animated.View style={[styles.infoCard, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={['#F8F5FF', '#F0FFFE']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.infoContent}>
            <Feather name="info" size={20} color={Colors.light.primary} />
            <Text style={styles.infoText}>
              Bu testler sadece ön değerlendirme amaçlıdır. Kesin tanı için bir uzmana danışın.
            </Text>
          </View>
        </Animated.View>

        {/* Test Categories */}
        <Text style={styles.sectionTitle}>Tüm Testler</Text>
        {TEST_CATEGORIES.map((category, index) => (
          <Animated.View
            key={category.id}
            style={{
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20 * (index + 1), 0],
                }),
              }],
            }}
          >
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => toggleCategory(category.id)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={category.gradient as [string, string]}
                style={styles.categoryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.categoryIconContainer}>
                  <Feather name={category.icon as any} size={24} color="#FFFFFF" />
                </View>
              </LinearGradient>
              <View style={styles.categoryContent}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                <Text style={styles.categoryCount}>{category.tests.length} test</Text>
              </View>
              <Feather
                name={expandedCategory === category.id ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={Colors.light.textSecondary}
              />
            </TouchableOpacity>

            {/* Expanded Tests List */}
            {expandedCategory === category.id && (
              <View style={styles.testsList}>
                {category.tests.map((test, testIndex) => (
                  <TouchableOpacity
                    key={test.id}
                    style={[
                      styles.testItem,
                      testIndex === category.tests.length - 1 && styles.testItemLast,
                    ]}
                    onPress={() => navigateToTest(test.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.testInfo}>
                      <Text style={styles.testName}>{test.name}</Text>
                      <View style={styles.testMeta}>
                        <Feather name="clock" size={12} color={Colors.light.textTertiary} />
                        <Text style={styles.testMetaText}>{test.duration}</Text>
                        <View style={styles.metaDot} />
                        <Text style={styles.testMetaText}>{test.questions} soru</Text>
                      </View>
                    </View>
                    <View style={styles.startButton}>
                      <Feather name="play" size={16} color={Colors.light.primary} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Animated.View>
        ))}

        {/* Share Results CTA */}
        <View style={styles.shareCTA}>
          <LinearGradient
            colors={Colors.gradients.primary as [string, string]}
            style={styles.shareGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.shareContent}>
              <Feather name="share-2" size={28} color="#FFFFFF" />
              <View style={styles.shareTextContainer}>
                <Text style={styles.shareTitle}>Sonuçlarınızı Paylaşın</Text>
                <Text style={styles.shareSubtitle}>
                  Test sonuçlarınızı uzmanlarla veya yakınlarınızla güvenle paylaşın
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },

  headerTextContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    letterSpacing: -0.5,
  },

  headerSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },

  historyButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },

  featuredContainer: {
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },

  featuredCard: {
    width: 100,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  featuredIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  featuredName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    textAlign: 'center',
  },

  infoCard: {
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
  },

  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },

  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },

  categoryGradient: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryContent: {
    flex: 1,
    marginLeft: Spacing.lg,
  },

  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },

  categorySubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },

  categoryCount: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  testsList: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    ...Shadows.sm,
  },

  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },

  testItemLast: {
    borderBottomWidth: 0,
  },

  testInfo: {
    flex: 1,
  },

  testName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },

  testMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  testMetaText: {
    fontSize: 11,
    color: Colors.light.textTertiary,
  },

  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.light.textTertiary,
    marginHorizontal: 4,
  },

  startButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  shareCTA: {
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.primary,
  },

  shareGradient: {
    padding: Spacing.xl,
  },

  shareContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },

  shareTextContainer: {
    flex: 1,
  },

  shareTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  shareSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
});
