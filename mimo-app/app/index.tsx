// app/index.tsx - MINIMAL SPLASH SCREEN
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows } from '../shared/theme';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Feather name="heart" size={48} color={Colors.light.surface} />
        </View>
        <Text style={styles.appName}>Mimo</Text>
        <Text style={styles.tagline}>Mind Yourself</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    alignItems: 'center',
  },

  logo: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...Shadows.lg,
  },

  appName: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 8,
    letterSpacing: -1,
  },

  tagline: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
});
