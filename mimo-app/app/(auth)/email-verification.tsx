// app/(auth)/email-verification.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius } from '../../shared/theme';

export default function EmailVerification() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const inputRefs = useRef<TextInput[]>([]);

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

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...verificationCode];
    newCode[index] = text;
    setVerificationCode(newCode);

    // Auto focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verify when all filled
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code: string) => {
    setIsLoading(true);

    try {
      // TODO: API call for verification
      console.log('Verification code:', code);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Doğrulama başarılı - onboarding'e geç
      router.push('/(auth)/onboarding-intro');

    } catch (error) {
      Alert.alert('Hata', 'Doğrulama kodu geçersiz. Lütfen tekrar deneyin.');
      setVerificationCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    try {
      // TODO: Resend verification email API call
      setCountdown(60);
      Alert.alert('Başarılı', 'Doğrulama kodu tekrar gönderildi.');
    } catch (error) {
      Alert.alert('Hata', 'Kod gönderilemedi. Lütfen tekrar deneyin.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        
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
          
          <View style={styles.iconContainer}>
            <Text style={styles.emailIcon}>📧</Text>
          </View>
          
          <Text style={styles.headerTitle}>E-postanızı Doğrulayın</Text>
          <Text style={styles.headerSubtitle}>
            E-posta adresinize gönderilen 6 haneli doğrulama kodunu girin
          </Text>
        </Animated.View>

        {/* Verification Code Input */}
        <Animated.View 
          style={[
            styles.codeContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.codeInputContainer}>
            {verificationCode.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[
                  styles.codeInput,
                  digit && styles.codeInputFilled
                ]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                autoFocus={index === 0}
              />
            ))}
          </View>

          {isLoading && (
            <Text style={styles.verifyingText}>Doğrulanıyor...</Text>
          )}
        </Animated.View>

        {/* Resend Section */}
        <Animated.View 
          style={[
            styles.resendContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.resendText}>
            Kod gelmedi mi?
          </Text>
          
          {countdown > 0 ? (
            <Text style={styles.countdownText}>
              {countdown} saniye sonra tekrar gönderebilirsiniz
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Tekrar Gönder</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Manual Verify Button */}
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity
            onPress={() => handleVerify(verificationCode.join(''))}
            style={[
              styles.verifyButton,
              { 
                opacity: verificationCode.every(digit => digit !== '') ? 1 : 0.5,
                backgroundColor: verificationCode.every(digit => digit !== '') 
                  ? Colors.light.primary 
                  : '#CCCCCC'
              }
            ]}
            disabled={!verificationCode.every(digit => digit !== '') || isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.verifyButtonText}>Doğrula</Text>
          </TouchableOpacity>
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
    paddingVertical: Spacing.lg,
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },

  backButton: {
    position: 'absolute',
    top: -Spacing.xl,
    left: 0,
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

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  emailIcon: {
    fontSize: 36,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },

  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },

  codeContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },

  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },

  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    backgroundColor: '#F8F9FA',
    marginHorizontal: 4,
  },

  codeInputFilled: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '10',
  },

  verifyingText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },

  resendContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },

  resendText: {
    fontSize: 14,
    color: '#666',
    marginBottom: Spacing.xs,
  },

  countdownText: {
    fontSize: 14,
    color: '#999',
  },

  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  buttonContainer: {
    paddingHorizontal: Spacing.md,
  },

  verifyButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});