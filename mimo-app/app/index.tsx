// app/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../shared/theme';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const [logoScale] = useState(new Animated.Value(0));
  const [logoOpacity] = useState(new Animated.Value(0));
  const [textOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    // Logo animasyonu
    Animated.sequence([
      // Logo büyüme animasyonu
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Text animasyonu (500ms gecikme ile)
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // 2.5 saniye sonra welcome sayfasına geç
    const timer = setTimeout(() => {
      // TODO: Daha sonra kullanıcının durumuna göre yönlendirme yapacağız:
      // - İlk kez giriş -> welcome 
      // - Daha önce onboarding tamamlanmış ama giriş yapmamış -> login
      // - Giriş yapmış -> (tabs)/home
      router.replace('/(auth)/welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Arka plan gradient efekti için */}
      <View style={styles.backgroundGradient} />
      
      {/* Ana logo ve içerik */}
      <View style={styles.content}>
        
        {/* Logo */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            }
          ]}
        >
          <View style={styles.logo}>
            <Text style={styles.logoText}>M</Text>
          </View>
        </Animated.View>

        {/* App Name */}
        <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
          <Text style={styles.appName}>Mimo</Text>
          <Text style={styles.tagline}>Mind Yourself</Text>
        </Animated.View>

      </View>

      {/* Loading indicator */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBar}>
          <Animated.View style={[styles.loadingProgress]} />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.primary, // Koyu mavi arka plan
  },
  
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.light.primary,
    opacity: 0.9,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  logoContainer: {
    marginBottom: 32,
  },

  logo: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },

  logoText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.light.primary,
  },

  textContainer: {
    alignItems: 'center',
  },

  appName: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 1,
  },

  tagline: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
    letterSpacing: 0.5,
  },

  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  loadingBar: {
    width: 4,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },

  loadingProgress: {
    width: '100%',
    height: '0%', // Bu CSS'de animate edilecekti, RN'de Animated.timing kullanacağız
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});