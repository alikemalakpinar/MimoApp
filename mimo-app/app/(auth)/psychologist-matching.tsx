// app/(auth)/psychologist-matching.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius } from '../../shared/theme';

const { width } = Dimensions.get('window');

// Mock psychologist data - gerçekte API'den gelecek
const recommendedPsychologists = [
  {
    id: 1,
    name: 'Dr. Ayşe Demir',
    title: 'Klinik Psikolog',
    specialties: ['Anksiyete', 'Depresyon', 'Stres Yönetimi'],
    experience: '8 yıl deneyim',
    rating: 4.9,
    reviewCount: 127,
    price: 350,
    matchPercentage: 95,
    avatar: '👩‍⚕️',
    backgroundColor: '#F0F9FF',
    isOnline: true,
    nextAvailable: 'Bugün 15:00'
  },
  {
    id: 2,
    name: 'Dr. Mehmet Kaya',
    title: 'Psikolog',
    specialties: ['Travma', 'İlişki Terapisi', 'Öfke Yönetimi'],
    experience: '12 yıl deneyim',
    rating: 4.8,
    reviewCount: 203,
    price: 400,
    matchPercentage: 88,
    avatar: '👨‍⚕️',
    backgroundColor: '#F0FDF4',
    isOnline: false,
    nextAvailable: 'Yarın 10:00'
  },
  {
    id: 3,
    name: 'Dr. Zeynep Şahin',
    title: 'Klinik Psikolog',
    specialties: ['Aile Terapisi', 'Çocuk Psikolojisi'],
    experience: '6 yıl deneyim',
    rating: 4.7,
    reviewCount: 89,
    price: 320,
    matchPercentage: 82,
    avatar: '👩‍⚕️',
    backgroundColor: '#FFFBEB',
    isOnline: true,
    nextAvailable: 'Bugün 17:30'
  }
];

export default function PsychologistMatching() {
  const router = useRouter();
  const [selectedPsychologist, setSelectedPsychologist] = useState<number | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSelectPsychologist = (psychologist: any) => {
    setSelectedPsychologist(psychologist.id);
    // TODO: Save selected psychologist to store/context
    console.log('Selected psychologist:', psychologist);
  };

  const handleContinue = () => {
    if (!selectedPsychologist) {
      alert('Lütfen bir psikolog seçin');
      return;
    }
    
    // Ana uygulamaya geçiş
    router.push('/(tabs)/home');
  };

  const handleViewAll = () => {
    // Tüm psikologları göster (appointments sayfasına gidecek)
    router.push('/(tabs)/appointments');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Size Uygun Psikologlar</Text>
            <Text style={styles.headerSubtitle}>
              Kişilik profilinize göre önerilen uzmanlar
            </Text>
          </View>
        </Animated.View>

        {/* Match Info Card */}
        <Animated.View 
          style={[
            styles.matchInfoCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.matchInfoIcon}>🎯</Text>
          <View style={styles.matchInfoContent}>
            <Text style={styles.matchInfoTitle}>Kişiselleştirilmiş Eşleşme</Text>
            <Text style={styles.matchInfoText}>
              Test sonuçlarınıza göre, bu psikologlar size en uygun yaklaşımları kullanıyor.
            </Text>
          </View>
        </Animated.View>

        {/* Psychologist Cards */}
        <Animated.View 
          style={[
            styles.psychologistsList,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {recommendedPsychologists.map((psychologist, index) => (
            <TouchableOpacity
              key={psychologist.id}
              style={[
                styles.psychologistCard,
                selectedPsychologist === psychologist.id && styles.selectedCard,
                { backgroundColor: psychologist.backgroundColor }
              ]}
              onPress={() => handleSelectPsychologist(psychologist)}
              activeOpacity={0.9}
            >
              {/* Match Badge */}
              <View style={styles.matchBadge}>
                <Text style={styles.matchPercentage}>{psychologist.matchPercentage}%</Text>
                <Text style={styles.matchText}>eşleşme</Text>
              </View>

              {/* Psychologist Info */}
              <View style={styles.psychologistHeader}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatar}>{psychologist.avatar}</Text>
                  {psychologist.isOnline && (
                    <View style={styles.onlineIndicator} />
                  )}
                </View>
                
                <View style={styles.psychologistInfo}>
                  <Text style={styles.psychologistName}>{psychologist.name}</Text>
                  <Text style={styles.psychologistTitle}>{psychologist.title}</Text>
                  <Text style={styles.experience}>{psychologist.experience}</Text>
                </View>
              </View>

              {/* Specialties */}
              <View style={styles.specialtiesContainer}>
                {psychologist.specialties.map((specialty, idx) => (
                  <View key={idx} style={styles.specialtyTag}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
              </View>

              {/* Rating & Price */}
              <View style={styles.psychologistFooter}>
                <View style={styles.ratingContainer}>
                  <Text style={styles.starIcon}>⭐</Text>
                  <Text style={styles.rating}>{psychologist.rating}</Text>
                  <Text style={styles.reviewCount}>({psychologist.reviewCount})</Text>
                </View>
                
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{psychologist.price}₺</Text>
                  <Text style={styles.priceUnit}>/seans</Text>
                </View>
              </View>

              {/* Availability */}
              <View style={styles.availabilityContainer}>
                <Text style={styles.availabilityIcon}>📅</Text>
                <Text style={styles.availabilityText}>
                  Müsait: {psychologist.nextAvailable}
                </Text>
              </View>

              {/* Selection Indicator */}
              {selectedPsychologist === psychologist.id && (
                <View style={styles.selectionIndicator}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Actions */}
        <Animated.View 
          style={[
            styles.actionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity
            onPress={handleContinue}
            style={[
              styles.continueButton,
              { opacity: selectedPsychologist ? 1 : 0.5 }
            ]}
            disabled={!selectedPsychologist}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              Seçili Psikologla Devam Et
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleViewAll}
            style={styles.viewAllButton}
            activeOpacity={0.8}
          >
            <Text style={styles.viewAllButtonText}>Tüm Psikologları Görüntüle</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  backButtonText: {
    fontSize: 18,
    color: '#333',
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: Spacing.xs,
  },

  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },

  matchInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary + '10',
    padding: Spacing.lg,
    borderRadius: 16,
    marginBottom: Spacing.xl,
  },

  matchInfoIcon: {
    fontSize: 28,
    marginRight: Spacing.md,
  },

  matchInfoContent: {
    flex: 1,
  },

  matchInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: Spacing.xs,
  },

  matchInfoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  psychologistsList: {
    marginBottom: Spacing.xl,
  },

  psychologistCard: {
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },

  selectedCard: {
    borderColor: Colors.light.primary,
    shadowOpacity: 0.15,
  },

  matchBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    alignItems: 'center',
  },

  matchPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  matchText: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.9,
  },

  psychologistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },

  avatar: {
    fontSize: 48,
  },

  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  psychologistInfo: {
    flex: 1,
  },

  psychologistName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: Spacing.xs,
  },

  psychologistTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: Spacing.xs,
  },

  experience: {
    fontSize: 12,
    color: '#999',
  },

  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },

  specialtyTag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  specialtyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },

  psychologistFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  starIcon: {
    fontSize: 14,
    marginRight: Spacing.xs,
  },

  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: Spacing.xs,
  },

  reviewCount: {
    fontSize: 12,
    color: '#666',
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  price: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.primary,
  },

  priceUnit: {
    fontSize: 12,
    color: '#666',
  },

  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  availabilityIcon: {
    fontSize: 14,
    marginRight: Spacing.xs,
  },

  availabilityText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },

  selectionIndicator: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkmark: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  actionContainer: {
    paddingTop: Spacing.lg,
  },

  continueButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  viewAllButton: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  viewAllButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
});